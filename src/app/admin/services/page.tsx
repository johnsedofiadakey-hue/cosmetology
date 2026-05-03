"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Scissors, Plus, Search, MoreVertical, Trash2 } from "lucide-react";

export default function AdminServices() {
  const [services, setServices] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newService, setNewService] = useState({ name: "", price: "", duration: "", category: "Hair" });

  useEffect(() => {
    fetch("/api/services").then(res => res.json()).then(data => setServices(data));
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newService, price: parseFloat(newService.price), duration: parseInt(newService.duration) })
    });
    if (res.ok) {
      const added = await res.json();
      setServices([...services, added]);
      setIsAdding(false);
      setNewService({ name: "", price: "", duration: "", category: "Hair" });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-3xl font-serif text-brand-primary">Service Menu</h3>
          <p className="text-zinc-500">Define your treatments and their professional pricing.</p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Add Service
        </Button>
      </div>

      {isAdding && (
        <div className="bg-white p-8 rounded-3xl border shadow-lg animate-in fade-in slide-in-from-top-4">
          <h4 className="text-xl font-bold mb-6">New Treatment</h4>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-zinc-400">Name</label>
              <input 
                value={newService.name} 
                onChange={e => setNewService({...newService, name: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-brand-primary outline-none" 
                placeholder="e.g. Signature Facial"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-zinc-400">Price ($)</label>
              <input 
                type="number" 
                value={newService.price} 
                onChange={e => setNewService({...newService, price: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-brand-primary outline-none" 
                placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-zinc-400">Duration (min)</label>
              <input 
                type="number" 
                value={newService.duration} 
                onChange={e => setNewService({...newService, duration: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-brand-primary outline-none" 
                placeholder="60"
                required
              />
            </div>
            <div className="flex items-end gap-2">
              <Button type="submit" className="flex-1 h-[50px]">Save Treatment</Button>
              <Button type="button" variant="outline" onClick={() => setIsAdding(false)} className="h-[50px]">Cancel</Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white p-6 rounded-3xl border hover:shadow-md transition-all group relative">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-secondary/50 flex items-center justify-center text-brand-primary">
                <Scissors className="w-6 h-6" />
              </div>
              <button className="text-zinc-300 hover:text-zinc-600 transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            <h4 className="text-lg font-bold">{service.name}</h4>
            <p className="text-zinc-500 text-sm mb-6">{service.category} • {service.duration} mins</p>
            <div className="flex justify-between items-center pt-4 border-t border-zinc-50">
              <span className="text-xl font-bold text-brand-primary">${service.price.toFixed(2)}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Active</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
