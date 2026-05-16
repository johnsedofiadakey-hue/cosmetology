import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from \"next-auth/next\";
import { authOptions } from \"@/lib/auth\";

export async function POST(request: Request) {
  try {
    const { appointmentId, email, amount } = await request.json();

    if (!appointmentId || !email || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Get Paystack Secret Key from environment
    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

    // IF NO KEY, return a "SIMULATED" success for now so they can test the flow
    if (!PAYSTACK_SECRET_KEY) {
      console.warn(\"[PAYSTACK] No PAYSTACK_SECRET_KEY found. Simulating initialization.\");
      return NextResponse.json({ 
        success: true, 
        simulated: true,
        authorization_url: `/booking/success?reference=SIMULATED_${Date.now()}&appointmentId=${appointmentId}` 
      });
    }

    // 2. Initialize Paystack Transaction
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: Math.round(amount * 100), // Paystack expects amount in Kobo
        reference: `LOU_${appointmentId}_${Date.now()}`,
        callback_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/booking/success`,
        metadata: {
          appointmentId
        }
      }),
    });

    const data = await response.json();

    if (!data.status) {
      return NextResponse.json({ error: data.message || 'Paystack initialization failed' }, { status: 500 });
    }

    // 3. Update appointment with payment reference
    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { paymentRef: data.data.reference }
    });

    return NextResponse.json({ 
      success: true, 
      authorization_url: data.data.authorization_url,
      reference: data.data.reference 
    });

  } catch (error) {
    console.error('[PAYSTACK_INIT_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
