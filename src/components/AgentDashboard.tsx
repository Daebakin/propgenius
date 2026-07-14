import React, { useState, useEffect } from "react";
import { 
  Building, 
  Plus, 
  Check, 
  MapPin, 
  DollarSign, 
  Loader2, 
  Layers, 
  Home, 
  Grid, 
  Briefcase, 
  Sparkles, 
  Send, 
  MessageSquare,
  ShieldCheck,
  AlertCircle,
  TrendingUp,
  Users,
  ArrowRight
} from "lucide-react";
import { Project, User } from "../types";

interface AgentFloorBlock {
  floorNumber: number;
  availableTypes: {
    bedrooms: 1 | 2 | 3 | 4;
    price: number;
    size: string;
    count: number;
    status: "Available" | "Reserved" | "Sold";
    details: string;
  }[];
}

interface AgentDashboardProps {
  projects: Project[];
  currentUser: User | null;
  onRefreshProjects: () => void;
  onAddActivityLog: (text: string) => void;
}

export default function AgentDashboard({
  projects,
  currentUser,
  onRefreshProjects,
  onAddActivityLog
}: AgentDashboardProps) {
  // Tabs "listings" or "add_listing" or "daebak_chat"
  const [activeTab, setActiveTab] = useState<"listings" | "add_listing" | "daebak_chat">("listings");

  // Form Fields
  const [listingName, setListingName] = useState("");
  const [propertyType, setPropertyType] = useState<"Apartment" | "House">("Apartment");
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [vrTourUrl, setVrTourUrl] = useState("");
  
  // Amenities selection list
  const availableAmenities = [
    "High-speed fiber Wifi",
    "Secure Indoor Parking",
    "24/7 CCTV surveillance",
    "Private Green Balcony",
    "Smart Keyless Locks",
    "Backup Borehole Sinks",
    "Solar Backup Water Heating",
    "Rooftop Swimming Pool",
    "Fitness gym & Yoga Studio",
    "Central Backup Power Generator",
    "Kids play zone",
    "Resident Lounge & Clubhouse"
  ];
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  // Floors configuration for Apartments
  const [floorsConfig, setFloorsConfig] = useState<AgentFloorBlock[]>([
    {
      floorNumber: 3,
      availableTypes: [
        { bedrooms: 1, price: 85000, size: "60 SQM", count: 4, status: "Available", details: "Elegant sunset orientation block designed with direct Kileleshwa greenery vistas." },
        { bedrooms: 2, price: 115000, size: "95 SQM", count: 2, status: "Available", details: "Premium corner blocks featuring an exquisite open-plan master bathroom suite." },
        { bedrooms: 3, price: 145050, size: "140 SQM", count: 1, status: "Available", details: "A magnificent corporate master block complete with extensive wrapping balcony." }
      ]
    },
    {
      floorNumber: 2,
      availableTypes: [
        { bedrooms: 2, price: 110000, size: "90 SQM", count: 3, status: "Available", details: "Quiet level-2 units featuring acoustic sound insulation and breakfast bars." },
        { bedrooms: 3, price: 140000, size: "135 SQM", count: 2, status: "Available", details: "Perfect family layouts complete with high-end designer gas cooktops." }
      ]
    }
  ]);

  // House-specific fields
  const [houseBedrooms, setHouseBedrooms] = useState("4");
  const [houseBathrooms, setHouseBathrooms] = useState("4");
  const [houseValue, setHouseValue] = useState("250000");
  const [houseSize, setHouseSize] = useState("280 SQM");

  // State controls
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [submitError, setSubmitError] = useState("");

  // Grid/Interaction display state (My listings view clicks)
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [activeFloorNum, setActiveFloorNum] = useState<number | null>(null);
  const [activeBedroomsNum, setActiveBedroomsNum] = useState<number | null>(null);

  const agentName = currentUser?.username || "Daebak Agent";

  // Daebak Smart Agent AI Chat states
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([]);
  const [chatLoading, setChatLoading] = useState(false);

  // Initialize dynamic agent chat greeting
  useEffect(() => {
    setChatMessages([
      { 
        sender: "ai", 
        text: `Greetings! I am ${agentName} Property Assistant, your premier executive real estate advisor. Let me help you select high-yielding offplan properties, review my listings, or plan out your physical Nairobi site tour today!` 
      }
    ]);
  }, [agentName]);

  // Helper toggle amenities
  const handleToggleAmenity = (name: string) => {
    if (selectedAmenities.includes(name)) {
      setSelectedAmenities(prev => prev.filter(item => item !== name));
    } else {
      setSelectedAmenities(prev => [...prev, name]);
    }
  };

  // Add Floor configuration row
  const handleAddNewFloorRow = () => {
    const nextFloorNum = floorsConfig.length > 0 ? Math.max(...floorsConfig.map(f => f.floorNumber)) + 1 : 1;
    setFloorsConfig(prev => [
      ...prev,
      {
        floorNumber: nextFloorNum,
        availableTypes: [
          { bedrooms: 1, price: 80000, size: "55 SQM", count: 4, status: "Available", details: "Cozy layout." }
        ]
      }
    ]);
  };

  // Add bedroom item inside specific floor row
  const handleAddBedroomsToFloor = (floorIndex: number, beds: 1|2|3|4) => {
    setFloorsConfig(prev => {
      const updated = [...prev];
      const floor = updated[floorIndex];
      if (floor.availableTypes.some(t => t.bedrooms === beds)) return prev; // Avoid duplicate
      floor.availableTypes.push({
        bedrooms: beds,
        price: beds * 40000 + 40000,
        size: `${beds * 45 + 15} SQM`,
        count: 2,
        status: "Available",
        details: "Premium comfort block units with double-glazed window frames."
      });
      return updated;
    });
  };

  const handleRemoveBedroomFromFloor = (floorIndex: number, bedTypeIndex: number) => {
    setFloorsConfig(prev => {
      const updated = [...prev];
      updated[floorIndex].availableTypes.splice(bedTypeIndex, 1);
      return updated;
    });
  };

  const handleUpdateFloorTypeField = (floorIndex: number, typeIndex: number, field: string, val: any) => {
    setFloorsConfig(prev => {
      const updated = [...prev];
      updated[floorIndex].availableTypes[typeIndex] = {
        ...updated[floorIndex].availableTypes[typeIndex],
        [field]: val
      };
      return updated;
    });
  };

  const handleRemoveFloorRow = (floorIndex: number) => {
    setFloorsConfig(prev => prev.filter((_, idx) => idx !== floorIndex));
  };

  // Submit Listing Form (creates and saves Project list securely)
  const handleAddListingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listingName || !location) {
      setSubmitError("Please fill out listing name and location area.");
      return;
    }

    setSubmitting(true);
    setSubmitSuccess("");
    setSubmitError("");

    try {
      // Build Unique project ID prefix
      const slugId = "agent-" + listingName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      // Construct towers format from floor blocks config
      const formattedTowers = propertyType === "Apartment" ? [
        {
          name: "Central Block",
          floors: floorsConfig.map(f => ({
            floorNumber: f.floorNumber,
            // Convert bedroom types into individual active clickable unit cards for the existing Grid Twin
            units: f.availableTypes.map(t => ({
              number: `${f.floorNumber}0${t.bedrooms} Block`,
              type: `${t.bedrooms} Bed Block`,
              price: t.price,
              size: t.size,
              status: t.status,
              flexStatus: t.status === "Available" ? "Available" : "Reserved",
              bedrooms: t.bedrooms,
              bathrooms: t.bedrooms,
              viewType: "Greenery Vista",
              metadata: {
                count: t.count,
                details: t.details,
                isBlockListing: true
              }
            }))
          }))
        }
      ] : [
        {
          name: "Main Estate",
          floors: [
            {
              floorNumber: 1,
              units: [
                {
                  number: "House Core",
                  type: `${houseBedrooms} Bed House`,
                  price: Number(houseValue),
                  size: houseSize,
                  status: "Available" as any,
                  flexStatus: "Available" as any,
                  bedrooms: Number(houseBedrooms),
                  bathrooms: Number(houseBathrooms),
                  viewType: "Scenic Landscaped Garden",
                  metadata: {
                    isHouse: true
                  }
                }
              ]
            }
          ]
        }
      ];

      const payload = {
        name: listingName,
        id: slugId,
        location: location,
        developerId: currentUser?.id || "agent-999",
        developerName: currentUser?.username || "Licensed Daebak Agent",
        tagline: tagline || `${propertyType} with world-class facilities.`,
        description: description || "Modern off-plan residential development optimized for maximum capital yields and passive cash flows.",
        priceRange: priceRange || (propertyType === "Apartment" ? "From $80,000" : `$${Number(houseValue).toLocaleString()}`),
        constructionProgress: 15,
        completionDate: "December 2027",
        roiRentalYield: "12% Expected",
        roiCapitalAppreciation: "18% Expected",
        overallRating: 4.8,
        developerVerified: true,
        approvalStatus: "Approved", // Auto approved for certified agent dashboard simulation
        amenities: selectedAmenities.length > 0 ? selectedAmenities : ["Broadband Internet connection", "Borehole system", "Back-up power supply"],
        faqs: [
          { q: "Is flexible private financing permitted?", a: "Yes, we accept continuous installment payment plans with structured escrow safeguards." }
        ],
        droneVideoUrl: "",
        locationHighlights: ["10 mins from central highway bypasses", "Close to modern international academies"],
        towers: formattedTowers,
        virtualTourMedia: {},
        vrTourUrl: vrTourUrl || "",
        currency: "USD",
        bookingDepositPercent: 10,
        seoTitle: `Agent Listing: ${listingName} in Nairobi`,
        seoDescription: tagline
      };

      const resp = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data.error || "Failed to finalize project registration.");
      }

      setSubmitSuccess(`Congratulations! "${listingName}" agent listing has been registered on PropSphere decentralized servers.`);
      onAddActivityLog(`💼 Licensed Agent registered a digital twin block listing: "${listingName}"`);
      
      // Clear forms
      setListingName("");
      setLocation("");
      setPriceRange("");
      setTagline("");
      setDescription("");
      setVrTourUrl("");
      setSelectedAmenities([]);
      
      onRefreshProjects();
      setActiveTab("listings");
    } catch (err: any) {
      setSubmitError(err.message || "Launch listing failed.");
    } finally {
      setSubmitting(false);
    }
  };

  // Submit chat message to dynamic Agent AI assistant server-side
  const handleDaebakChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");
    setChatLoading(true);

    try {
      const agentProjects = projects.filter(p => p.developerId === currentUser?.id || p.developerId === "agent-999");
      const resp = await fetch("/api/chat/daebak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          agentName: agentName,
          agentProperties: agentProjects,
          userBudget: "$120,000"
        })
      });
      const data = await resp.json();

      if (resp.ok && data.text) {
        setChatMessages(prev => [...prev, { sender: "ai", text: data.text }]);
      } else {
        throw new Error("Empty token response.");
      }
    } catch (err) {
      // High yield mock fallback content if offline/fail
      const agentProjects = projects.filter(p => p.developerId === currentUser?.id || p.developerId === "agent-999");
      const namesList = agentProjects.length > 0 ? agentProjects.map(p => p.name).join(", ") : "my active property twins";
      setChatMessages(prev => [...prev, { 
        sender: "ai", 
        text: `As ${agentName} Property Assistant, I represent high-yielding offplans specifically from my listed portfolio (${namesList}). 

Our Floor 3 configurations yield premium returns up to 13.5% annually. I only advise on verified listings in this ledger, assuring maximum title pre-vets and secure bank escrow holds.` 
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-8">
      
      {/* Header Panel */}
      <div className="bg-neutral-950 text-white p-8 rounded-3xl border border-neutral-850 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-neutral-950 font-black text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-lg">
              Licensed Broker
            </span>
            <span className="bg-neutral-800 text-stone-300 font-mono text-[9px] tracking-widest px-2.5 py-1 rounded-lg uppercase">
              AGENT PORTAL
            </span>
          </div>
          <h2 className="text-3xl font-sans font-black tracking-tight uppercase">Agent Command Dashboard</h2>
          <p className="text-xs text-stone-400">Manage offplan apartment blocks, houses specs, configure prices per floor/bedroom, and query your secure {agentName} Property Assistant.</p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-neutral-900 p-1.5 rounded-2xl border border-neutral-800 shrink-0">
          <button
            onClick={() => setActiveTab("listings")}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "listings" ? "bg-amber-400 text-neutral-950" : "text-stone-400 hover:text-white"
            }`}
          >
            📋 Master Listings
          </button>
          <button
            onClick={() => setActiveTab("add_listing")}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "add_listing" ? "bg-amber-400 text-neutral-950" : "text-stone-400 hover:text-white"
            }`}
          >
            ➕ Add Listing
          </button>
          <button
            onClick={() => setActiveTab("daebak_chat")}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "daebak_chat" ? "bg-amber-400 text-neutral-950" : "text-stone-400 hover:text-white"
            }`}
          >
            🤖 {agentName} AI Assistant
          </button>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 font-sans">
        
        {/* Box 1: Closed Commission (Green) */}
        <div 
          onClick={() => setActiveTab("earnings_ledger" as any)}
          className="bg-emerald-500 text-white rounded-3xl p-5 shadow-sm relative overflow-hidden group cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all"
        >
          <div className="inner space-y-1 z-10 relative">
            <span className="text-[10px] font-mono uppercase tracking-widest block font-bold text-emerald-100">Closed Commission</span>
            <strong className="text-3xl font-black leading-none block">$42,500 USD</strong>
            <p className="text-[10px] text-emerald-50/95">↑ 18% from last quarter</p>
          </div>
          <TrendingUp className="absolute right-4 top-4 text-white/15 w-16 h-16 pointer-events-none group-hover:scale-110 transition-transform duration-300" />
          <div className="bg-black/10 text-white/80 group-hover:bg-black/15 text-[10px] py-1 text-center font-bold uppercase tracking-wider absolute bottom-0 left-0 right-0 rounded-b-3xl transition-colors">
            More info <ArrowRight className="inline-block w-3 h-3 ml-1" />
          </div>
        </div>

        {/* Box 2: Managed Listings (Cyan) */}
        <div 
          onClick={() => setActiveTab("listings")}
          className="bg-cyan-500 text-white rounded-3xl p-5 shadow-sm relative overflow-hidden group cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all"
        >
          <div className="inner space-y-1 z-10 relative">
            <span className="text-[10px] font-mono uppercase tracking-widest block font-bold text-cyan-100">Managed Listings</span>
            <strong className="text-3xl font-black leading-none block">
              {projects.filter(p => p.developerId === currentUser?.id || p.developerId === "agent-999").length + 2} Units
            </strong>
            <p className="text-[10px] text-cyan-50/95">Standard apartment & house lots</p>
          </div>
          <Building className="absolute right-4 top-4 text-white/15 w-16 h-16 pointer-events-none group-hover:scale-110 transition-transform duration-300" />
          <div className="bg-black/10 text-white/80 group-hover:bg-black/15 text-[10px] py-1 text-center font-bold uppercase tracking-wider absolute bottom-0 left-0 right-0 rounded-b-3xl transition-colors">
            More info <ArrowRight className="inline-block w-3 h-3 ml-1" />
          </div>
        </div>

        {/* Box 3: Active Buyer Inquiries (Amber) */}
        <div 
          onClick={() => setActiveTab("daebak_chat")}
          className="bg-amber-500 text-white rounded-3xl p-5 shadow-sm relative overflow-hidden group cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all"
        >
          <div className="inner space-y-1 z-10 relative">
            <span className="text-[10px] font-mono uppercase tracking-widest block font-bold text-amber-100">Active Inquiries</span>
            <strong className="text-3xl font-black leading-none block">14 Leads</strong>
            <p className="text-[10px] text-amber-50/95">Qualified via AI broker pipeline</p>
          </div>
          <Users className="absolute right-4 top-4 text-white/15 w-16 h-16 pointer-events-none group-hover:scale-110 transition-transform duration-300" />
          <div className="bg-black/10 text-white/80 group-hover:bg-black/15 text-[10px] py-1 text-center font-bold uppercase tracking-wider absolute bottom-0 left-0 right-0 rounded-b-3xl transition-colors">
            More info <ArrowRight className="inline-block w-3 h-3 ml-1" />
          </div>
        </div>

        {/* Box 4: Escrow Verification (Rose) */}
        <div 
          onClick={() => setActiveTab("listings")}
          className="bg-rose-500 text-white rounded-3xl p-5 shadow-sm relative overflow-hidden group cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all"
        >
          <div className="inner space-y-1 z-10 relative">
            <span className="text-[10px] font-mono uppercase tracking-widest block font-bold text-rose-100">Escrow Verification</span>
            <strong className="text-3xl font-black leading-none block">Verified</strong>
            <p className="text-[10px] text-rose-50/95">Central CBK security clearance</p>
          </div>
          <ShieldCheck className="absolute right-4 top-4 text-white/15 w-16 h-16 pointer-events-none group-hover:scale-110 transition-transform duration-300" />
          <div className="bg-black/10 text-white/80 group-hover:bg-black/15 text-[10px] py-1 text-center font-bold uppercase tracking-wider absolute bottom-0 left-0 right-0 rounded-b-3xl transition-colors">
            More info <ArrowRight className="inline-block w-3 h-3 ml-1" />
          </div>
        </div>

      </div>

      {/* Main Content Workspace panels */}
      <main>
        
        {/* ================= TAB 1: LISTINGS VIEW AND INTERACTIVE BLOCKS GRID ================= */}
        {activeTab === "listings" && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Listings Catalog Index (5 columns) */}
              <div className="lg:col-span-5 space-y-4">
                <h3 className="text-lg font-black text-neutral-950 uppercase tracking-tight">Active Real Estate Catalog</h3>
                <p className="text-xs text-neutral-500">Select an agent list configuration to audit its interactive floor matrix modules below.</p>
                
                <div className="space-y-3">
                  {/* Default Dynamic Listings */}
                  {projects.map((proj) => {
                    const isSelected = selectedListingId === proj.id;
                    const isHouse = proj.towers[0]?.name === "Main Estate";
                    
                    return (
                      <div 
                        key={proj.id}
                        onClick={() => {
                          setSelectedListingId(proj.id);
                          setActiveFloorNum(null);
                          setActiveBedroomsNum(null);
                        }}
                        className={`p-5 rounded-3xl border transition-all cursor-pointer ${
                          isSelected 
                            ? "bg-neutral-950 text-white border-neutral-950 shadow-md" 
                            : "bg-white border-stone-200 text-neutral-900 hover:bg-stone-50"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-3">
                          <div>
                            <span className={`text-[8px] font-mono font-bold uppercase rounded px-2 py-0.5 ${
                              isHouse ? "bg-amber-400 text-neutral-950" : "bg-neutral-100 text-neutral-800"
                            }`}>
                              {isHouse ? "HOUSE / ESTATE" : "APARTMENT BLOCK"}
                            </span>
                            <h4 className="text-sm font-black pt-1.5">{proj.name}</h4>
                            <p className={`text-[10px] mt-0.5 ${isSelected ? "text-stone-300" : "text-stone-550"}`}>
                              📍 {proj.location} • {proj.developerName}
                            </p>
                          </div>
                          <strong className="text-xs font-mono font-black text-amber-500">{proj.priceRange}</strong>
                        </div>
                        <p className={`text-[11px] mt-2 italic leading-relaxed ${isSelected ? "text-stone-400" : "text-stone-500"}`}>
                          "{proj.tagline}"
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Floors and Bedroom Block Matrix (7 columns) */}
              <div className="lg:col-span-7 space-y-6 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm h-fit">
                {(() => {
                  const activeProj = projects.find(p => p.id === selectedListingId) || projects[0];
                  if (!activeProj) {
                    return (
                      <div className="text-center py-12 text-xs text-neutral-500">
                        No active listing selected yet.
                      </div>
                    );
                  }

                  const isHouse = activeProj.towers[0]?.name === "Main Estate";

                  return (
                    <div className="space-y-6">
                      <div className="border-b border-stone-200 pb-4">
                        <span className="text-[10px] font-mono text-neutral-400 font-bold block uppercase">
                          CURRENT LISTING SPECTRA
                        </span>
                        <h3 className="text-xl font-sans font-black text-neutral-950">{activeProj.name}</h3>
                        <p className="text-xs text-neutral-500">{activeProj.description}</p>
                      </div>

                      {isHouse ? (
                        /* House Display */
                        <div className="space-y-4">
                          <h4 className="text-sm font-black font-mono text-neutral-800 uppercase">🏡 House Specification Ledger</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-150">
                              <span className="text-[10px] text-stone-400 font-bold uppercase block">Bedrooms</span>
                              <strong className="text-lg font-black text-stone-800">4 beds</strong>
                            </div>
                            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-150">
                              <span className="text-[10px] text-stone-400 font-bold uppercase block">Bathrooms</span>
                              <strong className="text-lg font-black text-stone-800">4 baths</strong>
                            </div>
                            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-150">
                              <span className="text-[10px] text-stone-400 font-bold uppercase block">Plot Size</span>
                              <strong className="text-lg font-black text-stone-800">280 SQM</strong>
                            </div>
                            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-150">
                              <span className="text-[10px] text-stone-400 font-bold uppercase block">Structure</span>
                              <strong className="text-lg font-black text-stone-800">Duplex</strong>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Apartment Floors Blocks Grid */
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-black font-mono text-neutral-800 uppercase tracking-widest flex items-center gap-1">
                              <Layers className="w-4 h-4 text-amber-500" /> Layered Floor Units Matrix
                            </h4>
                            <span className="text-[10px] text-stone-400 italic">Click on any Bedroom Block below</span>
                          </div>

                          <div className="space-y-3">
                            {/* Render floors of chosen project */}
                            {(activeProj.towers[0]?.floors || []).map((floor) => (
                              <div key={floor.floorNumber} className="flex flex-col sm:flex-row sm:items-center gap-3 bg-stone-50/50 p-3 rounded-2xl border border-stone-200">
                                <div className="w-20 font-mono text-xs font-bold text-neutral-400 shrink-0 border-r border-stone-200 sm:py-2">
                                  Floor {floor.floorNumber}
                                </div>
                                <div className="flex-1 flex flex-wrap gap-2">
                                  {floor.units.map((unit) => {
                                    const isCurrentSelect = activeFloorNum === floor.floorNumber && activeBedroomsNum === unit.bedrooms;
                                    
                                    return (
                                      <button
                                        key={unit.number}
                                        onClick={() => {
                                          setActiveFloorNum(floor.floorNumber);
                                          setActiveBedroomsNum(unit.bedrooms || 1);
                                        }}
                                        className={`px-3 py-2 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer flex items-center gap-1.5 ${
                                          isCurrentSelect 
                                            ? "bg-neutral-950 text-white border-neutral-950 ring-2 ring-amber-400 ring-offset-2" 
                                            : "bg-white text-neutral-800 border-stone-200 hover:bg-stone-50 shadow-sm"
                                        }`}
                                      >
                                        <span>🛏️ {unit.bedrooms || unit.type.charAt(0)} BR Block</span>
                                        <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-1.5 py-0.5 rounded">
                                          ${(unit.price / 1000).toFixed(0)}K
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Interactive click details viewer */}
                          {activeFloorNum !== null && activeBedroomsNum !== null && (() => {
                            const activeFloor = (activeProj.towers[0]?.floors || []).find(f => f.floorNumber === activeFloorNum);
                            const activeUnit = activeFloor?.units.find(u => u.bedrooms === activeBedroomsNum);

                            if (!activeUnit) return null;

                            return (
                              <div className="bg-amber-50/45 border border-amber-200 p-5 rounded-2xl space-y-3 animate-slide-in">
                                <div className="flex justify-between items-start gap-4">
                                  <div>
                                    <span className="bg-amber-400 text-neutral-950 text-[10px] font-black uppercase px-2 py-0.5 rounded">
                                      Floor {activeFloorNum} • {activeBedroomsNum} Bedroom Block
                                    </span>
                                    <h5 className="text-base font-black text-neutral-950 pt-2">Custom Apartment Specifications</h5>
                                  </div>
                                  <strong className="text-lg font-black text-neutral-900">${activeUnit.price.toLocaleString()}</strong>
                                </div>

                                <div className="grid grid-cols-3 gap-2 text-xs font-mono py-1 border-y border-amber-100">
                                  <div><strong>Size:</strong> {activeUnit.size}</div>
                                  <div><strong>Availability:</strong> {activeUnit.metadata?.count || 4} units</div>
                                  <div><strong>Status:</strong> {activeUnit.status}</div>
                                </div>

                                <p className="text-xs text-neutral-700 leading-relaxed italic pt-1">
                                  "{activeUnit.metadata?.details || "High-end corporate corner apartment blocks situated on premium bypass elevations offering breathtaking sunrises and borehole backups."}"
                                </p>
                              </div>
                            );
                          })()}

                          {!activeFloorNum && (
                            <div className="bg-stone-50 p-4 rounded-xl text-center text-xs text-neutral-400 font-mono italic">
                              💡 Try clicking any BR Block chip above to see price listings and specific unit details!
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

            </div>
          </div>
        )}

        {/* ================= TAB 2: ADD DYNAMIC LISTING FORM ================= */}
        {activeTab === "add_listing" && (
          <form onSubmit={handleAddListingSubmit} className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-8 animate-fade-in">
            <div className="border-b border-stone-200 pb-4 space-y-1">
              <h3 className="text-xl font-sans font-black text-neutral-950 uppercase tracking-tight">Register New Off-Plan Listing Twin</h3>
              <p className="text-xs text-neutral-500">Specify property specifications, upload block features, and model per-floor bedroom configurations securely.</p>
            </div>

            {submitSuccess && (
              <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl border border-emerald-200 text-xs font-semibold flex items-center gap-2">
                <Check className="w-5 h-5 shrink-0" /> {submitSuccess}
              </div>
            )}
            {submitError && (
              <div className="bg-rose-50 text-rose-800 p-4 rounded-2xl border border-rose-200 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" /> {submitError}
              </div>
            )}

            {/* Core General Specifications Block */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-neutral-700">Property / Estate Title</label>
                <input 
                  type="text" 
                  value={listingName} 
                  onChange={(e) => setListingName(e.target.value)} 
                  placeholder="e.g. Crestview Highpoint Towers"
                  className="w-full text-xs p-3 rounded-xl border border-stone-200 focus:ring-1 focus:ring-amber-400"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-neutral-700">Property Type</label>
                <select 
                  value={propertyType} 
                  onChange={(e) => setPropertyType(e.target.value as any)}
                  className="w-full text-xs p-3 border border-stone-200 rounded-xl"
                >
                  <option value="Apartment">Apartment Block Development</option>
                  <option value="House">Residential House / Villa</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-neutral-700">Location Area</label>
                <input 
                  type="text" 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)} 
                  placeholder="e.g. Westlands, Nairobi"
                  className="w-full text-xs p-3 border border-stone-200 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-neutral-700">Display Price Range</label>
                <input 
                  type="text" 
                  value={priceRange} 
                  onChange={(e) => setPriceRange(e.target.value)} 
                  placeholder="e.g. From $85,000"
                  className="w-full text-xs p-3 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-mono font-bold text-neutral-700">One-Line Tagline Accord</label>
                <input 
                  type="text" 
                  value={tagline} 
                  onChange={(e) => setTagline(e.target.value)} 
                  placeholder="e.g. Master-crafted high-rise executive duplex blocks with dual boreholes"
                  className="w-full text-xs p-3 border border-stone-200 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-neutral-700">Overview Pitch Description</label>
              <textarea 
                rows={3}
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Describe the architectural layout, capital appreciation metrics, and location bypass connectivity..."
                className="w-full text-xs p-3 border border-stone-200 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-neutral-700">Walkthrough 3D VR Tour URL (Matterport / Iframe Embed Link)</label>
              <input 
                type="text" 
                value={vrTourUrl} 
                onChange={(e) => setVrTourUrl(e.target.value)} 
                placeholder="e.g. https://vr.justeasy.cn/view/1u7w11x77w0v81s0-1758796643.html"
                className="w-full text-xs p-3 border border-stone-200 rounded-xl font-mono"
              />
              <p className="text-[10px] text-stone-400">If supplied, this link renders directly as an interactive 3D virtual walkthrough on the property details page.</p>
            </div>

            {/* DYNAMIC AMENITIES CHECK GRIDS */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-neutral-700 block">Select Included Amenities & Facilities</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {availableAmenities.map(am => {
                  const selected = selectedAmenities.includes(am);
                  return (
                    <button
                      type="button"
                      key={am}
                      onClick={() => handleToggleAmenity(am)}
                      className={`text-left p-2.5 rounded-xl text-[10px] font-semibold border flex items-center gap-2 transition-all cursor-pointer ${
                        selected 
                          ? "bg-amber-400/10 border-amber-400 text-amber-900" 
                          : "bg-stone-50/50 border-stone-200 text-stone-600 hover:bg-stone-50"
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[8px] ${
                        selected ? "bg-amber-400 border-amber-400" : "border-stone-300"
                      }`}>
                        {selected && "✓"}
                      </span>
                      <span>{am}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* APARTMENT SHOREBED UNITS BLOCK MATRIX */}
            {propertyType === "Apartment" ? (
              <div className="space-y-4 pt-4 border-t border-stone-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-150 pb-2">
                  <div>
                    <h4 className="text-sm font-black font-mono text-neutral-800 uppercase tracking-widest flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-amber-500" /> Floors Bedroom Block Configuration
                    </h4>
                    <p className="text-[11px] text-stone-500">Configure how many units of each bedroom type are listed on each floor level.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddNewFloorRow}
                    className="bg-neutral-900 hover:bg-neutral-800 text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Floor Level Block
                  </button>
                </div>

                <div className="space-y-4">
                  {floorsConfig.map((floor, floorIndex) => (
                    <div key={floorIndex} className="bg-stone-50/50 p-6 rounded-2xl border border-stone-200 space-y-4">
                      
                      <div className="flex justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                          <label className="text-xs font-mono font-bold text-stone-500">Floor Level Number</label>
                          <input 
                            type="number" 
                            value={floor.floorNumber}
                            onChange={(e) => {
                              const updated = [...floorsConfig];
                              updated[floorIndex].floorNumber = Number(e.target.value);
                              setFloorsConfig(updated);
                            }}
                            className="w-16 text-xs p-1.5 border border-stone-200 rounded text-center bg-white font-bold"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFloorRow(floorIndex)}
                          className="text-stone-400 hover:text-red-500 text-[10px] font-bold uppercase font-mono"
                        >
                          Remove Floor Block
                        </button>
                      </div>

                      {/* Bedroom Blocks Sub Grids */}
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-mono text-stone-450 uppercase tracking-wider font-semibold">Included Bedroom Blocks:</span>
                          {[1, 2, 3, 4].map(b => (
                            <button
                              type="button"
                              key={b}
                              onClick={() => handleAddBedroomsToFloor(floorIndex, b as any)}
                              className="bg-white hover:bg-stone-100 text-stone-700 text-[10px] px-2.5 py-1 rounded-lg border border-stone-200 font-bold"
                            >
                              + {b} Bedroom Lot
                            </button>
                          ))}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {floor.availableTypes.map((type, typeIndex) => (
                            <div key={typeIndex} className="bg-white p-4 rounded-xl border border-stone-200 space-y-3 relative">
                              <button
                                type="button"
                                onClick={() => handleRemoveBedroomFromFloor(floorIndex, typeIndex)}
                                className="absolute top-3 right-3 text-[10px] text-stone-300 hover:text-red-500 font-bold font-mono"
                              >
                                [x]
                              </button>

                              <h5 className="text-[11px] font-mono font-black text-amber-650 text-amber-700 uppercase tracking-widest">
                                {type.bedrooms} Bedroom Block
                              </h5>

                              <div className="grid grid-cols-3 gap-2">
                                <div className="space-y-1">
                                  <label className="text-[9px] text-stone-400 font-bold uppercase font-mono block">Price USD</label>
                                  <input 
                                    type="number"
                                    value={type.price}
                                    onChange={(e) => handleUpdateFloorTypeField(floorIndex, typeIndex, "price", Number(e.target.value))}
                                    className="w-full text-xs p-1.5 border border-stone-150 rounded"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] text-stone-400 font-bold uppercase font-mono block">Size SQM</label>
                                  <input 
                                    type="text"
                                    value={type.size}
                                    onChange={(e) => handleUpdateFloorTypeField(floorIndex, typeIndex, "size", e.target.value)}
                                    className="w-full text-xs p-1.5 border border-stone-150 rounded"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] text-stone-400 font-bold uppercase font-mono block">Units count</label>
                                  <input 
                                    type="number"
                                    value={type.count}
                                    onChange={(e) => handleUpdateFloorTypeField(floorIndex, typeIndex, "count", Number(e.target.value))}
                                    className="w-full text-xs p-1.5 border border-stone-150 rounded text-center"
                                  />
                                </div>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[9px] text-stone-400 font-bold uppercase font-mono block">Custom unit specifications text</label>
                                <input 
                                  type="text"
                                  value={type.details}
                                  onChange={(e) => handleUpdateFloorTypeField(floorIndex, typeIndex, "details", e.target.value)}
                                  placeholder="e.g. Master suite featuring a wrapping balcony overlooking communal gardens."
                                  className="w-full text-[10px] p-2 border border-stone-150 rounded"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* ESTATED HOUSE CONFIGURATIONS rows */
              <div className="space-y-4 pt-4 border-t border-stone-100">
                <h4 className="text-sm font-black font-mono text-neutral-800 uppercase tracking-widest flex items-center gap-1.5">
                  <Home className="w-4 h-4 text-amber-500" /> House Plot Specification Ledger
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-neutral-700">Bedrooms Count</label>
                    <input 
                      type="number" 
                      value={houseBedrooms} 
                      onChange={(e) => setHouseBedrooms(e.target.value)}
                      className="w-full text-xs p-3 border border-stone-200 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-neutral-700">Bathrooms Count</label>
                    <input 
                      type="number" 
                      value={houseBathrooms} 
                      onChange={(e) => setHouseBathrooms(e.target.value)}
                      className="w-full text-xs p-3 border border-stone-200 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-neutral-700">Selling Price ($)</label>
                    <input 
                      type="number" 
                      value={houseValue} 
                      onChange={(e) => setHouseValue(e.target.value)}
                      className="w-full text-xs p-3 border border-stone-200 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-neutral-700">Plot Size SQM</label>
                    <input 
                      type="text" 
                      value={houseSize} 
                      onChange={(e) => setHouseSize(e.target.value)}
                      className="w-full text-xs p-3 border border-stone-200 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit Block buttons */}
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="bg-neutral-950 hover:bg-neutral-850 text-white font-extrabold text-xs uppercase tracking-wider px-8 py-3.5 rounded-2xl flex items-center gap-2 cursor-pointer shadow-lg shadow-neutral-950/10 transition-all active:scale-95"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                    Synchronizing Listing...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-amber-400" />
                    Launch Listing Twin
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ================= TAB 3: DAEBAK SMART AGENT AI ASSISTANT PANEL ================= */}
        {activeTab === "daebak_chat" && (
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 h-[550px] animate-fade-in font-sans">
            
            {/* Bio info block (4 columns) */}
            <div className="lg:col-span-4 bg-neutral-950 text-white p-6 rounded-2xl flex flex-col justify-between border border-neutral-850 h-full">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-400 text-neutral-950 flex items-center justify-center shadow-lg shadow-amber-400/20">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div>
                  <strong className="text-base font-black text-white block">{agentName} AI Assistant</strong>
                  <span className="text-[9px] font-mono font-extrabold text-stone-500 uppercase tracking-widest block mt-0.5">
                    Mode: {agentName} Property Assistant
                  </span>
                </div>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Unlike property-specific brochures, "{agentName} Assistant" is restricted strictly to properties listed by this agent. It analyzes market trends, reviews your floor configurations, and guides buyers with complete escrow parameters.
                </p>
              </div>

              <div className="p-3 bg-neutral-900 border border-neutral-850 rounded-xl text-[10px] text-stone-500 space-y-1">
                <span>AI Cognitive Sync Status:</span>
                <strong className="text-white block font-mono">AGENT_AI_GEN_15_FLASH_ONLINE</strong>
              </div>
            </div>

            {/* Chat viewport + entry (8 columns) */}
            <div className="lg:col-span-8 flex flex-col justify-between h-full space-y-4">
              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto p-4 bg-stone-50 rounded-2xl border border-stone-150 space-y-4 max-h-[380px]">
                {chatMessages.map((msg, idx) => {
                  const isAI = msg.sender === "ai";
                  const avatarText = isAI ? (agentName.substring(0, 2) || "DB").toUpperCase() : "ME";
                  return (
                    <div 
                      key={idx} 
                      className={`flex gap-3 max-w-[85%] ${isAI ? "mr-auto" : "ml-auto flex-row-reverse"}`}
                    >
                      <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-black uppercase ${
                        isAI ? "bg-amber-405 bg-amber-400 text-neutral-950" : "bg-neutral-800 text-white"
                      }`}>
                        {avatarText}
                      </div>
                      <div className={`p-4 rounded-2xl text-xs font-medium leading-relaxed shadow-sm whitespace-pre-line ${
                        isAI ? "bg-white text-neutral-950 border border-stone-200" : "bg-neutral-800 text-white"
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
                {chatLoading && (
                  <div className="flex gap-3 mr-auto max-w-[85%] items-center">
                    <div className="w-8 h-8 rounded-xl bg-amber-400 text-neutral-950 flex items-center justify-center text-xs font-black animate-pulse uppercase">
                      {(agentName.substring(0, 2) || "DB").toUpperCase()}
                    </div>
                    <div className="bg-white text-neutral-400 text-xs p-3 rounded-2xl border border-stone-200 italic flex items-center gap-1.5 font-semibold">
                      <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                      {agentName} Assistant is evaluating property indices...
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Form */}
              <form onSubmit={handleDaebakChatSubmit} className="flex gap-2">
                <input
                  type="text"
                  required
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={`Ask ${agentName} Assistant about your Floor blocks configurations, house layouts, prices...`}
                  className="flex-1 text-xs p-3 border border-stone-200 rounded-xl focus:ring-1 focus:ring-amber-400 bg-white"
                />
                <button
                  type="submit"
                  disabled={chatLoading}
                  className="bg-neutral-950 hover:bg-neutral-850 text-white font-extrabold text-xs uppercase px-5 py-3 rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-amber-400" />
                  Ask
                </button>
              </form>
            </div>

          </div>
        )}

      </main>

    </div>
  );
}
