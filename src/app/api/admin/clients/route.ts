import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || ((session.user as any).role !== "ADMIN" && (session.user as any).role !== "STAFF")) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const clients = await prisma.client.findMany({
      include: {
        user: true,
        appointments: {
          include: { services: true },
          orderBy: { startTime: 'desc' }
        },
        formulations: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    const formattedClients = clients.map(client => {
      const totalSpent = client.appointments.reduce((sum, apt) => sum + apt.totalPrice, 0);
      const lastVisit = client.appointments[0]?.startTime || null;

      return {
        id: client.id,
        name: client.user.name,
        email: client.user.email,
        phone: client.phone,
        lastVisit: lastVisit ? new Date(lastVisit).toLocaleDateString() : 'Never',
        totalSpent,
        history: client.appointments.map(apt => ({
          id: apt.id,
          date: new Date(apt.startTime).toLocaleDateString(),
          service: apt.services.map(service => service.name).join(', ') || 'No services',
          amount: apt.totalPrice,
          notes: "Service completed."
        })),
        formulations: client.formulations.map(f => ({
          id: f.id,
          title: f.title,
          date: new Date(f.createdAt).toLocaleDateString(),
          mix: f.description
        }))
      };
    });

    return NextResponse.json(formattedClients);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
  }
}
