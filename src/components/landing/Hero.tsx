import { Button } from "@/components/ui/button";
import Link from "next/link";

interface HeroProps {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  videoUrl?: string;
  mediaType?: 'image' | 'video';
}

export function Hero({ title, subtitle, backgroundImage, videoUrl, mediaType = 'image' }: HeroProps) {
  return (
    <section className="relative h-[90vh] min-h-[600px] w-full overflow-hidden flex items-center justify-center">
      {/* Background Media with Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {mediaType === 'video' && videoUrl ? (
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : (
          <div 
            className="w-full h-full bg-cover bg-center transition-transform duration-1000 hover:scale-105"
            style={{ backgroundImage: `url(${backgroundImage || '/beauty_hero_bg.png'})` }}
          />
        )}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
        <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight animate-fade-in-up">
          {title}
        </h1>
        <p className="text-xl md:text-2xl font-light mb-10 opacity-90 max-w-2xl mx-auto">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/booking" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto">
              Book Appointment
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-brand-primary">
            Explore Services
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
        <div className="w-[1px] h-12 bg-white" />
      </div>
    </section>
  );
}
