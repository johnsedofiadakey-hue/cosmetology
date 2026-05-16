"use client";

import { useEffect, useState } from "react";
import { CheckCircle, X } from "lucide-react";

const notifications = [
  { name: "Sarah", service: "Hair Artistry", time: "2 minutes ago" },
  { name: "Emma", service: "Skin Rejuvenation", time: "15 minutes ago" },
  { name: "Jessica", service: "Nail Boutique", time: "1 hour ago" },
  { name: "Michelle", service: "Hair Coloring", time: "5 minutes ago" },
];

export function SocialProof() {
  const [current, setCurrent] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showNotification = () => {
      const index = Math.floor(Math.random() * notifications.length);
      setCurrent(index);
      setIsVisible(true);

      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    };

    // Show first notification after 3 seconds
    const initialTimeout = setTimeout(showNotification, 3000);

    // Then every 20-30 seconds
    const interval = setInterval(() => {
      showNotification();
    }, 25000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  if (current === null) return null;

  const item = notifications[current];

  return (
    <div 
      className={`fixed bottom-24 md:bottom-8 left-6 z-[60] transition-all duration-700 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-zinc-100 flex items-center gap-4 min-w-[280px]">
        <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
          <CheckCircle className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-zinc-500 font-medium">{item.time}</p>
          <p className="text-sm font-bold text-brand-primary">
            {item.name} <span className="font-normal text-zinc-600">just booked</span> {item.service}
          </p>
        </div>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-zinc-300 hover:text-zinc-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
