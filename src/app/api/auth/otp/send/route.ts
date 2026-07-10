import { NextResponse } from 'next/server';
import { readStore, updateStore } from '@/lib/data-store';

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    const cleanInput = phone.replace(/[\s\-\+\(\)]/g, "");

    // 1. Find the client and linked user profile
    const store = await readStore();
    const client = store.clients.find((c) => {
      if (!c.phone) return false;
      const cleanC = c.phone.replace(/[\s\-\+\(\)]/g, "");
      return cleanC.endsWith(cleanInput) || cleanInput.endsWith(cleanC);
    });

    if (!client) {
      return NextResponse.json({ error: 'No account registered with this phone number. Please book an appointment first.' }, { status: 404 });
    }

    const user = store.users.find((u) => u.id === client.userId);
    if (!user) {
      return NextResponse.json({ error: 'Associated user account not found.' }, { status: 404 });
    }

    // 2. Generate a random 4-digit OTP
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 mins expiry

    // Save the dynamic OTP in the database
    await updateStore((db) => {
      const dbUser = db.users.find((u) => u.id === user.id);
      if (dbUser) {
        dbUser.tempOtp = otpCode;
        dbUser.tempOtpExpires = otpExpires;
      }
    });

    // 3. Dispatch OTP via SMS or WhatsApp (Arkesel or Twilio)
    const ARKESEL_API_KEY = process.env.ARKESEL_API_KEY;
    const ARKESEL_SENDER_ID = process.env.ARKESEL_SENDER_ID || 'BeautyHub';
    
    const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
    const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
    const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
    const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER;
    
    const message = `Your ${store.settings?.companyName || 'LOÙ Beauty Hub'} verification code is ${otpCode}. It expires in 10 minutes.`;

    let providerUsed = 'Simulator';
    let realMessageSent = false;

    // A. Ghana Gateway - Arkesel (SMS / WhatsApp)
    if (ARKESEL_API_KEY) {
      providerUsed = 'Arkesel';
      const toPhone = cleanInput.startsWith('0') ? '233' + cleanInput.slice(1) : cleanInput;
      
      try {
        // By default, trigger Arkesel SMS API
        const arkeselUrl = `https://sms.arkesel.com/sms/api?action=send-sms&api_key=${ARKESEL_API_KEY}&to=${toPhone}&from=${ARKESEL_SENDER_ID}&sms=${encodeURIComponent(message)}`;
        const dispatchRes = await fetch(arkeselUrl);
        if (dispatchRes.ok) {
          realMessageSent = true;
        }
      } catch (err) {
        console.error('[ARKESEL_DISPATCH_FAILED]', err);
      }
    } 
    // B. Global Gateway - Twilio (SMS or WhatsApp)
    else if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
      providerUsed = 'Twilio';
      
      try {
        const useWhatsApp = !!TWILIO_WHATSAPP_NUMBER;
        const toAddress = useWhatsApp ? `whatsapp:+${cleanInput}` : `+${cleanInput}`;
        const fromAddress = useWhatsApp ? `whatsapp:${TWILIO_WHATSAPP_NUMBER}` : TWILIO_PHONE_NUMBER;

        const bodyParams = new URLSearchParams({
          To: toAddress,
          From: fromAddress || '',
          Body: message
        });

        const dispatchRes = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`, {
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + Buffer.from(TWILIO_ACCOUNT_SID + ':' + TWILIO_AUTH_TOKEN).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: bodyParams
        });

        if (dispatchRes.ok) {
          realMessageSent = true;
        }
      } catch (err) {
        console.error('[TWILIO_DISPATCH_FAILED]', err);
      }
    }

    if (!realMessageSent) {
      console.log(`[OTP DISPATCH SIMULATOR] Dynamic OTP for ${phone} is: [ ${otpCode} ] (No API key found, falling back to simulator)`);
      return NextResponse.json({ 
        success: true, 
        simulated: true, 
        otpCode: otpCode, // Return code to front-end for easy testing in simulator mode
        message: `OTP Code '${otpCode}' triggered in simulator mode. Configure Arkesel/Twilio environment keys for real SMS/WhatsApp transmission.`
      });
    }

    return NextResponse.json({ 
      success: true, 
      simulated: false,
      message: `OTP Code sent via ${providerUsed} successfully.`
    });

  } catch (error: any) {
    console.error('[OTP_SEND_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
