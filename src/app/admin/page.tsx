"use client";

import { TrendingUp, Users, Calendar, DollarSign, ArrowUpRight } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { name: "Total Revenue", value: "$4,250", icon: DollarSign, trend: "+12.5%", color: "bg-emerald-100 text-emerald-600" },
    { name: "Appointments", value: "24", icon: Calendar, trend: "+5.2%", color: "bg-brand-secondary/50 text-brand-primary" },
    { name: "New Clients", value: "12", icon: Users, trend: "+18%", color: "bg-brand-accent/20 text-brand-accent" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-3xl font-serif text-brand-primary">Studio Pulse</h3>
        <p className="text-zinc-500">A snapshot of your business performance this month.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-3xl border shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500">{stat.name}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs">
              <ArrowUpRight className="w-3 h-3" />
              {stat.trend}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[40px] border shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-xl font-bold">Revenue Growth</h4>
            <select className="bg-zinc-50 border-none text-xs font-bold rounded-lg px-3 py-2 outline-none">
              <option>Last 6 Months</option>
              <option>Year to Date</option>
            </select>
          </div>
          <div className="flex items-end gap-3 h-48 px-2">
            {[40, 65, 45, 90, 75, 100].map((height, i) => (
              <div key={i} className="flex-1 group relative">
                <div 
                  className="w-full bg-brand-primary/10 rounded-t-xl group-hover:bg-brand-primary transition-all duration-500 cursor-pointer"
                  style={{ height: `${height}%` }}
                />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  ${(height * 42).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] border shadow-sm">
           <h4 className="text-xl font-bold mb-8">Popular Services</h4>
           <div className="space-y-6">
              {[
                { name: "Precision Cut & Balayage", share: 65, color: "bg-brand-primary" },
                { name: "Deep Cleansing Facial", share: 20, color: "bg-brand-accent" },
                { name: "Nail Art & Therapy", share: 15, color: "bg-brand-secondary" },
              ].map((service) => (
                <div key={service.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-zinc-700">{service.name}</span>
                    <span className="font-bold">{service.share}%</span>
                  </div>
                  <div className="w-full h-3 bg-zinc-50 rounded-full overflow-hidden">
                    <div className={`h-full ${service.color}`} style={{ width: `${service.share}%` }} />
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
