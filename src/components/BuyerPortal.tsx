import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Building2, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Compass, 
  Timer, 
  CreditCard, 
  FileText, 
  Heart, 
  Flame, 
  UserCheck, 
  Activity, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Sparkles,
  Search,
  MessageSquare,
  Users,
  ChevronRight
} from "lucide-react";
import { Project, Booking, User } from "../types";

interface BuyerPortalProps {
  projects: Project[];
  bookings: Booking[];
  activeProject: Project;
  onSelectProject: (id: string) => void;
  onNavigateToTab: (tab: "drops" | "portfolio" | "matchmaker" | "developers" | "financing" | "battle") => void;
  currentUser?: User | null;
}

export default function BuyerPortal({
  projects,
  bookings,
  activeProject,
  onSelectProject,
  onNavigateToTab,
  currentUser
}: BuyerPortalProps) {
  const [buyerSubTab, setBuyerSubTab] = useState<"dashboard" | "reservations" | "payments" | "documents" | "queues">("dashboard");
  const [favorites, setFavorites] = useState<string[]>(["sky-gardens", "westlands-heights"]);
  
  // Real-time concert ticket Reservation Queue simulation
  const [queueStatus, setQueueStatus] = useState({
    active: true,
    userPosition: 1, // You are user #1!
    timeLeft: 345, // 5 minutes 45 seconds remaining!
    reservedUnit: { number: "A-201", price: 82000, project: "Sky Gardens" },
    statusText: "YOUR RESERVATION ACCESS IS SECURE",
  });

  // Simulated live battlefield waiting room for "Unit Battle™"
  const [battleWaiters, setBattleWaiters] = useState([
    { name: "John M.", bid: 154000, time: "2s ago", flag: "KE" },
    { name: "Amina Al-Amin", bid: 154500, time: "Just now", flag: "UK" },
    { name: "David K.", bid: 155000, time: "Pending", flag: "US" }
  ]);
  const [currentBattleBid, setCurrentBattleBid] = useState(154500);
  const [battleTimer, setBattleTimer] = useState(45); // seconds left

  // Decrement queue timer
  useEffect(() => {
    const queueTimer = setInterval(() => {
      setQueueStatus(prev => {
        if (prev.timeLeft > 1) {
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        } else {
          // Timer expired, move to next user in line
          return {
            ...prev,
            userPosition: 2,
            timeLeft: 0,
            statusText: "ACCESS SECONDS EXPIRED. RELEASED TO CUSTOMER #2"
          };
        }
      });
    }, 1000);
    return () => clearInterval(queueTimer);
  }, []);

  // Battle timer simulation
  useEffect(() => {
    const battleInterval = setInterval(() => {
      setBattleTimer(prev => {
        if (prev > 1) return prev - 1;
        // Reset battle with random price increment
        setCurrentBattleBid(154000 + Math.floor(Math.random() * 8) * 1000);
        return 59;
      });
    }, 1000);
    return () => clearInterval(battleInterval);
  }, []);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const handlePlaceBattleBid = () => {
    const nextBid = currentBattleBid + 1000;
    setCurrentBattleBid(nextBid);
    setBattleWaiters(prev => [
      { name: "You (Verified Buyer)", bid: nextBid, time: "Just now", flag: "KE" },
      ...prev.slice(0, 2)
    ]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Side Navigation Sidebar for Buyers (3 cols) */}
      <aside className="lg:col-span-3 bg-white p-5 rounded-3xl border border-stone-200 shadow-sm h-fit space-y-6">
        <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
          <div className="w-11 h-11 rounded-xl bg-amber-400 text-neutral-900 flex items-center justify-center font-black shadow-md border border-amber-500 uppercase">
            {currentUser ? currentUser.username.substring(0, 1) : "C"}
          </div>
          <div>
            <strong className="text-sm font-black text-neutral-900 block">{currentUser ? currentUser.username : "Caleb Kiprop"}</strong>
            <span className="text-[10px] font-mono font-extrabold text-neutral-400 uppercase tracking-widest block">
              {currentUser ? currentUser.role : "Guest"} • VIP Client
            </span>
          </div>
        </div>

        {/* Portal Nav tabs */}
        <nav className="flex flex-col gap-1 text-xs">
          {[
            { id: "dashboard", label: "Overview & Dashboard", icon: Compass },
            { id: "queues", label: "Concert Reservation Queue", icon: Timer, badge: "LIVE" },
            { id: "reservations", label: "Active Lock Reservations", icon: ShieldCheck, count: bookings.length },
            { id: "payments", label: "My Payment Schedules", icon: CreditCard },
            { id: "documents", label: "KYC & Land Title Docs", icon: FileText }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setBuyerSubTab(item.id as any)}
              className={`flex items-center justify-between px-4 py-3 rounded-lg font-bold uppercase tracking-wider transition-all ${
                buyerSubTab === item.id
                  ? "bg-neutral-950 text-white shadow-md"
                  : "text-neutral-500 hover:bg-stone-50 hover:text-neutral-950"
              }`}
            >
              <div className="flex items-center gap-2">
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-red-500 text-white px-2 py-0.5 rounded text-[9px] font-mono font-bold animate-pulse">
                  {item.badge}
                </span>
              )}
              {item.count !== undefined && item.count > 0 && (
                <span className="bg-stone-100 border border-stone-200 text-neutral-800 px-2 py-0.5 rounded text-[10px]">
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Dynamic Trust Card badge */}
        <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white p-4 rounded-2xl border border-emerald-800 space-y-2 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-white/5 blur-xl rounded-full" />
          <strong className="text-xs font-bold block flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Escrow Balance Approved
          </strong>
          <p className="text-[10px] text-stone-300 leading-normal font-medium">
            PropSphere certified pre-clearance with local land registry. Direct bank trust guarantees in working orders.
          </p>
        </div>
      </aside>

      {/* Main Content Pane (9 cols) */}
      <main className="lg:col-span-9 space-y-8">
        
        {/* ================= PORTAL COMPONENT: OVERVIEW DASHBOARD ================= */}
        {buyerSubTab === "dashboard" && (
          <div className="space-y-8">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-neutral-950 tracking-tight">
                  Welcome Back, {currentUser ? currentUser.username.split(" ")[0] : "Caleb"}!
                </h2>
                <p className="text-xs text-neutral-500 font-mono">Verified Portfolio Space Overview</p>
              </div>
              <div className="bg-white px-4 py-2 rounded-2xl border border-stone-200 text-xs font-semibold text-neutral-600">
                Local EAT Time: <strong>{new Date().toLocaleTimeString()}</strong>
              </div>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
                <span className="text-[10px] text-neutral-400 uppercase font-mono block">Capital Hold Deposit</span>
                <strong className="text-2xl font-black text-neutral-900">$7,500 <span className="text-xs text-neutral-400">USD</span></strong>
                <p className="text-[10px] text-emerald-600 font-medium font-mono">● Safe inside secure escrow vault</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
                <span className="text-[10px] text-neutral-400 uppercase font-mono block">Locked Inventory Units</span>
                <strong className="text-2xl font-black text-neutral-900">{bookings.length} Units</strong>
                <p className="text-[10px] text-neutral-500 font-medium font-mono">1 Studio, 1 Duplex Executive</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
                <span className="text-[10px] text-neutral-400 uppercase font-mono block">Acquisition ROI Yield</span>
                <strong className="text-2xl font-black text-neutral-900">11.8% <span className="text-xs text-neutral-400">Average</span></strong>
                <p className="text-[10px] text-green-600 font-mono font-bold">★ Outperforming direct stocks</p>
              </div>
            </div>

            {/* Live Queue Alerts Banner */}
            {queueStatus.active && queueStatus.timeLeft > 0 && (
              <div className="bg-neutral-950 text-white p-5 rounded-2xl border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400 text-neutral-950 flex items-center justify-center font-black animate-spin" style={{ animationDuration: "12s" }}>
                    <Timer className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-400 font-mono block uppercase">Interactive Reservation Queue Lock</span>
                    <strong className="text-base font-bold text-white block">Checkout Timer for Unit {queueStatus.reservedUnit.number} ({queueStatus.reservedUnit.project})</strong>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] text-neutral-500 block uppercase font-mono">Reserve Hold Timer</span>
                    <strong className="text-xl font-mono text-red-500 font-black">{formatTime(queueStatus.timeLeft)}</strong>
                  </div>
                  <button 
                    onClick={() => setBuyerSubTab("queues")}
                    className="bg-amber-400 hover:bg-amber-300 text-neutral-950 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider"
                  >
                    Hold Checkout
                  </button>
                </div>
              </div>
            )}

            {/* Portfolio Projects Cards */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
              <strong className="text-xs uppercase font-mono tracking-wider text-neutral-400 block">Personal Favorites & Monitored Projects</strong>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projects.filter(p => favorites.includes(p.id)).map(p => (
                  <div key={p.id} className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex gap-4 hover:border-amber-400 transition-colors">
                    <div className="w-20 h-20 bg-stone-300 rounded-xl overflow-hidden shrink-0">
                      <img src={p.virtualTourMedia.livingRoom} alt={`${p.name} - Luxury ${p.type || "Apartment"} in ${p.location}`} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col justify-between">
                      <div>
                        <strong className="text-sm font-bold text-neutral-950 block">{p.name}</strong>
                        <span className="text-xs text-neutral-500 block">{p.location}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="bg-white border border-stone-200 text-[10px] font-bold text-stone-600 px-2 py-0.5 rounded">
                          ★ ROI {p.roiRentalYield}
                        </span>
                        <button 
                          onClick={() => { onSelectProject(p.id); onNavigateToTab("portfolio"); }}
                          className="text-[10px] text-amber-600 font-bold hover:underline"
                        >
                          View Twin model
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic AI Advisor Quick Box */}
            <div className="bg-amber-400/5 p-6 rounded-3xl border border-amber-400/20 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
              <div className="sm:col-span-8 space-y-2">
                <span className="text-xs font-mono font-bold tracking-widest text-amber-500 uppercase flex items-center gap-1">
                  <Sparkles className="w-4 h-4 fill-current" /> PropSphere Buyer AI Matcher
                </span>
                <strong className="text-base text-neutral-950 block">Tailor fits matching Caleb's $150k budget criteria</strong>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Our Gemini API models analyzed Westlands duplex grids. We unlocked a private 2-bedroom with premium green-compliance balcony details inside Westlands Heights showing superior capital compound.
                </p>
              </div>

              <div className="sm:col-span-4">
                <button 
                  onClick={() => onNavigateToTab("matchmaker")}
                  className="w-full bg-neutral-950 hover:bg-stone-850 text-white font-bold text-xs py-3 rounded-xl uppercase tracking-wider text-center flex items-center justify-center gap-1.5"
                >
                  Configure Matchmaker <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ================= PORTAL COMPONENT: CONCERT TICKET LOCK QUEUE ================= */}
        {buyerSubTab === "queues" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-wider">The PropSphere Concert-Ticket Engine</span>
                  <h2 className="text-2xl font-black text-neutral-950 tracking-tight">Active Reservation Waiting Queue</h2>
                </div>
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-mono font-bold animate-pulse">
                  HIGH VELOCITY LAUNCH IN PROGESS
                </span>
              </div>

              {/* Concert Lock Diagram */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
                
                {/* Visual Timer and position card (5 cols) */}
                <div className="lg:col-span-5 bg-neutral-950 text-white p-6 rounded-2xl border border-neutral-800 space-y-4 text-center relative overflow-hidden">
                  <div className="absolute right-0 top-0 bottom-0 w-16 bg-red-500/10 blur-xl rounded-full" />
                  
                  <span className="text-[10px] font-mono font-bold text-amber-400 block uppercase tracking-widest">Queue Hold Certificate</span>
                  
                  <div>
                    <span className="text-neutral-500 text-[10px] block font-mono uppercase">User Position</span>
                    <strong className="text-5xl font-mono font-black text-white"># {queueStatus.userPosition}</strong>
                    <span className="text-emerald-400 text-xs mt-1 block font-bold font-mono">✓ NEXT IN LINE FOR RESERVATION CHAT</span>
                  </div>

                  <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-800">
                    <span className="text-neutral-500 text-[10px] block font-mono">Time Left to Finalize Checkout</span>
                    <strong className="text-2xl font-mono text-amber-400 font-extrabold">{formatTime(queueStatus.timeLeft)}</strong>
                    <span className="text-[9px] text-neutral-500 block">If checkout fails to complete, unit is released instantly.</span>
                  </div>

                  <span className="text-[10px] text-neutral-400 block border-t border-neutral-900 pt-3 italic font-semibold">
                    Status: {queueStatus.statusText}
                  </span>
                </div>

                {/* Queue simulation timeline explanation (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                  <h4 className="text-sm font-black uppercase text-neutral-950">How queues prevent real estate over-selling:</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Premium studio suites of off-plan towers are subject to rapid cash demand (frequently 20 buyers bidding on a single premium unit block). The Concert-Ticket Hold engine guarantees that when you click a unit block:
                  </p>

                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between font-bold">
                      <span className="text-neutral-800">1. Private Reservation Guarantee</span>
                      <span className="text-amber-500">Secure Hold Locked</span>
                    </div>
                    <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between font-bold">
                      <span className="text-neutral-800">2. Fully Certified Registry Records</span>
                      <span className="text-neutral-500">10-Minute window enabled</span>
                    </div>
                    <div className="p-3 bg-stone-100 border border-stone-250 rounded-xl flex items-center justify-between font-bold">
                      <span className="text-neutral-800 font-mono">3. Fallback Queue Automation</span>
                      <span className="text-neutral-400 text-[10px]">Ready to pass to User #2</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={() => alert("Simulated 2% Hold lock fee checked and verified. Unit Reserved")}
                      className="bg-neutral-950 hover:bg-stone-850 text-white font-bold text-xs uppercase px-5 py-3 rounded-lg flex-1 text-center"
                    >
                      Process hold deposit
                    </button>
                    <button 
                      onClick={() => {
                        setQueueStatus(prev => ({
                          ...prev,
                          timeLeft: 5,
                          statusText: "Expiring timer mock..."
                        }));
                      }}
                      className="border border-dashed border-stone-300 hover:bg-stone-50 text-stone-600 font-bold text-xs uppercase px-4 py-3 rounded-lg"
                    >
                      Simulate Timeout expiry
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* ================= UNIT BATTLE CHAMEBER MINI WIDGET ================= */}
            <div className="bg-neutral-950 text-white p-6 rounded-3xl border border-neutral-800 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <div>
                  <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider block">Signature Gamification Chamber</span>
                  <strong className="text-xl font-extrabold tracking-tight block">Unit Battle™: Kilimani block K-203</strong>
                </div>
                <span className="bg-amber-400 text-neutral-950 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 shrink-0">
                  <Flame className="w-3.5 h-3.5" /> FLASH CONTEXT ACTIVE
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Battle chamber state card (7 cols) */}
                <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 p-5 rounded-2xl flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-neutral-800 font-mono">
                      <span className="text-neutral-400 text-[10px] uppercase">Battle Timer Remaining:</span>
                      <strong className="text-rose-500 font-bold ml-2 text-xl">{battleTimer}s left</strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-neutral-400 block font-mono">CURRENT TOP CONVERSION VALUE</span>
                        <strong className="text-3xl font-black font-mono text-amber-400">${currentBattleBid.toLocaleString()} USD</strong>
                      </div>
                      <span className="text-[10px] bg-red-650 px-2 py-0.5 rounded font-bold tracking-widest text-[#FFF]">
                        4 Active Bidders
                      </span>
                    </div>

                    {/* Waitlist history list */}
                    <div className="space-y-2 pt-2 text-[11px] font-mono">
                      {battleWaiters.map((w, idx) => (
                        <div key={idx} className="bg-black/30 px-3.5 py-2 rounded-lg border border-neutral-800/80 flex items-center justify-between">
                          <span className="text-neutral-300 font-semibold flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> {w.name} [{w.flag}]
                          </span>
                          <strong className="text-white">${w.bid.toLocaleString()}</strong>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-neutral-800">
                    <button 
                      onClick={handlePlaceBattleBid}
                      className="w-full bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black text-xs uppercase py-3 rounded-xl shadow shadow-amber-400/15"
                    >
                      Increment Bid Lock Block (+$1,000)
                    </button>
                    <p className="text-[9px] text-neutral-500 text-center mt-2">
                      Instant hold placement overrides current holder. Bids signify actual committed escrow pre-auth holds.
                    </p>
                  </div>
                </div>

                {/* Developer rules sidebar (5 cols) */}
                <div className="lg:col-span-5 bg-neutral-950 border border-neutral-800/80 p-5 rounded-2xl flex flex-col justify-between">
                  <div className="space-y-3">
                    <strong className="text-xs uppercase font-mono tracking-widest text-neutral-400 block leading-none">The Gamification Formula</strong>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      For high-demand penthouses or unique botanical sky-gardens, developers can activate "Unit Battle™" slots during Friday Drops. Bidders join locked waiting rooms, pre-authorizing hold deposits. Over 65% of units are cleared within 3 minutes of drop launch.
                    </p>
                    <div className="bg-neutral-900 border border-neutral-820 p-3 rounded-xl font-mono text-[10px] text-neutral-400">
                      ★ <strong>Conversion Rate Spike:</strong> +213% faster sales velocity on premium suites compared to standard portals.
                    </div>
                  </div>

                  <div className="text-[11px] text-neutral-500 font-semibold italic pt-4">
                    ● Monitored directly under Escrow Regulations
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ================= PORTAL COMPONENT: RESERVATIONS PANE ================= */}
        {buyerSubTab === "reservations" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
              <div>
                <h3 className="text-lg font-black text-neutral-950 uppercase tracking-tight">Active Lock Reservations</h3>
                <p className="text-xs text-neutral-500">Your authorized secure holdings on PropSphere.</p>
              </div>

              {bookings.length === 0 ? (
                <div className="text-center py-12 space-y-3 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                  <Building2 className="w-8 h-8 text-stone-400 mx-auto" />
                  <p className="text-xs text-neutral-500">No active lock-reservations registered in this session.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking, idx) => (
                    <div key={idx} className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-150 pb-3">
                        <div>
                          <strong className="text-sm font-black text-neutral-950 block">{booking.projectName} • Unit {booking.unitNumber}</strong>
                          <span className="text-[10px] text-neutral-500 block font-mono">Date: {booking.date}</span>
                        </div>
                        <span className="bg-emerald-100 text-emerald-800 font-mono font-bold text-[9px] px-2.5 py-0.5 rounded border border-emerald-200 uppercase self-start">
                          Status: {booking.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                        <div>
                          <span className="text-neutral-400 block">Payment Option</span>
                          <strong className="text-neutral-950">{booking.paymentPlan}</strong>
                        </div>
                        <div>
                          <span className="text-neutral-400 block">Locked Hold (2%)</span>
                          <strong className="text-emerald-600 font-mono font-bold">${booking.bookingFeePaid.toLocaleString()} USD</strong>
                        </div>
                        <div>
                          <span className="text-neutral-400 block">KYC Certified</span>
                          <strong className="text-neutral-950 uppercase font-mono">{booking.documentsSigned ? "Verified" : "Pending Signature"}</strong>
                        </div>
                        <div>
                          <span className="text-neutral-400 block">Fractional Deed ID</span>
                          <strong className="text-stone-500 font-mono font-semibold">{booking.id}</strong>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= PORTAL COMPONENT: PAYMENTS PANE ================= */}
        {buyerSubTab === "payments" && (
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-black text-neutral-950 uppercase tracking-tight">Standard Ledger Payment Schedules</h3>
              <p className="text-xs text-neutral-500">Monitor installment plans, verified pre-sales compound margins, and bank transfers.</p>
            </div>

            <div className="space-y-4">
              {[
                { stage: "Stage 1: Holding Lock fee", val: 2500, due: "Completed", status: "CLEARED OUT OF ESCROW", color: "border-l-emerald-500" },
                { stage: "Stage 2: 20% Base Construction Deposit", val: 24000, due: "Within 14 Days", status: "AWAITING REGISTER", color: "border-l-amber-500" },
                { stage: "Stage 3: 60% Linear Construction installments", val: 72000, due: "Spread over 24 Months", status: "SCHEDULED FOR hand-over", color: "border-l-stone-300" },
                { stage: "Stage 4: Handover Completion Release (20%)", val: 24000, due: "On Key Turnover", status: "RESERVE", color: "border-l-stone-150" }
              ].map((item, idx) => (
                <div key={idx} className={`bg-stone-50 p-4 rounded-xl border border-stone-200 border-l-4 ${item.color} flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs`}>
                  <div>
                    <strong className="text-neutral-900 block">{item.stage}</strong>
                    <span className="text-[10px] text-neutral-500 block font-mono">Scheduled Frame: {item.due}</span>
                  </div>
                  <div className="text-right flex flex-col items-end uppercase font-mono font-bold">
                    <span className="text-neutral-950 font-black text-base">${item.val.toLocaleString()} USD</span>
                    <span className="text-[9px] text-neutral-400 font-extrabold">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-800 leading-relaxed font-mono flex gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <strong>Client Escrow Safeguard Guard Active:</strong> All installment transfers go straight into partnering regional trust banks accounts, locked against legal developers construction heights certificates.
              </div>
            </div>
          </div>
        )}

        {/* ================= PORTAL COMPONENT: DOCUMENTS ================= */}
        {buyerSubTab === "documents" && (
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-black text-neutral-950 uppercase tracking-tight">Durable Land Title Records & KYC</h3>
              <p className="text-xs text-neutral-500">Access pre-registered fractional deeds, escrow receipts, and ID verifications.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: "Nairobi County approved site plan blueprint", type: "PDF Blueprint", date: "April 2026", status: "Verified verified" },
                { name: "Fractional Escrow hold Deed contract draft", type: "PDF Contract", date: "June 2026", status: "Pre-signed by legal" },
                { name: "Verified Passport/ID Main KYC file upload", type: "User file", date: "June 2026", status: "Under approval reviews" },
                { name: "Regulated bank digital escrow receipts", type: "PDF receipt", date: "June 2026", status: "Cleared receipt" }
              ].map((doc, idx) => (
                <div key={idx} className="bg-stone-50 p-4 rounded-xl border border-stone-200 flex items-center justify-between text-xs hover:border-amber-400 transition-colors">
                  <div className="space-y-1">
                    <strong className="text-neutral-950 block">{doc.name}</strong>
                    <span className="text-[10px] text-neutral-400 font-mono">{doc.type} • Date: {doc.date}</span>
                  </div>
                  <span className="bg-stone-200/80 text-stone-700 text-[9px] font-mono px-2 py-0.5 rounded shrink-0 font-bold">
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-neutral-500 text-center italic font-semibold">
              PropSphere organizes county cadastral surveys directly with county land registries inside Westlands corridor.
            </p>
          </div>
        )}

      </main>

    </div>
  );
}
