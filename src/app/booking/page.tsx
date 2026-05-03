"use client";

import { useState, useEffect } from "react";
import { format, addDays, startOfToday, isSameDay } from "date-fns";
import { ChevronRight, ChevronLeft, Check, Calendar, Clock, User, CreditCard, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type Step = "service" | "datetime" | "details" | "payment";

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState<Step>("service");
  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [clientData, setClientData] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    fetch("/api/services").then(res => res.json()).then(data => setServices(data));
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      fetch(`/api/bookings/available?date=${dateStr}`)
        .then(res => res.json())
        .then(data => setAvailableSlots(data));
    }
  }, [selectedDate]);

  const steps: Step[] = ["service", "datetime", "details", "payment"];
  const stepIndex = steps.indexOf(currentStep);

  const days = Array.from({ length: 14 }, (_, i) => addDays(startOfToday(), i));
  const timeSlots = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];

  const handleNext = async () => {
    if (currentStep === "service") setCurrentStep("datetime");
    else if (currentStep === "datetime") setCurrentStep("details");
    else if (currentStep === "details") setCurrentStep("payment");
    else if (currentStep === "payment") {
      // Final confirmation
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService.id,
          startTime: `${format(selectedDate, 'yyyy-MM-dd')}T${selectedTime}:00`,
          clientId: "default-client-id",
          staffId: "solo-staff-id"
        })
      });
      if (res.ok) {
        alert("Booking confirmed! Redirecting to dashboard...");
        window.location.href = "/dashboard";
      }
    }
  };

  const handleBack = () => {
    if (currentStep === "datetime") setCurrentStep("service");
    else if (currentStep === "details") setCurrentStep("datetime");
    else if (currentStep === "payment") setCurrentStep("details");
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

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border">
          {/* Step 1: Select Service */}
          {currentStep === "service" && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-serif text-brand-primary mb-2">Select a Service</h2>
                <p className="text-zinc-500">Choose the treatment you'd like to book today.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedService(s)}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                      selectedService?.id === s.id ? "border-brand-primary bg-brand-primary/5" : "border-zinc-100 hover:border-brand-accent"
                    }`}
                  >
                    <div className="w-16 h-16 rounded-xl bg-zinc-100 overflow-hidden relative">
                       {s.image ? <Image src={s.image} alt={s.name} fill className="object-cover" /> : <Scissors className="m-auto" />}
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold">{s.name}</h4>
                      <p className="text-xs text-zinc-500">{s.duration} mins • ${s.price}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Date & Time */}
          {currentStep === "datetime" && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-serif text-brand-primary mb-2">Choose Time</h2>
                <p className="text-zinc-500">Select a slot that fits your schedule.</p>
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
                {availableSlots.length > 0 ? (
                  availableSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        selectedTime === time ? "border-brand-primary bg-brand-primary text-white" : "border-zinc-100 hover:border-brand-accent"
                      }`}
                    >
                      {time}
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
                <p className="text-zinc-500">We'll use this to send your confirmation.</p>
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
                  <label className="text-sm font-medium">Email Address</label>
                  <input 
                    type="email" 
                    value={clientData.email}
                    onChange={(e) => setClientData({...clientData, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-brand-primary outline-none"
                    placeholder="jane@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <input 
                    type="tel" 
                    value={clientData.phone}
                    onChange={(e) => setClientData({...clientData, phone: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-brand-primary outline-none"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
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
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Service</span>
                    <span className="font-medium">{selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Date & Time</span>
                    <span className="font-medium">{format(selectedDate, "MMMM do")} at {selectedTime}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t">
                    <span className="font-bold">Total Amount</span>
                    <span className="font-bold">${selectedService?.price}</span>
                  </div>
                  <div className="flex justify-between text-brand-accent">
                    <span className="font-bold">Deposit Due Now (20%)</span>
                    <span className="font-bold">${(selectedService?.price * 0.2).toFixed(2)}</span>
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
          <div className="mt-12 flex items-center justify-between">
            <button 
              onClick={handleBack}
              className={`flex items-center gap-2 text-zinc-500 font-medium hover:text-zinc-800 transition-colors ${stepIndex === 0 ? 'invisible' : ''}`}
            >
              <ChevronLeft className="w-5 h-5" /> Back
            </button>
            <Button 
              size="lg" 
              onClick={handleNext}
              disabled={
                (currentStep === "service" && !selectedService) ||
                (currentStep === "datetime" && !selectedTime) ||
                (currentStep === "details" && (!clientData.name || !clientData.email))
              }
            >
              {currentStep === "payment" ? "Confirm & Pay Deposit" : "Continue"}
              {currentStep !== "payment" && <ChevronRight className="w-5 h-5 ml-2" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
