import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Clock, 
  MapPin, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  ArrowRight, 
  Play, 
  Activity, 
  Building2, 
  Sliders, 
  Sparkles, 
  DollarSign, 
  CheckCircle, 
  ChevronRight, 
  Calculator, 
  UserCheck, 
  FileCheck,
  Video,
  MonitorPlay,
  Flame,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkle,
  Compass,
  Star,
  Cpu,
  BadgeAlert,
  ArrowUpRight,
  Tv,
  ExternalLink,
  ChevronDown,
  Lock,
  RotateCw,
  Sun,
  Eye,
  Info,
  Building
} from "lucide-react";
import { Project, Unit } from "../types";

interface PLOSHomepageProps {
  projects: Project[];
  activeProject: Project;
  onSelectProject: (id: string) => void;
  onTriggerReserve: (project: Project, unit: Unit) => void;
  onNavigateToTab: (tab: "drops" | "portfolio" | "matchmaker" | "developers" | "financing" | "about" | "buyer") => void;
  homepageSettings?: any;
  getCustomized?: (elementId: string, defaultText: string, defaultStyles?: string) => any;
}

export default function PLOSHomepage({
  projects,
  activeProject,
  onSelectProject,
  onTriggerReserve,
  onNavigateToTab,
  homepageSettings,
  getCustomized
}: PLOSHomepageProps) {
  // Compute ordered and featured projects selection from super admin configurations
  const featuredIds = homepageSettings?.featuredProjectIds || [];
  const homepageProjects = featuredIds.length > 0
    ? [...projects]
        .filter(p => featuredIds.includes(p.id))
        .sort((a, b) => featuredIds.indexOf(a.id) - featuredIds.indexOf(b.id))
    : projects;

  // --- GENERAL STATE & HOOKS ---
  const [countdown, setCountdown] = useState({ days: 4, hours: 14, minutes: 22, seconds: 45 });
  const [tickerIndex, setTickerIndex] = useState(0);
  
  // Section 3: Waitlist success feedback
  const [notifiedProjects, setNotifiedProjects] = useState<string[]>([]);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [joinedWaitlistPrj, setJoinedWaitlistPrj] = useState<string | null>(null);

  // Section 6: AI Matchmaker Interactive State
  const [matchInputs, setMatchInputs] = useState({
    budget: 150000,
    bedrooms: "2 Bed Executive",
    lifestyle: "Wellness & Rooftop pool focus",
    location: "Westlands",
    familySize: "Couple / Co-living",
    investmentGoal: "High rental yield p.a."
  });
  const [aiMatchResult, setAiMatchResult] = useState<any[] | null>(null);
  const [isMatching, setIsMatching] = useState(false);

  // Section 7: Nairobi Investment Map Area State
  const [activeGeoZone, setActiveGeoZone] = useState<string>("Westlands");

  // Section 8: Live Inventory Visualizer selections
  const [selectedTowerIndex, setSelectedTowerIndex] = useState(0);
  const [selectedFloorNum, setSelectedFloorNum] = useState(2);
  const [activeUnitHover, setActiveUnitHover] = useState<Unit | null>(null);

  // Section 9: Digital Twin 3D Slider Controls
  const [sunlightHour, setSunlightHour] = useState(14); // 2:00 PM
  const [viewElevation, setViewElevation] = useState("Premium Floor Views");
  const [selectedFeatureTab, setSelectedFeatureTab] = useState<"balconies" | "views" | "sunlight" | "parking">("views");

  // Section 10: Virtual Tour Experience tabs
  const [activeTourNav, setActiveTourNav] = useState<"exterior" | "lobby" | "kitchen" | "livingRoom" | "bedrooms" | "balcony" | "gym" | "pool" | "rooftop" | "neighborhood">("livingRoom");

  // Section 11: Real-time Investment Intelligence sliders
  const [forecastYears, setForecastYears] = useState(5);

  // Countdown timer calculation for next Friday 3:00 PM East African Time (EAT - UTC+3)
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const eatDate = new Date(utc + (3600000 * 3)); // UTC+3

      let nextFriday = new Date(eatDate);
      nextFriday.setDate(eatDate.getDate() + (5 - eatDate.getDay() + 7) % 7);
      nextFriday.setHours(15, 0, 0, 0);

      // If we are past Friday 3 PM this week, jump to next Friday
      if (eatDate.getTime() > nextFriday.getTime()) {
        nextFriday.setDate(nextFriday.getDate() + 7);
      }

      const diff = nextFriday.getTime() - eatDate.getTime();
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setCountdown({ days: d, hours: h, minutes: m, seconds: s });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  // Section 2: Scrolling real-time ticker mock data matching requirements
  const tickerEvents = [
    "🔥 Unit A1204 (Westlands Heights) Reserved by international buyer",
    "⚡ KES 35M Prime Duplex Unit Reserved at Friday Drop Launch speed",
    "✓ New Westlands Launch Added! 65 units registered into high-yield Escrow lock",
    "🎉 VIP Member #214 just secured KES 1.8M Expected Launch Discount",
    "📈 Penthouse Sold: Sovereign Floor 12 secured for diaspora investor",
    "⏳ 142 Buyers Joined Waitlist Queue in the last 45 minutes",
    "🔧 Developer Uploaded New Project: Kilimani Botanica Suite Phase 2",
    "🛡️ Title deed cadastral registry checked & pre-approved for Kilimani Block B"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % tickerEvents.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Section 7: Geographic metrics for Nairobi clickable zones
  const geoZones: Record<string, {
    yield: string;
    capital: string;
    infrastructure: string;
    developers: string;
    rating: string;
    growthScore: string;
    details: string;
  }> = {
    Westlands: { growthScore: "9.8", yield: "11.5% - 12.2% p.a.", capital: "14.2% - 15.8% p.a.", infrastructure: "Expressway Access, Corporate HQ hub, Link roads", developers: "Premium Spaces E.A., Westlands Heights, Cytonn", rating: "★ AAA Prime Buy", details: "The primary commercial and financial hub of Nairobi, yielding high-tier corporate rental occupancy." },
    Kilimani: { growthScore: "9.3", yield: "10.2% - 10.9% p.a.", capital: "11.8% - 12.5% p.a.", infrastructure: "Yaya Center Refurbishment, Ring roads dualing", developers: "Eliud & Partner Spaces, Kilimani Elite Living Ltd", rating: "★ AA+ Super Strong", details: "Extremely popular with young professionals and expats. Robust rental occupancy with high demand." },
    Kileleshwa: { growthScore: "9.1", yield: "9.8% - 10.5% p.a.", capital: "11.0% - 11.9% p.a.", infrastructure: "Bypass interchanges, green belt corridor preservation", developers: "Kileleshwa Plaza Corp", rating: "★ AA Buy Focus", details: "Highly residential, quiet green-leafy suburb experiencing steady premium apartment conversion." },
    Riverside: { growthScore: "9.5", yield: "11.0% - 11.8% p.a.", capital: "13.5% - 14.5% p.a.", infrastructure: "Sovereign embassy bypass, secure wooded private lanes", developers: "Riverside Garden Ltd", rating: "★ AAA Prime Buy", details: "Exclusive diplomatic corridor boasting exceptional security levels and premium multinational demand." },
    Karen: { growthScore: "9.2", yield: "8.5% - 9.2% p.a.", capital: "14.0% - 15.2% p.a.", infrastructure: "The Hub Karen expansion, commuter lanes bypass", developers: "Botanica Karen Estates", rating: "★ AA+ Prime Yield", details: "Nairobi's premier colonial forest enclave. Heavy capital appreciation for luxury off-plan villas." },
    Gigiri: { growthScore: "9.7", yield: "11.2% - 12.0% p.a.", capital: "14.8% - 16.0% p.a.", infrastructure: "UN Avenue expansion, Diplomatic security rings", developers: "Gigiri Heights Developers", rating: "★ AAA Sovereign Prime", details: "Home of the UN headquarters and major embassies. Rent is predominantly paid in USD with ultra-low vacancy." },
    Runda: { growthScore: "9.4", yield: "7.9% - 8.6% p.a.", capital: "15.0% - 16.5% p.a.", infrastructure: "Northern Bypass expansions, Gated ring-fence networks", developers: "Runda Executive Builders", rating: "★ AA+ High Growth", details: "Elite residential estate. Unquestionable privacy and highest land pricing resilience in Africa." },
    Lavington: { growthScore: "9.0", yield: "9.5% - 10.2% p.a.", capital: "12.0% - 13.5% p.a.", infrastructure: "Lavington mall express lanes, school buses terminal", developers: "Lavington Crest Ltd", rating: "★ AA Stable Rent", details: "A historic leafy neighborhood now providing luxurious multi-family offplan apartments near top international schools." },
    "Tatu City": { growthScore: "9.6", yield: "10.5% - 11.5% p.a.", capital: "15.5% - 17.0% p.a.", infrastructure: "Special Economic Zone (SEZ) tax advantages, private power, private water grid", developers: "Tatu Heights Consortium", rating: "★ AAA Special Zone Buy", details: "Nairobi's modern industrial & residential private city. Enormous institutional corporate tax breaks drive pre-sales." },
    Northlands: { growthScore: "9.5", yield: "9.0% - 10.0% p.a.", capital: "16.0% - 18.5% p.a.", infrastructure: "Eastern Bypass dualing, Northlands private city masterplan", developers: "Northlands Smart City Ltd", rating: "★ AAA Ultimate Appreciation", details: "Pre-entry phase. A planned smart metropolis presenting maximum capital gain prospects for first-generation buyers." }
  };

  // Section 10: Virtual tour assets (Unsplash high-fidelity rendering placeholders with referrerPolicy)
  const virtualTourMediaLinks = {
    exterior: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    lobby: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80",
    kitchen: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
    livingRoom: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
    bedrooms: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80",
    balcony: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    gym: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80",
    pool: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80",
    rooftop: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80",
    neighborhood: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80"
  };

  // Section 6: Process simulated AI Matchmaking
  const handleCalculateMatchScores = (e: React.FormEvent) => {
    e.preventDefault();
    setIsMatching(true);
    setAiMatchResult(null);

    setTimeout(() => {
      // Find matches in actual projects or generate specialized matches based on project database
      const computedMatches = projects.map((prj, index) => {
        let percentage = 98 - (index * 4);
        if (percentage < 82) percentage = 82;

        const mockUnitNum = prj.towers[0]?.floors[2]?.units[0]?.number || "Suite A-102";
        const mockUnitType = prj.towers[0]?.floors[2]?.units[0]?.type || "Executive Studio";

        return {
          id: prj.id,
          projectLabel: prj.name,
          unitNumber: mockUnitNum,
          unitType: mockUnitType,
          matchPercent: percentage,
          lifestyleFit: `Perfect fit for "${matchInputs.lifestyle}" centered around developer master-amenities in ${prj.location}.`,
          reason: `We selected a prime floor layout with high natural sunlight matching your investment goal (${matchInputs.investmentGoal}). Expected rental yield p.a. of ${prj.roiRentalYield}.`
        };
      });

      setAiMatchResult(computedMatches);
      setIsMatching(false);
    }, 1500);
  };

  // Interactive Reservation Callback mapping standard projects
  const handleWaitlistLock = (projectLabel: string) => {
    setJoinedWaitlistPrj(projectLabel);
    setTimeout(() => {
      setJoinedWaitlistPrj(null);
      alert(`Success! You have officially joined Africa's VIP priority waitlist for ${projectLabel}. Notify credentials will dispatch via email/SMS 15 minutes before launch.`);
    }, 1200);
  };

  const handleNotifyMe = (projectId: string) => {
    if (notifiedProjects.includes(projectId)) {
      setNotifiedProjects(prev => prev.filter(p => p !== projectId));
      alert("Notification alert removed.");
    } else {
      setNotifiedProjects(prev => [...prev, projectId]);
      alert("Notification alert activated! We'll alert you 1 hour before Friday Drop hour opens.");
    }
  };

  // Section 8: Live Inventory coordinates
  const currentTower = activeProject?.towers[selectedTowerIndex] || activeProject?.towers[0];
  const currentFloor = currentTower?.floors.find(f => f.floorNumber === selectedFloorNum) || currentTower?.floors[0];
  const floorUnits = currentFloor?.units || [];

  return (
    <div id="propsphere-homepage-root" className="space-y-24 pb-24 text-neutral-900 bg-white">
      
      {/* ================================== SECTION 1: FULLSCREEN IMMERSIVE HERO ================================== */}
      <section id="hero-section" className="relative min-h-[95vh] bg-neutral-950 text-white rounded-3xl overflow-hidden flex flex-col justify-between p-6 sm:p-12 border border-neutral-800 shadow-2xl">
        {/* Animated Nairobi skyline skyline vector overlay */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="none">
            {/* Outline skyline silhouette */}
            <path d="M0,500 L50,500 L50,320 L110,320 L110,210 L160,210 L160,120 L220,120 L220,500 L260,500 L260,280 L310,280 L310,160 L350,90 L400,160 L400,500 L470,500 L470,230 L530,230 L530,500 L590,500 L590,300 L640,300 L640,140 L690,140 L690,500 L760,500 L760,250 L840,250 L840,180 L900,180 L900,500 L1000,500" fill="none" stroke="url(#nairobi-skyline-glow)" strokeWidth="2.5" strokeDasharray="5,5" />
            <defs>
              <linearGradient id="nairobi-skyline-glow" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="35%" stopColor="#EC4899" />
                <stop offset="70%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
          </svg>
          {/* Glowing neon city lights representing active project locations */}
          <div className="absolute left-[22%] top-[18%] w-3.5 h-3.5 bg-amber-400 rounded-full animate-ping" />
          <div className="absolute left-[35%] top-[14%] w-3 h-3 bg-pink-500 rounded-full animate-ping" style={{ animationDelay: "1s" }} />
          <div className="absolute left-[53%] top-[34%] w-2.5 h-2.5 bg-violet-400 rounded-full animate-ping" style={{ animationDelay: "2s" }} />
          <div className="absolute left-[69%] top-[22%] w-3 h-3 bg-blue-500 rounded-full animate-ping" style={{ animationDelay: "3s" }} />
        </div>

        {/* Dynamic color orb glows */}
        <div className="absolute top-0 right-[-10rem] w-96 h-96 bg-gradient-to-br from-amber-500/20 to-pink-500/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10rem] left-[10rem] w-[500px] h-[500px] bg-gradient-to-tr from-violet-600/10 to-blue-500/15 blur-[150px] rounded-full pointer-events-none" />

        {/* Hero header line */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400">Africa's Premier Luxury Properties</span>
          </div>
          <div className="bg-amber-400 text-neutral-950 font-mono font-extrabold text-[10px] uppercase px-3 py-1 rounded-full flex items-center gap-1.5 shrink-0 shadow-lg shadow-amber-400/10">
            <Activity className="w-3.5 h-3.5" /> PROPSPHERE PORTAL ACTIVE
          </div>
        </div>

        {/* Central visual grids */}
        <div className="relative z-10 my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8">
          
          <div className="lg:col-span-7 space-y-6">
            {(() => {
              const b = getCustomized ? getCustomized("hero-badge", "Premium Real Estate Platform") : { text: "Premium Real Estate Platform", className: "", style: {} };
              return (
                <span 
                  data-pencil-id="hero-badge"
                  className={`inline-block bg-white/5 border border-white/10 text-amber-400 text-[10px] font-mono px-3 py-1 rounded-md font-bold uppercase tracking-widest leading-none ${b.className || ""}`}
                  style={b.style}
                >
                  {b.text}
                </span>
              );
            })()}

            {(() => {
              const h = getCustomized ? getCustomized("hero-headline", "Africa's Real Estate Lunches, Reimagined.") : { text: "Africa's Real Estate Lunches, Reimagined.", className: "", style: {} };
              return (
                <h1 
                  data-pencil-id="hero-headline"
                  className={`text-4xl sm:text-6xl lg:text-7xl font-sans font-black tracking-tight leading-none text-white ${h.className || ""}`}
                  style={h.style}
                >
                  {h.text}
                </h1>
              );
            })()}

            {(() => {
              const d = getCustomized ? getCustomized("hero-description", "PropSphere helps you find, browse, and book premium properties in Africa. Connect directly with top developers and easily reserve your dream home today.") : { text: "PropSphere helps you find, browse, and book premium properties in Africa. Connect directly with top developers and easily reserve your dream home today.", className: "", style: {} };
              return (
                <p 
                  data-pencil-id="hero-description"
                  className={`text-neutral-300 text-base sm:text-lg max-w-xl font-medium leading-relaxed ${d.className || ""}`}
                  style={d.style}
                >
                  {d.text}
                </p>
              );
            })()}

            <div className="flex flex-wrap gap-4 pt-3">
              {(() => {
                const c1 = getCustomized ? getCustomized("hero-cta-primary", "Join Friday Drop") : { text: "Join Friday Drop", className: "", style: {} };
                return (
                  <button 
                    onClick={() => onNavigateToTab("drops")}
                    data-pencil-id="hero-cta-primary"
                    className={`bg-amber-450 hover:bg-amber-400 text-neutral-950 font-black text-xs uppercase tracking-wider px-8 py-4.5 rounded-xl transition-all shadow-xl shadow-amber-450/20 active:scale-95 flex items-center gap-2 bg-amber-400 cursor-pointer ${c1.className || ""}`}
                    style={c1.style}
                  >
                    {c1.text} <ArrowRight className="w-4 h-4 text-neutral-950 font-bold" />
                  </button>
                );
              })()}

              {(() => {
                const c2 = getCustomized ? getCustomized("hero-cta-secondary", "Browse Projects") : { text: "Browse Projects", className: "", style: {} };
                return (
                  <button 
                    onClick={() => onNavigateToTab("portfolio")}
                    data-pencil-id="hero-cta-secondary"
                    className={`bg-neutral-900 hover:bg-neutral-850 border border-neutral-750 text-white font-black text-xs uppercase tracking-wider px-7 py-4.5 rounded-xl transition-all active:scale-95 cursor-pointer ${c2.className || ""}`}
                    style={c2.style}
                  >
                    {c2.text}
                  </button>
                );
              })()}

              <button 
                onClick={() => onNavigateToTab("developers")}
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 font-bold text-xs uppercase tracking-wider px-6 py-4.5 rounded-xl transition-all active:scale-95 cursor-pointer"
              >
                Launch Your Project
              </button>
            </div>
          </div>

          {/* Right Immersive Countdown Widget */}
          <div className="lg:col-span-5 bg-black/40 border border-neutral-800 rounded-3xl p-6 backdrop-blur-md space-y-6 shadow-2xl relative">
            <div className="border-b border-neutral-800 pb-4">
              <span className="text-[10px] font-mono font-extrabold text-pink-400 uppercase tracking-widest block mb-2 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" /> NEXT PROP DROP™ COUNTDOWN
              </span>
              
              <div className="flex justify-between items-center gap-2">
                {[
                  { value: countdown.days, label: "Days" },
                  { value: countdown.hours, label: "Hours" },
                  { value: countdown.minutes, label: "Mins" },
                  { value: countdown.seconds, label: "Secs" }
                ].map((col, idx) => (
                  <div key={idx} className="text-center font-mono flex-1">
                    <span className="text-3xl sm:text-4xl font-black text-white px-2.5 py-2 bg-neutral-900/90 border border-neutral-800 rounded-xl inline-block w-full">
                      {String(col.value).padStart(2, "0")}
                    </span>
                    <span className="text-[9px] text-neutral-400 font-bold block mt-1 uppercase tracking-widest">{col.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Data metrics requested inside specification */}
            <div className="space-y-3">
              <span className="text-[9px] font-mono uppercase font-black tracking-widest text-neutral-500 block">PROPSPHERE LIVE PLATFORM STATISTICS:</span>
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-neutral-900/60 p-3 rounded-xl border border-neutral-800">
                  <span className="text-neutral-500 block text-[9px]">BUYERS WAITING:</span>
                  <strong className="text-base font-black text-amber-400 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-amber-500 shrink-0" /> 10,847 Vetted
                  </strong>
                </div>
                <div className="bg-neutral-900/60 p-3 rounded-xl border border-neutral-800">
                  <span className="text-neutral-500 block text-[9px]">UPCOMING LAUNCHES:</span>
                  <strong className="text-base font-black text-pink-500">124 Releases</strong>
                </div>
                <div className="bg-neutral-900/60 p-3 rounded-xl border border-neutral-800">
                  <span className="text-neutral-500 block text-[9px]">ACTIVE DEVELOPERS:</span>
                  <strong className="text-base font-black text-violet-400">52 Verified</strong>
                </div>
                <div className="bg-neutral-900/60 p-3 rounded-xl border border-neutral-800">
                  <span className="text-neutral-500 block text-[9px]">PORTFOLIO INVENTORY:</span>
                  <strong className="text-base font-black text-emerald-400 font-mono">KES 12.4B+</strong>
                </div>
              </div>
            </div>

            {/* CTA to Enter Drop Room */}
            <button
              onClick={() => onNavigateToTab("drops")}
              className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-350 hover:to-amber-450 text-neutral-950 font-black text-xs uppercase tracking-widest py-3 px-4 rounded-xl shadow-lg shadow-amber-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              Enter Live Drop Room <ArrowRight className="w-4 h-4" />
            </button>

            {/* Trust and Escrow details */}
            <div className="bg-amber-400/5 border border-amber-400/15 rounded-2xl p-4 text-[11px] text-amber-200 leading-normal font-mono flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong>Secure Escrow Guard:</strong> All launch reservations are held strictly in licensed bank custody accounts pending construction milestone verification.
              </div>
            </div>
          </div>

        </div>

        {/* Nairobi county pre-check references */}
        <div className="relative z-10 border-t border-white/10 pt-5 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-500 text-[10px] font-mono tracking-widest uppercase">
          <span>✓ CYTONN & PREMIUM EAST AFRICA TRUST COMPLIANT</span>
          <span>NAIROBI LAND REGISTRY INTEGRATION ACTIVE</span>
          <span>SaaS VOLUME: $42.5M SECURED OUT OF ESCROW</span>
        </div>
      </section>

      {/* ================================== SECTION 2: LIVE MARKET FEED ================================== */}
      <section id="live-feed-section" className="-mt-16 bg-neutral-950 text-amber-400 py-4 px-6 rounded-2xl border border-neutral-800 shadow-md flex items-center gap-4 overflow-hidden relative z-20">
        <span className="bg-amber-400 text-neutral-950 font-mono font-black px-2.5 py-1 rounded text-[10px] tracking-widest uppercase flex items-center gap-1 shrink-0 animate-pulse">
          <Activity className="w-3.5 h-3.5" /> LIVE MARKET FEED
        </span>
        
        <div className="flex-1 overflow-hidden font-mono text-xs text-neutral-200">
          <AnimatePresence mode="wait">
            <motion.p
              key={tickerIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="truncate font-semibold tracking-wide"
            >
              {tickerEvents[tickerIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        <span className="text-[10px] text-neutral-500 font-mono shrink-0 uppercase tracking-widest hidden md:inline font-bold">
          Updated Secs Ago • Verified Escrow Ledger
        </span>
      </section>

      {/* ================================== SECTION 3: FEATURED PROPERTY DROPS™ (NO PRICES) ================================== */}
      <section id="featured-drops-section" className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-black tracking-widest text-amber-500 uppercase">THE BLACK FRIDAY OF REAL ESTATE</span>
            <h2 className="text-3xl sm:text-4xl font-sans font-black text-neutral-950 tracking-tight">Active & Upcoming Property Drops™</h2>
            <p className="text-neutral-500 text-xs sm:text-sm mt-1">Anticipation throughout the week. Special flash launch prices revealed only at Friday 3:00 PM EST launch hours.</p>
          </div>
          <button 
            onClick={() => onNavigateToTab("drops")}
            className="text-xs font-black uppercase tracking-wider text-amber-600 flex items-center gap-1 hover:text-amber-500 self-start"
          >
            Launch Drops Portal <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Carousel/Grid container - PRICES STRICTLY HIDDEN per system instructions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {homepageProjects.map((proj, index) => {
            const discounts = [
              "Up to 20% Launch Savings",
              "Exclusive Friday VIP Pricing",
              "Limited Founder Release Block",
              "VIP Early Hold Discount Only"
            ];
            const launchDiscount = discounts[index % discounts.length];

            return (
              <div 
                key={proj.id}
                className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-neutral-300 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Photo Visuals */}
                  <div className="relative aspect-video bg-stone-100 overflow-hidden">
                    <img 
                      src={proj.virtualTourMedia.livingRoom} 
                      alt={proj.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/10 to-transparent p-5 flex flex-col justify-between">
                      <span className="bg-amber-400 text-neutral-950 text-[9px] font-mono font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider self-start shadow-md">
                        {launchDiscount}
                      </span>
                      <div>
                        <span className="text-[9px] font-mono font-bold text-neutral-300 uppercase tracking-widest block">{proj.location}</span>
                        <h3 className="text-xl font-black text-white tracking-tight">{proj.name}</h3>
                        <p className="text-[11px] text-stone-300 font-medium leading-none mt-1">By {proj.developerName}</p>
                      </div>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between text-[11px] font-mono font-extrabold text-amber-600">
                      <span>LAUNCH DATE: Friday 3PM EAT</span>
                      <span className="bg-amber-50 px-2 py-0.5 rounded text-[9px]">VIP ACCESS ONLY</span>
                    </div>

                    <p className="text-xs text-neutral-605 leading-relaxed text-neutral-600 font-medium">
                      "{proj.tagline}"
                    </p>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                        <span className="text-[9px] text-neutral-400 font-mono block uppercase">Expected Yield</span>
                        <strong className="text-xs sm:text-sm font-black text-neutral-900">{proj.roiRentalYield} Yield</strong>
                      </div>
                      <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                        <span className="text-[9px] text-neutral-400 font-mono block uppercase">Compounding</span>
                        <strong className="text-xs sm:text-sm font-black text-neutral-900">{proj.roiCapitalAppreciation}</strong>
                      </div>
                      <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                        <span className="text-[9px] text-neutral-400 font-mono block uppercase font-bold">Launch Discount</span>
                        <strong className="text-xs text-red-500 font-black uppercase">Reserved for VIP</strong>
                      </div>
                      <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                        <span className="text-[9px] text-neutral-400 font-mono block uppercase">Units Releasing</span>
                        <strong className="text-xs sm:text-sm font-black text-neutral-900">42 Luxury Nodes</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom interactive action blocks */}
                <div className="p-6 pt-0 border-t border-stone-100 mt-2 space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 pt-3">
                    <span>Units Available: <strong>High-Velocity Pool</strong></span>
                    <span className="flex items-center gap-1 font-bold text-red-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" /> BUILD FOMO ACTIVE
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      onClick={() => handleWaitlistLock(proj.name)}
                      className="col-span-1 bg-neutral-950 hover:bg-neutral-800 text-white font-extrabold text-[10px] py-3 rounded-lg uppercase tracking-wider text-center"
                    >
                      Join Waitlist
                    </button>
                    <button 
                      onClick={() => handleNotifyMe(proj.id)}
                      className={`col-span-1 border text-[10px] font-bold py-3 rounded-lg uppercase tracking-wider text-center ${
                        notifiedProjects.includes(proj.id) 
                          ? "bg-amber-450 border-amber-500 text-neutral-950 font-black bg-amber-450" 
                          : "border-stone-200 hover:bg-stone-50 text-stone-600"
                      }`}
                    >
                      {notifiedProjects.includes(proj.id) ? "Alert Active" : "Notify Me"}
                    </button>
                    <button 
                      onClick={() => {
                        onSelectProject(proj.id);
                        onNavigateToTab("portfolio");
                      }}
                      className="col-span-1 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black text-[10px] py-3 rounded-lg uppercase tracking-wider text-center"
                    >
                      View Property
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================================== SECTION 4: UPCOMING LAUNCHES CAROUSEL ================================== */}
      <section id="upcoming-carousels" className="bg-stone-50 p-8 sm:p-12 rounded-3xl border border-stone-200 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-black text-neutral-400 tracking-widest uppercase block">FUTURE HORIZONS LAUNCHPAD</span>
          <h2 className="text-3xl font-black text-neutral-950 tracking-tight">Upcoming Launches Carousel</h2>
          <p className="text-neutral-500 text-xs leading-normal">
            Pre-registered developments slated for release in coming weeks. Expected launch price models are fully hidden on standard view. Early waitlists secure priority queue tokens.
          </p>
        </div>

        {/* Scroll cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {homepageProjects.map((proj, idx) => (
            <div key={`${proj.id}-upcoming`} className="bg-white p-4.5 rounded-2xl border border-stone-150 flex flex-col justify-between shadow-sm hover:border-neutral-300 transition-colors">
              <div className="space-y-3">
                <div className="aspect-video bg-stone-100 rounded-xl overflow-hidden relative">
                  <img 
                    src={proj.virtualTourMedia.balconyView} 
                    alt="" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover" 
                  />
                  <span className="absolute bottom-2 left-2 bg-black/70 text-[9px] text-white px-2 py-0.5 rounded font-mono font-bold uppercase">
                    Launch Month: October 2026
                  </span>
                </div>

                <div>
                  <span className="text-[9px] font-mono uppercase font-semibold text-neutral-400 block">{proj.location}</span>
                  <strong className="text-sm font-black text-neutral-950 block">{proj.name}</strong>
                  <span className="text-[11px] text-stone-500">By {proj.developerName}</span>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {proj.amenities.slice(0, 2).map((am, idx2) => (
                    <span key={idx2} className="bg-stone-50 border border-stone-150 text-stone-500 text-[8px] font-bold px-1.5 py-0.5 rounded">
                      {am}
                    </span>
                  ))}
                </div>

                {/* Pricing text mandatory rule */}
                <span className="text-[10px] text-amber-600 block font-semibold bg-amber-50/50 p-2 rounded border border-amber-100 font-mono text-center">
                  🔐 "Special Launch Pricing Revealed on Launch Day"
                </span>
              </div>

              <button 
                onClick={() => handleWaitlistLock(proj.name)}
                className="w-full mt-4 bg-neutral-950 hover:bg-stone-850 text-white font-extrabold text-[10px] py-2.5 rounded-lg uppercase tracking-wider text-center"
              >
                Reserve Early Access
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ================================== SECTION 5: WHY PROPSPHERE ================================== */}
      <section id="why-propsphere-story" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5 space-y-4">
          <span className="text-xs font-mono font-black text-amber-500 uppercase tracking-widest block">HOW WE DISRUPT CAPITAL PROCESSES</span>
          <h2 className="text-3.5xl text-3xl sm:text-4xl font-sans font-black text-neutral-950 tracking-tight leading-tight">
            Traditional Buying vs Property Commerce
          </h2>
          <p className="text-neutral-500 text-sm leading-relaxed">
            Standard portals list static phone contacts matching 20% broker overheads, unverified titles, and duplicate mock listings. PropSphere's Property Commerce platform digitizes the complete transaction ledger.
          </p>

          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
            <span className="text-[10px] font-mono uppercase font-black tracking-widest text-[#999] block mb-2">THE SOVEREIGN DIFFERENCE:</span>
            <ul className="text-xs space-y-2 text-neutral-700 font-semibold">
              <li className="flex items-center gap-1.5 text-red-650">✕ Complex paper catalog trails matching agent markup.</li>
              <li className="flex items-center gap-1.5 text-emerald-600">✓ Instant 2% checkout holding inside secure bank escrow.</li>
              <li className="flex items-center gap-1.5 text-emerald-600">✓ Interactive property maps & 3D models.</li>
            </ul>
          </div>
        </div>

        {/* Animated progressive storytelling cards */}
        <div className="lg:col-span-7 bg-stone-100 p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <span className="text-xs font-mono font-extrabold text-[#777] uppercase block border-b border-stone-200 pb-2">THE SIX STEPS CONTINUOUS PIPELINE</span>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { idx: "1", title: "1. Smart Discovery", desc: "Browse pre-vetted Nairobi developments without duplicate spam catalogs." },
              { idx: "2", title: "2. AI Matching", desc: "Let Gemini align parameters on high-yield studios in seconds." },
              { idx: "3", title: "3. Friday Launch Drop", desc: "Wait for exactly Friday 3:00 PM EAT for exclusive spot prices." },
              { idx: "4", title: "4. Escrow Hold Block", desc: "Secure 2% hold queue lock immediately inside our ticket reservation engine." },
              { idx: "5", title: "5. KYC Passport", desc: "Sign digital escrow deed documents in your personal secure space." },
              { idx: "6", title: "6. Sovereign Ownership", desc: "Track high-altitude drone construction heights to liberate milestones." }
            ].map((st) => (
              <div key={st.idx} className="bg-white p-4.5 rounded-xl border border-stone-200 flex gap-3 shadow-inner">
                <span className="text-lg font-mono font-black text-amber-500">{st.idx}</span>
                <div>
                  <strong className="text-xs font-bold text-neutral-900 block leading-tight">{st.title}</strong>
                  <p className="text-[11px] text-neutral-500 mt-1 leading-normal">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================== SECTION 6: AI PROPERTY MATCHMAKER ================================== */}
      <section id="ai-homepage-matchmaker" className="bg-neutral-950 text-white p-8 sm:p-12 rounded-3xl border border-neutral-850 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-500/10 via-pink-500/5 to-transparent blur-3xl rounded-full" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
          
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-mono font-black tracking-widest text-amber-400 uppercase flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400 fill-current" /> GEMINI AI ADVISORY SERVICES
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-none text-white">
              AI Property Matchmaker
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
              Skip endless phone consultations. Enter your investment profiles, family size, and area of comfort to let the Gemini Model scan high-altitude digital towers, returning match weights in seconds.
            </p>

            {/* Simulated Live User Form Inputs */}
            <form onSubmit={handleCalculateMatchScores} className="space-y-4 bg-neutral-900/60 p-5 rounded-2xl border border-neutral-800">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase text-neutral-400 block font-bold">Invest Budget USD</label>
                  <select 
                    value={matchInputs.budget}
                    onChange={(e) => setMatchInputs(prev => ({ ...prev, budget: Number(e.target.value) }))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1.5 text-xs text-amber-400"
                  >
                    <option value={80000}>$80,000 USD</option>
                    <option value={150000}>$150,000 USD</option>
                    <option value={300000}>$300,000 USD</option>
                    <option value={750000}>$750,000 USD</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase text-neutral-400 block font-bold">Bedrooms configuration</label>
                  <select 
                    value={matchInputs.bedrooms}
                    onChange={(e) => setMatchInputs(prev => ({ ...prev, bedrooms: e.target.value }))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1.5 text-xs text-white"
                  >
                    <option value="Studio Suite">Studio Suite</option>
                    <option value="1 Bed Premium">1 Bed Premium</option>
                    <option value="2 Bed Executive">2 Bed Executive</option>
                    <option value="3 Bed Penthouse">3 Bed Penthouse</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase text-neutral-400 block font-bold">Primary Lifestyle & Amenities Focus</label>
                <input 
                  type="text" 
                  value={matchInputs.lifestyle}
                  onChange={(e) => setMatchInputs(prev => ({ ...prev, lifestyle: e.target.value }))}
                  placeholder="e.g. Wellness facility, children friendly, gym close"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase text-neutral-400 block font-bold">Work Location</label>
                  <select 
                    value={matchInputs.location}
                    onChange={(e) => setMatchInputs(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1.5 text-xs text-white"
                  >
                    <option value="Westlands">Westlands</option>
                    <option value="Kilimani">Kilimani</option>
                    <option value="Kileleshwa">Kileleshwa</option>
                    <option value="Riverside">Riverside</option>
                    <option value="Karen">Karen</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase text-neutral-400 block font-bold">Family Size / Format</label>
                  <select 
                    value={matchInputs.familySize}
                    onChange={(e) => setMatchInputs(prev => ({ ...prev, familySize: e.target.value }))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1.5 text-xs text-white"
                  >
                    <option value="Single Expatriate">Single Expatriate</option>
                    <option value="Couple / Co-living">Couple / Co-living</option>
                    <option value="Small Family (1-2 kids)">Small Family (1-2 kids)</option>
                    <option value="Large Portfolio Fund">Large Portfolio Fund</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1 pb-1">
                <label className="text-[9px] font-mono uppercase text-neutral-400 block font-bold">Investment Goals</label>
                <select 
                  value={matchInputs.investmentGoal}
                  onChange={(e) => setMatchInputs(prev => ({ ...prev, investmentGoal: e.target.value }))}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white"
                >
                  <option value="High rental yield p.a.">High rental yield p.a.</option>
                  <option value="Capital appreciation holding (5+ years)">Capital appreciation holding (5+ years)</option>
                  <option value="USD currency safe-haven hedging">USD currency safe-haven hedging</option>
                </select>
              </div>

              <button 
                type="submit"
                disabled={isMatching}
                className="w-full bg-amber-450 hover:bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all cursor-pointer bg-amber-450 bg-amber-400 text-center"
              >
                {isMatching ? "Calculating Match Weights..." : "Calculate Match Scores ✨"}
              </button>
            </form>
          </div>

          {/* Recommended Project Match Results */}
          <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 p-6 rounded-3xl min-h-[420px] flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#777] block pb-2 border-b border-neutral-80s border-neutral-800">RECOMMENDED APARTMENT MATCH RESULTS:</span>

              {!aiMatchResult && !isMatching && (
                <div className="text-center py-20 space-y-4">
                  <Star className="w-8 h-8 text-neutral-700 mx-auto" />
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                    Configure the criteria matrix on the left and hit calculated matches to execute deep queries on available units.
                  </p>
                </div>
              )}

              {isMatching && (
                <div className="text-center py-20 space-y-3">
                  <RotateCw className="w-8 h-8 text-amber-400 mx-auto animate-spin" />
                  <p className="text-xs text-neutral-400">Gemini model aligning floor orientations against regional capital trends...</p>
                </div>
              )}

              {aiMatchResult && (
                <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                  {aiMatchResult.map((res, idx) => (
                    <div key={idx} className="bg-neutral-950/85 p-4 rounded-xl border border-neutral-850 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-amber-400 font-mono font-bold block">{res.unitType} • Unit {res.unitNumber}</span>
                          <strong className="text-base font-black text-white">{res.projectLabel}</strong>
                        </div>
                        <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-black text-xs px-2.5 py-1 rounded">
                          {res.matchPercent}% Match
                        </span>
                      </div>

                      <p className="text-[11px] text-neutral-450 text-neutral-300 leading-normal font-medium">
                        {res.lifestyleFit}
                      </p>
                      <p className="text-[10px] text-neutral-500 italic leading-normal border-l border-neutral-700 pl-2">
                        {res.reason}
                      </p>

                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => {
                            onSelectProject(res.id);
                            onNavigateToTab("portfolio");
                          }}
                          className="bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-white text-[9px] font-bold px-3 py-1.5 rounded uppercase tracking-wider"
                        >
                          View Layout
                        </button>
                        <button
                          onClick={() => handleWaitlistLock(res.projectLabel)}
                          className="bg-amber-400 hover:bg-amber-300 text-neutral-950 text-[9px] font-black px-3 py-1.5 rounded uppercase tracking-wider"
                        >
                          Lock Priority Waitlist
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <p className="text-[10px] text-neutral-600 font-mono italic leading-none pt-2 mt-4 border-t border-neutral-820 border-neutral-800">
              ⚡ Accuracy scores represent algorithmic alignment with historic pre-sale indices in Lavington.
            </p>
          </div>

        </div>
      </section>

      {/* ================================== SECTION 7: INTERACTIVE NAIROBI INVESTMENT MAP ================================== */}
      <section id="investment-map" className="space-y-6">
        <div>
          <span className="text-xs font-mono font-black tracking-widest text-amber-500 uppercase">LOCATION INTELLIGENCE INDEX</span>
          <h2 className="text-3xl sm:text-4xl font-sans font-black text-neutral-950 tracking-tight">Interactive Nairobi Investment Map</h2>
          <p className="text-neutral-500 text-xs sm:text-sm mt-1">Select clickable districts to view rent yield ranges, infrastructure upgrades, active developer nodes, and AI scores.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Interactive Geographic Map Layout (7 cols) */}
          <div className="lg:col-span-7 bg-neutral-950 text-white rounded-3xl p-6 border border-neutral-850 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[380px]">
            {/* Custom SVG ring roads overlaying active districts */}
            <div className="absolute inset-0 opacity-15 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 600 400" preserveAspectRatio="none">
                <path d="M50,150 L120,40 L340,90 L520,210 L300,380 Z" fill="none" stroke="#FFF" strokeWidth="2" />
                <path d="M120,40 C180,180 340,320 300,380" fill="none" stroke="#FFF" strokeWidth="1" strokeDasharray="4,4" />
                <circle cx="120" cy="40" r="80" fill="none" stroke="#FFF" strokeWidth="1" />
                <circle cx="340" cy="90" r="140" fill="none" stroke="#FFF" strokeWidth="1" />
              </svg>
            </div>

            <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-neutral-500 border-b border-neutral-880 pb-3 uppercase tracking-widest">
              <span>District Layer: Yield & Growth Rating matrix</span>
              <span>Active Zone count: 10 Areas</span>
            </div>

            {/* Clickable Area Buttons */}
            <div className="relative z-10 py-8 flex flex-wrap gap-2 items-center justify-center max-w-xl mx-auto">
              {Object.keys(geoZones).map((zoneKey) => {
                const zoneObj = geoZones[zoneKey];
                const isActive = activeGeoZone === zoneKey;
                return (
                  <button
                    key={zoneKey}
                    onClick={() => setActiveGeoZone(zoneKey)}
                    className={`px-3 py-2 rounded-xl text-[11px] font-mono font-bold transition-all flex items-center gap-1.5 border shadow ${
                      isActive 
                        ? "bg-amber-400 border-amber-500 text-neutral-950 scale-105 font-black" 
                        : "bg-neutral-900/90 border-neutral-800 text-neutral-300 hover:bg-neutral-800"
                    }`}
                  >
                    <MapPin className={`w-3.5 h-3.5 ${isActive ? "text-neutral-950" : "text-amber-500"}`} />
                    {zoneKey}
                  </button>
                );
              })}
            </div>

            <div className="relative z-10 bg-black/60 p-3.5 rounded-xl border border-neutral-800 text-[10px] text-neutral-400 font-mono leading-normal">
              ★ Active infrastructure bypass projections trigger +12% annual capital holding multiplier variables automatically.
            </div>
          </div>

          {/* Area Metrics Board (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-stone-200 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-neutral-450 uppercase font-black">SELECTED METRIC NODE</span>
                  <h3 className="text-2xl font-black text-neutral-900 tracking-tight">{activeGeoZone} District</h3>
                </div>
                <div className="bg-stone-50 border border-stone-200 px-3.5 py-1.5 rounded-xl text-center shrink-0">
                  <span className="text-[9px] font-mono text-neutral-400 block uppercase">Growth Score</span>
                  <strong className="text-base font-black text-neutral-950">{geoZones[activeGeoZone].growthScore}/10</strong>
                </div>
              </div>

              <p className="text-xs text-neutral-500 leading-relaxed italic">
                "{geoZones[activeGeoZone].details}"
              </p>

              <div className="space-y-3 pt-2">
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-150 flex justify-between items-center text-xs">
                  <span className="text-neutral-400 font-mono font-bold">ESTIMATED RENTAL YIELD:</span>
                  <strong className="text-neutral-950 font-black">{geoZones[activeGeoZone].yield}</strong>
                </div>
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-150 flex justify-between items-center text-xs">
                  <span className="text-neutral-400 font-mono font-bold">CAPITAL APPRECIATION:</span>
                  <strong className="text-neutral-950 font-black">{geoZones[activeGeoZone].capital}</strong>
                </div>
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-150 flex justify-between items-center text-xs">
                  <span className="text-neutral-400 font-mono font-bold">AI PLATFORM RATING:</span>
                  <strong className="text-amber-600 font-black">{geoZones[activeGeoZone].rating}</strong>
                </div>
                <div className="space-y-1 text-xs pt-1">
                  <span className="text-[9px] font-mono text-neutral-400 uppercase font-black">MAJOR DIRECT-ROAD UPGRADES:</span>
                  <p className="font-bold text-neutral-800">{geoZones[activeGeoZone].infrastructure}</p>
                </div>
                <div className="space-y-1 text-xs pt-1">
                  <span className="text-[9px] font-mono text-neutral-400 uppercase font-black">REGISTERED ACTIVE DEVELOPERS:</span>
                  <p className="font-bold text-neutral-800 line-clamp-1">{geoZones[activeGeoZone].developers}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigateToTab("matchmaker")}
              className="w-full mt-6 bg-neutral-950 hover:bg-stone-850 text-white font-extrabold text-xs py-3.5 rounded-xl uppercase tracking-wider text-center"
            >
              Scan active {activeGeoZone} suites
            </button>
          </div>

        </div>
      </section>

      {/* ================================== SECTION 8: LIVE INVENTORY VISUALIZER ================================== */}
      <section id="inventory-visualizer" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-black text-amber-500 uppercase tracking-widest block">TICKETMASTER FOR LUXURY RESIDENCES</span>
            <h2 className="text-3xl sm:text-4xl font-sans font-black text-neutral-950 tracking-tight">Live Inventory Visualizer</h2>
            <p className="text-neutral-500 text-xs sm:text-sm mt-1">
              Interactive structural block views modeled like airline cabin layout grids. Select Towers, Floor heights, and specific unit suites to check locked statuses or click to reserve.
            </p>
          </div>
          
          <div className="flex items-center gap-2 bg-stone-50 p-1.5 rounded-xl border border-stone-200">
            {activeProject.towers.map((tower, idx) => (
              <button
                key={tower.name}
                onClick={() => { setSelectedTowerIndex(idx); setSelectedFloorNum(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedTowerIndex === idx 
                    ? "bg-neutral-950 text-white shadow" 
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                {tower.name}
              </button>
            ))}
          </div>
        </div>

        {/* Visualizer layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
          
          {/* Left selector sidebar (3 cols) */}
          <div className="lg:col-span-3 bg-stone-50 p-5 rounded-3xl border border-stone-200 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[10px] font-mono font-black text-[#555] uppercase block border-b border-stone-200 pb-2">Select Elevation Floor:</span>
              <div className="flex flex-row lg:flex-col flex-wrap gap-1.5 max-h-[220px] lg:max-h-none overflow-y-auto pr-1">
                {currentTower?.floors.map((fl) => (
                  <button
                    key={fl.floorNumber}
                    onClick={() => setSelectedFloorNum(fl.floorNumber)}
                    className={`flex-1 min-w-[3.5rem] lg:w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold font-mono transition-colors ${
                      selectedFloorNum === fl.floorNumber 
                        ? "bg-amber-450 text-neutral-950 font-black bg-amber-400 shadow-sm" 
                        : "bg-white hover:bg-stone-105 border border-stone-200 text-stone-500 hover:text-stone-900"
                    }`}
                  >
                    <span>Floor {fl.floorNumber}</span>
                    <span className="text-[9px] bg-neutral-950/5 px-1.5 rounded font-bold font-sans">
                      {fl.units.filter(u => u.status === "Available").length} Green
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Micro color legend keys */}
            <div className="space-y-2 pt-6 border-t border-stone-200 mt-6 text-[10px] font-mono">
              <span className="text-[#888] font-black uppercase tracking-wider block">Ledger Status Codes:</span>
              <div className="grid grid-cols-2 gap-2 font-bold">
                <div className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-emerald-500 shrink-0" /> Available</div>
                <div className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-amber-500 shrink-0" /> Reserved</div>
                <div className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-stone-300 shrink-0" /> Sold Out</div>
                <div className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-purple-600 shrink-0" /> Flash Deal</div>
                <div className="flex items-center gap-1 col-span-2"><span className="h-2.5 w-2.5 rounded bg-blue-400 shrink-0" /> Coming Soon</div>
              </div>
            </div>
          </div>

          {/* Core Interactive Grid block (6 cols) */}
          <div className="lg:col-span-6 bg-neutral-950 text-stone-300 p-6 sm:p-8 rounded-3xl border border-neutral-850 flex flex-col justify-between relative min-h-[350px]">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-900 pb-3 font-mono text-[10px] text-neutral-500 tracking-wider">
                <span>ACTIVE INTERACTIVE CABIN VIEW: TOWER {currentTower?.name} • FLOOR {selectedFloorNum}</span>
                <span className="flex items-center gap-1 font-bold text-green-400">● LEDGER HEALTHY</span>
              </div>

              {/* Units grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4">
                {floorUnits.map((u) => {
                  const isFlash = u.flexStatus === "Purple";
                  const statusColors = {
                    Available: isFlash 
                      ? "bg-purple-950/90 border-purple-500 hover:border-purple-300 text-purple-200 shadow-md shadow-purple-500/10" 
                      : "bg-emerald-950/70 border-emerald-500/80 hover:border-emerald-300 text-emerald-200",
                    Reserved: "bg-amber-950/80 border-amber-600 hover:border-amber-400 text-amber-200",
                    Sold: "bg-stone-900 border-stone-800 text-neutral-600 cursor-not-allowed",
                    "Coming Soon": "bg-blue-950/60 border-blue-800 text-blue-300 hover:border-blue-400"
                  };

                  return (
                    <div
                      key={u.number}
                      onMouseEnter={() => setActiveUnitHover(u)}
                      onClick={() => {
                        if (u.status === "Available") {
                          onTriggerReserve(activeProject, u);
                        } else {
                          alert(`Unit ${u.number} is currently "${u.status}". Choose green Available units to execute standard pre-sales escrow lock.`);
                        }
                      }}
                      className={`p-3.5 rounded-xl border-2 text-center transition-all cursor-pointer flex flex-col justify-between h-24 select-none ${
                        statusColors[u.status] || "bg-stone-900"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-neutral-500 font-bold">{u.type}</span>
                        {isFlash && <Flame className="w-3.5 h-3.5 text-purple-400 animate-pulse" />}
                      </div>

                      <strong className="text-base sm:text-lg font-black font-mono tracking-tight block">
                        {u.number}
                      </strong>

                      <span className="text-[9px] font-mono uppercase bg-black/45 py-0.5 rounded font-bold block truncate">
                        {u.status === "Available" && isFlash ? "⚡ FLASH PRICE" : u.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-850 p-3 rounded-xl text-[11px] font-mono text-neutral-400 flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-400 shrink-0" /> Hover or touch any interactive unit to load its DNA score index, layout size, and specifications instantly.
            </div>
          </div>

          {/* Rigth selection info drawer (3 cols) */}
          <div className="lg:col-span-3 bg-white p-5 rounded-3xl border border-stone-200 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <span className="text-[10px] font-mono text-neutral-400 uppercase font-black tracking-widest block">UNIT LEDGER INTELLIGENCE:</span>

              {activeUnitHover ? (
                <div className="space-y-4">
                  <div>
                    <span className="text-xs bg-stone-100 border border-stone-250 px-2 py-0.5 rounded font-mono font-bold text-neutral-600 inline-block uppercase mb-1">
                      {activeUnitHover.type} Setup
                    </span>
                    <h4 className="text-2xl font-black text-neutral-950 font-mono tracking-tight">Suite {activeUnitHover.number}</h4>
                  </div>

                  <div className="space-y-3 pt-2 text-xs">
                    <div className="bg-stone-50 p-3 rounded-xl border border-stone-150 flex justify-between items-center text-xs">
                      <span className="text-neutral-400 font-mono">Unit Size Layout:</span>
                      <strong className="text-neutral-950 font-mono">{activeUnitHover.size}</strong>
                    </div>
                    <div className="bg-stone-50 p-3 rounded-xl border border-stone-150 flex justify-between items-center text-xs">
                      <span className="text-neutral-400 font-mono">Status Profile:</span>
                      <strong className={`font-mono text-xs uppercase ${
                        activeUnitHover.status === "Available" ? "text-emerald-600 font-black" : "text-amber-600"
                      }`}>{activeUnitHover.status}</strong>
                    </div>
                    
                    {/* DNA score mockup */}
                    <div className="bg-amber-400/5 border border-amber-400/20 p-3 rounded-xl">
                      <span className="text-[9px] font-mono text-amber-600 font-extrabold block">AI PROPERTY DNA™ VALUE:</span>
                      <div className="flex items-center gap-2 mt-1">
                        <strong className="text-base font-black text-amber-600">9.4 / 10</strong>
                        <span className="text-[10px] text-neutral-500 font-medium">Premium high elevation natural light compound score.</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 space-y-3">
                  <RotateCw className="w-6 h-6 text-stone-300 mx-auto animate-spin" style={{ animationDuration: "12s" }} />
                  <p className="text-[11px] text-neutral-405 text-stone-400">Position mouse or tap any layout to load direct specs drawer...</p>
                </div>
              )}
            </div>

            {activeUnitHover && activeUnitHover.status === "Available" ? (
              <button 
                onClick={() => onTriggerReserve(activeProject, activeUnitHover)}
                className="w-full bg-amber-450 hover:bg-amber-400 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black text-xs uppercase py-3 rounded-xl text-center shadow tracking-wider cursor-pointer mt-4"
              >
                Lock secure checkout spot
              </button>
            ) : (
              <button 
                disabled 
                className="w-full bg-stone-100 text-stone-400 font-bold text-xs uppercase py-3 rounded-xl text-center border border-stone-200 cursor-not-allowed mt-4"
              >
                Selection Lock closed
              </button>
            )}
          </div>

        </div>
      </section>

      {/* ================================== SECTION 9: INTERACTIVE PROPERTY MODELS ================================== */}
      <section id="digital-twins" className="bg-neutral-950 text-white p-8 sm:p-12 rounded-3xl border border-neutral-850 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute left-0 bottom-0 top-0 w-80 bg-gradient-to-tr from-violet-600/5 via-pink-500/5 to-transparent blur-3xl rounded-full" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Controls sidebar (4 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-mono font-black text-amber-450 text-amber-400 uppercase tracking-widest block">INTERACTIVE PROPERTY MODELS</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-none text-white">Virtual Layouts & Day Orientation</h2>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
              Explore property layouts, see different floor angles, and view sunlight exposure throughout the day to find your perfect home.
            </p>
            <div className="space-y-4 bg-neutral-900/60 p-5 rounded-2xl border border-neutral-800">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-mono text-neutral-400">
                  <span className="flex items-center gap-1 font-bold"><Sun className="w-3.5 h-3.5 text-amber-400" /> Sunlight Direction</span>
                  <span className="text-white font-extrabold font-mono">{sunlightHour}:00 Hours (EAT)</span>
                </div>
                <input 
                  type="range" 
                  min={8} 
                  max={18} 
                  value={sunlightHour} 
                  onChange={(e) => setSunlightHour(Number(e.target.value))}
                  className="w-full accent-amber-400 h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer" 
                />
                <span className="text-[9px] text-[#777] font-mono uppercase block text-right">
                  {sunlightHour < 12 ? "Morning East sunlight" : sunlightHour < 16 ? "Midday overhead solar" : "Evening West sunset flare"}
                </span>
              </div>

              <div className="space-y-1 pt-2 border-t border-neutral-800">
                <span className="text-[9px] font-mono uppercase text-neutral-400 block font-bold">ALTITUDE ELEVATION VALUE:</span>
                <div className="flex gap-2 text-[10px] font-mono">
                  {["Low Rise Garden Nodes", "Mid Altitude Comfort", "Premium Floor Views"].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setViewElevation(lvl)}
                      className={`flex-1 p-2 rounded border font-bold text-center transition-all ${
                        viewElevation === lvl 
                          ? "bg-amber-400 border-amber-500 text-neutral-950 font-black" 
                          : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:bg-neutral-800"
                      }`}
                    >
                      {lvl.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive structural projection (7 cols) */}
          <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 p-6 rounded-3xl min-h-[380px] flex flex-col justify-between relative overflow-hidden">
            {/* Visual twin wireframe display */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-neutral-800 pb-3 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
                <span>3D PROJECTION ENGINE v3.0: {activeProject.name} Structure</span>
                <span className="bg-amber-405 bg-amber-400 text-neutral-950 font-extrabold px-1.5 rounded">65% HEIGHT CONCRETE Milestone</span>
              </div>

              {/* Wireframe simulated skyscraper */}
              <div className="relative h-64 flex items-center justify-center">
                {/* Simulated altitude blocks */}
                <div className="space-y-2.5 w-44">
                  {[4, 3, 2, 1].map((floorNum) => {
                    const isPremium = viewElevation === "Premium Floor Views" && floorNum === 4;
                    const isMid = viewElevation === "Mid Altitude Comfort" && (floorNum === 3 || floorNum === 2);
                    const isLow = viewElevation === "Low Rise Garden Nodes" && floorNum === 1;
                    const isActive = isPremium || isMid || isLow;

                    return (
                      <div 
                        key={floorNum}
                        className={`h-11 rounded-lg border-2 flex items-center justify-between px-3 font-mono text-xs transition-all ${
                          isActive 
                            ? "bg-amber-400/15 border-amber-400 text-amber-200 font-extrabold scale-105 shadow-md shadow-amber-400/5" 
                            : "bg-neutral-950/60 border-neutral-800 text-neutral-500"
                        }`}
                      >
                        <span>Floor Level 0{floorNum}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Solar ray indicator */}
                          <div className={`h-2.5 w-2.5 rounded-full ${
                            isActive && sunlightHour > 12 ? "bg-amber-400 animate-pulse" : "bg-neutral-800"
                          }`} />
                          <span className="text-[9px] text-[#666]">
                            {floorNum === 4 ? "Penthouses" : floorNum === 3 ? "Duplexes" : "Studios"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Simulated Floating Solar Vector Dot based on sunlight Hour range slider */}
                <div 
                  className="absolute w-8 h-8 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center shadow-lg shadow-amber-400/20 font-mono text-[9px] font-black pointer-events-none transition-all duration-300"
                  style={{
                    left: `${20 + ((sunlightHour - 8) * 6)}%`,
                    top: `${15 + (Math.sin((sunlightHour - 8) / 10 * Math.PI) * -15)}%`
                  }}
                >
                  <Sun className="w-4 h-4 animate-spin" style={{ animationDuration: "20s" }} />
                </div>
              </div>
            </div>

            <p className="text-[10px] text-neutral-500 font-mono italic leading-normal border-t border-neutral-820 border-neutral-800 pt-3">
              ★ Westlands heights digital twins calculate exact structural shadow parameters matched with global solar tracking frameworks.
            </p>
          </div>

        </div>
      </section>

      {/* ================================== SECTION 10: VIRTUAL TOUR EXPERIENCE ================================== */}
      <section id="virtual-tour" className="space-y-6">
        <div>
          <span className="text-xs font-mono font-black text-amber-500 uppercase tracking-widest block">UHD MATTERPORT SPHERES</span>
          <h2 className="text-3xl sm:text-4xl font-sans font-black text-neutral-950 tracking-tight">Virtual Tour Experience</h2>
          <p className="text-neutral-500 text-xs sm:text-sm mt-1">Immersive real render galleries detailing interior bathrooms, master kitchens, high rise balconies, and surrounding neighborhoods.</p>
        </div>

        <div className="space-y-4">
          {/* Carousel tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
            {Object.keys(virtualTourMediaLinks).map((navKey) => {
              const isActive = activeTourNav === navKey;
              return (
                <button
                  key={navKey}
                  onClick={() => setActiveTourNav(navKey as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors capitalize ${
                    isActive 
                      ? "bg-neutral-950 text-white shadow-sm" 
                      : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  {navKey}
                </button>
              );
            })}
          </div>

          {/* Render image viewport */}
          <div className="relative rounded-3xl overflow-hidden aspect-video bg-stone-100 border border-stone-200 shadow shadow-inner group">
            <img 
              src={virtualTourMediaLinks[activeTourNav]} 
              alt={activeTourNav}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" 
            />
            
            {/* Overlay indicators */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 p-6 flex flex-col justify-between">
              <span className="bg-black/75 text-white text-[10px] font-mono border border-white/10 px-2.5 py-1 rounded self-start tracking-wider uppercase font-bold">
                ✓ SIMULATED Matterport HD Viewport
              </span>

              <div className="flex justify-between items-end">
                <div>
                  <strong className="text-base font-bold text-white block capitalize">{activeTourNav} UHD rendering</strong>
                  <span className="text-xs text-stone-300">Edge green energy pre-certified layout specs included</span>
                </div>
                
                <span className="bg-amber-450 bg-amber-400 text-neutral-950 font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase font-mono shadow-md tracking-wider">
                  UHD Walkthrough Live
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================== SECTION 11: INVESTMENT INTELLIGENCE ================================== */}
      <section id="investment-intelligence" className="bg-stone-50 p-8 sm:p-12 rounded-3xl border border-stone-200 space-y-6">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-mono font-black text-amber-500 uppercase tracking-widest block">SAAS METRICS MATRIX</span>
          <h2 className="text-3xl font-black text-neutral-950 tracking-tight">Investment Intelligence</h2>
          <p className="text-neutral-500 text-xs sm:text-sm mt-1">AI-generated projection models mapping future capital gain appreciation, demand indexes, neighborhood rating thresholds.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
          
          {/* Left panel sliders (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-5">
            <strong className="text-xs uppercase font-mono text-neutral-450 font-black block border-b border-stone-100 pb-2">Align Investment Period:</strong>

            <div className="space-y-2">
              <div className="flex justify-between font-mono text-xs text-neutral-600">
                <span>Hold Duration Period:</span>
                <strong className="text-neutral-950 font-bold">{forecastYears} Years</strong>
              </div>
              <input 
                type="range" 
                min={1} 
                max={15} 
                value={forecastYears} 
                onChange={(e) => setForecastYears(Number(e.target.value))}
                className="w-full accent-neutral-900 h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer" 
              />
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex justify-between items-center bg-stone-50 p-2.5 rounded-lg">
                <span className="text-neutral-400">Demand Score:</span>
                <strong className="text-emerald-600 font-extrabold font-mono">9.8 / 10 (Boiling)</strong>
              </div>
              <div className="flex justify-between items-center bg-stone-50 p-2.5 rounded-lg">
                <span className="text-neutral-400">Neighborhood Rating:</span>
                <strong className="text-neutral-950 font-extrabold font-mono">★ AAA Prime</strong>
              </div>
              <div className="flex justify-between items-center bg-stone-50 p-2.5 rounded-lg">
                <span className="text-neutral-400">Tax SEZ Breakeven:</span>
                <strong className="text-indigo-600 font-extrabold font-mono">Zero county duties</strong>
              </div>
            </div>
          </div>

          {/* SVG line-graph projections (7 cols) */}
          <div className="lg:col-span-7 bg-neutral-950 text-white p-6 sm:p-8 rounded-3xl border border-neutral-850 shadow min-h-[300px] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between font-mono text-[10px] text-neutral-400 uppercase tracking-widest border-b border-neutral-900 pb-3">
                <span>Projected Appreciation compound: Westlands Corridor Suite A-102</span>
                <span className="text-amber-400 font-bold">14.2% Year Capital growth</span>
              </div>

              {/* Styled SVG Chart */}
              <div className="h-44 w-full pt-4">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150">
                  <defs>
                    <linearGradient id="chart-slope-glow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid lines */}
                  <line x1="0" y1="130" x2="500" y2="130" stroke="#1F2937" strokeWidth="1" />
                  <line x1="0" y1="80" x2="500" y2="80" stroke="#131B2E" strokeWidth="1" />
                  <line x1="0" y1="30" x2="500" y2="30" stroke="#131B2E" strokeWidth="1" />
                  
                  {/* Dynamic path based on forecastYears slider */}
                  <path 
                    d={`M0,128 C100,${110 - (forecastYears * 1.5)} 250,${90 - (forecastYears * 3)} 500,${50 - (forecastYears * 4.5)}`} 
                    fill="none" 
                    stroke="#F59E0B" 
                    strokeWidth="3" 
                    className="transition-all duration-300"
                  />
                  
                  {/* Gradient fill */}
                  <path 
                    d={`M0,128 C100,${110 - (forecastYears * 1.5)} 250,${90 - (forecastYears * 3)} 500,${50 - (forecastYears * 4.5)} L500,130 L0,130 Z`} 
                    fill="url(#chart-slope-glow)" 
                    className="transition-all duration-300 animate-pulse"
                  />

                  {/* Nodes */}
                  <circle cx="500" cy={50 - (forecastYears * 4.5)} r="5" fill="#F59E0B" className="transition-all duration-300" />
                  <text x="490" y={35 - (forecastYears * 4.5)} fill="#FFF" className="text-[10px] font-mono font-black" textAnchor="end">
                    ${Math.round(82000 * Math.pow(1.142, forecastYears)).toLocaleString()} USD
                  </text>
                  <text x="5" y="115" fill="#555" className="text-[9px] font-mono">Launch spot</text>
                  <text x="245" y="145" fill="#555" className="text-[9px] font-mono">Linear Appreciation path</text>
                </svg>
              </div>
            </div>

            <p className="text-[10px] text-neutral-500 font-mono italic leading-normal pt-2 border-t border-neutral-900 mt-4">
              ✓ Projections calibrated from cytonn capital indexes recorded inside Kilimani district over the trailing 12 years.
            </p>
          </div>

        </div>
      </section>

      {/* ================================== SECTION 12: BUYER SUCCESS STORIES ================================== */}
      <section id="buyer-success" className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-mono font-black text-amber-500 uppercase tracking-widest block">VERIFIED BUYING EXPERIENCES</span>
          <h2 className="text-3xl font-black text-neutral-950 tracking-tight">Buyer Success Stories</h2>
          <p className="text-neutral-500 text-xs text-sm">Read how premium international investors secured holdings with zero traditional markup commissions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          {[
            {
              buyer: "Moses Mwangi",
              profile: "VIP Class Investor, Real Estate broker",
              location: "Westlands heights, Oct 2025",
              savings: "Savings of KES 2.3M",
              text: "I booked Floor 8 duplex inside launch minutes on my phone. The digital twin map matched physical orientations wonderfully. Escrow lock system guarantees construction confidence."
            },
            {
              buyer: "Sophia Al-Amin",
              profile: "Diaspora Tech Engineer, London HQ",
              location: "Sky Gardens Studio, June 2026",
              savings: "USD Safe-Haven hedge",
              text: "Wiring direct holdings to verified developers inside Kenya felt daunting. PropSphere pre-screened land title approvals on central ledger. Escrow drawdown milestones give deep tranquility."
            },
            {
              buyer: "David Kipkorir",
              profile: "Capital Fund Principal, Nairobi",
              location: "Kilimani Botanical, Nov 2025",
              savings: "Yield p.a. of 12.2%",
              text: "We acquired 4 units in bulk slots using automated Friday drop waitlists. Speed of checkout cleared closing paperwork within 24 hours. The Apple of African PropTech without question."
            }
          ].map((sc, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-amber-500 text-xs">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                  <span className="text-neutral-450 text-[10px] bg-stone-50 px-1.5 rounded font-mono border text-neutral-500">5.0 Star Verified</span>
                </div>
                <strong className="text-base text-neutral-950 block">"{sc.buyer}"</strong>
                <p className="text-xs text-neutral-500 leading-relaxed italic">
                  "{sc.text}"
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 mt-6 flex justify-between items-center text-xs">
                <div>
                  <strong className="text-neutral-900 block font-semibold">{sc.buyer}</strong>
                  <span className="text-[10px] text-neutral-450 block text-neutral-400 font-mono leading-none mt-0.5">{sc.profile}</span>
                </div>
                <span className="bg-emerald-50 text-emerald-805 font-mono text-[9px] px-2 py-0.5 rounded border border-emerald-150 font-bold">
                  {sc.savings}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================================== SECTION 13: DEVELOPER SUCCESS STORIES ================================== */}
      <section id="developer-success" className="bg-neutral-950 text-white p-8 sm:p-12 rounded-3xl border border-neutral-850 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 bottom-0 right-0 w-80 bg-gradient-to-br from-pink-500/5 to-transparent blur-3xl rounded-full" />
        
        <div className="max-w-2xl space-y-2 relative z-10">
          <span className="text-xs font-mono font-black text-amber-450 text-amber-400 uppercase tracking-widest block">ENTERPRISE SAAS OUTCOMES</span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-none text-white">Developer Success Stories</h2>
          <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
            Leading regional real-estate enterprises launch off-plan towers on our commerce ledger to experience unmatched sales velocity, zero brochure printing, and pre-vetted leads.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 relative z-10">
          {[
            {
              dev: "Premium East African Spaces Ltd",
              case: "Sky Gardens Tower A pre-sales clearance",
              speed: "Sold 32 rooms in 14 launch minutes",
              revenue: "KES 480M Locked Escrow Revenue",
              summary: "We uploaded architectural CAD layouts into digital twin formats inside October. The Friday Drop countdown trigger organized 3,000 active investor checkouts. Complete clearance happened before cement foundation poured."
            },
            {
              dev: "Westlands Elite Residencies Consortium",
              case: "Westlands Heights Penthouses launch",
              speed: "97% inventory cleared during Day 1",
              revenue: "$3.4M USD Capital booked",
              summary: "Traditional offline campaigns matching broker commissions were eating 25% of development capital value. PropSphere's direct-to-escrow fractional ledger pre-qualified credit lines, allowing zero-markups sales."
            }
          ].map((dc, idx) => (
            <div key={idx} className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-[10px] text-pink-400 uppercase font-mono block">DEVELOPER CASE SPEC:</span>
                <strong className="text-base text-white block">{dc.dev}</strong>
                <p className="text-neutral-400 text-xs leading-relaxed italic">
                  "{dc.summary}"
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-800 mt-6 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-neutral-500 block">Launch Speed velocity:</span>
                  <strong className="text-white">{dc.speed}</strong>
                </div>
                <div>
                  <span className="text-neutral-500 block">Revenue Cleared:</span>
                  <strong className="text-amber-400 font-mono font-bold">{dc.revenue}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================================== SECTION 14: LAUNCH YOUR PROJECT (DEVELOPER CTA) ================================== */}
      <section id="developer-cta" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5 space-y-4">
          <span className="text-xs font-mono font-black text-amber-500 uppercase tracking-widest block font-bold">DIGITIZE YOUR TOWERS TODAY</span>
          <h2 className="text-3xl font-black text-neutral-950 tracking-tight leading-none text-neutral-950">
            Launch Your Project
          </h2>
          <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed">
            Monetize off-plan towers through Africa's dominant property commerce platform. Host Friday VIP drops, configure automated WhatsApp conversion chats, upload cadastral layouts, and manage global international ledgers with ease.
          </p>

          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs space-y-2">
            <span className="text-[9px] font-mono uppercase font-black text-[#888] block">ENTERPRISE COMMAND SYSTEMS INTRO:</span>
            <div className="flex items-center gap-1.5 font-bold"><CheckCircle className="w-4 h-4 text-emerald-500" /> Integrated land cadastral title survey registers.</div>
            <div className="flex items-center gap-1.5 font-bold"><CheckCircle className="w-4 h-4 text-emerald-500" /> Pre-configured server-side Gemini broker chatbots.</div>
            <div className="flex items-center gap-1.5 font-bold"><CheckCircle className="w-4 h-4 text-emerald-500" /> Standard 2.5% transaction base billing commission.</div>
          </div>
        </div>

        {/* Lead Intake Form Simulator */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <strong className="text-xs uppercase font-mono tracking-wider text-[#999] block border-b border-stone-100 pb-2">APPLY FOR LIVE DEVELOPER PARTNERSHIP ACCESS:</strong>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 text-xs">
              <label className="text-[10px] uppercase font-mono text-neutral-400 font-bold block">Developer Corp Name</label>
              <input type="text" placeholder="e.g. Premium East Africa Spaces" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2" />
            </div>
            <div className="space-y-1 text-xs">
              <label className="text-[10px] uppercase font-mono text-neutral-400 font-bold block">Primary Launch Area</label>
              <select className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2 py-2">
                <option>Westlands Corridor</option>
                <option>Kilimani Premium</option>
                <option>Riverside Diplomatic</option>
                <option>Karen Luxury Villa Zone</option>
              </select>
            </div>
            <div className="space-y-1 text-xs">
              <label className="text-[10px] uppercase font-mono text-neutral-400 font-bold block">Project Projected Inventory Size</label>
              <input type="number" defaultValue={50} className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 font-mono" />
            </div>
            <div className="space-y-1 text-xs">
              <label className="text-[10px] uppercase font-mono text-neutral-400 font-bold block">Target launch month</label>
              <input type="text" placeholder="e.g. October 2026" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3">
            <button 
              type="button" 
              onClick={() => {
                alert("Demo Request Submitted! One of our regional lead sales architects in Westlands corporate office will correspond within 2 hours.");
              }}
              className="bg-neutral-950 hover:bg-stone-850 text-white font-extrabold text-[11px] py-3 rounded-lg uppercase tracking-wider text-center"
            >
              Book Demo Tour
            </button>
            <button 
              type="button" 
              onClick={() => {
                onNavigateToTab("developers");
              }}
              className="bg-amber-405 hover:bg-amber-400 bg-amber-450 hover:bg-amber-400 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black text-[11px] py-3 rounded-lg uppercase tracking-wider text-center cursor-pointer"
            >
              Launch Developer Portal
            </button>
          </div>
        </div>
      </section>

      {/* ================================== SECTION 15: FINAL COUNTDOWN ================================== */}
      <section id="final-countdown-epic" className="bg-gradient-to-r from-amber-450 to-amber-500 text-neutral-950 rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden bg-amber-400">
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-white/10 blur-3xl rounded-full pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
          <div className="space-y-3">
            <span className="text-xs uppercase font-mono tracking-widest font-black text-neutral-900/60 block">Sovereign Property Dropping Waitlists</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-950 leading-none">
              Don't Miss the Next Friday Drops
            </h2>
            <p className="text-neutral-900/80 font-bold text-sm max-w-xl">
              Nairobi off-plan suites resolve within launch minutes. Lock your priority waiting credentials, monitor digital tower maps, and claim launch appreciation margins.
            </p>

            {/* Simulated instant waiting enter box */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2 max-w-md">
              <input 
                type="email" 
                required
                value={waitlistEmail}
                onChange={(e) => setWaitlistEmail(e.target.value)}
                placeholder="Secure priority email address..." 
                className="bg-white/80 border border-amber-600/20 text-neutral-950 font-semibold px-4 py-3 rounded-xl text-xs flex-1 outline-none focus:bg-white" 
              />
              <button 
                type="button"
                onClick={() => {
                  if (!waitlistEmail.trim() || !waitlistEmail.includes("@")) {
                    alert("A valid email represents strict cadastral pre-approval registers.");
                    return;
                  }
                  alert(`Priority registration approved! You are booked under buyer waiting index #${Math.floor(Math.random() * 500) + 10000}. Check your inbox for VIP access pass.`);
                  setWaitlistEmail("");
                }}
                className="bg-neutral-950 hover:bg-stone-900 text-white font-extrabold text-xs uppercase tracking-widest px-6 py-3 rounded-xl"
              >
                Claim Priority spot
              </button>
            </div>
          </div>

          {/* Inline Countdown */}
          <div className="bg-neutral-950 text-white p-5 rounded-2xl flex flex-col gap-2 shrink-0 font-mono shadow-xl relative border border-white/5 min-w-[240px]">
            <span className="text-[9px] uppercase tracking-widest text-[#777] font-black block border-b border-neutral-900 pb-2">TIME UNTIL LAUNCH HOURS:</span>
            <div className="flex justify-between gap-3 text-center">
              <div>
                <span className="text-xl font-bold block">{countdown.days}</span>
                <span className="text-[8px] text-neutral-500 uppercase font-black font-sans">Days</span>
              </div>
              <div>
                <span className="text-xl font-bold block">{countdown.hours}</span>
                <span className="text-[8px] text-neutral-400 uppercase font-black font-sans">Hours</span>
              </div>
              <div>
                <span className="text-xl font-bold block">{countdown.minutes}</span>
                <span className="text-[8px] text-neutral-400 uppercase font-black font-sans">Mins</span>
              </div>
              <div>
                <span className="text-xl font-bold block text-red-500 animate-pulse">{countdown.seconds}</span>
                <span className="text-[8px] text-neutral-400 uppercase font-black font-sans">Sec</span>
              </div>
            </div>
            
            {/* Added Enter Drop Room CTA for this countdown */}
            <button
              onClick={() => onNavigateToTab("drops")}
              className="mt-3 w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-350 hover:to-amber-450 text-neutral-950 font-black text-xs uppercase tracking-widest py-2 px-3 rounded-xl shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Enter Drop Room <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
