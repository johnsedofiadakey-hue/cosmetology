import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from 'next/cache';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || ((session.user as any).role !== "ADMIN" && (session.user as any).role !== "STAFF")) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const settings = await prisma.systemSettings.findFirst();
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || ((session.user as any).role !== "ADMIN" && (session.user as any).role !== "STAFF")) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    const settings = await prisma.systemSettings.upsert({
      where: { id: 1 },
      update: body,
      create: { id: 1, ...body },
    });

    revalidatePath('/', 'layout');
    revalidatePath('/admin', 'layout');

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
