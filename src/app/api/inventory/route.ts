import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { createId, readStore, updateStore } from '@/lib/data-store';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || ((session.user as any).role !== "ADMIN" && (session.user as any).role !== "STAFF")) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const store = await readStore();
  const itemsWithForecast = store.inventory.map((item) => {
    let projectedUsage = 0;
    for (const service of store.services) {
      for (const material of service.materials || []) {
        if (material.inventoryItemId !== item.id) continue;
        const upcomingApptsCount = store.appointments.filter((apt) => (
          apt.serviceIds.includes(service.id) &&
          ['PENDING', 'CONFIRMED'].includes(apt.status) &&
          new Date(apt.startTime) >= new Date()
        )).length;
        projectedUsage += upcomingApptsCount * material.estimatedUsage;
      }
    }

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
    const item = await updateStore((store) => {
      const item = {
        id: createId("inventory"),
        name: data.name,
        sku: data.sku || "",
        quantity: Number(data.quantity),
        unit: data.unit,
        minThreshold: Number(data.minThreshold || 5),
        lastRestocked: new Date().toISOString(),
        projectedUsage: 0,
        projectedBalance: Number(data.quantity),
        isForecastingLow: false,
      };
      store.inventory.push(item);
      return item;
    });
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create inventory item" }, { status: 500 });
  }
}
