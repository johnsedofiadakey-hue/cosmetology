"use client";

import { useState } from "react";
import { Calendar, Clock, CreditCard, FileText, Scissors, User as UserIcon, History as TreatmentHistory } from "lucide-react";

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState<"appointments" | "invoices" | "timeline">("appointments");

  const client = {
    name: "Jane Doe",
    email: "jane@doe.com",
    memberSince: "Jan 2024"
  };

  const appointments = [
    { id: 1, date: "2024-05-15", time: "10:30 AM", service: "Precision Cut & Balayage", status: "Upcoming", price: 150.00 },
    { id: 2, date: "2024-04-01", time: "02:00 PM", service: "Deep Cleansing Facial", status: "Completed", price: 80.00 },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 pt-24 pb-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl p-8 mb-8 border shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6 text-center md:text-left flex-col md:flex-row">
            <div className="w-24 h-24 rounded-full bg-brand-secondary/50 flex items-center justify-center text-brand-primary border-4 border-white shadow-xl">
              <UserIcon className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-3xl font-serif text-brand-primary">{client.name}</h2>
              <p className="text-zinc-500">{client.email} • Member since {client.memberSince}</p>
            </div>
          </div>
          <div className="flex gap-3">
             <button className="px-6 py-3 bg-brand-primary text-white rounded-xl shadow-lg hover:scale-105 transition-transform font-medium">Book New Service</button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Navigation */}
          <div className="w-64 hidden lg:flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab("appointments")}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all ${activeTab === 'appointments' ? 'bg-brand-primary text-white shadow-lg' : 'hover:bg-white text-zinc-500'}`}
            >
              <Calendar className="w-5 h-5" /> Appointments
            </button>
            <button 
              onClick={() => setActiveTab("invoices")}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all ${activeTab === 'invoices' ? 'bg-brand-primary text-white shadow-lg' : 'hover:bg-white text-zinc-500'}`}
            >
              <FileText className="w-5 h-5" /> My Invoices
            </button>
            <button 
              onClick={() => setActiveTab("timeline")}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all ${activeTab === 'timeline' ? 'bg-brand-primary text-white shadow-lg' : 'hover:bg-white text-zinc-500'}`}
            >
              <TreatmentHistory className="w-5 h-5" /> Treatment Journey
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 space-y-6">
            {activeTab === "appointments" && (
              <div className="bg-white rounded-3xl p-8 border shadow-sm">
                <h3 className="text-xl font-bold mb-6">Your Appointments</h3>
                <div className="space-y-4">
                  {appointments.map((apt) => (
                    <div key={apt.id} className="flex flex-col sm:flex-row items-center justify-between p-6 rounded-2xl border bg-zinc-50 hover:border-brand-accent transition-colors gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-brand-primary shadow-sm">
                          <Scissors className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold">{apt.service}</p>
                          <p className="text-xs text-zinc-500 flex items-center gap-2">
                            <Calendar className="w-3 h-3" /> {apt.date} • <Clock className="w-3 h-3" /> {apt.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm font-bold">${apt.price.toFixed(2)}</p>
                          <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full ${
                            apt.status === 'Upcoming' ? 'bg-brand-secondary/50 text-brand-primary' : 'bg-zinc-200 text-zinc-500'
                          }`}>
                            {apt.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "timeline" && (
              <div className="bg-white rounded-3xl p-8 border shadow-sm">
                <h3 className="text-xl font-bold mb-6">Your Transformation Journey</h3>
                <div className="space-y-12 relative before:absolute before:left-6 before:top-16 before:bottom-0 before:w-[2px] before:bg-zinc-100">
                  <div className="relative pl-16">
                     <div className="absolute left-[20px] top-1 w-2 h-2 rounded-full bg-brand-primary" />
                     <p className="text-xs font-bold text-brand-accent mb-1 uppercase tracking-widest">Latest Update</p>
                     <h4 className="font-bold text-lg mb-2">Deep Hydration Phase</h4>
                     <p className="text-sm text-zinc-500 mb-4">"Skin is showing significant improvement in elasticity. Moving to maintenance serums next month."</p>
                     <div className="flex gap-4">
                        <div className="relative group cursor-pointer">
                           <div className="w-32 h-32 rounded-2xl bg-zinc-100 overflow-hidden border-2 border-white shadow-md">
                              <img src="/service_hair.png" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="Before" />
                           </div>
                           <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[8px] px-2 py-0.5 rounded-full font-bold uppercase">Before</span>
                        </div>
                        <div className="relative group cursor-pointer">
                           <div className="w-32 h-32 rounded-2xl bg-zinc-100 overflow-hidden border-2 border-brand-accent shadow-md">
                              <img src="/service_hair.png" className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="After" />
                           </div>
                           <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-brand-accent text-white text-[8px] px-2 py-0.5 rounded-full font-bold uppercase">After</span>
                        </div>
                     </div>
                  </div>
                  <div className="relative pl-16">
                     <div className="absolute left-[20px] top-1 w-2 h-2 rounded-full bg-zinc-200" />
                     <h4 className="font-bold text-lg mb-2">Initial Consultation</h4>
                     <p className="text-sm text-zinc-500">"Focused on redness reduction and texture smoothing. Started on Rose Water base."</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "invoices" && (
              <div className="bg-white rounded-3xl p-8 border shadow-sm">
                <h3 className="text-xl font-bold mb-6">Digital Receipts</h3>
                <div className="space-y-4">
                   <div className="flex items-center justify-between p-6 rounded-2xl border bg-zinc-50">
                      <div className="flex items-center gap-4">
                        <FileText className="w-6 h-6 text-brand-primary" />
                        <div>
                          <p className="font-bold">INV-00124</p>
                          <p className="text-xs text-zinc-500">April 1st, 2024</p>
                        </div>
                      </div>
                      <button className="text-brand-primary font-bold text-sm hover:underline">Download PDF</button>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
