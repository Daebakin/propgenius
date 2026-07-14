import React, { useState, useMemo } from "react";
import { 
  Building2, 
  MapPin, 
  Percent, 
  Clock, 
  ArrowRight, 
  Globe, 
  Compass, 
  Sparkles, 
  Search, 
  SlidersHorizontal,
  Phone,
  HelpCircle,
  Eye,
  Crown
} from "lucide-react";
import { Project, User } from "../types";

interface InternationalPortfolioPageProps {
  projects: Project[];
  onSelectProject: (id: string) => void;
  currentUser?: User | null;
  onNavigateToTab?: (tabName: string) => void;
}

// Pre-vetted Dubai list
export const dubaiPreVetted: Project[] = [
  {
    id: "damac-bay-cavalli",
    name: "DAMAC Bay by Cavalli",
    location: "Dubai Marina, Dubai",
    developerId: "damac-official",
    developerName: "DAMAC Properties",
    tagline: "Ultra-luxury waterfront luxury branded by Cavalli Casa",
    description: "A monumental masterwork of three magnificent architectural towers rising at Dubai Harbour. Designed exclusively with Cavalli inspired finishing, private sky pools, and infinity beaches.",
    priceRange: "$1,350,000 - $6,400,000",
    completionDate: "December 2029",
    constructionProgress: 18,
    roiRentalYield: "11.2%",
    roiCapitalAppreciation: "14.8%",
    overallRating: 5.0,
    developerVerified: true,
    amenities: [
      "Private Cavalli Private Beach Club",
      "Heated Horizon Pools & Lounges",
      "Dubai Marina Mega-Yacht Access",
      "Cavalli Branded Cigar & Caviar Bar",
      "24/7 Diplomatic Valet & Butler Team"
    ],
    locationHighlights: [
      "Direct access boundary with Dubai Beach Marina",
      "2 minutes to elite international yachts terminal",
      "15 minutes to Downtown Burj Khalifa boulevard"
    ],
    droneVideoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    vrTourUrl: "https://vr.justeasy.cn/view/1u7w11x77w0v81s0-1758796643.html",
    whatsappPhone: "+97143731000",
    currency: "USD",
    bookingDepositPercent: 10,
    faqs: [
      { q: "What is the post-handover payment plan?", a: "We offer a flexible 80/20 milestone-based developer escrow installment framework." }
    ],
    tiktokVideos: [],
    status: "ongoing",
    type: "Penthouse",
    views: 890,
    isFeatured: true,
    isInternational: true,
    towers: [
      {
        name: "Tower Alpha",
        floors: [
          {
            floorNumber: 42,
            units: [
              { number: "C-4201", type: "3 Bed Grand Duplex", price: 2900000, size: "280 SQM", status: "Available", flexStatus: "Available" },
              { number: "C-4202", type: "4 Bed Cavalli Sky Mansion", price: 4800000, size: "420 SQM", status: "Available", flexStatus: "Available" }
            ]
          }
        ]
      }
    ],
    virtualTourMedia: {
      livingRoom: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
      kitchen: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
      masterBedroom: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80"
    }
  },
  {
    id: "emaar-beachfront-mansions",
    name: "Emaar Beachfront Premium",
    location: "Palm Jumeirah Precinct, Dubai",
    developerId: "emaar-official",
    developerName: "Emaar Properties",
    tagline: "Private island sanctuary suspended above the Persian Gulf",
    description: "An awe-inspiring beachfront sanctuary. True coastal magnificence featuring floor-to-ceiling glass paneling, full Arabian Gulf panoramas, and gated luxury yacht harbors.",
    priceRange: "$2,100,000 - $9,500,000",
    completionDate: "June 2028",
    constructionProgress: 42,
    roiRentalYield: "12.4%",
    roiCapitalAppreciation: "15.2%",
    overallRating: 5.0,
    developerVerified: true,
    amenities: [
      "Private Gated Island Sandy Beachfront",
      "Exclusive Superyacht Berth Slips",
      "Michelin-Star Resident Chef Service",
      "Wellness Infinity Horizon Hammam Spa"
    ],
    locationHighlights: [
      "Direct exit road into the main Palm Jumeirah highway",
      "Surrounded entirely by multi-million dollar villas and private resorts",
      "20 minutes bypass road to Dubai International DXB Airport"
    ],
    droneVideoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    vrTourUrl: "https://vr.justeasy.cn/view/1u7w11x77w0v81s0-1758796643.html",
    whatsappPhone: "+97143673333",
    currency: "USD",
    bookingDepositPercent: 20,
    faqs: [],
    tiktokVideos: [],
    status: "ongoing",
    type: "Penthouse",
    views: 1120,
    isFeatured: true,
    isInternational: true,
    towers: [
      {
        name: "Palm Residence",
        floors: [
          {
            floorNumber: 18,
            units: [
              { number: "PR-1801", type: "4 Bed Sea Facing Mansion", price: 4200000, size: "385 SQM", status: "Available", flexStatus: "Available" }
            ]
          }
        ]
      }
    ],
    virtualTourMedia: {
      livingRoom: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      kitchen: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
      masterBedroom: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80"
    }
  }
];

export default function InternationalPortfolioPage({
  projects,
  onSelectProject,
  currentUser,
  onNavigateToTab
}: InternationalPortfolioPageProps) {
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState<string>("All Areas");
  const [selectedDeveloper, setSelectedDeveloper] = useState<string>("All Developers");
  const [selectedRoi, setSelectedRoi] = useState<string>("All");
  const [activeVirtualTourUrl, setActiveVirtualTourUrl] = useState<string | null>(null);


  // Merge pre-vetted with any uploaded projects from admin/database with isInternational === true
  const listItems = useMemo(() => {
    const fromProps = projects.filter(p => p.isInternational === true);
    // Combine, overriding any pre-vetted if custom ones have the exact same ID
    const combined = [...fromProps];
    dubaiPreVetted.forEach(p => {
      if (!combined.some(c => c.id === p.id)) {
        combined.push(p);
      }
    });
    return combined;
  }, [projects, dubaiPreVetted]);

  // Extract filter dimensions
  const uniqueAreas = useMemo(() => {
    const areas = new Set<string>();
    listItems.forEach(p => {
      const parts = p.location.split(",");
      const city = parts[parts.length - 1]?.trim() || "Dubai";
      const area = parts[0]?.trim() || "Downtown";
      areas.add(`${area}, ${city}`);
    });
    return ["All Areas", ...Array.from(areas)];
  }, [listItems]);

  const uniqueDevelopers = useMemo(() => {
    const devs = new Set<string>();
    listItems.forEach(p => {
      if (p.developerName) devs.add(p.developerName);
    });
    return ["All Developers", ...Array.from(devs)];
  }, [listItems]);

  // Filter process
  const filteredAndSorted = useMemo(() => {
    return listItems.filter(p => {
      // search
      const textMatch = searchQuery === "" || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.tagline || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.developerName.toLowerCase().includes(searchQuery.toLowerCase());

      // Area filter
      let areaMatch = true;
      if (selectedArea !== "All Areas") {
        areaMatch = p.location.toLowerCase().includes(selectedArea.split(",")[0].toLowerCase().trim());
      }

      // Developer filter
      const devMatch = selectedDeveloper === "All Developers" || p.developerName === selectedDeveloper;

      // Roi filter (e.g., "> 11%")
      let roiMatch = true;
      if (selectedRoi !== "All") {
        const numericRoi = parseFloat(p.roiRentalYield || "0");
        if (selectedRoi === "High (> 11%)") {
          roiMatch = numericRoi >= 11;
        } else if (selectedRoi === "Extremely High (>= 12%)") {
          roiMatch = numericRoi >= 12;
        }
      }

      return textMatch && areaMatch && devMatch && roiMatch;
    });
  }, [listItems, searchQuery, selectedArea, selectedDeveloper, selectedRoi]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-1 sm:px-4 py-2" id="dubai-luxury-portal">
      
      {/* 1. Sleek Luxury Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-neutral-950 p-8 sm:p-12 border border-neutral-900 shadow-xl">
        <div className="absolute inset-0 opacity-25">
          <img 
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80" 
            alt="Dubai skyline luxury off-plan portfolio" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/90 to-transparent" />
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-400/10 text-amber-400 px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-widest border border-amber-400/30">
            <Globe className="w-3 h-3 animate-spin" /> Dubai Sovereign Estates
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            PropSphere <span className="text-amber-400">Platinum</span>: Dubai Luxury Off-Plan
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
            Direct sovereign syndications connecting regional capital directly with Dubai’s most magnificent waterfront, island, and skyscraper developments from developers like **DAMAC** and **Emaar**. Enjoy stable tax-free capital growth and secure offshore dollar-denominated yields.
          </p>

          <div className="flex flex-wrap gap-4 pt-4 text-xs">
            <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">Tax Sovereign Sandbox</span>
              <span className="font-extrabold text-amber-400 text-sm">0% Capital Gains Tax</span>
            </div>
            <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">Average Net ROI</span>
              <span className="font-extrabold text-amber-400 text-sm">11.4% - 12.8% Yields</span>
            </div>
            <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">Golden Visa Index</span>
              <span className="font-extrabold text-amber-400 text-sm">Pre-Approved Ready</span>
            </div>
          </div>
        </div>

        {/* Floating Developer/SuperAdmin Quick-Path Button */}
        {currentUser?.role === "SuperAdmin" && (
          <div className="absolute top-4 right-4 z-20">
            <button
              onClick={() => {
                if (onNavigateToTab) onNavigateToTab("developers");
              }}
              className="bg-amber-400 hover:bg-amber-300 text-neutral-950 px-3 py-2 rounded-xl text-[10px] font-bold tracking-wider uppercase shadow-lg transition-all border border-amber-500 flex items-center gap-1.5"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Post New Listing (SuperAdmin)</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Interactive Search & Premium Filter Panel */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-3">
          
          {/* Main search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Dubai harbor waterfront, private islands, villa compounds or DAMAC sky-penthouses..."
              className="w-full pl-10 pr-4 py-3 bg-neutral-50 rounded-2xl border border-stone-200 focus:outline-none focus:border-amber-400 font-medium text-xs text-neutral-900 cursor-text"
            />
          </div>

          {/* Quick status badge */}
          <div className="flex items-center gap-1 bg-amber-50 rounded-2xl p-2.5 border border-amber-100 text-[10px] font-bold text-amber-800 uppercase tracking-wide px-4">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            Active Channel Sync Status: Live Centralized Ledgers Connected
          </div>
        </div>

        {/* Fine Grain Filters Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Areas */}
          <div>
            <label className="text-[10px] uppercase font-mono font-bold text-neutral-500 block mb-1">Dubai Neighborhood Zone</label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full text-xs p-3 rounded-2xl border border-stone-200 bg-white font-medium cursor-pointer"
            >
              {uniqueAreas.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* Developers */}
          <div>
            <label className="text-[10px] uppercase font-mono font-bold text-neutral-500 block mb-1">Elite Master Developer</label>
            <select
              value={selectedDeveloper}
              onChange={(e) => setSelectedDeveloper(e.target.value)}
              className="w-full text-xs p-3 rounded-2xl border border-stone-200 bg-white font-medium cursor-pointer"
            >
              {uniqueDevelopers.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Yields */}
          <div>
            <label className="text-[10px] uppercase font-mono font-bold text-neutral-500 block mb-1">Est. Tax-Free Rental Yield (ROA)</label>
            <select
              value={selectedRoi}
              onChange={(e) => setSelectedRoi(e.target.value)}
              className="w-full text-xs p-3 rounded-2xl border border-stone-200 bg-white font-medium cursor-pointer"
            >
              <option value="All">All Sovereign Yield Bands</option>
              <option value="High (> 11%)">High (11%+ Yield)</option>
              <option value="Extremely High (>= 12%)">Maximized (12%+ Yield)</option>
            </select>
          </div>

        </div>
      </div>

      {/* 3. Render Virtual VR Overlay if active */}
      {activeVirtualTourUrl && (
        <div className="fixed inset-0 z-[200] bg-neutral-950/80 backdrop-blur-md flex flex-col justify-center items-center p-4">
          <div className="bg-neutral-900 border border-amber-400 p-4 rounded-3xl w-full max-w-5xl h-[80vh] flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="p-1 px-2.5 bg-amber-400 text-neutral-950 rounded-lg text-[10px] font-mono font-bold uppercase">VR IMMERSIVE</span>
                <span className="text-xs font-bold text-white uppercase tracking-wider">Dubai Sky Manor Immersive Metaverse Walkthrough</span>
              </div>
              <button 
                onClick={() => setActiveVirtualTourUrl(null)}
                className="text-stone-400 hover:text-white text-xs font-bold bg-neutral-800 p-2 rounded-xl px-4 cursor-pointer"
              >
                Close VR Tour
              </button>
            </div>
            
            <div className="flex-1 rounded-2xl overflow-hidden bg-black border border-neutral-800 relative">
              <iframe 
                src={activeVirtualTourUrl}
                title="VR Sandbox"
                className="w-full h-full border-none absolute inset-0"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. Luxury Property Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredAndSorted.map((proj) => {
          const featuredImg = proj.virtualTourMedia?.livingRoom || "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80";
          return (
            <div 
              key={proj.id}
              className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              
              {/* Media Container with badges */}
              <div className="relative h-64 md:h-72 w-full overflow-hidden bg-stone-100 group">
                <img 
                  src={featuredImg} 
                  alt={`${proj.name} - Luxury Dubai ${proj.type || "Apartment"} in ${proj.location}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                
                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Floating tags */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 bg-amber-400 text-neutral-950 font-black text-[10px] uppercase rounded-lg shadow-sm font-mono leading-none tracking-widest flex items-center gap-1">
                    <Globe className="w-3 h-3 text-neutral-950" /> Dubai Offplan
                  </span>
                  <span className="px-3 py-1 bg-neutral-950/85 text-white font-extrabold text-[10px] uppercase rounded-lg shadow-sm leading-none tracking-wide flex items-center gap-1.5 border border-white/10">
                    👑 {proj.developerName}
                  </span>
                </div>

                <div className="absolute top-4 right-4 bg-white/15 backdrop-blur-md px-3 py-1 rounded-lg text-white font-extrabold text-[10px] tracking-wide uppercase flex items-center gap-1">
                  Est. Progress: {proj.constructionProgress || 10}%
                </div>

                {/* Bottom title layer overlay */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-[10px] font-mono text-amber-300 uppercase tracking-widest block font-bold">{proj.location}</p>
                  <h3 className="text-lg font-black tracking-tight mt-0.5 leading-none">{proj.name}</h3>
                </div>
              </div>

              {/* Specs & Performance Indicators */}
              <div className="p-6 space-y-6 flex-1 flex flex-col justify-between">
                
                <div className="space-y-2">
                  <p className="text-xs font-bold text-neutral-800 leading-relaxed italic">
                    "{proj.tagline || 'Modern luxury designed exclusively.'}"
                  </p>
                  <p className="text-xs text-neutral-500 leading-relaxed font-light line-clamp-3">
                    {proj.description || 'Pristine masterfully developed custom structural space utilizing high-end architectural systems...'}
                  </p>
                </div>

                {/* Performance stats bento panel */}
                <div className="grid grid-cols-3 gap-2 bg-neutral-50 p-4 rounded-2xl border border-stone-200/50">
                  <div className="text-center">
                    <span className="text-[9px] uppercase font-mono font-bold text-neutral-400 block tracking-wide">Expected ROI</span>
                    <span className="font-extrabold text-amber-600 text-[13px] inline-flex items-center gap-0.5 mt-0.5">
                      <Percent className="w-3 h-3 text-amber-500 shrink-0" /> {proj.roiRentalYield || "11.2%"}
                    </span>
                  </div>
                  <div className="text-center border-x border-stone-200 px-1">
                    <span className="text-[9px] uppercase font-mono font-bold text-neutral-400 block tracking-wide">Target Handover</span>
                    <span className="font-bold text-neutral-800 text-xs inline-flex items-center gap-1 mt-1 justify-center">
                      <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" /> {proj.completionDate || "2029"}
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="text-[9px] uppercase font-mono font-bold text-neutral-400 block tracking-wide">Price range</span>
                    <span className="font-extrabold text-neutral-900 text-[11px] block mt-1 truncate">
                      {proj.priceRange || "$1,000,000+"}
                    </span>
                  </div>
                </div>

                {/* Amenities pills */}
                <div className="space-y-1.5">
                  <span className="text-[9px] uppercase font-mono font-bold tracking-widest text-neutral-400 block">Luxury Accents</span>
                  <div className="flex flex-wrap gap-1">
                    {proj.amenities?.slice(0, 3).map((amen, ax) => (
                      <span key={ax} className="text-[9px] bg-stone-100 text-neutral-600 px-2 py-1 rounded-md uppercase font-bold tracking-tight">
                        ⭐ {amen}
                      </span>
                    ))}
                    {proj.amenities && proj.amenities.length > 3 && (
                      <span className="text-[9px] text-stone-400 font-bold px-1.5 self-center">
                        +{proj.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Dynamic Actions block */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-stone-100">
                  
                  {/* Digital Twin */}
                  <button
                    onClick={() => onSelectProject(proj.id)}
                    className="w-full bg-neutral-950 hover:bg-neutral-800 text-amber-400 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-1 border border-neutral-850 cursor-pointer"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Interactive Map</span>
                  </button>

                  {/* VR Tour */}
                  {proj.vrTourUrl ? (
                    <button
                      onClick={() => setActiveVirtualTourUrl(proj.vrTourUrl || null)}
                      className="w-full bg-white hover:bg-stone-50 text-neutral-900 p-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border border-stone-200 shadow-sm transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-stone-500" />
                      <span>VR Cavalli Tour</span>
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-stone-50 text-stone-400 p-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border border-stone-100 transition-all flex items-center justify-center gap-1 cursor-not-allowed"
                    >
                      <span>No VR Configured</span>
                    </button>
                  )}

                  {/* Direct WhatsApp Concierge Channel */}
                  <a
                    href={`https://wa.me/${(proj.whatsappPhone || "+97143731000").replace(/\+/g, "")}?text=Hi%20PropSphere%20Representative,%20I'm%20extremely%20interested%20in%20investing%20in%20the%20international%20off-plan%20launch%20"${encodeURIComponent(proj.name)}"%20in%2520Dubai.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-1.5 sm:col-span-2 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                </div>

              </div>

            </div>
          );
        })}

        {filteredAndSorted.length === 0 && (
          <div className="col-span-1 md:col-span-2 bg-stone-50 p-12 text-center rounded-3xl border border-dashed border-stone-300">
            <Compass className="w-12 h-12 text-stone-300 mx-auto mb-4" />
            <span className="font-mono text-xs uppercase tracking-wider block font-bold text-neutral-600">No Dubai Developments Match Criteria</span>
            <p className="text-stone-400 text-xs mt-1">Try expanding search query syntax or restoring standard Neighborhood parameters.</p>
          </div>
        )}
      </div>

      {/* 5. Dubai Legal Sandbox Guide FAQ */}
      <div className="bg-gradient-to-tr from-stone-50 to-neutral-50 p-6 sm:p-8 rounded-3xl border border-stone-200/80 mt-12 space-y-4">
        <h4 className="text-xs font-black uppercase tracking-widest text-neutral-900 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-neutral-400 font-bold" /> Dubai Escrow Legals & Escrow Regulations
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed text-zinc-650">
          <div className="bg-white p-4 rounded-xl border border-stone-200/50 space-y-2">
            <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-amber-600 block">1. Is my capital legally protected?</span>
            <p className="font-light text-neutral-500">
              Yes, absolutely. By Dubai Sovereign Law (Law No. 8 of 2007 on Escrow Accounts), all progress payments must be in a project-specific Escrow Account registered with the land department. Developers cannot access your money except for approved construction milestones.
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-stone-200/50 space-y-2">
            <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-amber-600 block">2. How is currency risk mitigated?</span>
            <p className="font-light text-neutral-500">
              The United Arab Emirates Dirham (AED) is pegged directly to the United States Dollar (USD) at a rate of 3.6725. This ensures there are absolutely no exchange losses, shielding your wealth in dynamic offshore dollar-pegged property assets.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
