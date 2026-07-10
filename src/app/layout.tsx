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
    title: settings?.companyName || "LOÙ Beauty Hub | Professional Cosmetology",
    description: settings?.heroSubtitle || "Subtle. Intentional. Beautiful — cosmetology services tailored to you.",
    manifest: "/manifest.json",
    icons: {
      icon: settings?.logoUrl || "/logo.jpg",
      shortcut: settings?.logoUrl || "/logo.jpg",
      apple: settings?.logoUrl || "/logo.jpg",
    },
    appleWebApp: {
      capable: true,
      title: settings?.companyName || "LOÙ Beauty Hub",
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
    themeColor: settings?.primaryColor || "#A85F54",
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
    primaryColor: '#A85F54',
    secondaryColor: '#FBF1EA',
    accentColor: '#C9A227',
    textPrimaryColor: '#241C1A',
    textSecondaryColor: '#7A6A63',
    fontFamily: 'Playfair Display'
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
            --color-text-primary: ${themeSettings.textPrimaryColor || '#18181b'};
            --color-text-secondary: ${themeSettings.textSecondaryColor || '#71717a'};
            --font-brand: ${themeSettings.fontFamily === 'Playfair Display' ? '"Playfair Display", serif' : '"Outfit", sans-serif'};
            --font-body: "Outfit", sans-serif;
          }
        `}} />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="font-[family-name:var(--font-body)] bg-[var(--color-secondary)] text-[var(--color-text-primary)] antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
