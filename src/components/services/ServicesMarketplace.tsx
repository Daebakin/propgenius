// FILE: components/services/ServicesMarketplace.tsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scale, ClipboardCheck, Landmark, Sofa, Truck, CheckSquare, 
  Search, SlidersHorizontal, PlusCircle, HelpCircle, Briefcase, 
  User, CheckCircle, ShieldCheck, MapPin, Building, Info 
} from 'lucide-react';
import { ServiceProvider, ServiceBooking, ServiceCategory } from '../../types/services';
import { ServiceService } from '../../services/serviceService';
import ServiceProviderCard from './ServiceProviderCard';
import ServiceProviderProfile from './ServiceProviderProfile';
import ServiceBookingModal from './ServiceBookingModal';
import ProviderRegistrationModal from './ProviderRegistrationModal';
import ServiceProviderDashboard from './ServiceProviderDashboard';

interface ServicesMarketplaceProps {
  currentUser: any;
  formatPrice: (priceVal: number, project?: any) => string;
  displayCurrency: 'USD' | 'KES';
}

export default function ServicesMarketplace({
  currentUser,
  formatPrice,
  displayCurrency
}: ServicesMarketplaceProps) {
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filters State
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'price_low' | 'price_high' | 'experience'>('rating');
  const [serviceAreaFilter, setServiceAreaFilter] = useState('');

  // Modals state
  const [selectedProviderForProfile, setSelectedProviderForProfile] = useState<ServiceProvider | null>(null);
  const [selectedProviderForBooking, setSelectedProviderForBooking] = useState<ServiceProvider | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [successBookingMessage, setSuccessBookingMessage] = useState<ServiceBooking | null>(null);

  // Registered Advisor Node state
  const [registeredNode, setRegisteredNode] = useState<ServiceProvider | null>(null);
  const [viewMode, setViewMode] = useState<'buyer' | 'provider'>('buyer');

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const data = await ServiceService.getProviders();
      setProviders(data);

      // Check if current user is registered as provider
      if (currentUser) {
        const matchingNode = data.find(p => p.email.toLowerCase() === currentUser.email.toLowerCase());
        if (matchingNode) {
          setRegisteredNode(matchingNode);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, [currentUser]);

  // Categories metadata
  const categoriesList = [
    { id: 'all', label: 'All Services', icon: HelpCircle, color: 'text-[#333]', bg: 'bg-stone-100', desc: 'Browse all vetted real estate specialists.' },
    { id: 'lawyer', label: 'Property Lawyers', icon: Scale, color: 'text-amber-500', bg: 'bg-amber-50', desc: 'Conveyancing, title escrow checks, agreements.' },
    { id: 'valuer', label: 'Certified Valuers', icon: ClipboardCheck, color: 'text-emerald-500', bg: 'bg-emerald-50', desc: 'Shoring estate valuations & structural health audits.' },
    { id: 'mortgage_broker', label: 'Mortgage Brokers', icon: Landmark, color: 'text-sky-500', bg: 'bg-sky-50', desc: 'Match mortgages with Stanchart, NCBA & KCB.' },
    { id: 'interior_designer', label: 'Interior Stagers', icon: Sofa, color: 'text-purple-500', bg: 'bg-purple-50', desc: 'Bespoke apartment staging & space layouts.' },
    { id: 'moving_company', label: 'Moving Teams', icon: Truck, color: 'text-rose-500', bg: 'bg-rose-50', desc: 'Local and international cargo logistics.' },
    { id: 'home_inspector', label: 'Safe Inspectors', icon: CheckSquare, color: 'text-blue-500', bg: 'bg-indigo-50', desc: 'Thermal surveys, plumbing & snag verifies.' }
  ];

  // Price conversion helper for sorting
  const getBaseValueInUSD = (p: ServiceProvider) => {
    if (p.priceCurrency === 'KES') {
      return p.startingPrice / 130;
    }
    return p.startingPrice;
  };

  // Filter & Sort Logic
  const filteredAndSortedProviders = providers
    .filter(p => {
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesSearch = p.businessName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesArea = !serviceAreaFilter || p.serviceArea.some(a => a.toLowerCase().includes(serviceAreaFilter.toLowerCase())) || p.location.city.toLowerCase().includes(serviceAreaFilter.toLowerCase());
      
      return matchesCategory && matchesSearch && matchesArea;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'experience') return b.yearsExperience - a.yearsExperience;
      
      const priceA = getBaseValueInUSD(a);
      const priceB = getBaseValueInUSD(b);
      if (sortBy === 'price_low') return priceA - priceB;
      if (sortBy === 'price_high') return priceB - priceA;
      return 0;
    });

  const handleBookingCompleted = (booking: ServiceBooking) => {
    setSelectedProviderForBooking(null);
    setSelectedProviderForProfile(null);
    setSuccessBookingMessage(booking);
    setTimeout(() => setSuccessBookingMessage(null), 10000);
  };

  const handleRegistrationCompleted = (provider: ServiceProvider) => {
    setProviders(prev => [provider, ...prev]);
    setRegisteredNode(provider);
    setShowRegisterModal(false);
    setViewMode('provider');
    alert('Congratulations! Your Professional Advisor Node has been securely launched on our centralized registry.');
  };

  const currentCategoryMeta = categoriesList.find(c => c.id === selectedCategory) || categoriesList[0];

  return (
    <div className="space-y-8">
      {/* Dynamic Upper Top Banner */}
      <section className="bg-gradient-to-br from-neutral-950 to-stone-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl overflow-hidden relative">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-amber-400/10 blur-3xl rounded-full pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10 text-left">
          <div className="space-y-3 max-w-2xl">
            <span className="text-[10px] uppercase tracking-widest text-amber-400 font-mono font-bold block">Centralized Services Gateways</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-none text-white">
              Vetted Professional Advisory Network
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed font-sans font-medium">
              Protect your capital off-plan. Book vetted conveyancers, certified surveyors, cooperative mortgage brokers, luxury interior stagers, and trusted relocators directly within the PropSphere escrow corridor.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-2.5 shrink-0 w-full lg:w-auto">
            {registeredNode ? (
              <div className="flex flex-col gap-2">
                <span className="text-[9px] font-mono text-stone-400 uppercase">You have active listing</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setViewMode(viewMode === 'buyer' ? 'provider' : 'buyer')}
                    className="bg-amber-400 text-neutral-900 font-extrabold text-[10px] uppercase tracking-widest px-5 py-3 rounded-xl cursor-pointer"
                  >
                    {viewMode === 'buyer' ? 'View Advisor Dashboard' : 'View Marketplace'}
                  </button>
                </div>
              </div>
            ) : (
              <button 
                type="button"
                onClick={() => {
                  if (!currentUser) {
                    alert('Please secure an official PropSphere user account to launch an on-network service node.');
                    return;
                  }
                  setShowRegisterModal(true);
                }}
                className="bg-transparent border border-white/25 hover:border-amber-400 text-white font-extrabold text-[10px] uppercase tracking-widest px-5 py-3.5 rounded-xl cursor-pointer flex items-center justify-center gap-1.5 transition-all text-center"
              >
                <PlusCircle className="w-4 h-4 text-amber-400" /> Join As Service Provider
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Success Booking notification banner logic */}
      {successBookingMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
          <div className="space-y-1">
            <strong className="text-sm font-black font-sans block flex items-center gap-1.5">
              <CheckCircle className="w-5 h-5 text-emerald-500" /> Secure Consultation Booked!
            </strong>
            <p className="text-xs leading-relaxed font-sans font-medium">
              We have generated escrow reservation index <span className="font-mono font-bold underline">{successBookingMessage.bookingReference}</span>. 
              The partner advocate <strong>{successBookingMessage.providerName}</strong> was dispatched. 
              Review your inbox or coordinates at {successBookingMessage.userPhone} for scheduling confirmation.
            </p>
          </div>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">SLA Dispatch: Under 2h</span>
        </div>
      )}

      {/* RENDER MODE SPLIT */}
      {viewMode === 'provider' && registeredNode ? (
        <ServiceProviderDashboard 
          provider={registeredNode}
          currentUser={currentUser}
          onUpdateProvider={(updated) => setRegisteredNode(updated)}
          formatPrice={formatPrice}
        />
      ) : (
        /* BUYER MARKETPLACE LOOKUP VIEW */
        <div className="space-y-6">
          {/* Vetted categories slide selector row */}
          <div className="space-y-2.5 text-left">
            <h3 className="text-xs uppercase font-mono tracking-widest font-black text-neutral-400">Classify Domain Audits</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {categoriesList.map((cat) => {
                const IconComp = cat.icon;
                const isSelected = selectedCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id as ServiceCategory | 'all')}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between h-24 transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-[#111] border-neutral-950 text-white shadow-md scale-[102%]' 
                        : 'bg-white border-stone-200 text-[#444] hover:border-neutral-350 hover:bg-stone-50'
                    }`}
                  >
                    <IconComp className={`w-6 h-6 ${isSelected ? 'text-amber-400' : cat.color}`} />
                    <span className="text-[11px] font-extrabold tracking-tight leading-tight uppercase font-sans mt-2">
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="text-[11px] font-mono text-slate-400 mt-1">
              Active Scope: <span className="font-bold text-neutral-700 underline">{currentCategoryMeta.desc}</span>
            </p>
          </div>

          {/* Search, service area and Sorting rails */}
          <div className="bg-stone-50 border border-stone-200 p-5 rounded-3xl grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Query */}
            <div className="md:col-span-4 relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400">
                <Search className="w-4 h-4" />
              </span>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search advisor by firm, services, bio..." 
                className="w-full text-xs bg-white border border-stone-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-stone-350"
              />
            </div>

            {/* Service Area */}
            <div className="md:col-span-3 relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400">
                <MapPin className="w-4 h-4 text-stone-400" />
              </span>
              <input 
                type="text" 
                value={serviceAreaFilter}
                onChange={(e) => setServiceAreaFilter(e.target.value)}
                placeholder="Region, e.g., Westlands, Karen" 
                className="w-full text-xs bg-white border border-stone-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-stone-350"
              />
            </div>

            {/* Sorters */}
            <div className="md:col-span-5 flex items-center justify-between gap-3 text-xs w-full">
              <span className="text-stone-400 font-mono font-semibold shrink-0 uppercase tracking-widest text-[10px]">Sort by:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="flex-1 bg-white border border-stone-200 rounded-xl p-3 text-xs outline-none focus:border-stone-350"
              >
                <option value="rating">🏆 Highest Verified Rating</option>
                <option value="experience">💼 Years Active Experience</option>
                <option value="price_low">🪙 Price: Low to High</option>
                <option value="price_high">🪙 Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* MAIN GRID WORKSPACE */}
          {loading ? (
            <div className="py-24 text-center space-y-3">
              <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-neutral-500 font-mono uppercase tracking-wider">Acquiring licensed advisor registries...</p>
            </div>
          ) : filteredAndSortedProviders.length === 0 ? (
            <div className="py-16 text-center border-t border-stone-200 border-dashed max-w-sm mx-auto space-y-2">
              <Info className="w-8 h-8 text-stone-300 mx-auto" />
              <strong className="text-sm font-bold text-neutral-900 block font-sans">No matching service nodes matched</strong>
              <p className="text-xs text-stone-550 leading-relaxed font-sans">
                Try widening your search terms or selecting "All Services Category" above. Vetted agents can also register offices directly.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedProviders.map((provider) => (
                <ServiceProviderCard 
                  key={provider.id}
                  provider={provider}
                  onViewProfile={(p) => setSelectedProviderForProfile(p)}
                  onBookNow={(p) => setSelectedProviderForBooking(p)}
                  formatPrice={formatPrice}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* PERSISTENT MODALS CONTROLLER */}
      <AnimatePresence>
        {/* Detail Profile Drawer Modal */}
        {selectedProviderForProfile && (
          <ServiceProviderProfile 
            provider={selectedProviderForProfile}
            onClose={() => setSelectedProviderForProfile(null)}
            currentUser={currentUser}
            formatPrice={formatPrice}
            onBookNow={() => {
              setSelectedProviderForBooking(selectedProviderForProfile);
            }}
          />
        )}

        {/* Schedule/Booking modal */}
        {selectedProviderForBooking && (
          <ServiceBookingModal 
            provider={selectedProviderForBooking}
            onClose={() => setSelectedProviderForBooking(null)}
            currentUser={currentUser}
            displayCurrency={displayCurrency}
            onSuccess={handleBookingCompleted}
          />
        )}

        {/* Registration Modal */}
        {showRegisterModal && (
          <ProviderRegistrationModal 
            onClose={() => setShowRegisterModal(false)}
            onSuccess={handleRegistrationCompleted}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
