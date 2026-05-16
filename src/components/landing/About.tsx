"use client";

import { Button } from "@/components/ui/button";
import { useReveal } from "@/hooks/useReveal";
import Image from "next/image";

export function About() {
  const revealRef = useReveal();

  return (
    <section ref={revealRef} className="py-24 bg-white reveal" id="about">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="relative w-full md:w-1/2 aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="/service_hair.png"
              alt="The Artist"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-8 right-8 glass p-6 rounded-2xl shadow-xl max-w-[200px] animate-fade-in-up">
               <div className="text-3xl font-serif text-white mb-1">10+</div>
               <div className="text-xs font-bold uppercase tracking-widest text-white/70">Years of Luxury Experience</div>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-4xl md:text-5xl font-serif text-brand-primary mb-6">Our Philosophy</h2>
            <div className="w-20 h-1 bg-brand-accent mb-8" />
            <p className="text-xl text-zinc-700 leading-relaxed mb-6">
              Beauty is not just about the surface; it's about the confidence that radiates from within. 
              Our studio was founded on the principle that every client deserves a personalized experience 
              that honors their unique natural beauty.
            </p>
            <p className="text-lg text-zinc-600 leading-relaxed mb-8">
              With over a decade of experience in high-end cosmetology, we blend advanced clinical 
              techniques with a holistic approach to ensure your results are both stunning and sustainable.
            </p>
            <Button variant="primary" size="lg">
              Read Our Story
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
