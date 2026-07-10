"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format, addDays, startOfToday, isSameDay } from "date-fns";
import { ChevronRight, ChevronLeft, Check, Calendar, Clock, User, Phone, Banknote, CreditCard, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import confetti from "canvas-confetti";
import { Skeleton } from "@/components/ui/skeleton";
import { normalizeGhanaPhone, formatSlotLabel } from "@/lib/utils";

type Step = "service" | "datetime" | "details" | "payment";

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState<Step>("service");
  const [services, setServices] = useState<any[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [clientData, setClientData] = useState({ name: "", phone: "" });
  const [currency, setCurrency] = useState("GH₵");
  const [requireDeposit, setRequireDeposit] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setIsAdmin(searchParams.get("admin") === "true");
    setIsLoadingServices(true);
    fetch("/api/services")
      .then(res => res.json())
      .then(data => {
        setServices(data);
        setIsLoadingServices(false);
      });

    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.currencySymbol) setCurrency(data.currencySymbol);
        setRequireDeposit(!!data.requireDeposit);
      });
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      setIsLoadingSlots(true);
      fetch(`/api/bookings/available?date=${dateStr}`)
        .then(res => res.json())
        .then(data => {
          setAvailableSlots(data);
          setIsLoadingSlots(false);
        });
    }
  }, [selectedDate]);

  const skipPayment = isAdmin || !requireDeposit;
  const steps: Step[] = skipPayment ? ["service", "datetime", "details"] : ["service", "datetime", "details", "payment"];
  const stepIndex = steps.indexOf(currentStep);

  const days = Array.from({ length: 14 }, (_, i) => addDays(startOfToday(), i));

  const totalPrice = selectedServices.reduce((acc, s) => acc + s.price, 0);
  const totalDuration = selectedServices.reduce((acc, s) => acc + s.duration, 0);

  const handleNext = async () => {
    if (currentStep === "service") setCurrentStep("datetime");
    else if (currentStep === "datetime") setCurrentStep("details");
    else if (currentStep === "details") {
      if (skipPayment) {
        await finalizeBooking();
      } else {
        setCurrentStep("payment");
      }
    }
    else if (currentStep === "payment") {
      await finalizeBooking();
    }
  };

  const finalizeBooking = async () => {
    const normalizedPhone = normalizeGhanaPhone(clientData.phone);
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceIds: selectedServices.map(s => s.id),
        startTime: `${format(selectedDate, 'yyyy-MM-dd')}T${selectedTime}:00`,
        name: clientData.name,
        phone: normalizedPhone,
        staffId: "solo-staff-id"
      })
    });

    if (res.ok) {
      const appointment = await res.json();

      // Save phone to localStorage so they can auto-fill it when logging in
      if (typeof window !== "undefined") {
        localStorage.setItem("client_phone", normalizedPhone);
      }

      // No online payment required (admin booking, or deposits are off) —
      // clients pay by cash/Mobile Money at the appointment.
      if (skipPayment) {
        setIsSuccess(true);
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#E8B8B0', '#FFF9F6', '#D4AF37']
        });
        return;
      }

      // Deposits are required — redirect to Paystack.
      setIsRedirecting(true);
      const payRes = await fetch("/api/payments/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: appointment.id,
          amount: totalPrice * 0.2 // 20% Deposit
        })
      });

      const payData = await payRes.json();
      if (payData.success && payData.authorization_url) {
        window.location.href = payData.authorization_url;
      } else {
        alert("Payment initialization failed. Please contact us.");
        setIsRedirecting(false);
      }
    } else {
      const errorData = await res.json();
      alert(errorData.error || "Failed to confirm booking. Please try again.");
    }
  };

  const handleBack = () => {
    if (currentStep === "datetime") setCurrentStep("service");
    else if (currentStep === "details") setCurrentStep("datetime");
    else if (currentStep === "payment") setCurrentStep("details");
  };

  const toggleService = (service: any) => {
    if (selectedServices.find(s => s.id === service.id)) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-12">
          {steps.map((step, idx) => (
            <div key={step} className="flex items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  idx <= stepIndex ? "bg-brand-primary text-white" : "bg-zinc-200 text-zinc-500"
                }`}
              >
                {idx < stepIndex ? <Check className="w-5 h-5" /> : idx + 1}
              </div>
              {idx < steps.length - 1 && (
                <div className={`w-12 md:w-24 h-[2px] mx-2 ${idx < stepIndex ? "bg-brand-primary" : "bg-zinc-200"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border relative overflow-hidden">
          {/* Success Overlay */}
          {isSuccess && (
            <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-500">
               <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mb-6 animate-in zoom-in-50 duration-500 delay-200">
                  <Check className="w-12 h-12 text-emerald-600" />
               </div>
               <h2 className="text-4xl font-serif text-brand-primary mb-4">Confirmed!</h2>
               <p className="text-lg text-zinc-600 mb-8">Your appointment for {selectedServices.length} service{selectedServices.length === 1 ? "" : "s"} has been secured. We'll see you soon!</p>
               <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                 <Link 
                   href="/portal" 
                   className="flex-1 px-8 py-4 bg-brand-primary text-white rounded-2xl font-bold hover:scale-105 transition-transform shadow-xl shadow-brand-primary/20"
                 >
                   Access Your Portal
                 </Link>
                 <Link 
                   href="/" 
                   className="flex-1 px-8 py-4 bg-zinc-100 text-zinc-600 rounded-2xl font-bold hover:bg-zinc-200 transition-colors"
                 >
                   Back to Home
                 </Link>
               </div>
            </div>
          )}

          {/* Step 1: Select Service */}
          {currentStep === "service" && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-serif text-brand-primary mb-2">Select Services</h2>
                <p className="text-zinc-500">You can choose multiple treatments for your session.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isLoadingServices ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-zinc-100">
                      <Skeleton className="w-16 h-16 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))
                ) : (
                  services.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => toggleService(s)}
                      className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all relative ${
                        selectedServices.find(srv => srv.id === s.id) ? "border-brand-primary bg-brand-primary/5" : "border-zinc-100 hover:border-brand-accent"
                      }`}
                    >
                      {selectedServices.find(srv => srv.id === s.id) && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-brand-primary text-white rounded-full flex items-center justify-center shadow-lg">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <div className="w-16 h-16 rounded-xl bg-zinc-100 overflow-hidden relative">
                         {s.image ? <Image src={s.image} alt={s.name} fill className="object-cover" /> : <Scissors className="m-auto" />}
                      </div>
                      <div className="text-left">
                        <h4 className="font-bold">{s.name}</h4>
                        <p className="text-xs text-zinc-500">{s.duration} mins • {currency}{s.price}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
              
              {selectedServices.length > 0 && (
                <div className="p-4 bg-brand-primary/5 rounded-2xl border border-brand-primary/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold">
                      {selectedServices.length}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-brand-primary">Selected Services</p>
                      <p className="text-xs text-zinc-500">{totalDuration} mins total</p>
                    </div>
                  </div>
                  <p className="text-xl font-serif text-brand-primary font-bold">{currency}{totalPrice}</p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Date & Time */}
          {currentStep === "datetime" && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-serif text-brand-primary mb-2">Choose Time</h2>
                <p className="text-zinc-500">Select a slot for your {totalDuration} min session.</p>
              </div>
              
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {days.map((day) => (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={`flex flex-col items-center min-w-[70px] p-4 rounded-2xl border-2 transition-all ${
                      isSameDay(day, selectedDate) ? "border-brand-primary bg-brand-primary text-white" : "border-zinc-100"
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold mb-1 opacity-60">{format(day, "EEE")}</span>
                    <span className="text-lg font-bold">{format(day, "d")}</span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {isLoadingSlots ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 rounded-xl" />
                  ))
                ) : availableSlots.length > 0 ? (
                  availableSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        selectedTime === time ? "border-brand-primary bg-brand-primary text-white" : "border-zinc-100 hover:border-brand-accent"
                      }`}
                    >
                      {formatSlotLabel(time)}
                    </button>
                  ))
                ) : (
                  <p className="col-span-full text-center text-zinc-400 py-8">No slots available for this date.</p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Client Details */}
          {currentStep === "details" && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-serif text-brand-primary mb-2">Your Information</h2>
                <p className="text-zinc-500">We'll use this to confirm your booking and reach you.</p>
              </div>
              <div className="space-y-4 max-w-md mx-auto">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <input
                    type="text"
                    value={clientData.name}
                    onChange={(e) => setClientData({...clientData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-brand-primary outline-none"
                    placeholder="Jane Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <div className="relative flex items-stretch">
                    <div className="flex items-center gap-1.5 pl-4 pr-3 rounded-l-xl border border-r-0 bg-zinc-50 text-zinc-500 font-bold text-sm">
                      <Phone className="w-4 h-4 text-zinc-300" />
                      +233
                    </div>
                    <input
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      value={clientData.phone}
                      onChange={(e) => setClientData({...clientData, phone: e.target.value.replace(/\D/g, "")})}
                      className="w-full pl-3 pr-4 py-3 rounded-r-xl border focus:ring-2 focus:ring-brand-primary outline-none"
                      placeholder="0541234567 or 541234567"
                    />
                  </div>
                </div>
                {skipPayment && (
                  <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl text-emerald-800 text-sm">
                    <Banknote className="w-5 h-5 flex-shrink-0" />
                    <p>No online payment needed — pay by Mobile Money or cash when you arrive.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Payment Preview */}
          {currentStep === "payment" && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-serif text-brand-primary mb-2">Secure Your Slot</h2>
                <p className="text-zinc-500">A 20% deposit is required to confirm booking.</p>
              </div>
              
              <div className="bg-zinc-50 rounded-2xl p-6 border border-dashed border-zinc-300">
                <div className="space-y-3">
                  <div className="pb-3 border-b border-zinc-200">
                    <span className="text-xs uppercase tracking-widest text-zinc-400 font-bold">Selected Services</span>
                  </div>
                  {selectedServices.map(s => (
                    <div key={s.id} className="flex justify-between text-sm">
                      <span className="text-zinc-500">{s.name}</span>
                      <span className="font-medium">{currency}{s.price}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-3 border-t">
                    <span className="text-zinc-500">Date & Time</span>
                    <span className="font-medium">{format(selectedDate, "MMMM do")} at {selectedTime}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t">
                    <span className="font-bold">Total Amount</span>
                    <span className="font-bold">{currency}{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-brand-primary">
                    <span className="font-bold">Deposit Due Now (20%)</span>
                    <span className="font-bold">{currency}{(totalPrice * 0.2).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl text-amber-800 text-sm">
                <CreditCard className="w-5 h-5 flex-shrink-0" />
                <p>You will be redirected to Paystack to securely pay your deposit.</p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-12 flex items-center justify-between md:relative fixed bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-xl border-t md:border-none md:bg-transparent md:p-0 z-40 pb-safe">
            {stepIndex === 0 ? (
              <Link 
                href="/"
                className="flex items-center gap-2 text-zinc-500 font-medium hover:text-zinc-800 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" /> <span className="hidden sm:inline">Back to Home</span>
              </Link>
            ) : (
              <button 
                onClick={handleBack}
                className="flex items-center gap-2 text-zinc-500 font-medium hover:text-zinc-800 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" /> <span className="hidden sm:inline">Back</span>
              </button>
            )}
            <Button 
              size="lg"
              className="flex-1 sm:flex-none ml-4 h-14 sm:h-12 font-bold text-lg"
              onClick={handleNext}
              disabled={
                isRedirecting ||
                (currentStep === "service" && selectedServices.length === 0) ||
                (currentStep === "datetime" && !selectedTime) ||
                (currentStep === "details" && (!clientData.name || clientData.phone.replace(/\D/g, "").length < 9))
              }
            >
              {isRedirecting
                ? "Redirecting..."
                : currentStep === "payment"
                ? "Confirm & Pay"
                : currentStep === "details" && skipPayment
                ? "Confirm Booking"
                : "Continue"}
              {!isRedirecting && currentStep !== "payment" && !(currentStep === "details" && skipPayment) && <ChevronRight className="w-5 h-5 ml-2" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
