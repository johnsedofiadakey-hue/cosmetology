import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || ((session.user as any).role !== "ADMIN" && (session.user as any).role !== "STAFF")) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const items = await prisma.inventoryItem.findMany({
    include: {
      serviceUsage: {
        include: {
          service: {
            include: {
              appointments: {
                where: {
                  status: {
                    in: ['PENDING', 'CONFIRMED']
                  },
                  startTime: {
                    gte: new Date()
                  }
                }
              }
            }
          }
        }
      }
    }
  });

  const itemsWithForecast = items.map(item => {
    let projectedUsage = 0;
    item.serviceUsage.forEach(usage => {
      const upcomingApptsCount = usage.service.appointments.length;
      projectedUsage += upcomingApptsCount * usage.estimatedUsage;
    });

    return {
      ...item,
      projectedUsage,
      projectedBalance: item.quantity - projectedUsage,
      isForecastingLow: (item.quantity - projectedUsage) <= item.minThreshold
    };
  });

  return NextResponse.json(itemsWithForecast);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || ((session.user as any).role !== "ADMIN" && (session.user as any).role !== "STAFF")) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const item = await prisma.inventoryItem.create({
      data: {
        name: data.name,
        quantity: data.quantity,
        unit: data.unit,
        minThreshold: data.minThreshold || 5.0
      }
    });
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create inventory item" }, { status: 500 });
  }
}
