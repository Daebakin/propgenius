// FILE: components/services/ProviderRegistrationModal.tsx

import React, { useState } from 'react';
import { X, Check, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { ServiceCategory, ServiceProvider } from '../../types/services';
import { ServiceService } from '../../services/serviceService';

interface ProviderRegistrationModalProps {
  onClose: () => void;
  onSuccess: (provider: ServiceProvider) => void;
}

export default function ProviderRegistrationModal({
  onClose,
  onSuccess
}: ProviderRegistrationModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Step 1: Basic info
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('lawyer');
  const [description, setDescription] = useState('');

  // Step 2: Verification details
  const [licenseNumber, setLicenseNumber] = useState('');
  const [yearsExperience, setYearsExperience] = useState(5);
  const [serviceAreaInput, setServiceAreaInput] = useState('Westlands, Kilimani, Lavington, Kileleshwa, Karen');
  const [startingPrice, setStartingPrice] = useState(100);
  const [priceCurrency, setPriceCurrency] = useState<'USD' | 'KES'>('KES');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Nairobi');

  // Step 3: Terms
  const [agreeTerms, setAgreeTerms] = useState(false);

  const validateStep1 = () => {
    if (!businessName.trim() || !ownerName.trim() || !email.trim() || !phone.trim() || !description.trim()) {
      setErrorMsg('Please populate all basic credentials before continuing.');
      return false;
    }
    if (!email.includes('@')) {
      setErrorMsg('Please supply a valid communication email address.');
      return false;
    }
    setErrorMsg('');
    return true;
  };

  const validateStep2 = () => {
    if (!licenseNumber.trim() || !address.trim() || !city.trim() || startingPrice <= 0) {
      setErrorMsg('Please populate official licensing and starting fees.');
      return false;
    }
    setErrorMsg('');
    return true;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      if (validateStep2()) setStep(3);
    }
  };

  const handlePrevStep = () => {
    setErrorMsg('');
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      setErrorMsg('You must certify official High-Court status or relevant professional board registry.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const splitAreas = serviceAreaInput
        .split(',')
        .map(a => a.trim())
        .filter(Boolean);

      const registered = await ServiceService.registerProvider({
        businessName,
        ownerName,
        email,
        phone,
        category,
        description,
        licenseNumber,
        yearsExperience: Number(yearsExperience),
        serviceArea: splitAreas.length > 0 ? splitAreas : ['Nairobi'],
        startingPrice: Number(startingPrice),
        priceCurrency,
        location: {
          address,
          city
        }
      });

      onSuccess(registered);
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong during registrar node submission.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 overflow-y-auto">
      <div className="bg-white max-w-xl w-full rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
        
        {/* Header bar */}
        <div className="bg-neutral-950 text-white p-5 flex items-center justify-between">
          <div className="text-left">
            <span className="text-[9px] uppercase tracking-widest text-[#aaa] font-mono">PARTNER ONBOARDING HUB</span>
            <h3 className="text-sm font-black tracking-tight mt-0.5">Register Professional Advisor Node</h3>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="text-white hover:text-amber-400 p-1 rounded-full cursor-pointer transition-all active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step tracker bullets */}
        <div className="px-6 sm:px-8 pt-6 pb-2 grid grid-cols-3 gap-2 text-center text-xs font-mono font-bold text-neutral-400">
          <div className={`border-b-4 pb-2 ${step >= 1 ? 'border-amber-500 text-amber-500' : 'border-stone-100'}`}>
            1. Basic Bio
          </div>
          <div className={`border-b-4 pb-2 ${step >= 2 ? 'border-amber-500 text-amber-500' : 'border-stone-100'}`}>
            2. License & Location
          </div>
          <div className={`border-b-4 pb-2 ${step >= 3 ? 'border-amber-500 text-amber-500' : 'border-stone-100'}`}>
            3. Final Terms
          </div>
        </div>

        {/* Form Body Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 text-left">
          {errorMsg && (
            <div className="p-3 bg-red-100/60 border border-red-200 text-red-700 rounded-xl text-xs font-mono mb-4">
              {errorMsg}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-stone-500 font-mono font-bold block uppercase">Business Name</label>
                  <input 
                    type="text" 
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. LSK Conveyance Chambers"
                    className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-3 outline-none focus:bg-white" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-stone-500 font-mono font-bold block uppercase">Lead Advisor/Owner</label>
                  <input 
                    type="text" 
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="e.g. Albert Ndwiga, LL.M."
                    className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-3 outline-none focus:bg-white" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-stone-500 font-mono font-bold block uppercase">Work Email</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="partners@ops.co.ke"
                    className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-3 outline-none focus:bg-white" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-stone-500 font-mono font-bold block uppercase">Business Line</label>
                  <input 
                    type="text" 
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+254 7..."
                    className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-3 outline-none focus:bg-white" 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-stone-500 font-mono font-bold block uppercase">Professional Category Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-3 outline-none focus:bg-white"
                >
                  <option value="lawyer">⚖️ Property Lawyer / Conveyancer</option>
                  <option value="valuer">🏠 Certified Valuer / Appraisal Surveyor</option>
                  <option value="mortgage_broker">💳 Mortgage Broker / Financing Advisor</option>
                  <option value="interior_designer">🛋️ Interior Designer / Staging Expert</option>
                  <option value="moving_company">🚚 Moving Company / Prime Relocations</option>
                  <option value="home_inspector">🛠️ Home Structural Quality Inspector</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-stone-500 font-mono font-bold block uppercase">Description Of Qualifications</label>
                <textarea 
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell clients about your background, team experience, typical engagement timelines, and specialization, such as off-plan legal securities..."
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-3 outline-none focus:bg-white resize-none"
                />
              </div>

              <button 
                type="button" 
                onClick={handleNextStep}
                className="w-full bg-neutral-900 text-white font-extrabold text-[11px] py-4 rounded-xl uppercase tracking-widest cursor-pointer mt-6 flex items-center justify-center gap-1 hover:bg-black transition-all"
              >
                Verification Data <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-stone-500 font-mono font-bold block uppercase">Registrar Board License #</label>
                  <input 
                    type="text" 
                    required
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="e.g. LSK-2016/9932"
                    className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-3 outline-none focus:bg-white" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-stone-500 font-mono font-bold block uppercase">Years in Active Practice</label>
                  <input 
                    type="number" 
                    required
                    min={1}
                    value={yearsExperience}
                    onChange={(e) => setYearsExperience(Number(e.target.value))}
                    className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-3 outline-none focus:bg-white font-mono font-bold" 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-stone-500 font-mono font-bold block uppercase">Areas Of Operation (Comma Separated)</label>
                <input 
                  type="text" 
                  required
                  value={serviceAreaInput}
                  onChange={(e) => setServiceAreaInput(e.target.value)}
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-3 outline-none focus:bg-white" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
                <div className="md:col-span-8 space-y-1">
                  <label className="text-[10px] text-stone-500 font-mono font-bold block uppercase">Starting Consultation Fee</label>
                  <input 
                    type="number" 
                    required
                    min={1}
                    value={startingPrice}
                    onChange={(e) => setStartingPrice(Number(e.target.value))}
                    className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-3 outline-none focus:bg-white font-mono font-bold" 
                  />
                </div>
                <div className="md:col-span-4 space-y-1">
                  <label className="text-[10px] text-stone-500 font-mono font-bold block uppercase">Currency Base</label>
                  <select 
                    value={priceCurrency}
                    onChange={(e) => setPriceCurrency(e.target.value as 'USD' | 'KES')}
                    className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-3 outline-none focus:bg-white"
                  >
                    <option value="KES">KES (Kshs)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-stone-500 font-mono font-bold block uppercase">Company Office Address</label>
                  <input 
                    type="text" 
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Pine Tree suite 6, Westlands"
                    className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-3 outline-none focus:bg-white" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-stone-500 font-mono font-bold block uppercase">City</label>
                  <input 
                    type="text" 
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Nairobi"
                    className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-3 outline-none focus:bg-white" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={handlePrevStep}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs uppercase px-4 py-3.5 rounded-xl cursor-pointer"
                >
                  Back
                </button>
                <button 
                  type="button" 
                  onClick={handleNextStep}
                  className="bg-neutral-900 border border-neutral-900 text-white font-bold text-xs uppercase px-4 py-3.5 rounded-xl cursor-pointer hover:bg-black"
                >
                  Certify Terms
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200 space-y-3.5">
                <div className="flex items-center gap-2 text-amber-850">
                  <ShieldCheck className="w-5 h-5 text-amber-500" />
                  <strong className="text-sm font-black tracking-tight font-sans block">PropSphere Professional Indemnity Pact</strong>
                </div>
                
                <ul className="list-disc list-inside text-[11px] leading-relaxed text-amber-900 space-y-1.5 font-sans font-medium">
                  <li>We agree that all legal filings, surveys, and mortgage negotiations mapped represent certified practitioners matching regulatory compliance registries.</li>
                  <li>In Kenya, all client conveyances correspond to secure legal client accounts compliant with Law Society guidelines.</li>
                  <li>You pledge a standardized 15% Platform Commission rate on first bookings sourced through our digital real estate funnel.</li>
                </ul>
              </div>

              <label className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl border border-stone-150 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 text-amber-500 border-stone-300 rounded focus:ring-amber-500" 
                />
                <div className="text-xs">
                  <strong className="text-[#333] font-bold block mb-0.5">I Certify Compliance Credential Registers</strong>
                  <span className="text-stone-500 font-normal">We warrant the information submitted is 100% correct and subject to SuperAdmin validation checks at corporate headquarters.</span>
                </div>
              </label>

              <div className="grid grid-cols-2 gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={handlePrevStep}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-705 font-bold text-xs uppercase px-4 py-3.5 rounded-xl cursor-pointer"
                >
                  Back
                </button>
                <button 
                  type="button"
                  onClick={handleSubmit} 
                  disabled={loading || !agreeTerms}
                  className="bg-amber-400 hover:bg-amber-350 disabled:opacity-50 text-neutral-950 font-black text-xs uppercase tracking-widest px-4 py-3.5 rounded-xl cursor-pointer"
                >
                  {loading ? 'Transmitting Registry...' : 'Launch Registrar Advisor node'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
