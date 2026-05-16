"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Plus, Trash2, Tag, ExternalLink } from "lucide-react";

export default function AdminPortfolio() {
  const [items, setItems] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ title: "", category: "Bridal", imageUrl: "" });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch("/api/portfolio").then(res => res.json()).then(data => {
      if (Array.isArray(data)) setItems(data);
    });
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/portfolio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem)
    });
    if (res.ok) {
      const added = await res.json();
      setItems([added, ...items]);
      setIsAdding(false);
      setNewItem({ title: "", category: "Bridal", imageUrl: "" });
    }
  };

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setNewItem({ ...newItem, imageUrl: data.url });
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/portfolio?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems(items.filter(i => i.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-3xl font-serif text-brand-primary">Transformation Gallery</h3>
          <p className="text-zinc-500">Manage the visual showcase of your professional work.</p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="gap-2 shadow-xl shadow-brand-primary/20">
          <Plus className="w-4 h-4" /> Add Transformation
        </Button>
      </div>

      {isAdding && (
        <div className="bg-white p-10 rounded-[40px] border shadow-2xl animate-in fade-in slide-in-from-top-6">
          <h4 className="text-xl font-bold mb-8 flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-brand-accent" /> New Showcase Item
          </h4>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-zinc-400">Project Title</label>
              <input 
                value={newItem.title} 
                onChange={e => setNewItem({...newItem, title: e.target.value})}
                className="w-full px-5 py-4 rounded-2xl border focus:ring-2 focus:ring-brand-primary outline-none" 
                placeholder="e.g. Platinum Balayage"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-zinc-400">Category</label>
              <select 
                value={newItem.category} 
                onChange={e => setNewItem({...newItem, category: e.target.value})}
                className="w-full px-5 py-4 rounded-2xl border focus:ring-2 focus:ring-brand-primary outline-none bg-white"
              >
                <option>Bridal</option>
                <option>Coloring</option>
                <option>Treatments</option>
                <option>Nail Art</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-zinc-400">Media (Image/Video)</label>
              <div className="flex flex-col gap-2">
                <input 
                  type="file" 
                  accept="image/*,video/*"
                  onChange={uploadFile}
                  className="text-xs text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand-primary/10 file:text-brand-primary hover:file:bg-brand-primary/20 cursor-pointer"
                  required={!newItem.imageUrl}
                />
                {uploading && <p className="text-[10px] text-brand-primary animate-pulse">Uploading...</p>}
                {newItem.imageUrl && <p className="text-[10px] text-emerald-600 truncate">Uploaded: {newItem.imageUrl}</p>}
              </div>
            </div>
            <div className="md:col-span-3 flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsAdding(false)} className="rounded-2xl px-8">Cancel</Button>
              <Button type="submit" className="rounded-2xl px-12">Publish to Gallery</Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {items.map((item) => (
          <div key={item.id} className="group relative bg-white rounded-[32px] overflow-hidden border hover:shadow-2xl transition-all duration-500">
            <div className="aspect-square relative overflow-hidden">
               <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.title} />
               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
               </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-3 h-3 text-brand-accent" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-accent">{item.category}</span>
              </div>
              <h4 className="text-lg font-bold">{item.title}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
