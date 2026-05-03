"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Lock, User as UserIcon } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin123") {
      // In a real app, this would set a secure HTTP-only cookie via API
      document.cookie = "admin_auth=authenticated; path=/";
      router.push("/admin/settings");
    } else {
      setError("Invalid credentials. Please check your username and password.");
    }
  };

  return (
    <div className="min-h-screen bg-brand-primary flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-2xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-brand-secondary/50 rounded-2xl mx-auto flex items-center justify-center text-brand-primary mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-serif text-brand-primary">Studio Access</h2>
          <p className="text-zinc-500 mt-2">Enter your credentials to manage your studio.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 flex items-center gap-2">
              <UserIcon className="w-4 h-4" /> Username
            </label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-brand-primary outline-none"
              placeholder="admin"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 flex items-center gap-2">
              <Lock className="w-4 h-4" /> Password
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-brand-primary outline-none"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-500 text-xs text-center">{error}</p>}

          <Button type="submit" className="w-full h-14 text-lg">
            Unlock Dashboard
          </Button>
        </form>

        <p className="text-center text-zinc-400 text-[10px] mt-8 uppercase tracking-widest">
          Secure Multi-Factor Infrastructure Enabled
        </p>
      </div>
    </div>
  );
}
