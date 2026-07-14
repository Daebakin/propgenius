import React, { useState, useMemo } from "react";
import { 
  Search, 
  MapPin, 
  Building, 
  Layers, 
  DollarSign, 
  TrendingUp, 
  Eye, 
  Sparkles, 
  Check, 
  Compass, 
  Flame, 
  Star,
  ExternalLink,
  SlidersHorizontal,
  Bookmark
} from "lucide-react";
import { Project } from "../types";

interface PropertiesPageProps {
  projects: Project[];
  onSelectProject: (projectId: string) => void;
  formatPrice: (priceVal: number) => string;
  displayCurrency: "KES" | "USD";
}

export default function PropertiesPage({
  projects,
  onSelectProject,
  formatPrice,
  displayCurrency
}: PropertiesPageProps) {
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all");
  const [selectedAmenity, setSelectedAmenity] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"views" | "roi" | "progress" | "rating">("views");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedVRId, setExpandedVRId] = useState<string | null>(null);

  // Derive locations, types and all unique amenities for filters
  const locations = useMemo(() => {
    const list = new Set<string>();
    projects.forEach(p => {
      if (p.location) {
        // Get general area, e.g., "Westlands" from "Raphta Road, Westlands"
        const parts = p.location.split(",");
        const area = parts[parts.length - 1].trim();
        list.add(area);
      }
    });
    return Array.from(list);
  }, [projects]);

  const propertyTypes = useMemo(() => {
    const list = new Set<string>();
    projects.forEach(p => {
      if (p.type) list.add(p.type);
    });
    return Array.from(list);
  }, [projects]);

  const allAmenities = useMemo(() => {
    const list = new Set<string>();
    projects.forEach(p => {
      p.amenities?.forEach(am => list.add(am));
    });
    return Array.from(list).slice(0, 15); // Limit filter options to top 15 for UI layout
  }, [projects]);

  // Handle single property click: register dynamic view log and proceed
  const handlePropertyClick = async (projectId: string) => {
    try {
      // Async record the view statistics endpoint to Firestore & mockDb on backend
      await fetch(`/api/projects/${projectId}/view`, { method: "POST" });
    } catch (e) {
      console.error("Failed to register SEO view count payload:", e);
    }
    // Proceed to details page
    onSelectProject(projectId);
  };

  // Extract price helper to evaluate USD/KES price limits or representations
  const getProjectBasePriceNumeric = (p: Project): number => {
    // Attempt parsing numeric values from price ranges like "$85,000 - $220,000" or "KES 31M - KES 51M"
    try {
      const priceStr = p.priceRange || "";
      if (priceStr.includes("KES")) {
        const match = priceStr.match(/(\d+)\s*M/);
        if (match) {
          // e.g. "31M" -> 31,000,000 KES
          const kesValue = Number(match[1]) * 1000000;
          return p.currency === "KES" ? kesValue : kesValue / 130;
        }
      }
      const matchUSD = priceStr.replace(/,/g, "").match(/\$?(\d+)/);
      if (matchUSD) {
        const usdValue = Number(matchUSD[1]);
        return p.currency === "KES" ? usdValue : usdValue;
      }
    } catch {
      // safe fallback
    }
    return 100000;
  };

  // Filter & sort logic
  const filteredAndSortedProjects = useMemo(() => {
    let result = projects.filter(p => !p.isInternational);

    // Filter by search query (Name, Location, Tagline, Description)
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // Filter by Location
    if (selectedLocation !== "all") {
      result = result.filter(p => p.location.toLowerCase().includes(selectedLocation.toLowerCase()));
    }

    // Filter by Property Type
    if (selectedType !== "all") {
      result = result.filter(p => p.type && p.type.toLowerCase() === selectedType.toLowerCase());
    }

    // Filter by Status (offplan, ongoing, completed)
    if (selectedStatus !== "all") {
      result = result.filter(p => p.status && p.status.toLowerCase() === selectedStatus.toLowerCase());
    }

    // Filter by Price Range Category (under 100k, 100k-200k, over 200k, or below 40M KES etc)
    if (selectedPriceRange !== "all") {
      result = result.filter(p => {
        const price = getProjectBasePriceNumeric(p);
        if (selectedPriceRange === "low") {
          return price < 100000; // < $100,000
        } else if (selectedPriceRange === "mid") {
          return price >= 100000 && price <= 200000; // $100k - $200k
        } else if (selectedPriceRange === "high") {
          return price > 200000; // > $200,000
        }
        return true;
      });
    }

    // Filter by Amenities
    if (selectedAmenity !== "all") {
      result = result.filter(p => p.amenities?.some(am => am === selectedAmenity));
    }

    // Sorting (Most Viewed on top, ROI Capital yield high, or constructionProgress high, overallRating)
    result.sort((a, b) => {
      if (sortBy === "views") {
        return (b.views || 0) - (a.views || 0);
      } else if (sortBy === "roi") {
        const yieldA = parseFloat(a.roiRentalYield || "0");
        const yieldB = parseFloat(b.roiRentalYield || "0");
        return yieldB - yieldA;
      } else if (sortBy === "progress") {
        return (b.constructionProgress || 0) - (a.constructionProgress || 0);
      } else if (sortBy === "rating") {
        return (b.overallRating || 0) - (a.overallRating || 0);
      }
      return 0;
    });

    return result;
  }, [projects, searchQuery, selectedLocation, selectedType, selectedStatus, selectedPriceRange, selectedAmenity, sortBy]);

  // Featured properties (always shown at top if set, otherwise top viewed)
  const featuredProperties = useMemo(() => {
    const localProjects = projects.filter(p => !p.isInternational);
    const explicitlyFeatured = localProjects.filter(p => p.isFeatured);
    if (explicitlyFeatured.length > 0) return explicitlyFeatured;
    // Fallback to top two most viewed
    return [...localProjects].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 2);
  }, [projects]);

  return (
    <article className="space-y-8 text-neutral-900 animate-fade-in pb-12">
      {/* SEO Title & Description for Web Crawler Optimization */}
      <header className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full">
          <Sparkles className="w-3.5 h-3.5" /> Luxury Real Estate Kenya Index
        </div>
        <h1 className="text-4xl md:text-5xl font-sans font-black uppercase tracking-tight text-neutral-950 leading-none">
          Nairobi Premium Properties Portfolio
        </h1>
        <p className="text-sm text-neutral-550 leading-relaxed max-w-2xl mx-auto">
          Explore off-plan duplexes, premium high-rise suites, and certified ready-to-move-in penthouses in Westlands, Kilimani, and premium Nairobi sectors. Curated with direct builder verified pricing, high capital growth indexes, and drone walkthrough integrations.
        </p>
        
        {/* SEO Keywords Tag Cloud (Semantic Crawl Target) */}
        <div className="flex flex-wrap justify-center gap-1.5 pt-2">
          {["Westlands Luxury Apartments", "Off-Plan Nairobi Investments", "Kilimani Family Homestays", "High Yield Passive Rental Kenya", "Verified Developer Portals"].map((kw, i) => (
            <span key={i} className="text-[9px] font-mono text-zinc-400 bg-zinc-50 border border-zinc-150 rounded-md px-2 py-0.5">
              #{kw.replace(/\s+/g, "")}
            </span>
          ))}
        </div>
      </header>

      {/* Featured Listings Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
          <Flame className="w-5 h-5 text-red-500" />
          <h2 className="text-xs font-mono uppercase font-black text-rose-600 tracking-wider">
            Featured Hotspot Properties (High ROI Yields)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredProperties.map((proj) => {
            const displayStatus = proj.status === "completed" ? "Completed" : proj.status === "ongoing" ? "Ongoing" : "Off-Plan";
            const statusColor = proj.status === "completed" ? "bg-emerald-550 text-white" : proj.status === "ongoing" ? "bg-amber-500 text-white" : "bg-blue-600 text-white";

            return (
              <div 
                key={proj.id} 
                onClick={() => handlePropertyClick(proj.id)}
                className="bg-white border-2 border-amber-400 rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all group flex flex-col justify-between relative"
                id={`featured-card-${proj.id}`}
              >
                {/* Top Ribbons */}
                <div className="absolute top-3 left-3 z-10 flex gap-2">
                  <span className={`${statusColor} text-[10px] uppercase font-mono px-3 py-1 rounded-lg font-black shadow-sm`}>
                    {displayStatus}
                  </span>
                  <span className="bg-neutral-950 text-amber-400 text-[10px] uppercase font-mono px-3 py-1 rounded-lg font-black shadow-sm flex items-center gap-0.5">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-400" /> FEATURED
                  </span>
                </div>

                <div className="absolute top-3 right-3 z-10">
                  <span className="bg-black/60 backdrop-blur-md text-white font-mono text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                    <Eye className="w-3.5 h-3.5 text-stone-300" />
                    <strong>{proj.views || 150}</strong>
                  </span>
                </div>

                {/* Hero preview images */}
                <div className="relative aspect-video overflow-hidden bg-stone-100 border-b border-stone-150">
                  <img 
                    src={proj.virtualTourMedia?.livingRoom || "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200"} 
                    alt={`${proj.name} - Luxury ${proj.type || "Apartment"} for Sale in ${proj.location}`} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent flex items-end p-5">
                    <div className="space-y-1">
                      <h3 className="text-xl md:text-2xl font-black text-white hover:text-amber-400 transition-colors drop-shadow">{proj.name}</h3>
                      <p className="text-xs text-stone-300 font-medium tracking-tight flex items-center gap-1 uppercase">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" /> {proj.location}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Body metadata stats */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <blockquote className="text-xs text-neutral-600 font-serif leading-relaxed italic border-l-2 border-amber-400 pl-3">
                      "{proj.tagline}"
                    </blockquote>
                    <p className="text-xs text-neutral-500 leading-normal line-clamp-2">
                      {proj.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-stone-100 bg-stone-50/50 p-3 rounded-2xl text-center">
                    <div>
                      <span className="text-[9px] font-mono text-stone-400 block uppercase">STARTING RANGE</span>
                      <strong className="text-[13px] text-neutral-900 font-mono tracking-tight font-black">{proj.priceRange}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-stone-400 block uppercase">RENTAL ROI YIELD</span>
                      <strong className="text-[13px] text-emerald-600 font-mono font-black">{proj.roiRentalYield} p.a.</strong>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-stone-400 block uppercase">PROGRESS INDEX</span>
                      <div className="flex items-center justify-center gap-1">
                        <div className="w-12 bg-stone-200 h-1.5 rounded-full overflow-hidden mt-1 inline-block">
                          <div className="bg-amber-400 h-full rounded-full" style={{ width: `${proj.constructionProgress}%` }} />
                        </div>
                        <span className="text-[10px] font-mono font-bold text-neutral-800">{proj.constructionProgress}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer links */}
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-neutral-400 font-mono">
                      DEVELOPED BY: <strong className="text-neutral-700">{proj.developerName}</strong>
                    </span>
                    <span className="text-amber-600 font-bold flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-150 transition-colors group-hover:bg-amber-400 group-hover:text-neutral-950 group-hover:border-amber-400">
                      View Interactive Layout & Units <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Main Grid + Filter Section */}
      <section className="space-y-6">
        
        {/* Search, Filter Toggles & Sorting Controls */}
        <div className="bg-white p-4 md:p-5 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-stone-400" />
              <input 
                type="text"
                placeholder="Search developments by name, region keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 focus:border-amber-400 focus:bg-white text-xs p-3.5 pl-10 rounded-2xl outline-none transition-colors"
              />
            </div>

            {/* Filters toggle + Sorters */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1.5 px-4 py-3 rounded-2xl border text-xs font-bold transition-all uppercase tracking-wider ${
                  showFilters 
                    ? "bg-stone-100 border-neutral-800 text-neutral-900" 
                    : "bg-stone-50 border-stone-200 hover:border-neutral-450"
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" /> 
                {showFilters ? "Hide Filters" : "Advanced Filters"}
              </button>

              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-1 flex items-center gap-1">
                <span className="text-[10px] font-mono uppercase font-bold text-neutral-400 px-2 shrink-0">SORT BY:</span>
                {(["views", "roi", "progress", "rating"] as const).map((sortByOption) => {
                  const labels = {
                    views: "Popularity",
                    roi: "High ROI",
                    progress: "Progress",
                    rating: "Top Rating"
                  };
                  return (
                    <button
                      key={sortByOption}
                      onClick={() => setSortBy(sortByOption)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wide transition-all ${
                        sortBy === sortByOption
                          ? "bg-neutral-950 text-[#fff] shadow-sm"
                          : "text-neutral-500 hover:text-neutral-950"
                      }`}
                    >
                      {labels[sortByOption]}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Advanced Collapsible Filter Triggers */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 pt-3 border-t border-stone-100 animate-fade-in text-left">
              
              {/* Location Select */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-neutral-400 font-bold uppercase tracking-wider block">Nairobi Location Mode</label>
                <select 
                  value={selectedLocation} 
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 text-xs p-2.5 rounded-xl outline-none focus:border-amber-400"
                >
                  <option value="all">📍 All Locations / Sectors</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Type Select */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-neutral-400 font-bold uppercase tracking-wider block">Property Configuration</label>
                <select 
                  value={selectedType} 
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 text-xs p-2.5 rounded-xl outline-none focus:border-amber-400"
                >
                  <option value="all">🏠 All Typologies</option>
                  {propertyTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Penthouse">Penthouse</option>
                </select>
              </div>

              {/* Status Select */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-neutral-400 font-bold uppercase tracking-wider block">Construction Status</label>
                <select 
                  value={selectedStatus} 
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 text-xs p-2.5 rounded-xl outline-none focus:border-amber-400"
                >
                  <option value="all">📅 All Statuses</option>
                  <option value="offplan">Off-Plan / Concept</option>
                  <option value="ongoing">Ongoing Build</option>
                  <option value="completed">Completed / Ready</option>
                </select>
              </div>

              {/* Price Select */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-neutral-400 font-bold uppercase tracking-wider block">Estimated Price Tier</label>
                <select 
                  value={selectedPriceRange} 
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 text-xs p-2.5 rounded-xl outline-none focus:border-amber-400"
                >
                  <option value="all">💵 Any Price Scale</option>
                  <option value="low">Under $100K (KES 13M)</option>
                  <option value="mid">$100K - $200K (KES 13M - 26M)</option>
                  <option value="high">Luxury Above $200K (KES 26M+)</option>
                </select>
              </div>

              {/* Amenities Filter */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-neutral-400 font-bold uppercase tracking-wider block font-black">DNA Amenity Select</label>
                <select 
                  value={selectedAmenity} 
                  onChange={(e) => setSelectedAmenity(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 text-xs p-2.5 rounded-xl outline-none focus:border-amber-400"
                >
                  <option value="all">🔑 Any Custom Amenity Available</option>
                  {allAmenities.map((am) => (
                    <option key={am} value={am}>{am}</option>
                  ))}
                </select>
              </div>

            </div>
          )}
        </div>

        {/* Results Info Bar */}
        <div className="flex items-center justify-between text-xs text-neutral-500 font-medium px-1">
          <span>Found <strong>{filteredAndSortedProjects.length}</strong> matching premium developments in Kenya</span>
          {searchQuery || selectedLocation !== "all" || selectedType !== "all" || selectedStatus !== "all" || selectedPriceRange !== "all" || selectedAmenity !== "all" ? (
            <button 
              onClick={() => {
                setSearchQuery("");
                setSelectedLocation("all");
                setSelectedType("all");
                setSelectedStatus("all");
                setSelectedPriceRange("all");
                setSelectedAmenity("all");
              }}
              className="text-amber-700 hover:underline font-bold"
            >
              Clear filters
            </button>
          ) : null}
        </div>

        {/* Main Grid Display */}
        {filteredAndSortedProjects.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-dashed border-stone-200 space-y-2">
            <Compass className="w-10 h-10 text-stone-300 mx-auto animate-pulse" />
            <h4 className="text-sm font-bold text-neutral-850 uppercase font-mono">No matching boutique listings found</h4>
            <p className="text-xs text-neutral-500 max-w-md mx-auto">Try broadening your search metrics or location configurations. Standard real estate markets fluctuate based on currency volatility indexes.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedProjects.map((proj) => {
              const displayStatus = proj.status === "completed" ? "Completed" : proj.status === "ongoing" ? "Ongoing" : "Offplan";
              const statusColors = {
                completed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
                ongoing: "bg-amber-50 text-amber-700 border border-amber-205",
                offplan: "bg-blue-50 text-blue-700 border border-blue-200"
              };
              const projectStatusKey = proj.status || "ongoing";
              const statusStyle = statusColors[projectStatusKey] || statusColors.ongoing;

              return (
                <div
                  key={proj.id}
                  onClick={() => handlePropertyClick(proj.id)}
                  id={`property-grid-${proj.id}`}
                  className="bg-white border border-stone-200 hover:border-neutral-400 rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="relative aspect-video overflow-hidden bg-stone-100 border-b border-stone-150">
                    <img 
                      src={proj.virtualTourMedia?.livingRoom || "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200"} 
                      alt={`${proj.name} - Luxury ${proj.type || "Apartment"} in ${proj.location}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Floating badges */}
                    <div className="absolute top-2.5 left-2.5 z-10 flex gap-1.5">
                      <span className={`text-[9px] uppercase font-mono font-extrabold px-2 py-0.5 rounded-md ${statusStyle}`}>
                        {displayStatus}
                      </span>
                      {proj.isFeatured && (
                        <span className="bg-neutral-950 text-amber-400 text-[9px] uppercase font-mono font-extrabold px-2 py-0.5 rounded-md shadow-sm">
                          HOT
                        </span>
                      )}
                    </div>

                    <div className="absolute top-2.5 right-2.5 z-10 flex gap-1.5">
                      <span className="bg-black/60 backdrop-blur-md text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Eye className="w-3 h-3 text-stone-300" /> {proj.views || 60}
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 right-2.5 z-10">
                      <span className="bg-amber-400 text-neutral-950 font-black text-[9px] font-mono tracking-tight px-2 py-0.5 rounded-md border border-amber-500 shadow-sm">
                        {proj.roiRentalYield} Yield
                      </span>
                    </div>
                  </div>

                  {/* Property Card details */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block font-bold truncate max-w-[150px]">{proj.developerName}</span>
                        <div className="flex items-center gap-0.5 font-bold text-[10px] text-amber-500">
                          <Star className="w-3 h-3 fill-current" /> {proj.overallRating}
                        </div>
                      </div>
                      
                      <h4 className="text-[15px] font-bold text-neutral-900 group-hover:text-amber-600 transition-colors">{proj.name}</h4>
                      
                      <span className="text-[11px] text-neutral-500 flex items-center gap-1 font-semibold uppercase tracking-wider">
                        <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" /> {proj.location}
                      </span>
                      
                      <p className="text-[11px] text-zinc-500 leading-normal line-clamp-2">
                        {proj.description || proj.tagline}
                      </p>
                    </div>

                    {/* Progress indicator */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[9px]">
                        <span className="text-zinc-400 font-mono">BUILD PROGRESS</span>
                        <span className="text-zinc-800 font-bold font-mono">{proj.constructionProgress}%</span>
                      </div>
                      <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden border border-stone-200">
                        <div className="bg-neutral-950 h-full rounded-full" style={{ width: `${proj.constructionProgress}%` }} />
                      </div>
                    </div>

                    {/* Price and Action button */}
                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] font-mono text-stone-400 block uppercase">STARTING FROM</span>
                        <strong className="text-xs text-neutral-950 font-mono tracking-tight font-black">{proj.priceRange}</strong>
                      </div>
                      <span className="text-xs font-bold text-neutral-900 hover:text-amber-600 transition-all group-hover:-translate-x-1 flex items-center gap-1 font-sans">
                        See Blueprint <Compass className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      </span>
                    </div>

                    {/* Integrated Inline VR Tour Web Embed Showroom */}
                    {proj.vrTourUrl && (
                      <div className="pt-2 border-t border-stone-100 flex flex-col gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedVRId(expandedVRId === proj.id ? null : proj.id);
                          }}
                          className={`w-full py-2 px-3 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                            expandedVRId === proj.id
                              ? "bg-amber-400 text-neutral-950 border border-amber-450"
                              : "bg-neutral-950 text-white hover:bg-neutral-800"
                          }`}
                        >
                          🌐 {expandedVRId === proj.id ? "Collapse Virtual 3D Tour Embed" : "Show Live Virtual Walkthrough Embed"}
                        </button>

                        {expandedVRId === proj.id && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="relative rounded-2xl overflow-hidden aspect-video bg-stone-50 border border-stone-200 shadow-inner mt-1 animate-fadeIn"
                          >
                            <iframe
                              src={proj.vrTourUrl}
                              title={`${proj.name} Live Interactive Digital Walkthrough`}
                              className="w-full h-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; xr-spatial-tracking"
                              allowFullScreen
                            />
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Elegant Real Estate SEO Footer Block */}
      <footer className="pt-6 border-t border-zinc-200/60 text-center text-[10px] text-zinc-400 font-mono max-w-2xl mx-auto space-y-2">
        <p>© 2026 PROPSPHERE REAL ESTATE ADVISORY LTD. CO. NAIROBI, KENYA.</p>
        <p>ALL SPECIFICATIONS SUBJECT TO COUNTY REGISTRATION MATRIX GUIDELINES. RENTAL AND CAPITAL APPRECIATION SCHEDULING FORECASTS ARE POWERED INTELLIGENTLY VIA PROPSPHERE AI LABS.</p>
      </footer>
    </article>
  );
}
