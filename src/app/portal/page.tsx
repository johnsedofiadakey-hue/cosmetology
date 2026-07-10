"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Phone, Lock, ArrowRight, ShieldCheck, ArrowLeft } from "lucide-react";

export default function ClientPortalAuth() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "password" | "otp">("phone");
  const [settings, setSettings] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/settings").then(res => res.json()).then(data => setSettings(data));
    
    // Auto-fill phone from localStorage if present
    if (typeof window !== "undefined") {
      const savedPhone = localStorage.getItem("client_phone");
      if (savedPhone) {
        setPhone(savedPhone);
      }
    }
  }, []);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (settings?.enableOTP) {
      try {
        const res = await fetch("/api/auth/otp/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone }),
        });
        const data = await res.json();
        if (res.ok) {
          setStep("otp");
          if (data.simulated) {
            alert(`[SIMULATOR] Verification code sent! Use code: ${data.otpCode}`);
          } else {
            alert("Verification code has been sent to your phone number.");
          }
        } else {
          setError(data.error || "Failed to send verification code. Please try again.");
        }
      } catch (err) {
        setError("Failed to connect to the server. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setStep("password");
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        phone,
        password: step === "password" ? password : "",
        otp: step === "otp" ? otp : "",
      });

      if (result?.error) {
        setError("Invalid phone number, password, or verification code.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
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
          <h2 className="text-4xl font-serif text-brand-primary mb-2">{settings?.companyName || "LOÙ Beauty Hub"} Portal</h2>
          <p className="text-zinc-400 text-sm">Access your treatment history and book new sessions.</p>
        </div>

        <form onSubmit={step === 'phone' ? handlePhoneSubmit : handleFinalSubmit} className="space-y-6">
          {error && (
            <p className="text-rose-600 text-xs text-center font-medium bg-rose-50 border border-rose-100 py-3 px-4 rounded-2xl animate-in fade-in zoom-in-95 duration-200">
              {error}
            </p>
          )}

          {step === "phone" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase text-zinc-400 tracking-widest">Phone Number</label>
                  {typeof window !== "undefined" && localStorage.getItem("client_phone") && (
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">Prefilled</span>
                  )}
                </div>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300" />
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                    placeholder="+233 00 000 0000"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full h-16 text-lg rounded-2xl gap-2 shadow-xl shadow-brand-primary/20" disabled={loading}>
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
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full h-16 text-lg rounded-2xl gap-2 shadow-xl shadow-brand-primary/20" disabled={loading}>
                {loading ? "Verifying..." : <>Verify & Enter <ShieldCheck className="w-5 h-5" /></>}
              </Button>
              <div className="flex flex-col gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => { if (!loading) setStep("password"); }} 
                  className="w-full text-xs font-bold uppercase text-brand-primary hover:text-brand-accent transition-colors flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  Log in with password instead
                </button>
                <button 
                  type="button" 
                  onClick={() => { if (!loading) setStep("phone"); }} 
                  className="w-full py-2 text-xs font-bold uppercase text-zinc-400 hover:text-brand-primary transition-colors flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  <ArrowLeft className="w-3 h-3" /> Change Phone Number
                </button>
              </div>
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
                    disabled={loading}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full h-16 text-lg rounded-2xl gap-2 shadow-xl shadow-brand-primary/20" disabled={loading}>
                {loading ? "Securing Session..." : <>Secure Login <ShieldCheck className="w-5 h-5" /></>}
              </Button>
              <div className="flex flex-col gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={async () => {
                    if (!loading) {
                      setLoading(true);
                      setError("");
                      try {
                        const res = await fetch("/api/auth/otp/send", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ phone }),
                        });
                        const data = await res.json();
                        if (res.ok) {
                          setStep("otp");
                          if (data.simulated) {
                            alert(`[SIMULATOR] Verification code sent! Use code: ${data.otpCode}`);
                          } else {
                            alert("Verification code has been sent to your phone number.");
                          }
                        } else {
                          setError(data.error || "Failed to send verification code. Please try again.");
                        }
                      } catch (err) {
                        setError("Failed to connect to the server. Please try again.");
                      } finally {
                        setLoading(false);
                      }
                    }
                  }} 
                  className="w-full text-xs font-bold uppercase text-brand-primary hover:text-brand-accent transition-colors flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  Forgot password? Use OTP code
                </button>
                <button 
                  type="button" 
                  onClick={() => { if (!loading) setStep("phone"); }} 
                  className="w-full py-2 text-xs font-bold uppercase text-zinc-400 hover:text-brand-primary transition-colors flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  <ArrowLeft className="w-3 h-3" /> Change Phone Number
                </button>
              </div>
            </div>
          )}
        </form>

        <div className="mt-12 text-center border-t pt-8">
           <p className="text-[10px] text-zinc-400 uppercase tracking-widest">Powered by LOÙ Beauty Hub</p>
        </div>
      </div>
    </div>
  );
}
