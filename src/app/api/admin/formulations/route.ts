import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || ((session.user as any).role !== "ADMIN" && (session.user as any).role !== "STAFF")) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');

    const formulations = await prisma.formulation.findMany({
      where: clientId ? { clientId } : undefined,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(formulations);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch formulations' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || ((session.user as any).role !== "ADMIN" && (session.user as any).role !== "STAFF")) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const formulation = await prisma.formulation.create({
      data: {
        title: data.title,
        description: data.description,
        clientId: data.clientId || null, // Handle empty string as null
        beforeImage: data.beforeImage || null,
        afterImage: data.afterImage || null
      }
    });
    return NextResponse.json(formulation);
  } catch (error) {
    console.error("[FORMULATION_POST]", error);
    return NextResponse.json({ error: "Failed to create formulation" }, { status: 500 });
  }
}
