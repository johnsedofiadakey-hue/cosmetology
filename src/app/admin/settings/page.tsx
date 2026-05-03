"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Palette, Layout, Type, Image as ImageIcon, CheckCircle, Package } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    companyName: "Beauty Studio",
    primaryColor: "#052e16",
    secondaryColor: "#fef3c7",
    accentColor: "#10b981",
    heroTitle: "Elevate Your Natural Beauty",
    heroSubtitle: "Professional cosmetology services tailored to you.",
    heroImage: "/beauty_hero_bg.png",
    heroVideoUrl: "",
    heroMediaType: "image",
    paystackPublicKey: "",
    whatsappNumber: "",
    instagramUrl: "",
    facebookUrl: "",
    tiktokUrl: "",
    enableOTP: false,
  });

  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setSettings(data);
        }
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaveStatus("saving");
    await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 2000);
  };

  if (loading && !settings.companyName) return <div className="flex items-center justify-center h-96">Loading Studio Engine...</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Configuration Form */}
      <div className="flex-1 space-y-8">
        <div className="bg-white rounded-3xl p-8 shadow-sm border">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
              <Palette className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-serif">Brand Control Center</h3>
          </div>
          
          <div className="space-y-8">
            {/* Visual Identity */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-500">Primary Color</label>
                <div className="flex gap-2">
                  <input 
                    type="color" 
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                    className="w-10 h-10 rounded-lg border-none p-0 cursor-pointer overflow-hidden"
                  />
                  <input type="text" value={settings.primaryColor} className="flex-1 text-xs border rounded-lg px-2" readOnly />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-500">Secondary Color</label>
                <div className="flex gap-2">
                  <input 
                    type="color" 
                    value={settings.secondaryColor}
                    onChange={(e) => setSettings({...settings, secondaryColor: e.target.value})}
                    className="w-10 h-10 rounded-lg border-none p-0 cursor-pointer"
                  />
                  <input type="text" value={settings.secondaryColor} className="flex-1 text-xs border rounded-lg px-2" readOnly />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-500">Accent Color</label>
                <div className="flex gap-2">
                  <input 
                    type="color" 
                    value={settings.accentColor}
                    onChange={(e) => setSettings({...settings, accentColor: e.target.value})}
                    className="w-10 h-10 rounded-lg border-none p-0 cursor-pointer"
                  />
                  <input type="text" value={settings.accentColor} className="flex-1 text-xs border rounded-lg px-2" readOnly />
                </div>
              </div>
            </div>

            {/* Content Control */}
            <div className="space-y-6 pt-6 border-t">
              <div className="flex items-center gap-2 text-zinc-400 mb-2">
                <Type className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Content & Messaging</span>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700">Company Name</label>
                  <input 
                    type="text" 
                    value={settings.companyName}
                    onChange={(e) => setSettings({...settings, companyName: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-brand-primary outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700">Hero Title</label>
                  <input 
                    type="text" 
                    value={settings.heroTitle}
                    onChange={(e) => setSettings({...settings, heroTitle: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700">Hero Subtitle</label>
                  <textarea 
                    value={settings.heroSubtitle}
                    onChange={(e) => setSettings({...settings, heroSubtitle: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border h-24"
                  />
                </div>

                {/* Gateways & Integrations */}
                <div className="pt-8 border-t space-y-6">
                  <div className="flex items-center gap-2 text-zinc-400 mb-2">
                    <Package className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Gateways & Integrations</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-700">Hero Media Type</label>
                      <div className="flex bg-zinc-100 p-1 rounded-xl">
                        <button 
                          onClick={() => setSettings({...settings, heroMediaType: 'image'})}
                          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${settings.heroMediaType === 'image' ? 'bg-white shadow-sm text-brand-primary' : 'text-zinc-500'}`}
                        >
                          Image
                        </button>
                        <button 
                          onClick={() => setSettings({...settings, heroMediaType: 'video'})}
                          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${settings.heroMediaType === 'video' ? 'bg-white shadow-sm text-brand-primary' : 'text-zinc-500'}`}
                        >
                          Video
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-700">Hero {settings.heroMediaType === 'image' ? 'Image' : 'Video'} URL</label>
                      <input 
                        type="text" 
                        value={settings.heroMediaType === 'image' ? settings.heroImage : settings.heroVideoUrl}
                        onChange={(e) => setSettings({...settings, [settings.heroMediaType === 'image' ? 'heroImage' : 'heroVideoUrl']: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-brand-primary outline-none"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-700">Instagram URL</label>
                      <input 
                        type="text" 
                        value={settings.instagramUrl || ''}
                        onChange={(e) => setSettings({...settings, instagramUrl: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border"
                        placeholder="https://instagram.com/..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-700">Facebook URL</label>
                      <input 
                        type="text" 
                        value={settings.facebookUrl || ''}
                        onChange={(e) => setSettings({...settings, facebookUrl: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border"
                        placeholder="https://facebook.com/..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-700">WhatsApp Link</label>
                      <input 
                        type="text" 
                        value={settings.whatsappNumber || ''}
                        onChange={(e) => setSettings({...settings, whatsappNumber: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border"
                        placeholder="e.g. 233..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-700">Paystack Public Key</label>
                      <input 
                        type="text" 
                        value={settings.paystackPublicKey || ''}
                        onChange={(e) => setSettings({...settings, paystackPublicKey: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border"
                        placeholder="pk_test_..."
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                    <div>
                      <p className="text-sm font-bold">Enable SMS/OTP Authentication</p>
                      <p className="text-xs text-zinc-500">Requires an active SMS provider balance (e.g. Twilio).</p>
                    </div>
                    <button 
                      onClick={() => setSettings({...settings, enableOTP: !settings.enableOTP})}
                      className={`w-12 h-6 rounded-full transition-colors relative ${settings.enableOTP ? 'bg-brand-primary' : 'bg-zinc-300'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.enableOTP ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t flex justify-end">
              <Button size="lg" onClick={handleSave} disabled={saveStatus === "saving"}>
                {saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Saved</span> : "Apply Brand Changes"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Live Preview Sidebar */}
      <div className="w-full lg:w-[400px] space-y-4">
        <div className="bg-zinc-900 rounded-3xl p-4 text-white">
          <div className="flex items-center gap-2 mb-4 px-2">
            <Layout className="w-4 h-4 text-brand-secondary" />
            <span className="text-xs font-bold uppercase tracking-widest">Live Preview</span>
          </div>
          
          {/* Miniature Website Mockup */}
          <div className="rounded-2xl overflow-hidden bg-white aspect-[9/16] border-4 border-zinc-800 relative scale-100">
            {/* Header */}
            <div className="h-10 px-4 flex items-center justify-between border-b" style={{ backgroundColor: 'white' }}>
              <span className="text-[10px] font-serif" style={{ color: settings.primaryColor }}>{settings.companyName}</span>
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: settings.primaryColor }} />
            </div>
            
            {/* Hero */}
            <div className="h-48 relative flex items-center justify-center p-6 text-center" style={{ backgroundColor: settings.primaryColor }}>
              <div className="absolute inset-0 opacity-20 bg-[url('/beauty_hero_bg.png')] bg-cover bg-center" />
              <div className="relative z-10">
                <h4 className="text-white text-xs font-serif mb-2" style={{ color: settings.secondaryColor }}>{settings.heroTitle}</h4>
                <p className="text-[6px] text-white/70 mb-4">{settings.heroSubtitle}</p>
                <div className="h-4 w-12 mx-auto rounded-full text-[6px] flex items-center justify-center" style={{ backgroundColor: settings.secondaryColor, color: settings.primaryColor }}>
                  Book Now
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="p-4 space-y-3">
              <div className="h-1 w-8 mx-auto" style={{ backgroundColor: settings.accentColor }} />
              <div className="grid grid-cols-2 gap-2">
                <div className="h-20 rounded-lg bg-zinc-100 p-2">
                   <div className="h-1 w-full bg-zinc-200 rounded mb-1" />
                   <div className="h-[2px] w-3/4 bg-zinc-200 rounded" />
                </div>
                <div className="h-20 rounded-lg bg-zinc-100 p-2">
                   <div className="h-1 w-full bg-zinc-200 rounded mb-1" />
                   <div className="h-[2px] w-3/4 bg-zinc-200 rounded" />
                </div>
              </div>
            </div>

            {/* Accent Elements */}
            <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full shadow-lg flex items-center justify-center" style={{ backgroundColor: settings.accentColor }}>
              <div className="w-3 h-3 bg-white rounded-sm rotate-45" />
            </div>
          </div>
          
          <p className="text-[10px] text-center mt-4 text-zinc-500">This is a real-time reflection of your public landing page.</p>
        </div>
      </div>
    </div>
  );
}
