import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const services = await prisma.service.findMany({
    include: { materials: true }
  });
  return NextResponse.json(services);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const service = await prisma.service.create({
      data: {
        name: data.name,
        price: data.price,
        duration: data.duration,
        category: data.category || "Hair",
        description: data.description || ""
      }
    });
    return NextResponse.json(service);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}
