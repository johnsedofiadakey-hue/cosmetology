import { NextResponse } from 'next/server';
import { readStore } from '@/lib/data-store';

export async function GET() {
  try {
    const settings = (await readStore()).settings;
    // Return only public fields
    return NextResponse.json({
      companyName: settings?.companyName,
      currencySymbol: settings?.currencySymbol || "GH₵",
      primaryColor: settings?.primaryColor,
      secondaryColor: settings?.secondaryColor,
      accentColor: settings?.accentColor,
      whatsappNumber: settings?.whatsappNumber,
      instagramUrl: settings?.instagramUrl,
      facebookUrl: settings?.facebookUrl,
      tiktokUrl: settings?.tiktokUrl,
      youtubeUrl: settings?.youtubeUrl,
      twitterUrl: settings?.twitterUrl,
      contactEmail: settings?.contactEmail,
      contactPhone: settings?.contactPhone,
      address: settings?.address,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}
