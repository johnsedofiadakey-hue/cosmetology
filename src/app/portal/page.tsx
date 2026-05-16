"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Phone, Lock, ArrowRight, ShieldCheck, ArrowLeft } from "lucide-react";

export default function ClientPortalAuth() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "password" | "otp">("phone");
  const [settings, setSettings] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/settings").then(res => res.json()).then(data => setSettings(data));
  }, []);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (settings?.enableOTP) {
      setStep("otp");
      // In a real app, this would trigger the SMS API
      alert("Simulator: OTP code '1234' sent to " + phone);
    } else {
      setStep("password");
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'otp' && otp === '1234') {
       router.push("/dashboard");
    } else if (step === 'password') {
       // In a real app, verify password against DB
       router.push("/dashboard");
    } else {
       alert("Invalid verification. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-brand-primary flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[40px] p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-brand-accent" />
        <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-zinc-400 hover:text-brand-primary transition-colors text-xs font-bold uppercase tracking-widest group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Website
        </Link>
        
        <div className="text-center mb-10">
          <h2 className="text-4xl font-serif text-brand-primary mb-2">My Studio Portal</h2>
          <p className="text-zinc-400 text-sm">Access your treatment history and book new sessions.</p>
        </div>

        <form onSubmit={step === 'phone' ? handlePhoneSubmit : handleFinalSubmit} className="space-y-6">
          {step === "phone" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-zinc-400 tracking-widest">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300" />
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                    placeholder="+233 00 000 0000"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full h-16 text-lg rounded-2xl gap-2 shadow-xl shadow-brand-primary/20">
                Continue <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          )}

          {step === "otp" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <div className="space-y-2 text-center">
                <label className="text-xs font-bold uppercase text-zinc-400 tracking-widest">Verification Code</label>
                <p className="text-[10px] text-zinc-500 mb-4">Enter the 4-digit code sent to {phone}</p>
                <input 
                  type="text" 
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full text-center text-4xl tracking-[2em] font-bold py-4 rounded-2xl border focus:ring-2 focus:ring-brand-primary outline-none"
                  placeholder="0000"
                  required
                />
              </div>
              <Button type="submit" className="w-full h-16 text-lg rounded-2xl gap-2 shadow-xl shadow-brand-primary/20">
                Verify & Enter <ShieldCheck className="w-5 h-5" />
              </Button>
              <button 
                type="button" 
                onClick={() => setStep("phone")} 
                className="w-full py-4 text-xs font-bold uppercase text-zinc-400 hover:text-brand-primary transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-3 h-3" /> Change Phone Number
              </button>
            </div>
          )}

          {step === "password" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-zinc-400 tracking-widest">Secure Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full h-16 text-lg rounded-2xl gap-2 shadow-xl shadow-brand-primary/20">
                Secure Login <ShieldCheck className="w-5 h-5" />
              </Button>
              <button 
                type="button" 
                onClick={() => setStep("phone")} 
                className="w-full py-4 text-xs font-bold uppercase text-zinc-400 hover:text-brand-primary transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-3 h-3" /> Use different number
              </button>
            </div>
          )}
        </form>

        <div className="mt-12 text-center border-t pt-8">
           <p className="text-[10px] text-zinc-400 uppercase tracking-widest">Powered by LOU Beauty Hub Infrastructure</p>
        </div>
      </div>
    </div>
  );
}
