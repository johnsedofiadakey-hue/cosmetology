"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Scissors, Plus, Search, MoreVertical, Trash2 } from "lucide-react";

export default function AdminServices() {
  const [newService, setNewService] = useState({ name: "", price: "", duration: "", category: "Hair", description: "", imageUrl: "" });
  const [services, setServices] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [currency, setCurrency] = useState("GH₵");

  useEffect(() => {
    fetch("/api/services").then(res => res.json()).then(data => setServices(data));
    fetch("/api/settings").then(res => res.json()).then(data => {
      if (data.currencySymbol) setCurrency(data.currencySymbol);
    });
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
      setNewService({ name: "", price: "", duration: "", category: "Hair", description: "", imageUrl: "" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    const res = await fetch(`/api/services?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setNewService({ ...newService, imageUrl: data.url });
      }
    } catch (error) {
      console.error("Upload failed:", error);
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
                value={newService.name || ""} 
                onChange={e => setNewService({...newService, name: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-brand-primary outline-none" 
                placeholder="e.g. Signature Facial"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-zinc-400">Price ({currency})</label>
              <input 
                type="number" 
                value={newService.price || ""} 
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
                value={newService.duration || ""} 
                onChange={e => setNewService({...newService, duration: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-brand-primary outline-none" 
                placeholder="60"
                required
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold uppercase text-zinc-400">Description</label>
              <textarea 
                value={newService.description || ""} 
                onChange={e => setNewService({...newService, description: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-brand-primary outline-none h-12" 
                placeholder="Brief description of the service..."
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold uppercase text-zinc-400">Upload Service Image</label>
              <div className="flex flex-col gap-2">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={uploadFile}
                  className="text-xs text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand-primary/10 file:text-brand-primary hover:file:bg-brand-primary/20 cursor-pointer"
                />
                {newService.imageUrl && <p className="text-[10px] text-zinc-400 truncate">Uploaded: {newService.imageUrl}</p>}
              </div>
            </div>
            <div className="flex items-end gap-2 md:col-span-4">
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
              <button 
                onClick={() => handleDelete(service.id)}
                className="text-zinc-300 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <h4 className="text-lg font-bold">{service.name}</h4>
            <p className="text-zinc-500 text-sm mb-6">{service.category} • {service.duration} mins</p>
            <div className="flex justify-between items-center pt-4 border-t border-zinc-50">
              <span className="text-xl font-bold text-brand-primary">{currency}{service.price.toFixed(2)}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Active</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
