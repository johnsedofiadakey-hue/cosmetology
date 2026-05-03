import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { addMinutes } from 'date-fns';

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        service: true,
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
    const { clientId, staffId, serviceId, startTime } = await request.json();
    
    // Fetch service to get duration and price
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    });

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    const endTime = addMinutes(new Date(startTime), service.duration);

    const appointment = await prisma.appointment.create({
      data: {
        clientId,
        staffId,
        serviceId,
        startTime: new Date(startTime),
        endTime,
        totalPrice: service.price,
        status: 'PENDING',
      },
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
