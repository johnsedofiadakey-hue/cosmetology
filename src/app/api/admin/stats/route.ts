import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { startOfMonth, subMonths } from 'date-fns';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || ((session.user as any).role !== "ADMIN" && (session.user as any).role !== "STAFF")) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));

    // 1. Total Revenue
    const revenueData = await prisma.appointment.aggregate({
      where: {
        status: { in: ['COMPLETED', 'CONFIRMED', 'PENDING'] }
      },
      _sum: {
        totalPrice: true
      }
    });

    // 2. Appointment Count
    const appointmentCount = await prisma.appointment.count();

    // 3. New Clients (this month)
    const newClientsCount = await prisma.client.count({
      where: {
        user: {
          createdAt: { gte: thisMonthStart }
        }
      }
    });

    // 4. Service Share (Popularity)
    const services = await prisma.service.findMany({
      include: {
        _count: {
          select: { appointments: true }
        }
      }
    });

    const totalBookings = services.reduce((acc, s) => acc + s._count.appointments, 0);
    const popularServices = services.map(s => ({
      name: s.name,
      share: totalBookings > 0 ? Math.round((s._count.appointments / totalBookings) * 100) : 0,
      color: "bg-brand-primary" // Default color
    })).sort((a, b) => b.share - a.share).slice(0, 3);

    // 5. Critical Alerts
    const lowStockItems = await prisma.inventoryItem.findMany({
      where: {
        quantity: { lte: prisma.inventoryItem.fields.minThreshold }
      },
      take: 5
    });

    const pendingAppointments = await prisma.appointment.count({
      where: { status: 'PENDING' }
    });

    return NextResponse.json({
      totalRevenue: revenueData._sum.totalPrice || 0,
      appointmentCount,
      newClientsCount,
      popularServices,
      alerts: {
        lowStock: lowStockItems.length,
        pendingAppointments
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
  }
}
