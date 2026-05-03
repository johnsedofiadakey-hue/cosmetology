"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock, User, CheckCircle, XCircle, MoreVertical } from "lucide-react";

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [view, setView] = useState<"list" | "calendar">("list");

  useEffect(() => {
    fetch("/api/bookings")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setAppointments(data);
      });
  }, []);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/bookings/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-3xl font-serif text-brand-primary">Appointment Book</h3>
          <p className="text-zinc-500">Manage your daily schedule and confirm client arrivals.</p>
        </div>
        <div className="flex bg-zinc-100 p-1 rounded-xl">
          <button 
            onClick={() => setView("list")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${view === 'list' ? 'bg-white shadow-sm text-brand-primary' : 'text-zinc-500'}`}
          >
            List View
          </button>
          <button 
            onClick={() => setView("calendar")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${view === 'calendar' ? 'bg-white shadow-sm text-brand-primary' : 'text-zinc-500'}`}
          >
            Calendar
          </button>
        </div>
      </div>

      {view === "list" ? (
        <div className="bg-white rounded-[40px] shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-zinc-50 border-b">
            <tr className="text-xs uppercase tracking-widest text-zinc-500">
              <th className="px-8 py-4 font-bold">Client & Service</th>
              <th className="px-8 py-4 font-bold">Time</th>
              <th className="px-8 py-4 font-bold">Status</th>
              <th className="px-8 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {appointments.length > 0 ? appointments.map((apt) => (
              <tr key={apt.id} className="hover:bg-zinc-50 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-secondary/50 flex items-center justify-center text-brand-primary">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold">{apt.client?.user?.name || 'Walk-in Client'}</p>
                      <p className="text-xs text-brand-accent">{apt.service?.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="w-4 h-4 text-zinc-400" />
                    <span>{new Date(apt.startTime).toLocaleDateString()}</span>
                    <Clock className="w-4 h-4 text-zinc-400 ml-2" />
                    <span>{new Date(apt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    apt.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                    apt.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                    'bg-zinc-100 text-zinc-700'
                  }`}>
                    {apt.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    {apt.status === 'PENDING' && (
                      <>
                        <button 
                          onClick={() => updateStatus(apt.id, 'COMPLETED')}
                          className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => updateStatus(apt.id, 'CANCELLED')}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    <button className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="px-8 py-12 text-center text-zinc-400 italic">
                  No appointments scheduled yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      ) : (
        <div className="bg-white rounded-[40px] shadow-sm border p-8 overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-8 border-b pb-4 mb-4">
              <div />
              {days.map(day => (
                <div key={day} className="text-center text-xs font-bold uppercase text-zinc-400 tracking-widest">{day}</div>
              ))}
            </div>
            <div className="space-y-1">
              {hours.map(hour => (
                <div key={hour} className="grid grid-cols-8 items-center h-20 border-b border-zinc-50 last:border-0 group">
                  <div className="text-[10px] font-bold text-zinc-300 group-hover:text-brand-primary transition-colors">{hour}</div>
                  {Array.from({ length: 7 }).map((_, i) => {
                    // Simulation: finding appointments for this slot
                    const hasApt = Math.random() > 0.8;
                    return (
                      <div key={i} className="h-full border-l border-zinc-50 relative p-1">
                        {hasApt && (
                          <div className="absolute inset-1 bg-brand-primary/10 rounded-xl border border-brand-primary/20 p-2 text-[8px] overflow-hidden group/apt cursor-pointer hover:bg-brand-primary hover:text-white transition-all">
                             <p className="font-bold truncate">Client Session</p>
                             <p className="opacity-70">Cut & Color</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
