"use client";

import Image from "next/image";
import { useState } from "react";

const portfolioItems = [
  { id: 1, category: "Hair", title: "Emerald Glow Balayage", image: "/service_hair.png" },
  { id: 2, category: "Skin", title: "Dewy Glass Facial", image: "/service_skin.png" },
  { id: 3, category: "Nails", title: "Minimalist Marble", image: "/service_nails.png" },
  { id: 4, category: "Hair", title: "Precision Bob Cut", image: "/service_hair.png" },
];

export function Portfolio() {
  const [filter, setFilter] = useState("All");

  const filteredItems = filter === "All" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === filter);

  return (
    <section className="py-24 bg-white" id="portfolio">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif text-brand-primary mb-4">The Portfolio</h2>
            <p className="text-zinc-500">A showcase of our recent transformations.</p>
          </div>
          
          <div className="flex gap-4">
            {["All", "Hair", "Skin", "Nails"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full border transition-all ${
                  filter === cat 
                  ? "bg-brand-primary text-brand-secondary border-brand-primary" 
                  : "border-zinc-200 text-zinc-500 hover:border-brand-accent"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-brand-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-6 text-center text-white">
                <span className="text-xs uppercase tracking-widest mb-2 text-brand-secondary font-bold">{item.category}</span>
                <h4 className="text-xl font-serif">{item.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
