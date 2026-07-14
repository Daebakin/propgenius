// FILE: components/services/ServiceProviderCard.tsx

import React from 'react';
import { ShieldCheck, Star, MapPin, Briefcase, Award } from 'lucide-react';
import { ServiceProvider } from '../../types/services';

interface ServiceProviderCardProps {
  provider: ServiceProvider;
  onViewProfile: (provider: ServiceProvider) => void;
  onBookNow: (provider: ServiceProvider) => void;
  formatPrice: (priceVal: number, project?: any) => string;
}

const ServiceProviderCard: React.FC<ServiceProviderCardProps> = ({
  provider,
  onViewProfile,
  onBookNow,
  formatPrice,
}) => {
  // Categorization Styles and Labels
  const categoryMeta: Record<string, { label: string; color: string; bg: string }> = {
    lawyer: { label: 'Property Lawyer', color: 'text-amber-500', bg: 'bg-amber-50' },
    valuer: { label: 'Certified Valuer', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    mortgage_broker: { label: 'Mortgage Broker', color: 'text-sky-500', bg: 'bg-sky-50' },
    interior_designer: { label: 'Interior Designer', color: 'text-purple-500', bg: 'bg-purple-50' },
    moving_company: { label: 'Moving Company', color: 'text-rose-500', bg: 'bg-rose-50' },
    home_inspector: { label: 'Home Inspector', color: 'text-blue-500', bg: 'bg-indigo-50' },
  };

  const currentMeta = categoryMeta[provider.category] || { label: 'Consultant', color: 'text-neutral-500', bg: 'bg-neutral-50' };

  // Price formatting handler
  // Starting price can be in USD or KES. 
  // We need to convert startingPrice into base USD value first if it's in KES (using 1 USD = 130 KES),
  // then format using our global formatPrice, or format directly.
  const displayStructuredPrice = () => {
    let usdPrice = provider.startingPrice;
    if (provider.priceCurrency === 'KES') {
      usdPrice = provider.startingPrice / 130;
    }
    // Now pass to standard formatPrice which accepts a USD-equivalent property price value
    return formatPrice(usdPrice);
  };

  return (
    <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full group">
      {/* Cover Showcase / Category Banner */}
      <div className="relative h-32 w-full bg-stone-100 overflow-hidden">
        {provider.coverImage ? (
          <img 
            src={provider.coverImage} 
            alt={provider.businessName} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-neutral-900 to-stone-750 flex items-center justify-center font-black text-amber-500 tracking-wider">
            PROPSPHERE SERVICES
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className={`text-[10px] font-mono uppercase font-bold tracking-widest px-2.5 py-1.5 rounded-full ${currentMeta.color} ${currentMeta.bg} border border-[#eee]/30 shadow-sm backdrop-blur-md`}>
            {currentMeta.label}
          </span>
        </div>
        {provider.isVerified && (
          <div className="absolute top-3 right-3 bg-neutral-950 text-white flex items-center gap-1 text-[10px] uppercase font-mono font-bold tracking-widest px-2.5 py-1 rounded-full shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            Verified
          </div>
        )}
      </div>

      {/* Profile Details Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2.5">
          {/* Logo & Title */}
          <div className="flex items-start gap-3.5">
            {provider.logo ? (
              <img 
                src={provider.logo} 
                alt={provider.businessName} 
                className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-400 font-bold shrink-0">
                {provider.businessName.substring(0, 2).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <h3 className="font-semibold text-neutral-900 text-sm tracking-tight leading-snug hover:text-amber-500 transition-colors cursor-pointer line-clamp-1" onClick={() => onViewProfile(provider)}>
                {provider.businessName}
              </h3>
              <p className="text-[11px] text-neutral-500 font-medium font-mono">
                By {provider.ownerName}
              </p>
            </div>
          </div>

          {/* Ratings & Metrics */}
          <div className="flex items-center gap-4 text-xs font-mono font-bold border-b border-stone-100 pb-3">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{provider.rating.toFixed(1)}</span>
              <span className="text-neutral-400 font-normal">({provider.totalReviews})</span>
            </div>
            <div className="text-stone-400 font-normal">•</div>
            <div className="text-[#333] flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-stone-500" />
              <span>{provider.yearsExperience} yrs exp</span>
            </div>
          </div>

          {/* Description Snippet */}
          <p className="text-[11px] leading-relaxed text-stone-600 line-clamp-2 h-9">
            {provider.description}
          </p>

          {/* Area of Service Badges */}
          <div className="flex flex-wrap gap-1.5 pt-1.5">
            {provider.serviceArea.slice(0, 3).map((area, idx) => (
              <span key={idx} className="flex items-center gap-0.5 text-[9px] font-mono text-neutral-500 bg-stone-100 px-2 py-0.5 rounded-md">
                <MapPin className="w-2.5 h-2.5 text-stone-400 shrink-0" />
                {area}
              </span>
            ))}
            {provider.serviceArea.length > 3 && (
              <span className="text-[9px] font-mono text-neutral-400 bg-stone-50 px-1.5 py-0.5 rounded-md">
                +{provider.serviceArea.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Call to Actions */}
        <div className="pt-4 mt-4 border-t border-stone-150 flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest block">Starting At</span>
            <strong className="text-sm font-black text-neutral-900 font-mono">
              {displayStructuredPrice()}
            </strong>
          </div>

          <div className="flex items-center gap-1.5">
            <button 
              type="button" 
              onClick={() => onViewProfile(provider)}
              className="text-[11px] font-extrabold uppercase tracking-wide border border-stone-200 px-3.5 py-2 rounded-xl text-neutral-700 bg-stone-50 hover:bg-white cursor-pointer active:scale-95 transition-all"
            >
              Profile
            </button>
            <button 
              type="button" 
              onClick={() => onBookNow(provider)}
              className="text-[11px] font-extrabold uppercase tracking-wide bg-amber-400 hover:bg-amber-350 text-neutral-950 px-4 py-2 rounded-xl cursor-pointer active:scale-95 transition-all shadow-sm"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderCard;
