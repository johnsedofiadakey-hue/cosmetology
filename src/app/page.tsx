import { Hero } from "@/components/landing/Hero";
import { Services } from "@/components/landing/Services";
import { About } from "@/components/landing/About";
import { Contact } from "@/components/landing/Contact";
import { Navbar } from "@/components/landing/Navbar";
import { Portfolio } from "@/components/landing/Portfolio";
import { TrustStrip } from "@/components/landing/TrustStrip";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";
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
        videoUrl={currentSettings.heroVideoUrl}
        mediaType={currentSettings.heroMediaType as any}
      />
      <TrustStrip />
      <Services />
      <Portfolio />
      <Testimonials />
      <About />
      <FAQ />
      <Contact />
      <Footer settings={settings} />
      
      {/* Floating Booking Bar for Mobile */}
      <div className="fixed bottom-6 left-6 right-6 z-50 md:hidden animate-bounce-in">
        <a href="/booking">
          <button className="w-full bg-brand-primary text-brand-secondary py-4 rounded-full shadow-2xl font-bold text-lg flex items-center justify-center gap-2 border border-white/10 backdrop-blur-sm">
            Book Your Session Now
          </button>
        </a>
      </div>
    </main>
  );
}
