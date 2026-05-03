"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-md py-4 shadow-sm" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="text-2xl font-serif text-brand-primary">
          Beauty Studio
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="#services" className="text-sm font-medium hover:text-brand-accent transition-colors">Services</Link>
          <Link href="#about" className="text-sm font-medium hover:text-brand-accent transition-colors">About</Link>
          <Link href="#contact" className="text-sm font-medium hover:text-brand-accent transition-colors">Contact</Link>
          <Link href="/portal" className="text-sm font-medium opacity-50 hover:opacity-100 transition-opacity">My Portal</Link>
          <Link href="/admin/settings" className="text-sm font-medium opacity-50 hover:opacity-100 transition-opacity italic">Admin</Link>
          <Link href="/booking"><Button variant="primary" size="sm">Book Now</Button></Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-brand-primary"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b p-6 flex flex-col gap-4 md:hidden shadow-xl animate-fade-in">
          <Link href="#services" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium">Services</Link>
          <Link href="#about" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium">About</Link>
          <Link href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium">Contact</Link>
          <Link href="/portal" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium">My Portal</Link>
          <Link href="/booking" onClick={() => setIsMobileMenuOpen(false)}><Button className="w-full">Book Now</Button></Link>
        </div>
      )}
    </nav>
  );
}
