import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { addMinutes } from 'date-fns';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || ((session.user as any).role !== "ADMIN" && (session.user as any).role !== "STAFF")) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        services: true,
        client: { include: { user: true } },
      }
    });
    return NextResponse.json(appointments);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, phone, staffId, serviceIds, startTime } = await request.json();
    
    // Fetch services to get duration and price
    const selectedServices = await prisma.service.findMany({
      where: { id: { in: serviceIds } }
    });

    if (selectedServices.length === 0) {
      return NextResponse.json({ error: 'No valid services found' }, { status: 404 });
    }

    const totalDuration = selectedServices.reduce((acc, s) => acc + s.duration, 0);
    const totalPrice = selectedServices.reduce((acc, s) => acc + s.price, 0);

    // Resolve Staff ID
    let resolvedStaffId = staffId;
    if (staffId === "solo-staff-id" || !staffId) {
      const firstStaff = await prisma.staff.findFirst({ where: { isActive: true } });
      if (!firstStaff) {
        return NextResponse.json({ error: 'No active staff members found to handle this booking.' }, { status: 500 });
      }
      resolvedStaffId = firstStaff.id;
    }

    const start = new Date(startTime);
    const end = addMinutes(start, totalDuration);

    // 1. Conflict Check: Check if staff is available
    const conflict = await prisma.appointment.findFirst({
      where: {
        staffId: resolvedStaffId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        OR: [
          { startTime: { lt: end }, endTime: { gt: start } },
        ]
      }
    });

    if (conflict) {
      return NextResponse.json({ error: 'This time slot is already booked. Please try another time.' }, { status: 409 });
    }

    // 2. Client Handling
    const result = await prisma.$transaction(async (tx) => {
      let user = await tx.user.findUnique({
        where: { email }
      });

      if (!user) {
        user = await tx.user.create({
          data: {
            email,
            name,
            password: 'guest-password-' + Math.random().toString(36).slice(-8),
            role: 'CLIENT'
          }
        });
      }

      let client = await tx.client.findUnique({
        where: { userId: user.id }
      });

      if (!client) {
        client = await tx.client.create({
          data: {
            userId: user.id,
            phone: phone
          }
        });
      }

      // 3. Create Appointment with Multiple Services
      return await tx.appointment.create({
        data: {
          clientId: client.id,
          staffId: resolvedStaffId,
          services: {
            connect: serviceIds.map((id: string) => ({ id }))
          },
          startTime: start,
          endTime: end,
          totalPrice: totalPrice,
          status: 'PENDING',
        },
        include: {
          services: true
        }
      });
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
