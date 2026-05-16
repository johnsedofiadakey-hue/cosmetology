"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const DEFAULT_SERVICES = [
  {
    id: "hair",
    name: "Hair Artistry",
    description: "From precision cuts to bespoke coloring, we transform your vision into reality.",
    image: "/service_hair.png",
  },
  {
    id: "skin",
    name: "Skin Rejuvenation",
    description: "Experience the ultimate in skin health with our tailored facial treatments.",
    image: "/service_skin.png",
  },
  {
    id: "nails",
    name: "Nail Boutique",
    description: "Elegant and sophisticated nail care that reflects your personal style.",
    image: "/service_nails.png",
  },
];

import { XCircle, CheckCircle2, Clock, ChevronRight } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";

export function Services({ settings }: { settings?: any }) {
  const revealRef = useReveal();
  const [services, setServices] = useState<any[]>([]);
  const [activeService, setActiveService] = useState<any | null>(null);

  const currency = settings?.currencySymbol || "GH₵";

  useEffect(() => {
    fetch("/api/services")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setServices(data);
        } else {
          setServices(DEFAULT_SERVICES);
        }
      })
      .catch(() => setServices(DEFAULT_SERVICES));
  }, []);

  return (
    <section ref={revealRef} className="py-24 bg-[var(--color-secondary)] reveal" id="services">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-[#1A1A1A] mb-4">Our Services</h2>
          <div className="w-20 h-1 bg-brand-accent mx-auto mb-6 rounded-full" />
          <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
            Each service is a journey of transformation, blending technical excellence with artistic vision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={service.id || index} 
              onClick={() => setActiveService(service)}
              className="group relative bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer border-0 ring-1 ring-zinc-100 hover:ring-brand-accent/30"
            >
              <div className="relative h-80 w-full overflow-hidden">
                <Image
                  src={service.image || "/service_hair.png"}
                  alt={service.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                   <span className="text-white text-sm font-bold flex items-center gap-2">View Details <ChevronRight className="w-4 h-4" /></span>
                </div>
                {service.price && (
                  <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-brand-primary font-bold shadow-lg text-sm">
                    {currency}{service.price}
                  </div>
                )}
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-serif text-brand-primary mb-3">{service.name}</h3>
                <p className="text-zinc-500 mb-6 line-clamp-2 text-sm leading-relaxed">
                  {service.description}
                </p>
                <div className="flex items-center justify-between">
                   <span className="text-xs font-bold uppercase tracking-widest text-brand-accent">{service.duration || '60'} MINS</span>
                   <Button variant="ghost" size="lg" className="text-brand-primary font-bold h-12">Details</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Detail Modal */}
      {activeService && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div 
            className="bg-white rounded-[40px] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl relative flex flex-col md:flex-row animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setActiveService(null)}
              className="absolute top-6 right-6 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-colors"
            >
              <XCircle className="w-6 h-6 text-zinc-400" />
            </button>

            {/* Modal Image */}
            <div className="w-full md:w-1/2 h-64 md:h-auto relative">
              <Image 
                src={activeService.image || "/service_hair.png"} 
                alt={activeService.name} 
                fill 
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
            </div>

            {/* Modal Content */}
            <div className="w-full md:w-1/2 p-10 md:p-14 overflow-y-auto">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-accent mb-4 block">Treatment Details</span>
              <h2 className="text-4xl font-serif text-brand-primary mb-6">{activeService.name}</h2>
              
              <div className="flex gap-6 mb-8">
                <div className="flex items-center gap-2 text-zinc-500 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{activeService.duration || '60'} Minutes</span>
                </div>
                <div className="flex items-center gap-2 text-brand-primary font-bold text-sm">
                  <span className="text-zinc-400 font-normal">Starting at</span>
                  <span className="text-brand-accent">{currency}{activeService.price || '85'}</span>
                </div>
              </div>

              <div className="space-y-6 mb-10">
                <p className="text-zinc-600 leading-relaxed">
                  {activeService.description || "Our premium treatment experience designed to revitalize your look and restore your inner confidence. Every session begins with a comprehensive consultation to tailor the service to your specific needs and aesthetic goals."}
                </p>
                
                <div className="space-y-3 mb-10">
                  <h4 className="font-bold text-zinc-800">Key Benefits</h4>
                  <ul className="space-y-2">
                    {["Personalized aesthetic consultation", "Premium clinical-grade products", "Expert application by senior stylists", "Extended maintenance guide provided"].map((benefit, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-zinc-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8 border-t border-brand-accent/20">
                  <h4 className="font-bold text-zinc-800 mb-6">Treatment Journey</h4>
                  <div className="relative">
                    <div className="absolute top-4 left-0 w-full h-[1px] bg-zinc-100" />
                    <div className="grid grid-cols-4 gap-4 relative">
                      {[
                        { label: "Consult", icon: "01" },
                        { label: "Prepare", icon: "02" },
                        { label: "Treat", icon: "03" },
                        { label: "Recover", icon: "04" }
                      ].map((step, i) => (
                        <div key={i} className="flex flex-col items-center text-center">
                          <div className="w-8 h-8 rounded-full bg-white border-2 border-brand-accent flex items-center justify-center text-[10px] font-bold text-brand-primary mb-3 relative z-10 shadow-sm">
                            {step.icon}
                          </div>
                          <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">{step.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a href="/booking" className="flex-1">
                  <Button className="w-full h-16 rounded-2xl text-lg shadow-xl shadow-brand-primary/20 font-bold">Book Session</Button>
                </a>
                <Button 
                  variant="outline" 
                  className="h-16 rounded-2xl px-8 font-bold"
                  onClick={() => setActiveService(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
