import { Button } from "@/components/ui/button";
import Image from "next/image";

export function About() {
  return (
    <section className="py-24 bg-white" id="about">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="relative w-full md:w-1/2 aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="/service_hair.png" // Using one of the generated images as a placeholder for the artist
              alt="The Artist"
              fill
              className="object-cover"
            />
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
