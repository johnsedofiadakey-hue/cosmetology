import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { status } = await request.json();
    const { id } = await params;

    // Use a transaction to ensure atomic update
    const result = await prisma.$transaction(async (tx) => {
      const appointment = await tx.appointment.update({
        where: { id },
        data: { status },
        include: {
          service: {
            include: {
              materials: true
            }
          }
        }
      });

      // If marked as COMPLETED, deplete inventory
      if (status === 'COMPLETED') {
        for (const material of appointment.service.materials) {
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

      return appointment;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}
