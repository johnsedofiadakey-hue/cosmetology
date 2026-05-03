import Image from "next/image";
import { Button } from "@/components/ui/button";

const services = [
  {
    id: "hair",
    title: "Hair Artistry",
    description: "From precision cuts to bespoke coloring, we transform your vision into reality.",
    image: "/service_hair.png",
  },
  {
    id: "skin",
    title: "Skin Rejuvenation",
    description: "Experience the ultimate in skin health with our tailored facial treatments.",
    image: "/service_skin.png",
  },
  {
    id: "nails",
    title: "Nail Boutique",
    description: "Elegant and sophisticated nail care that reflects your personal style.",
    image: "/service_nails.png",
  },
];

export function Services() {
  return (
    <section className="py-24 bg-zinc-50" id="services">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-brand-primary mb-4">Our Services</h2>
          <div className="w-20 h-1 bg-brand-accent mx-auto mb-6" />
          <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
            Each service is a journey of transformation, blending technical excellence with artistic vision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div 
              key={service.id} 
              className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div className="relative h-80 w-full overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-brand-primary/10 group-hover:bg-brand-primary/0 transition-colors duration-500" />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-serif text-brand-primary mb-3">{service.title}</h3>
                <p className="text-zinc-600 mb-6 line-clamp-2">
                  {service.description}
                </p>
                <Button variant="outline" className="w-full">
                  View Menu
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
