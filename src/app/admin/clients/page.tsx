"use client";

import { useState, useEffect } from "react";
import { Search, User as UserIcon, History, FlaskConical, MoreVertical, MessageSquare, Loader2 } from "lucide-react";

export default function ClientVault() {
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState("GH₵");

  useEffect(() => {
    fetch("/api/admin/clients")
      .then(res => res.json())
      .then(data => {
        setClients(data);
        setLoading(false);
      });
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.currencySymbol) setCurrency(data.currencySymbol);
      });
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] gap-8">
      {/* Client List */}
      <div className="flex-1 bg-white rounded-3xl shadow-sm border overflow-hidden flex flex-col">
        <div className="p-6 border-b bg-zinc-50/50">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search clients by name, email, or phone..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border bg-white focus:ring-2 focus:ring-brand-primary outline-none"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-50 border-b sticky top-0">
              <tr className="text-xs uppercase tracking-widest text-zinc-500">
                <th className="px-8 py-4 font-bold">Client Name</th>
                <th className="px-8 py-4 font-bold">Last Visit</th>
                <th className="px-8 py-4 font-bold">Total Spent</th>
                <th className="px-8 py-4 font-bold"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {clients.map((client) => (
                <tr 
                  key={client.id} 
                  onClick={() => setSelectedClient(client)}
                  className={`cursor-pointer transition-colors ${selectedClient?.id === client.id ? 'bg-brand-primary/5' : 'hover:bg-zinc-50'}`}
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
                        <UserIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold">{client.name}</p>
                        <p className="text-xs text-zinc-500">{client.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm">{client.lastVisit}</td>
                  <td className="px-8 py-6 text-sm font-medium">{currency}{client.totalSpent.toFixed(2)}</td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 hover:bg-zinc-100 rounded-lg"><MoreVertical className="w-4 h-4 text-zinc-400" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Client Detail Side Panel */}
      <div className={`w-[450px] transition-all duration-500 ${selectedClient ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 absolute right-0'}`}>
        <div className="bg-white rounded-3xl shadow-xl border h-full overflow-y-auto p-8">
          {selectedClient ? (
            <div className="space-y-10">
              {/* Profile Header */}
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-brand-secondary/50 mx-auto mb-4 flex items-center justify-center text-brand-primary border-4 border-white shadow-lg">
                  <UserIcon className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-serif">{selectedClient.name}</h3>
                <p className="text-zinc-500 mb-6">{selectedClient.phone}</p>
                <div className="flex gap-2 justify-center">
                   <button className="p-3 bg-brand-primary text-white rounded-xl shadow-lg hover:scale-105 transition-transform">
                      <MessageSquare className="w-5 h-5" />
                   </button>
                   <button className="p-3 bg-zinc-100 text-zinc-600 rounded-xl hover:bg-zinc-200 transition-colors">
                      Edit Profile
                   </button>
                </div>
              </div>

              {/* History Tabs */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b pb-4">
                  <FlaskConical className="w-5 h-5 text-brand-primary" />
                  <h4 className="font-bold">Formulation Vault</h4>
                </div>
                <div className="space-y-4">
                   {selectedClient.formulations?.map((f: any) => (
                     <div key={f.id} className="p-5 rounded-2xl bg-zinc-50 border border-dashed border-zinc-200">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-bold text-sm">{f.title}</p>
                          <span className="text-[10px] text-zinc-400">{f.date}</span>
                        </div>
                        <p className="text-xs font-mono text-zinc-600 break-words">{f.mix}</p>
                     </div>
                   ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b pb-4">
                  <History className="w-5 h-5 text-brand-primary" />
                  <h4 className="font-bold">Service History</h4>
                </div>
                <div className="space-y-4">
                   {selectedClient.history?.map((h: any) => (
                     <div key={h.id} className="flex gap-4">
                        <div className="w-[2px] bg-zinc-100 relative">
                           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-brand-accent" />
                        </div>
                        <div className="flex-1 pb-6">
                          <div className="flex justify-between mb-1">
                            <p className="text-sm font-bold">{h.service}</p>
                            <span className="text-xs text-zinc-400">{h.date}</span>
                          </div>
                          <p className="text-xs text-zinc-500 italic mb-2">"{h.notes}"</p>
                          <p className="text-xs font-bold text-brand-primary">{currency}{h.amount.toFixed(2)}</p>
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-zinc-400 text-center">
              <UserIcon className="w-16 h-16 mb-4 opacity-10" />
              <p>Select a client to view their vault</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
