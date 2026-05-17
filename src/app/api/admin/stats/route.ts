import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { startOfMonth } from 'date-fns';
import { readStore } from '@/lib/data-store';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || ((session.user as any).role !== "ADMIN" && (session.user as any).role !== "STAFF")) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const store = await readStore();
    const thisMonthStart = startOfMonth(new Date());
    const totalRevenue = store.appointments
      .filter((apt) => ['COMPLETED', 'CONFIRMED', 'PENDING'].includes(apt.status))
      .reduce((sum, apt) => sum + apt.totalPrice, 0);
    const newClientsCount = store.clients.filter((client) => {
      const user = store.users.find((item) => item.id === client.userId);
      return user && new Date(user.createdAt) >= thisMonthStart;
    }).length;

    const serviceCounts = new Map<string, number>();
    for (const apt of store.appointments) {
      for (const serviceId of apt.serviceIds) {
        serviceCounts.set(serviceId, (serviceCounts.get(serviceId) || 0) + 1);
      }
    }
    const totalBookings = Array.from(serviceCounts.values()).reduce((sum, count) => sum + count, 0);
    const popularServices = store.services.map((service) => ({
      name: service.name,
      share: totalBookings > 0 ? Math.round(((serviceCounts.get(service.id) || 0) / totalBookings) * 100) : 0,
      color: "bg-brand-primary"
    })).sort((a, b) => b.share - a.share).slice(0, 3);

    return NextResponse.json({
      totalRevenue,
      appointmentCount: store.appointments.length,
      newClientsCount,
      popularServices,
      alerts: {
        lowStock: store.inventory.filter((item) => item.quantity <= item.minThreshold).length,
        pendingAppointments: store.appointments.filter((apt) => apt.status === 'PENDING').length
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
  }
}
