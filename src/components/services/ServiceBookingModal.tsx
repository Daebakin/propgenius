// FILE: components/services/ServiceBookingModal.tsx

import React, { useState } from 'react';
import { X, Calendar, DollarSign, Clock, HelpCircle, ShieldAlert } from 'lucide-react';
import { ServiceProvider, ServiceBooking } from '../../types/services';
import { ServiceService } from '../../services/serviceService';

interface ServiceBookingModalProps {
  provider: ServiceProvider;
  onClose: () => void;
  currentUser: any;
  onSuccess: (booking: ServiceBooking) => void;
  displayCurrency: 'USD' | 'KES';
}

export default function ServiceBookingModal({
  provider,
  onClose,
  currentUser,
  onSuccess,
  displayCurrency
}: ServiceBookingModalProps) {
  const [description, setDescription] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('10:00 AM');
  const [budget, setBudget] = useState<number>(() => {
    // Determine default startingPrice converted based on current displayCurrency
    let baseUSD = provider.startingPrice;
    if (provider.priceCurrency === 'KES') {
      baseUSD = provider.startingPrice / 130;
    }
    return displayCurrency === 'KES' ? Math.round(baseUSD * 130) : Math.round(baseUSD);
  });
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || 'buyer@propsphere.com');
  const [name, setName] = useState(currentUser?.username || 'John Doe');
  const [serviceType, setServiceType] = useState(() => {
    switch (provider.category) {
      case 'lawyer': return 'Title Deed Conveyancing & Searches';
      case 'valuer': return 'Official Market Valuation';
      case 'mortgage_broker': return 'Home Mortgage Comparison Negotiation';
      case 'interior_designer': return 'Full-Suite Apartment Interior Staging';
      case 'moving_company': return 'Local Relocation Package (Premium Move)';
      case 'home_inspector': return 'Detailed Structural Survey Inspection';
      default: return 'Service Consultation';
    }
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Service types based on category
  const getServiceTypesList = () => {
    switch (provider.category) {
      case 'lawyer':
        return [
          'Title Deed Conveyancing & Searches',
          'Sales Agreement Review & Drafting',
          'Joint Venture Legal Alignment',
          'Charge & Lien Real Estate Searches'
        ];
      case 'valuer':
        return [
          'Official Market Valuation',
          'Rental Appraisals (High-Yield Verification)',
          'Structural Pre-Purchase Integrity Surveys',
          'Subdivision Feasibility Appraisals'
        ];
      case 'mortgage_broker':
        return [
          'Home Mortgage Comparison Negotiation',
          ' diaspora Financial Prequalification',
          'Commercial Project Financing Lines',
          'Cooperative Loan Refinancing'
        ];
      case 'interior_designer':
        return [
          'Full-Suite Apartment Interior Staging',
          '3D Space Planning Renderings',
          'Custom Furniture & Fittings Procurement',
          'Airbnb Staging Optimization'
        ];
      case 'moving_company':
        return [
          'Local Relocation Package (Premium Move)',
          'International Diaspora Air Cargo Move',
          'Office Workspace Re-assembly Logistics',
          'Transit-Insured Fragile Moving only'
        ];
      case 'home_inspector':
        return [
          'Detailed Structural Survey Inspection',
          'Electrical & Concrete Thermal Audit',
          'Mechanical Plumbing Damage Discovery',
          'Off-Plan Snag List Verification'
        ];
      default:
        return ['General Professional Consultation'];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setErrorMsg('Please describe details about your real estate task.');
      return;
    }
    if (!preferredDate) {
      setErrorMsg('Preferred consultation date is required.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      // In the database or booking, the amount and budget are recorded.
      // If displayCurrency is KES, we store the amount converted or raw, but we keep it clean.
      const freshBooking = await ServiceService.createBooking({
        providerId: provider.id,
        providerName: provider.businessName,
        userId: currentUser?.id || 'user-buyer-1',
        userName: name,
        userEmail: email,
        userPhone: phone,
        serviceType,
        description,
        preferredDate,
        preferredTime,
        budget: Number(budget),
        status: 'pending'
      });

      onSuccess(freshBooking);
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong while booking the partner advisor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-white max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl relative">
        {/* Header bar */}
        <div className="bg-neutral-950 text-white p-5 flex items-center justify-between">
          <div className="text-left">
            <span className="text-[9px] uppercase tracking-widest text-[#aaa] font-mono">PROPSPHERE DIRECT SERVICES</span>
            <h3 className="text-sm font-black tracking-tight mt-0.5">Book {provider.businessName}</h3>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="text-white hover:text-amber-400 p-1 rounded-full cursor-pointer transition-all active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form area */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4 max-h-[80vh] overflow-y-auto text-left">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-mono flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              {errorMsg}
            </div>
          )}

          {/* Service categorization selection */}
          <div className="space-y-1">
            <label className="text-[10px] text-stone-500 font-mono font-bold block uppercase">Select Service Package</label>
            <select 
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-3 outline-none focus:bg-white"
            >
              {getServiceTypesList().map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-stone-500 font-mono font-bold block uppercase">Preferred Date</label>
              <input 
                type="date" 
                required
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-3 outline-none focus:bg-white" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-stone-500 font-mono font-bold block uppercase">Preferred Time</label>
              <input 
                type="text" 
                required
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                placeholder="e.g. 10:00 AM"
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-3 outline-none focus:bg-white" 
              />
            </div>
          </div>

          {/* Budget Field, tied of real multi-tenancy toggled display currency */}
          <div className="space-y-1">
            <label className="text-[10px] text-stone-500 font-mono font-bold block uppercase flex items-center justify-between">
              <span>Target Budget Limit</span>
              <span className="text-amber-600">Starting base: {displayCurrency} {budget.toLocaleString()}</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-neutral-400">
                {displayCurrency}
              </span>
              <input 
                type="number" 
                required
                min={1}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl py-3 pl-14 pr-4 outline-none focus:bg-white font-mono font-bold" 
              />
            </div>
          </div>

          {/* Description of real estate task */}
          <div className="space-y-1">
            <label className="text-[10px] text-stone-500 font-mono font-bold block uppercase">Requirement Details</label>
            <textarea 
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a description of your project, e.g., Title deed checking on Kilimani block, staging services timeline..."
              className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-3 outline-none focus:bg-white resize-none"
            />
          </div>

          <div className="border-t border-stone-100 pt-4 space-y-3">
            <strong className="text-[10px] text-[#444] font-mono tracking-widest font-black block uppercase">PREFILL PRIMARY CONTACT CREDENTIALS</strong>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-mono text-neutral-400 block font-bold">Contact Name</span>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs bg-stone-100/50 border border-stone-200 rounded-lg p-2.5 px-3" 
                />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-mono text-neutral-400 block font-bold">Phone Number</span>
                <input 
                  type="text" 
                  value={phone} 
                  required
                  placeholder="+254..."
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs bg-stone-100/50 border border-stone-200 rounded-lg p-2.5 px-3" 
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full text-center bg-neutral-950 hover:bg-neutral-900 border border-neutral-950 text-white font-extrabold text-[11px] py-4 rounded-xl uppercase tracking-widest cursor-pointer select-none mt-6 active:scale-[98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting secure reservation...' : 'Confirm Secure Booking Request'}
          </button>
        </form>
      </div>
    </div>
  );
}
