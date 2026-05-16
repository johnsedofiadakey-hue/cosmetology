"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Beaker, Search, Plus, Copy, FileText, User } from "lucide-react";

export default function FormulationLab() {
  const [formulations, setFormulations] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newForm, setNewForm] = useState({ title: "", description: "", clientId: "", beforeImage: "", afterImage: "" });

  useEffect(() => {
    fetch("/api/admin/formulations").then(res => res.json()).then(data => setFormulations(data));
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/formulations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newForm)
    });
    if (res.ok) {
      const added = await res.json();
      setFormulations([added, ...formulations]);
      setIsAdding(false);
      setNewForm({ title: "", description: "", clientId: "", beforeImage: "", afterImage: "" });
    }
  };

  const filtered = formulations.filter(f => 
    f.title.toLowerCase().includes(search.toLowerCase()) || 
    f.description.toLowerCase().includes(search.toLowerCase())
  );

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
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
        setNewForm({ ...newForm, [field]: data.url });
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-3xl font-serif text-brand-primary">Formulation Lab</h3>
          <p className="text-zinc-500">Manage your secret mixes and chemical recipes.</p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="gap-2">
          <Plus className="w-4 h-4" /> New Formulation
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Search recipes, ingredients, or clients..." 
          className="w-full pl-12 pr-6 py-4 rounded-3xl border focus:ring-2 focus:ring-brand-primary outline-none"
          value={search || ""}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isAdding && (
        <div className="bg-white p-8 rounded-[40px] border shadow-lg animate-in zoom-in-95">
           <h4 className="text-xl font-bold mb-6">Create New Recipe</h4>
           <form onSubmit={handleAdd} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-zinc-400">Title</label>
                  <input 
                    value={newForm.title || ""} 
                    onChange={e => setNewForm({...newForm, title: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border" 
                    placeholder="e.g. Winter Blonde Glow"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-zinc-400">Client ID (Optional)</label>
                  <input 
                    value={newForm.clientId || ""} 
                    onChange={e => setNewForm({...newForm, clientId: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border" 
                    placeholder="Paste Client ID to link..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-zinc-400">Upload Before Image</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => uploadFile(e, 'beforeImage')}
                    className="w-full px-4 py-2 rounded-xl border text-xs" 
                  />
                  {newForm.beforeImage && <p className="text-[10px] text-zinc-400 truncate">Uploaded: {newForm.beforeImage}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-zinc-400">Upload After Image</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => uploadFile(e, 'afterImage')}
                    className="w-full px-4 py-2 rounded-xl border text-xs" 
                  />
                  {newForm.afterImage && <p className="text-[10px] text-zinc-400 truncate">Uploaded: {newForm.afterImage}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-zinc-400">Mix Instructions</label>
                <textarea 
                  value={newForm.description || ""} 
                  onChange={e => setNewForm({...newForm, description: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border h-32" 
                  placeholder="e.g. 30g L'Oreal Professional 7.1 + 45g 20vol Developer..."
                />
              </div>
              <div className="flex gap-4">
                 <Button type="submit" className="flex-1 h-12">Save to Library</Button>
                 <Button type="button" variant="outline" onClick={() => setIsAdding(false)} className="h-12">Cancel</Button>
              </div>
           </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((form) => (
          <div key={form.id} className="bg-white rounded-[40px] p-8 border hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-primary/5 flex items-center justify-center text-brand-primary">
                <Beaker className="w-6 h-6" />
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 hover:bg-zinc-50 rounded-lg text-zinc-400"><Copy className="w-4 h-4" /></button>
                <button className="p-2 hover:bg-zinc-50 rounded-lg text-zinc-400"><FileText className="w-4 h-4" /></button>
              </div>
            </div>
            <h4 className="text-xl font-serif text-brand-primary mb-2">{form.title}</h4>
            <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
              <User className="w-3 h-3" /> {form.clientId ? "Client Specific" : "Global Template"}
            </p>
            <div className="p-4 bg-zinc-50 rounded-2xl border border-dashed text-sm text-zinc-600 line-clamp-3">
              {form.description}
            </div>
            <div className="mt-6 pt-6 border-t flex justify-between items-center">
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest">{new Date(form.createdAt).toLocaleDateString()}</span>
              <Button variant="ghost" size="sm" className="text-xs">View Full Mix</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
