import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Clock, Play, Users, MessageSquare, Flame, ShieldCheck, Ticket, Sparkles, Send } from "lucide-react";

interface PropDropsEventProps {
  activityLogs: Array<{ id: string; time: string; type: string; text: string }>;
  onSelectUnit: (projectName: string, unitNumber: string) => void;
  homepageSettings?: any;
}

export default function PropDropsEvent({ activityLogs, onSelectUnit, homepageSettings }: PropDropsEventProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [liveQueue, setLiveQueue] = useState(1342);
  const [soldCounter, setSoldCounter] = useState(14);
  const [chatMessages, setChatMessages] = useState([
    { id: "cm-1", user: "Moses Mwangi", text: "Westlands duplex yields are insane right now, just booked!", badge: "VIP Buyer" },
    { id: "cm-2", user: "Sophia Al-Amin", text: "Are foreigners eligible for the 5% cash discount?", badge: "Investor" },
    { id: "cm-3", user: "David Kipkorir", text: "Waiting for Floor 3 Sky Gardens release at exactly 3:00!", badge: "Member" },
    { id: "cm-4", user: "Admin_PropSphere", text: "Welcome to Prop Drops! 3 units left of VIP Penhouse.", badge: "Host" }
  ]);
  const [customMsg, setCustomMsg] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Countdown timer calculations for closest next Friday 3:00 PM EAT (UTC+3)
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      // Adjust to EAT (UTC + 3)
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const eatDate = new Date(utc + (3600000 * 3));

      let nextFriday = new Date(eatDate);
      nextFriday.setDate(eatDate.getDate() + (5 - eatDate.getDay() + 7) % 7);
      nextFriday.setHours(15, 0, 0, 0);

      // If nextFriday possesses passed today's Friday 3 PM, push to next week
      if (eatDate.getTime() > nextFriday.getTime()) {
        nextFriday.setDate(nextFriday.getDate() + 7);
      }

      const diff = nextFriday.getTime() - eatDate.getTime();
      
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulate evolving live queue and active chat simulation
  useEffect(() => {
    const queueInterval = setInterval(() => {
      setLiveQueue(prev => prev + Math.floor(Math.random() * 7) - 3);
    }, 4000);

    const simulationComments = [
      "Any studios remaining in Tower A?",
      "Just wired the lock deposit for Unit A-201!",
      "Edge green certified energy means massive power savings. Love Westlands Heights",
      "Is Kilimani fully complete? Can I move in by next month?",
      "96% AI recommendations match is incredibly accurate",
      "Who is the lead host today?",
      "The virtual tour 360 view of the balcony is spectacular!",
      "I am joined from London, capital appreciation rates are outstanding compared to UK",
      "Kenya off-plan is the future"
    ];

    const names = ["Kamau O.", "Nadia Ahmed", "Wycliffe S.", "Clara N.", "Brian Langat", "Tariq K.", "Fatma Z."];
    const badges = ["VIP Buyer", "Investor", "Member", "Elite Agent"];

    const chatInterval = setInterval(() => {
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomText = simulationComments[Math.floor(Math.random() * simulationComments.length)];
      const randomBadge = badges[Math.floor(Math.random() * badges.length)];
      
      setChatMessages(prev => [
        ...prev.slice(-15), // keep last 15
        { id: `cm-sim-${Date.now()}`, user: randomName, text: randomText, badge: randomBadge }
      ]);

      // occasionally trigger a simulated purchase
      if (Math.random() > 0.7) {
        setSoldCounter(prev => prev + 1);
      }
    }, 4500);

    return () => {
      clearInterval(queueInterval);
      clearInterval(chatInterval);
    };
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMsg.trim()) return;
    setChatMessages(prev => [
      ...prev,
      { id: `cm-custom-${Date.now()}`, user: "You (Verified Buyer)", text: customMsg, badge: "Buyer" }
    ]);
    setCustomMsg("");
  };

  return (
    <div id="prop-drops-section" className="bg-neutral-900 text-white rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden border border-neutral-800">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header and countdown banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-neutral-800 relative z-10">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-mono tracking-widest font-semibold uppercase mb-3">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Prop Drops™ Signature Event
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Every Friday <span className="text-amber-400">3:00 PM EAT</span>
          </h2>
          <p className="text-neutral-400 mt-1 max-w-xl text-sm">
            Nairobi's ultimate off-plan apartment releases. Unlock exclusive early-bird developer pricing, limited inventory, and live reservations.
          </p>
        </div>

        {/* Real-time CountDown Block */}
        <div className="bg-neutral-950/60 backdrop-blur-md border border-neutral-800 p-4 rounded-2xl flex items-center gap-4 md:gap-6 self-start lg:self-auto shadow-inner">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: "12s" }} />
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Next Release In</span>
          </div>
          <div className="flex gap-3">
            {[
              { label: "D", val: timeLeft.days },
              { label: "H", val: timeLeft.hours },
              { label: "M", val: timeLeft.minutes },
              { label: "S", val: timeLeft.seconds }
            ].map((col, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="text-xl md:text-2xl font-mono font-bold text-white bg-neutral-900 border border-neutral-800 px-2.5 py-1 rounded-lg shadow min-w-[3rem] text-center">
                  {String(col.val).padStart(2, "0")}
                </span>
                <span className="text-[10px] text-neutral-500 font-semibold mt-1 uppercase tracking-wider">{col.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Broadcast Center Grid: Live stream simulated screen + Live Chat feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8 relative z-10">
        
        {/* Main Stream Window (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="relative rounded-2xl overflow-hidden aspect-video bg-neutral-950 border border-neutral-800 group shadow-lg">
            
            {/* Real drone background simulator */}
            <iframe
              className="w-full h-full object-cover pointer-events-none opacity-50 absolute inset-0 mix-blend-lighten"
              src={homepageSettings?.dropBroadcastVideoUrl || "https://www.youtube.com/embed/gEPXb0F0vmo?autoplay=1&mute=1&controls=0&loop=1&playlist=gEPXb0F0vmo"}
              title="Drone Walkthrough"
              frameBorder="0"
              allow="autoplay; encrypted-media"
            />

            {/* Static high-end real-estate fallback visualization */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80 flex flex-col justify-between p-6">
              
              {/* Broadcast Badges */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <span className="bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1 animate-pulse">
                    <Play className="w-2.5 h-2.5 fill-current" /> LIVE LAUNCH
                  </span>
                  <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-white/10">
                    <Users className="w-3.5 h-3.5 text-blue-400" /> {liveQueue} waiting
                  </span>
                </div>
                
                <span className="bg-amber-400/90 text-neutral-950 text-xs font-mono font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1 hover:scale-105 transition-transform">
                  <Flame className="w-3.5 h-3.5" /> FLASH DISCOUNT ACTIVE
                </span>
              </div>

              {/* Central play trigger simulated */}
              <div className="self-center flex flex-col items-center gap-3 text-center opacity-90 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="w-16 h-16 rounded-full bg-amber-400 text-neutral-900 flex items-center justify-center shadow-lg shadow-amber-400/20 hover:scale-110 transition-transform cursor-pointer">
                  <Play className="w-6 h-6 fill-current translate-x-0.5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Sky Gardens Launch Presentation</h3>
                  <p className="text-xs text-neutral-300">Live with Premium Spaces Developer team</p>
                </div>
              </div>

              {/* Bottom control Overlay */}
              <div className="flex items-center justify-between text-xs text-neutral-300 bg-neutral-950/75 p-3 rounded-xl border border-white/5 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <strong className="text-white">Active Launch:</strong>
                  <span className="text-amber-400 font-semibold text-xs">Tower A & B Duplex suites (Special Early-bird Discounts)</span>
                </div>
                <div className="flex items-center gap-1 text-green-400 font-mono font-bold">
                  <Ticket className="w-4 h-4 animate-bounce" /> {soldCounter} Units Sold Today
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof Alerts Banner */}
          <div className="bg-neutral-950/80 rounded-xl p-4 border border-neutral-800 flex items-center justify-between text-xs relative overflow-hidden shadow">
            <span className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />
            <div className="flex items-center gap-2 overflow-hidden w-full">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
              <div className="overflow-hidden whitespace-nowrap text-ellipsis text-neutral-300 font-mono">
                <span className="text-white font-semibold uppercase mr-2">[LIVE DEALS TICKER]</span>
                {activityLogs[0]?.text || "Queue is currently active. 4 units of Sky Gardens Duplexes are on high demand."}
              </div>
            </div>
            <span className="text-neutral-500 text-[10px] font-semibold tracking-wider font-mono uppercase bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded ml-2 shrink-0">
              EAT 15:32
            </span>
          </div>
        </div>

        {/* Live Chat System (4 cols) */}
        <div className="lg:col-span-4 bg-neutral-950/60 backdrop-blur-md rounded-2xl border border-neutral-800 flex flex-col justify-between h-[400px] overflow-hidden shadow-lg">
          
          <div className="px-4 py-3 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
            <span className="font-semibold text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-400" /> Live Event Chat
            </span>
            <span className="text-[10px] font-mono font-bold bg-neutral-900 text-neutral-400 border border-neutral-800 px-2 py-1 rounded">
              AUTO ACCELERATING
            </span>
          </div>

          {/* Messages window */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-2 text-xs scrollbar-thin scrollbar-thumb-neutral-800">
            <AnimatePresence initial={false}>
              {chatMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-neutral-900/40 border border-neutral-800/60 p-2.5 rounded-lg flex flex-col gap-1 shadow-sm"
                >
                  <div className="flex items-center gap-2 justify-between">
                    <strong className="text-neutral-200 text-xs font-semibold">{msg.user}</strong>
                    <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border ${
                      msg.badge === "Host" 
                        ? "bg-red-500/10 text-red-400 border-red-500/20" 
                        : msg.badge === "VIP Buyer"
                        ? "bg-amber-400/10 text-amber-400 border-amber-400/20"
                        : "bg-neutral-800 text-neutral-400 border-neutral-700"
                    }`}>
                      {msg.badge}
                    </span>
                  </div>
                  <p className="text-neutral-300 font-medium leading-relaxed">{msg.text}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Submit form */}
          <form onSubmit={handleSendChat} className="p-3 bg-neutral-950 border-t border-neutral-850 flex gap-2">
            <input
              type="text"
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              placeholder="Join Kenya's launch conversation..."
              className="flex-1 bg-neutral-900 text-white rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-amber-400 outline-none border border-neutral-800"
            />
            <button
              type="submit"
              className="bg-amber-400 text-neutral-950 p-1.5 rounded-lg hover:bg-amber-300 font-bold transition-all shrink-0 shadow shadow-amber-400/20"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>

      </div>

      {/* Trust guarantees footer badges */}
      <div className="flex flex-wrap items-center gap-y-4 gap-x-8 mt-6 pt-6 border-t border-neutral-800/60 text-xs text-neutral-400 relative z-10">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-green-400" /> Escrow Backed Security (100% Guaranteed Deposits)
        </span>
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-400" /> Verified Land Title registries
        </span>
        <span className="flex items-center gap-1.5">
          <Ticket className="w-4 h-4 text-blue-400" /> EDGE Green-Compliant Certifications
        </span>
      </div>
    </div>
  );
}
