import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const items = await prisma.inventoryItem.findMany();
  return NextResponse.json(items);
}

export async function POST(request: Request) {
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
