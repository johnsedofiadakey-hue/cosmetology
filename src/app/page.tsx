import { Hero } from "@/components/landing/Hero";
import { Services } from "@/components/landing/Services";
import { About } from "@/components/landing/About";
import { Contact } from "@/components/landing/Contact";
import { Navbar } from "@/components/landing/Navbar";
import { Portfolio } from "@/components/landing/Portfolio";
import prisma from "@/lib/prisma";

export default async function Home() {
  let settings;
  
  try {
    settings = await prisma.systemSettings.findFirst();
  } catch (e) {
    console.error("Failed to fetch settings from DB, using defaults");
  }

  const defaultSettings = {
    heroTitle: "Elevate Your Natural Beauty",
    heroSubtitle: "Professional cosmetology services tailored to you.",
    heroImage: "/beauty_hero_bg.png",
  };

  const currentSettings = settings || defaultSettings;

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero 
        title={currentSettings.heroTitle} 
        subtitle={currentSettings.heroSubtitle} 
        backgroundImage={currentSettings.heroImage || defaultSettings.heroImage}
      />
      <Services />
      <Portfolio />
      <About />
      <Contact />
      
      {/* Floating Booking Bar for Mobile */}
      <div className="fixed bottom-6 left-6 right-6 z-50 md:hidden animate-bounce-in">
        <button className="w-full bg-brand-primary text-brand-secondary py-4 rounded-full shadow-2xl font-bold text-lg flex items-center justify-center gap-2">
          Book Your Session Now
        </button>
      </div>
    </main>
  );
}
