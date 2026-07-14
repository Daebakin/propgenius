import React, { useState, useMemo } from "react";
import { 
  Search, 
  MapPin, 
  Layers, 
  DollarSign, 
  TrendingUp, 
  Sparkles, 
  Compass, 
  Tag,
  Building,
  ArrowRight,
  PhoneCall,
  Send,
  CheckCircle,
  FileCheck,
  Maximize2,
  X
} from "lucide-react";
import { OtherProperty } from "../types";

interface OtherPropertiesPageProps {
  otherProperties: OtherProperty[];
  onAddActivityLog?: (text: string) => void;
  formatPrice: (priceVal: number) => string;
}

export default function OtherPropertiesPage({
  otherProperties,
  onAddActivityLog,
  formatPrice
}: OtherPropertiesPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedZoning, setSelectedZoning] = useState<string>("all");
  
  // Offer modal state
  const [selectedPropForOffer, setSelectedPropForOffer] = useState<OtherProperty | null>(null);
  const [offerName, setOfferName] = useState("");
  const [offerEmail, setOfferEmail] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const [isSubmittingOffer, setIsSubmittingOffer] = useState(false);
  const [offerSuccess, setOfferSuccess] = useState(false);

  // Filter logic
  const filteredProperties = useMemo(() => {
    let list = [...otherProperties];

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.zoning.toLowerCase().includes(q)
      );
    }

    if (selectedLocation !== "all") {
      list = list.filter(p => p.location.toLowerCase() === selectedLocation.toLowerCase());
    }

    if (selectedType !== "all") {
      list = list.filter(p => p.type.toLowerCase() === selectedType.toLowerCase());
    }

    if (selectedZoning !== "all") {
      list = list.filter(p => p.zoning.toLowerCase().includes(selectedZoning.toLowerCase()));
    }

    return list;
  }, [otherProperties, searchQuery, selectedLocation, selectedType, selectedZoning]);

  // Handle submitting a purchase offer / inquiry
  const handleSendOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPropForOffer || !offerName || !offerEmail || !offerPrice) return;

    setIsSubmittingOffer(true);
    try {
      // Simulate/post the lead to the leads collection
      const resp = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName: `[Land Offer] ${selectedPropForOffer.name}`,
          unitNumber: `Plot ${selectedPropForOffer.size}`,
          buyerName: offerName,
          buyerEmail: offerEmail,
          buyerPhone: "+254711222333",
          paymentPlan: `Offer Amount: KES ${offerPrice}`,
          bookingFeePaid: 100000, // standard placeholder escrow commit
          status: "Pending Land Escrow"
        })
      });

      if (resp.ok) {
        setOfferSuccess(true);
        if (onAddActivityLog) {
          onAddActivityLog(`🏞️ Buyer ${offerName} submitted an offer of KES ${offerPrice} for Land ID ${selectedPropForOffer.name} in ${selectedPropForOffer.location}.`);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingOffer(false);
    }
  };

  return (
    <article className="space-y-8 text-neutral-900 animate-fade-in pb-12">
      {/* Page Header */}
      <header className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Developer Land & Subdivisions Index
        </div>
        <h1 className="text-4xl md:text-5xl font-sans font-black uppercase tracking-tight text-neutral-950 leading-none">
          Upmarket Land & Prime Plots
        </h1>
        <p className="text-sm text-neutral-550 leading-relaxed max-w-2xl mx-auto">
          Pre-vetted development footprints, commercial quadrants, and cluster-villa plots located inside Nairobi’s highest capital-appreciation corridors. Engineered with certified dual frontages, approved multi-family zoning configurations, and clean digital titles for builders.
        </p>
      </header>

      {/* Advanced Filter Box */}
      <section className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-4 text-left">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Keyword Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input 
              type="text"
              placeholder="Search by keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 text-xs p-3 pl-10 rounded-2xl outline-none focus:border-amber-400"
            />
          </div>

          {/* Upmarket Locations */}
          <div className="space-y-1">
            <select 
              value={selectedLocation} 
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 text-xs p-3 rounded-2xl outline-none focus:border-amber-400"
            >
              <option value="all">📍 All Upmarket Regions</option>
              <option value="Westlands">Westlands</option>
              <option value="Kilimani">Kilimani</option>
              <option value="Kileleshwa">Kileleshwa</option>
              <option value="Karen">Karen</option>
              <option value="Lavington">Lavington</option>
            </select>
          </div>

          {/* Property Type */}
          <div className="space-y-1">
            <select 
              value={selectedType} 
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 text-xs p-3 rounded-2xl outline-none focus:border-amber-400"
            >
              <option value="all">📁 All Classifications</option>
              <option value="Land">Vacant Land</option>
              <option value="Plot">Subdivided Plot</option>
            </select>
          </div>

          {/* Zoning Select */}
          <div className="space-y-1">
            <select 
              value={selectedZoning} 
              onChange={(e) => setSelectedZoning(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 text-xs p-3 rounded-2xl outline-none focus:border-amber-400"
            >
              <option value="all">🏢 All Zoning Configurations</option>
              <option value="Commercial">Commercial / Mixed-Use</option>
              <option value="Residential High-Density">Residential High-Density</option>
              <option value="Residential Cluster">Townhouse / Cluster Villas</option>
              <option value="Single-Family">Single-Family Estates</option>
            </select>
          </div>

        </div>

        {/* Dynamic Tagline Cloud */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1.5 text-[11px] text-neutral-500">
          <span className="font-mono uppercase text-[9px] text-neutral-400 font-extrabold mr-1">Hot Areas:</span>
          {["Westlands Commercial Hub", "Kilimani Apartments Footprint", "Karen Gated Subdivisions", "Lavington Cluster Acres", "Kileleshwa Corner Plots"].map((tag, i) => (
            <button 
              key={i}
              onClick={() => {
                const keyword = tag.split(" ")[0];
                setSelectedLocation(keyword);
              }}
              className="px-2.5 py-1 rounded-xl bg-stone-50 hover:bg-amber-100 border border-stone-150 hover:border-amber-200 transition-colors cursor-pointer font-bold text-[10px]"
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* Grid Results */}
      {filteredProperties.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-dashed border-stone-200 space-y-2">
          <Compass className="w-10 h-10 text-stone-300 mx-auto animate-pulse" />
          <h4 className="text-sm font-bold text-neutral-850 uppercase font-mono">No matching Land/Plot footprint found</h4>
          <p className="text-xs text-neutral-500 max-w-md mx-auto">Try broadening your search metrics. Upmarket real estate subdivisions sell rapidly to corporate developers.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((prop) => (
            <div 
              key={prop.id}
              className="bg-white border border-stone-200 hover:border-neutral-400 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-left group"
              id={`other-prop-card-${prop.id}`}
            >
              {/* Image preview */}
              <div className="relative aspect-video overflow-hidden bg-stone-100 border-b border-stone-150">
                <img 
                  src={prop.imageUrl || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200"} 
                  alt={`${prop.name} - Premium ${prop.type || "Listing"} in ${prop.location}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                  referrerPolicy="no-referrer"
                />
                
                {/* Float Badges */}
                <div className="absolute top-2.5 left-2.5 z-10 flex gap-1.5">
                  <span className="bg-amber-400 text-neutral-950 text-[9px] uppercase font-mono font-extrabold px-2.5 py-0.5 rounded-md border border-amber-500 shadow-sm">
                    {prop.type}
                  </span>
                  <span className="bg-neutral-950 text-white text-[9px] uppercase font-mono font-extrabold px-2.5 py-0.5 rounded-md shadow-sm">
                    {prop.size}
                  </span>
                </div>

                <div className="absolute bottom-2.5 right-2.5 z-10">
                  <span className="bg-black/70 backdrop-blur-md text-white font-mono text-[9px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-400" /> Pre-Vetted Title
                  </span>
                </div>
              </div>

              {/* Specifications */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-stone-400">
                    <span className="uppercase font-extrabold">{prop.zoning}</span>
                    <span>VIEWS: {prop.views}</span>
                  </div>
                  
                  <h4 className="text-base font-bold text-neutral-950 group-hover:text-amber-600 transition-colors leading-tight">
                    {prop.name}
                  </h4>

                  <span className="text-[11px] text-neutral-500 flex items-center gap-1 uppercase tracking-wider font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" /> {prop.location}, Nairobi
                  </span>

                  <p className="text-xs text-neutral-550 leading-relaxed line-clamp-3">
                    {prop.description}
                  </p>
                </div>

                {/* Highlights check cloud */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {prop.highlights.map((hl, index) => (
                    <span 
                      key={index} 
                      className="text-[9px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-md px-2 py-0.5 flex items-center gap-1 font-bold"
                    >
                      <CheckCircle className="w-3 h-3 text-emerald-500" /> {hl}
                    </span>
                  ))}
                </div>

                {/* Pricing & Builder Purchase action */}
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[9px] font-mono text-stone-400 block uppercase font-bold">DIRECT OWNER PRICE</span>
                    <strong className="text-sm text-neutral-950 font-mono tracking-tight font-black">
                      {formatPrice(prop.price)}
                    </strong>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedPropForOffer(prop);
                      setOfferPrice(prop.price.toString());
                      setOfferSuccess(false);
                    }}
                    className="bg-neutral-950 hover:bg-neutral-850 text-amber-400 px-3.5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-md flex items-center gap-1 cursor-pointer"
                  >
                    Submit Offer / Buy <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Purchase / Offer Submission Modal */}
      {selectedPropForOffer && (
        <div className="fixed inset-0 bg-neutral-950/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200 text-neutral-900 animate-scale-up text-left">
            <header className="p-4 bg-neutral-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-amber-400" />
                <h3 className="text-xs font-mono uppercase font-black tracking-widest text-amber-400">Land Purchase Protocol</h3>
              </div>
              <button 
                onClick={() => setSelectedPropForOffer(null)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            {offerSuccess ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-neutral-950 uppercase font-mono">Offer Submitted Successfully!</h4>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Your purchase intent for <strong>{selectedPropForOffer.name}</strong> has been logged inside our land escrow. A certified valuer will reach out to schedule due diligence verification of the Title Deed.
                </p>
                <button
                  onClick={() => setSelectedPropForOffer(null)}
                  className="w-full bg-neutral-950 text-amber-400 font-black text-xs uppercase py-3 rounded-2xl block text-center"
                >
                  Return to Market
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendOffer} className="p-5 space-y-4">
                <div className="bg-amber-50 border border-amber-100 p-3 rounded-2xl text-[10px] text-amber-900 leading-relaxed font-semibold">
                  Property Selected: <strong>{selectedPropForOffer.name} ({selectedPropForOffer.location})</strong> • Valuation price is estimated at {formatPrice(selectedPropForOffer.price)}.
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-stone-400 font-extrabold uppercase tracking-wider block">Developer / Buyer Full Name</label>
                  <input 
                    type="text"
                    required
                    value={offerName}
                    onChange={(e) => setOfferName(e.target.value)}
                    placeholder="Enter your name or developer entity..."
                    className="w-full bg-stone-50 border border-stone-200 text-xs p-3 rounded-xl outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-stone-400 font-extrabold uppercase tracking-wider block">Email Address</label>
                  <input 
                    type="email"
                    required
                    value={offerEmail}
                    onChange={(e) => setOfferEmail(e.target.value)}
                    placeholder="name@developercompany.com"
                    className="w-full bg-stone-50 border border-stone-200 text-xs p-3 rounded-xl outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-stone-400 font-extrabold uppercase tracking-wider block">Offer Amount (KES)</label>
                  <input 
                    type="number"
                    required
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    placeholder={selectedPropForOffer.price.toString()}
                    className="w-full bg-stone-50 border border-stone-200 text-xs p-3 rounded-xl outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-stone-400 font-extrabold uppercase tracking-wider block">Letter of Intent / Custom Notes</label>
                  <textarea 
                    value={offerMessage}
                    onChange={(e) => setOfferMessage(e.target.value)}
                    rows={2}
                    placeholder="Describe any custom terms, financing schedules, or joint-venture outlines..."
                    className="w-full bg-stone-50 border border-stone-200 text-xs p-3 rounded-xl outline-none focus:border-amber-400 font-sans"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedPropForOffer(null)}
                    className="w-1/3 py-3 border border-stone-200 text-neutral-600 font-extrabold text-xs uppercase rounded-2xl block text-center hover:bg-stone-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingOffer}
                    className="flex-1 bg-neutral-950 hover:bg-neutral-850 disabled:opacity-50 text-amber-400 font-black text-xs uppercase py-3 rounded-2xl flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isSubmittingOffer ? "Submitting Protocol..." : "Submit Formal Offer"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer Block */}
      <footer className="pt-6 border-t border-zinc-200/60 text-center text-[10px] text-zinc-400 font-mono max-w-2xl mx-auto space-y-1">
        <p>© 2026 PROPSPHERE REAL ESTATE ADVISORY LTD. CO. LAND DIVISION.</p>
        <p>ALL LAND TITLE INQUIRIES ROUTED THROUGH NAIROBI COUNTY LANDS OFFICE (ARDHI HOUSE) ONLINE ESCROW PROTOCOLS.</p>
      </footer>
    </article>
  );
}
