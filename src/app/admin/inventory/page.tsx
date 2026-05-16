"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Package, Plus, AlertCircle, RefreshCw, BarChart3 } from "lucide-react";

export default function AdminInventory() {
  const [items, setItems] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", quantity: "", unit: "ml", minThreshold: "50" });

  useEffect(() => {
    fetch("/api/inventory").then(res => res.json()).then(data => setItems(data));
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newItem, quantity: parseFloat(newItem.quantity), minThreshold: parseFloat(newItem.minThreshold) })
    });
    if (res.ok) {
      const added = await res.json();
      setItems([...items, added]);
      setIsAdding(false);
      setNewItem({ name: "", quantity: "", unit: "ml", minThreshold: "50" });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-3xl font-serif text-brand-primary">Inventory Vault</h3>
          <p className="text-zinc-500">Track your raw materials and receive stock alerts.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" /> Sync Stock
          </Button>
          <Button onClick={() => setIsAdding(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Add Item
          </Button>
        </div>
      </div>

      {isAdding && (
        <div className="bg-white p-8 rounded-3xl border shadow-lg animate-in fade-in slide-in-from-top-4">
          <h4 className="text-xl font-bold mb-6">New Raw Material</h4>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-zinc-400">Material Name</label>
              <input 
                value={newItem.name} 
                onChange={e => setNewItem({...newItem, name: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-brand-primary outline-none" 
                placeholder="e.g. Organic Serum"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-zinc-400">Initial Quantity</label>
              <input 
                type="number" 
                value={newItem.quantity} 
                onChange={e => setNewItem({...newItem, quantity: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-brand-primary outline-none" 
                placeholder="1000"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-zinc-400">Unit (ml, g, etc)</label>
              <input 
                value={newItem.unit} 
                onChange={e => setNewItem({...newItem, unit: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-brand-primary outline-none" 
                placeholder="ml"
                required
              />
            </div>
            <div className="flex items-end gap-2">
              <Button type="submit" className="flex-1 h-[50px]">Save Material</Button>
              <Button type="button" variant="outline" onClick={() => setIsAdding(false)} className="h-[50px]">Cancel</Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item) => {
          const isLow = item.quantity <= item.minThreshold;
          const willBeLow = item.isForecastingLow && !isLow;
          return (
            <div key={item.id} className={`bg-white p-6 rounded-3xl border transition-all ${isLow ? 'border-red-200 ring-2 ring-red-50' : willBeLow ? 'border-amber-200 ring-2 ring-amber-50' : 'hover:shadow-md'}`}>
              <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isLow ? 'bg-red-100 text-red-600' : willBeLow ? 'bg-amber-100 text-amber-600' : 'bg-brand-secondary/50 text-brand-primary'}`}>
                  {isLow ? <AlertCircle className="w-6 h-6" /> : willBeLow ? <Clock className="w-6 h-6" /> : <Package className="w-6 h-6" />}
                </div>
                <div className="text-right">
                  {isLow ? (
                    <span className="text-[10px] font-bold text-red-600 uppercase tracking-tighter">Low Stock</span>
                  ) : willBeLow ? (
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-tighter">Shortage Predicted</span>
                  ) : null}
                </div>
              </div>
              <h4 className="text-lg font-bold truncate">{item.name}</h4>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold">{item.quantity} <span className="text-sm font-medium text-zinc-400">{item.unit}</span></p>
                  <div className="w-full bg-zinc-100 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${isLow ? 'bg-red-500' : willBeLow ? 'bg-amber-500' : 'bg-brand-accent'}`} 
                      style={{ width: `${Math.min((item.quantity / (item.minThreshold * 5)) * 100, 100)}%` }}
                    />
                  </div>
                  {item.projectedUsage > 0 && (
                    <div className="mt-3 p-2 bg-zinc-50 rounded-lg border border-dashed">
                      <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Forecast</p>
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-400">Reserved:</span>
                        <span className="font-bold">-{item.projectedUsage}{item.unit}</span>
                      </div>
                    </div>
                  )}
                </div>
                <button className="p-2 hover:bg-zinc-50 rounded-xl text-zinc-400 group relative">
                  <BarChart3 className="w-5 h-5" />
                  <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-zinc-900 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    Projected balance of {item.projectedBalance}{item.unit} after all upcoming sessions.
                  </div>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
