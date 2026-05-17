import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || ((session.user as any).role !== "ADMIN" && (session.user as any).role !== "STAFF")) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { status } = await request.json();
    const { id } = await params;

    // Use a transaction to ensure atomic update
    const result = await prisma.$transaction(async (tx) => {
      const updateData: any = { status };
      if (status === 'COMPLETED') {
        updateData.isPaid = true;
      }

      const appointment = await tx.appointment.update({
        where: { id },
        data: updateData,
        include: {
          services: {
            include: {
              materials: true
            }
          }
        }
      });

      // If marked as COMPLETED, deplete inventory and create engagement record
      if (status === 'COMPLETED') {
        // 1. Deplete Inventory
        for (const service of appointment.services) {
          for (const material of service.materials) {
            await tx.inventoryItem.update({
              where: { id: material.inventoryItemId },
              data: {
                quantity: {
                  decrement: material.estimatedUsage
                }
              }
            });
          }
        }

        // 2. Create Engagement Record (Treatment Journey)
        await tx.formulation.create({
          data: {
            clientId: appointment.clientId,
            title: `Treatment Completed: ${appointment.services.map(service => service.name).join(', ')}`,
            description: `Session finalized on ${new Date().toLocaleDateString()}. Your skin/hair is glowing! View your updated history in the portal.`,
          }
        });
      }

      return appointment;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}
