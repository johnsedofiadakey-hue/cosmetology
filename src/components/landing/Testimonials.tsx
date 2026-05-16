"use client";

import { Star, Quote } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";

export function Testimonials() {
  const revealRef = useReveal();
  const reviews = [
    {
      name: "Sarah Jenkins",
      role: "Bridal Client",
      content: "The attention to detail is unlike anything I've experienced in Accra. My wedding look was flawless and lasted the entire day.",
      rating: 5
    },
    {
      name: "Michael Oppong",
      role: "Regular Grooming",
      content: "A truly professional and serene environment. The skin treatments have completely transformed my routine. Highly recommended.",
      rating: 5
    },
    {
      name: "Elena Rossi",
      role: "Balayage Specialist",
      content: "She is a master of color. The result was exactly what I wanted—natural, vibrant, and healthy-looking hair.",
      rating: 5
    }
  ];

  return (
    <section ref={revealRef} className="py-24 bg-brand-primary/5 reveal">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="flex justify-center gap-1 mb-4">
             {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-brand-accent text-brand-accent" />)}
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-brand-primary mb-4">Client Love</h2>
          <p className="text-zinc-500 max-w-xl mx-auto">Hear from those who have experienced the Nexus transformation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <div 
              key={i} 
              className="bg-white p-10 rounded-[40px] shadow-sm border border-zinc-100 relative group hover:shadow-xl transition-all duration-500"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-2xl glass-dark flex items-center justify-center absolute top-8 right-8 group-hover:scale-110 transition-transform">
                <Quote className="w-6 h-6 text-brand-secondary" />
              </div>
              <div className="flex gap-1 mb-6">
                {[...Array(review.rating)].map((_, j) => <Star key={j} className="w-3 h-3 fill-brand-accent text-brand-accent" />)}
              </div>
              <p className="text-zinc-600 mb-8 italic leading-relaxed">&quot;{review.content}&quot;</p>
              <div>
                <p className="font-bold text-brand-primary">{review.name}</p>
                <p className="text-xs text-zinc-400 uppercase tracking-widest">{review.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
