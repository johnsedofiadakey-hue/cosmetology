import type { Metadata } from "next";
import "./globals.css";
import prisma from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  let settings;
  try {
    settings = await prisma.systemSettings.findFirst();
  } catch (e) {}

  return {
    title: settings?.companyName || "Beauty Studio | Professional Cosmetology",
    description: settings?.heroSubtitle || "Elevate your natural beauty with our professional services.",
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let settings;
  try {
    settings = await prisma.systemSettings.findFirst();
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
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --color-primary: ${themeSettings.primaryColor};
            --color-secondary: ${themeSettings.secondaryColor};
            --color-accent: ${themeSettings.accentColor};
            --font-brand: ${themeSettings.fontFamily === 'Inter' ? 'sans-serif' : 'serif'};
          }
        `}} />
      </head>
      <body className="font-brand bg-white text-zinc-900 antialiased">
        {children}
      </body>
    </html>
  );
}
