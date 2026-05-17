import type { Metadata } from "next";
import "./globals.css";
export const dynamic = 'force-dynamic';
import { readStore } from "@/lib/data-store";
import { Providers } from "@/components/Providers";

export async function generateMetadata(): Promise<Metadata> {
  let settings;
  try {
    settings = (await readStore()).settings;
  } catch (e) {}

  return {
    title: settings?.companyName || "Beauty Studio | Professional Cosmetology",
    description: settings?.heroSubtitle || "Elevate your natural beauty with our professional services.",
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      title: settings?.companyName || "Nexus Beauty",
      statusBarStyle: "black-translucent",
    },
  };
}

export async function generateViewport(): Promise<any> {
  let settings;
  try {
    settings = (await readStore()).settings;
  } catch (e) {}

  return {
    themeColor: settings?.primaryColor || "#052e16",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let settings;
  try {
    settings = (await readStore()).settings;
  } catch (e) {}

  const themeSettings = settings || {
    primaryColor: '#052e16',
    secondaryColor: '#fef3c7',
    accentColor: '#10b981',
    fontFamily: 'Inter'
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Outfit:wght@100..900&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --color-primary: ${themeSettings.primaryColor};
            --color-secondary: ${themeSettings.secondaryColor};
            --color-accent: ${themeSettings.accentColor};
            --font-brand: ${themeSettings.fontFamily === 'Playfair Display' ? '"Playfair Display", serif' : '"Outfit", sans-serif'};
            --font-body: "Outfit", sans-serif;
          }
        `}} />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="font-[family-name:var(--font-body)] bg-[var(--color-secondary)] text-zinc-900 antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
