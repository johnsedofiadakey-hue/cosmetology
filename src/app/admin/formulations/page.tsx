"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search, FlaskConical } from "lucide-react";

export default function FormulationVault() {
  const [formulations] = useState([
    { id: 1, client: "Jane Doe", title: "Winter Blonde Mix", description: "70% Developer + 30% Shade 7.1", date: "2024-05-01" },
    { id: 2, client: "Alice Smith", title: "Organic Glow Facial", description: "50ml Rose Water + 10g Vitamin C Powder", date: "2024-04-28" },
  ]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-3xl font-serif text-brand-primary">Formulation Vault</h3>
          <p className="text-zinc-500">The "Secret Sauce" - tracking client-specific recipes.</p>
        </div>
        <Button>
          <Plus className="w-5 h-5 mr-2" />
          New Formulation
        </Button>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by client or mix name..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-brand-primary outline-none bg-zinc-50"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {formulations.map((formula) => (
            <div key={formula.id} className="p-6 rounded-2xl border bg-zinc-50 hover:border-brand-accent transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-brand-secondary flex items-center justify-center text-brand-primary">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-zinc-400">{formula.date}</span>
              </div>
              <h4 className="text-xl font-medium mb-1">{formula.title}</h4>
              <p className="text-brand-accent text-sm mb-3">Client: {formula.client}</p>
              <div className="bg-white p-4 rounded-xl border border-dashed border-zinc-200">
                <p className="text-zinc-600 font-mono text-sm">{formula.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
