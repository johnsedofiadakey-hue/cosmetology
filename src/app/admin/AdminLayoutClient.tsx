"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, Scissors, Package, Settings, Users, Calendar, ArrowLeft, Image as ImageIcon, Beaker, Command, LogOut } from "lucide-react";
import { AdminCommandPalette } from "@/components/admin/AdminCommandPalette";
import { signOut } from "next-auth/react";

export default function AdminLayoutClient({
  children,
  settings,
}: {
  children: React.ReactNode;
  settings: any;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Appointments", href: "/admin/appointments", icon: Calendar },
    { name: "Portfolio", href: "/admin/portfolio", icon: ImageIcon },
    { name: "Formulations", href: "/admin/formulations", icon: Beaker },
    { name: "Services", href: "/admin/services", icon: Scissors },
    { name: "Inventory", href: "/admin/inventory", icon: Package },
    { name: "Clients", href: "/admin/clients", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const studioName = settings?.companyName || "LOU Beauty Hub";

  return (
    <div className="flex min-h-screen bg-zinc-100">
      <AdminCommandPalette />
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 text-white flex flex-col">
        <div className="p-8 text-2xl font-serif text-brand-secondary border-b border-white/10 flex flex-col gap-2">
          {settings?.logoUrl && (
            <img src={settings.logoUrl} alt={studioName} className="w-10 h-10 object-contain rounded-lg" />
          )}
          <span>{studioName}</span>
          <span className="text-[10px] uppercase tracking-widest opacity-50 font-sans">Admin Portal</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors hover:bg-white/10 ${pathname === item.href ? 'bg-white/10 text-brand-secondary' : ''}`}
            >
              <item.icon className="w-5 h-5 opacity-70" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10 space-y-2">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center text-[10px] font-bold text-zinc-900">LB</div>
            <div className="text-sm flex-1">
              <p className="font-medium text-white/90">Studio Owner</p>
              <p className="text-white/40 text-[10px] uppercase tracking-wider">Administrator</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-red-500/10 text-white/60 hover:text-red-400 group"
          >
            <LogOut className="w-5 h-5 opacity-70 group-hover:opacity-100" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white h-16 border-b flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 group transition-colors">
              <ArrowLeft className="w-5 h-5 group-hover:text-brand-primary" />
            </Link>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-medium">{studioName}</h2>
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-zinc-100 rounded-md text-[10px] text-zinc-400 border border-zinc-200">
                <Command className="w-3 h-3" />
                <span>K</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/admin/appointments?new=true')}
              className="px-4 py-2 bg-brand-primary text-white rounded-lg text-sm hover:scale-105 transition-transform shadow-lg shadow-brand-primary/20 font-bold"
            >
              + New Appointment
            </button>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
