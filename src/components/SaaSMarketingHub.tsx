import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Building2, 
  Sparkles, 
  Tv, 
  Activity, 
  Users, 
  Coins, 
  ShieldCheck, 
  TrendingUp, 
  ArrowRight,
  Monitor,
  Database,
  Briefcase,
  Play
} from "lucide-react";

export interface DeveloperPackage {
  id: string;
  name: string;
  priceUSD: number;
  priceKES: number;
  projectsLimit: number;
  unitsLimit: number;
  aiTier: string;
  support: string;
}

interface SaaSMarketingHubProps {
  packages: DeveloperPackage[];
  onTriggerAuth: () => void;
}

export default function SaaSMarketingHub({ packages, onTriggerAuth }: SaaSMarketingHubProps) {
  const [activeFeatureTab, setActiveFeatureTab] = useState<"twin" | "ai" | "drops" | "escrow">("twin");

  const screenshotPreviews = {
    twin: {
      title: "Interactive Digital Gemini Twin Mapper",
      desc: "Real-time LED floor status highlights with responsive hover popups and sunlight-hour solar shadows simulator mapped for Nairobi city zoning.",
      badge: "3D Rendering Suite",
      stat: "99.2% Buyer Engagement",
      previewItems: [
        { label: "Active Nodes", val: "Nairobi Core" },
        { label: "Render Protocol", val: "WebGL Direct" },
        { label: "Latency", val: "4ms Edge" }
      ],
      mockUI: (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-xs font-mono text-neutral-400 space-y-3">
          <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
            <span className="text-white font-bold text-[10px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              PORTFOLIO_TWIN_LEDGER
            </span>
            <span className="text-[9px]">v3.25 PRO</span>
          </div>
          <div className="bg-black/40 border border-neutral-850 p-3 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-[10px] text-neutral-500">TOWER COORDS</p>
              <p className="text-white font-semibold">Kilimani Tower A - lvl 5</p>
            </div>
            <span className="bg-amber-400/10 text-amber-400 px-2 py-0.5 rounded text-[9px] font-bold">READY TO STREAM</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
            <div className="p-2 border border-neutral-850 rounded">
              <span className="text-neutral-500 block text-[8px]">UNITS</span>
              <strong className="text-emerald-400 font-bold">12 Available</strong>
            </div>
            <div className="p-2 border border-neutral-850 rounded">
              <span className="text-neutral-500 block text-[8px]">AMENITIES</span>
              <strong className="text-amber-400 font-bold">Heated Pool</strong>
            </div>
            <div className="p-2 border border-neutral-850 rounded">
              <span className="text-neutral-500 block text-[8px]">PROGRESS</span>
              <strong className="text-violet-400 font-bold">45% Baked</strong>
            </div>
          </div>
        </div>
      )
    },
    ai: {
      title: "Gemini Sales Executive Retraining",
      desc: "Instant text/PDF context uploads that feed Nairobi's smartest digital real estate brain. Answers coordinates, local school commutes, and schedules reservation escrow.",
      badge: "LLM Autopilot",
      stat: "84% Conversion Boost",
      previewItems: [
        { label: "Context Window", val: "100k Words" },
        { label: "Response Delay", val: "0.8s avg" },
        { label: "Integrations", val: "WhatsApp Web" }
      ],
      mockUI: (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-xs font-mono text-neutral-400 space-y-3">
          <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
            <span className="text-pink-400 font-bold text-[10px] flex items-center gap-1">
              🤖 GEMINI_BROKER_BRAIN
            </span>
            <span className="bg-pink-400/10 text-pink-400 px-2 py-0.5 rounded text-[8px]">99.8% ACCURATE</span>
          </div>
          <div className="space-y-2">
            <div className="bg-black/30 p-2 rounded text-[10px] text-right text-stone-300">
              "Is there ISK school nearby? What is the booking fee?"
            </div>
            <div className="bg-amber-450/10 bg-amber-400/5 p-2 rounded text-[10px] text-left border-l-2 border-amber-400 text-neutral-200">
              "Yes! ISK school is exactly 8 minutes away with no gridlocks. The booking fee is KES 325,000 held under safe Escrow."
            </div>
          </div>
        </div>
      )
    },
    drops: {
      title: "Live Friday Drops Countdown Timer",
      desc: "Configure anticipatory countdown widgets, flash spot deals, and active neon highlights that deploy on Friday 3:00 PM EST for high-yield velocity.",
      badge: "Launchpad Timer",
      stat: "KES 450M Sold/Hr",
      previewItems: [
        { label: "Peak Load", val: "+50,000 Clicks" },
        { label: "Timer Pulse", val: "100ms Sync" },
        { label: "Status", val: "Escrow Ready" }
      ],
      mockUI: (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-xs font-mono text-neutral-400 space-y-3">
          <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
            <span className="text-white font-bold text-[10px] flex items-center gap-1">
              ⚡ LIVE_BROADCAST_MONITOR
            </span>
            <span className="text-red-500 animate-pulse text-[9px]">● LIVE STATS</span>
          </div>
          <div className="text-center py-1">
            <p className="text-[10px] text-neutral-500">FRIDAY DROP COOLDOWN</p>
            <strong className="text-2xl text-white font-bold tracking-widest block font-mono">03d : 14h : 22m</strong>
          </div>
          <div className="bg-neutral-950 p-2 rounded text-[9px] text-neutral-500 flex justify-between">
            <span>SUBSCRIBERS: 12,840</span>
            <span>ACTIVE ALERTS: 4,502</span>
          </div>
        </div>
      )
    },
    escrow: {
      title: "Secure Automatic KYC & Bank Escrow",
      desc: "Licensed under East African regulators to instantly verify buyer identities, lock unit holds, hold deposit escrows, and draft signed agreements legally.",
      badge: "Compliance Protocol",
      stat: "100% Secure Custody",
      previewItems: [
        { label: "Bank Escrow", val: "Equity & KCB" },
        { label: "KYC Validator", val: "AI Document OCR" },
        { label: "Compliance ID", val: "NCA-Cert-2026" }
      ],
      mockUI: (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-xs font-mono text-neutral-400 space-y-3">
          <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
            <span className="text-emerald-400 font-bold text-[10px] flex items-center gap-1">
              🛡️ REGULATORY_ESCROW_NODE
            </span>
            <span className="bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded text-[8px]">VERIFIED</span>
          </div>
          <div className="p-2.5 bg-black/40 border border-neutral-850 rounded-lg text-[10px] space-y-1">
            <div className="flex justify-between">
              <span>Escrow Holding Limit:</span>
              <span className="text-white font-bold">$10,000,000</span>
            </div>
            <div className="flex justify-between text-[9px] text-neutral-500">
              <span>NCA Legal Escrow Code:</span>
              <span>PLOS-9402-ESC</span>
            </div>
          </div>
        </div>
      )
    }
  };

  return (
    <div id="saas-marketing-showcase" className="space-y-16 py-8 px-4 max-w-7xl mx-auto">
      
      {/* 1. HERO BLOCK */}
      <section className="text-center space-y-6 max-w-3xl mx-auto py-10">
        <span className="bg-amber-400/10 text-amber-500 text-xs font-mono font-extrabold px-3.5 py-1 rounded-full uppercase tracking-widest">
          PropSphere OS Developer SaaS Platform
        </span>
        <h1 className="text-4xl sm:text-6xl font-sans font-black tracking-tight text-neutral-950 leading-tight">
          Unleash Velocity. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-pink-500 to-violet-500">
            Sell Out Off-Plan in Minutes.
          </span>
        </h1>
        <p className="text-neutral-500 text-sm sm:text-base leading-relaxed">
          The property operating system designed exclusively for premium real estate developers. Upload floor plans dynamically, retrain expert LLM sales teams instantly, and launch immersive 3D Friday Drops verified by bank escrow.
        </p>

        <div className="flex flex-wrap gap-3 justify-center pt-2">
          <button
            onClick={onTriggerAuth}
            className="bg-neutral-950 hover:bg-stone-850 text-white font-extrabold text-xs uppercase tracking-widest px-8 py-4 rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            Claim Developer Workspace <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href="#pricing-grid-plans"
            className="bg-stone-100 hover:bg-stone-200 text-neutral-800 font-extrabold text-xs uppercase tracking-widest px-8 py-4 rounded-xl transition-all inline-block"
          >
            View Pricing Packages
          </a>
        </div>
      </section>

      {/* 2. DYNAMIC WORKSPACE UI SCREENSHOT SIMULATOR */}
      <section className="bg-stone-900 text-white rounded-3xl p-6 sm:p-12 border border-stone-850 shadow-2xl space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-b from-amber-400/10 to-transparent blur-[120px] pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Feature selector */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] font-mono font-black text-amber-400 tracking-widest block uppercase">Live Console Preview</span>
            <h2 className="text-2xl sm:text-3xl font-sans font-black tracking-tight leading-snug">
              Every dashboard tool. <br />
              Ready to attract buyers.
            </h2>
            <p className="text-stone-400 text-xs leading-relaxed">
              PropSphere OS combines high-status 3D digital mappings with conversational artificial intelligence models to educate potential prospects and accelerate offplan conversions securely.
            </p>

            {/* Selector buttons */}
            <div className="space-y-2">
              {[
                { id: "twin", label: "3D Digital Twin Creator", desc: "Interactive smart units coordinates map" },
                { id: "ai", label: "WhatsApp Gemini Broker", desc: "Instantly retrained custom corporate LLM API" },
                { id: "drops", label: "Friday Spot Drops", desc: "Interactive waitlist, timers, and drops event trigger" },
                { id: "escrow", label: "Automated Bank Escrow", desc: "Zero friction regulatory escrow-backed reservation system" }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setActiveFeatureTab(f.id as any)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col gap-0.5 cursor-pointer ${
                    activeFeatureTab === f.id
                      ? "bg-white border-white text-neutral-950 shadow-md"
                      : "bg-black/20 border-stone-800 text-stone-300 hover:bg-black/40 hover:border-stone-750"
                  }`}
                >
                  <span className="text-xs font-bold block">{f.label}</span>
                  <span className={`text-[10px] block ${activeFeatureTab === f.id ? "text-stone-500" : "text-stone-400"}`}>{f.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Screen Preview Wrapper */}
          <div className="lg:col-span-7 bg-stone-950 border border-stone-800 rounded-2xl p-6 shadow-inner space-y-6 flex flex-col justify-between h-[390px]">
            <div className="flex items-center justify-between border-b border-stone-850 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-stone-700 block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-stone-700 block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-stone-700 block"></span>
                <span className="text-[10px] text-stone-500 font-mono ml-2 uppercase font-semibold">PropSphere OS SaaS Terminal // {activeFeatureTab}</span>
              </div>
              <span className="text-amber-400 font-mono text-[9px] font-bold border border-amber-400/20 px-2 py-0.5 rounded">
                {screenshotPreviews[activeFeatureTab].badge}
              </span>
            </div>

            <div className="space-y-4">
              <h4 className="text-base font-black tracking-tight">{screenshotPreviews[activeFeatureTab].title}</h4>
              <p className="text-xs text-stone-400 leading-normal">{screenshotPreviews[activeFeatureTab].desc}</p>
              
              {screenshotPreviews[activeFeatureTab].mockUI}
            </div>

            <div className="border-t border-stone-850 pt-3 flex justify-between items-center text-[10px] font-mono text-stone-500">
              <span className="text-pink-400 font-bold">{screenshotPreviews[activeFeatureTab].stat}</span>
              <div className="flex gap-4">
                {screenshotPreviews[activeFeatureTab].previewItems.map((pi, index) => (
                  <span key={index}>
                    {pi.label}: <strong className="text-white font-bold">{pi.val}</strong>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE SAAS PACKAGES (Pricing controlled by Super Admin) */}
      <section id="pricing-grid-plans" className="space-y-8 pt-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-black text-rose-500 block uppercase tracking-widest">SaaS Subscription Plans</span>
          <h2 className="text-3xl font-sans font-black text-neutral-950 tracking-tight">Flexible Developer Plans Designed to Scale</h2>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-xl mx-auto">
            Choose a plan that fits your launch portfolio size. All plans are billed monthly and feature dynamic Escrow Bank ledger integrations. Pricing controlled directly by system administrators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map(pkg => {
            const isPremium = pkg.id === "pkg-pro";
            return (
              <div 
                key={pkg.id}
                className={`rounded-3xl p-8 border flex flex-col justify-between transition-all duration-350 relative ${
                  isPremium 
                    ? "bg-white border-neutral-950 shadow-xl" 
                    : "bg-white border-stone-200 shadow-sm hover:shadow-md"
                }`}
              >
                {isPremium && (
                  <span className="absolute top-4 right-4 bg-amber-400 text-neutral-950 text-[8px] font-mono font-black uppercase px-2.5 py-1 rounded-full tracking-widest leading-none shadow shadow-amber-400/10">
                    MOST POPULAR
                  </span>
                )}

                <div className="space-y-6">
                  <div>
                    <strong className="text-neutral-950 font-black text-lg uppercase tracking-tight block">{pkg.name}</strong>
                    <span className="text-[10px] text-neutral-400 font-mono block mt-1">Unlimited Leads • Escrow Integration</span>
                  </div>

                  <div className="border-y border-stone-100 py-5 space-y-1">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-sans font-black text-neutral-950">${pkg.priceUSD.toLocaleString()}</span>
                      <span className="text-neutral-400 text-xs font-mono uppercase font-bold">USD/mo</span>
                    </div>
                    <p className="text-[11px] font-mono text-neutral-500 font-semibold uppercase">
                      Or approx. KES {pkg.priceKES.toLocaleString()} / month
                    </p>
                  </div>

                  <ul className="space-y-3.5 text-xs text-neutral-600">
                    <li className="flex items-center gap-2 font-medium">
                      <span className="w-1.5 h-1.5 bg-neutral-950 rounded-full shrink-0"></span>
                      <span>Active Projects: <strong className="text-neutral-900 font-black">{pkg.projectsLimit === 999 ? "Unlimited" : pkg.projectsLimit} Project Workspace</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-neutral-950 rounded-full shrink-0"></span>
                      <span>Inventory limit: <strong className="text-neutral-900 font-bold">{pkg.unitsLimit === 9999 ? "Unlimited" : `${pkg.unitsLimit} Units`}</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-neutral-950 rounded-full shrink-0 mt-1.5"></span>
                      <span>AI Engine: <span className="text-stone-500">{pkg.aiTier}</span></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-neutral-950 rounded-full shrink-0"></span>
                      <span>Support tier: <span className="text-stone-500">{pkg.support}</span></span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={onTriggerAuth}
                  className={`w-full font-black text-xs uppercase tracking-wider py-4 rounded-xl mt-8 transition-all hover:shadow cursor-pointer ${
                    isPremium 
                      ? "bg-neutral-950 text-white hover:bg-stone-850" 
                      : "bg-stone-50 text-neutral-800 border border-stone-200 hover:bg-stone-100"
                  }`}
                >
                  Activate {pkg.name}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. MOCK SUCCESS METRICS / SOCIAL PROOF */}
      <section className="bg-stone-50 p-8 sm:p-12 rounded-3xl border border-stone-200 text-center space-y-6">
        <span className="text-[10px] font-mono font-black text-neutral-400 uppercase tracking-widest block">SAAS PLATFORM SCALE</span>
        <h3 className="text-xl sm:text-2xl font-sans font-black tracking-tight text-neutral-950">Trusted by Africa's Sovereign Real Estate Brands</h3>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          <div>
            <strong className="text-2xl sm:text-3xl font-sans font-black text-neutral-950 block">$42.5M+</strong>
            <span className="text-[10px] text-neutral-500 font-semibold uppercase block">Escrow Volume Secured</span>
          </div>
          <div>
            <strong className="text-2xl sm:text-3xl font-sans font-black text-neutral-950 block">45,000+</strong>
            <span className="text-[10px] text-neutral-500 font-semibold uppercase block font-mono">Vetted Global Buyers</span>
          </div>
          <div>
            <strong className="text-2xl sm:text-3xl font-sans font-black text-neutral-950 block">52</strong>
            <span className="text-[10px] text-neutral-500 font-semibold uppercase block">Nairobi Projects Registered</span>
          </div>
          <div>
            <strong className="text-2xl sm:text-3xl font-sans font-black text-neutral-950 block">8.4x</strong>
            <span className="text-[10px] text-neutral-500 font-semibold uppercase block">SaaS Velocity Increase</span>
          </div>
        </div>
      </section>

    </div>
  );
}
