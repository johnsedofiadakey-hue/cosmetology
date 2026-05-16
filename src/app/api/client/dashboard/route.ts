import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user?.email as string },
      include: {
        clientProfile: {
          include: {
            appointments: {
              include: {
                services: true,
                staff: { include: { user: true } }
              },
              orderBy: { startTime: 'desc' }
            },
            formulations: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let clientProfile = user.clientProfile;

    // Lazy initialize client profile if missing
    if (!clientProfile) {
      clientProfile = await prisma.client.create({
        data: {
          userId: user.id,
          phone: "", // Will be updated later
        },
        include: {
          appointments: {
            include: {
              services: true,
              staff: { include: { user: true } }
            },
            orderBy: { startTime: 'desc' }
          },
          formulations: true
        }
      });
    }

    return NextResponse.json({
      profile: {
        name: user.name,
        email: user.email,
        phone: clientProfile.phone,
        createdAt: user.createdAt
      },
      appointments: clientProfile.appointments,
      formulations: clientProfile.formulations
    });
  } catch (error: any) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
