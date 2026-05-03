import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const items = await prisma.portfolioItem.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const item = await prisma.portfolioItem.create({
      data: {
        title: data.title,
        category: data.category,
        imageUrl: data.imageUrl,
        description: data.description || ""
      }
    });
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create portfolio item" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  try {
    await prisma.portfolioItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
