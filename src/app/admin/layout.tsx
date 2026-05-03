import Link from "next/link";
import { LayoutDashboard, Scissors, Package, Settings, Users, Calendar, ArrowLeft, Image as ImageIcon } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Appointments", href: "/admin/appointments", icon: Calendar },
    { name: "Portfolio", href: "/admin/portfolio", icon: ImageIcon },
    { name: "Services", href: "/admin/services", icon: Scissors },
    { name: "Inventory", href: "/admin/inventory", icon: Package },
    { name: "Clients", href: "/admin/clients", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-100">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 text-white flex flex-col">
        <div className="p-8 text-2xl font-serif text-brand-secondary border-b border-white/10">
          Nexus Admin
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors hover:bg-white/10"
            >
              <item.icon className="w-5 h-5 opacity-70" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-brand-accent" />
            <div className="text-sm">
              <p className="font-medium">Solo Operator</p>
              <p className="text-white/40">Admin Role</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white h-16 border-b flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 group transition-colors">
              <ArrowLeft className="w-5 h-5 group-hover:text-brand-primary" />
            </Link>
            <h2 className="text-xl font-medium">Dashboard</h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-brand-primary text-white rounded-lg text-sm">
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
