// FILE: components/services/ServiceProviderProfile.tsx

import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Star, MapPin, Calendar, BookOpen, Scale, Award, ArrowRight, CheckCircle, MessageSquare } from 'lucide-react';
import { ServiceProvider, ServiceReview } from '../../types/services';
import { ServiceService } from '../../services/serviceService';

interface ServiceProviderProfileProps {
  provider: ServiceProvider;
  onClose: () => void;
  onBookNow: () => void;
  currentUser: any;
  formatPrice: (priceVal: number, project?: any) => string;
}

export default function ServiceProviderProfile({
  provider,
  onClose,
  onBookNow,
  currentUser,
  formatPrice
}: ServiceProviderProfileProps) {
  const [reviews, setReviews] = useState<ServiceReview[]>([]);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [responseTexts, setResponseTexts] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchReviews = async () => {
      const data = await ServiceService.getReviews(provider.id);
      setReviews(data);
    };
    fetchReviews();
  }, [provider.id]);

  const displayStructuredPrice = () => {
    let usdPrice = provider.startingPrice;
    if (provider.priceCurrency === 'KES') {
      usdPrice = provider.startingPrice / 130;
    }
    return formatPrice(usdPrice);
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert('You must be securely signed in to leave verified service reviews.');
      return;
    }
    if (!newReviewComment.trim()) return;

    try {
      const review = await ServiceService.submitReview(provider.id, {
        providerId: provider.id,
        userId: currentUser.id || 'user-buyer-1',
        userName: currentUser.username || 'John Doe',
        rating: newReviewRating,
        title: newReviewTitle || 'Excellent Professional Service',
        comment: newReviewComment,
        isVerifiedPurchase: true
      });

      setReviews(prev => [review, ...prev]);
      setNewReviewTitle('');
      setNewReviewComment('');
      setNewReviewRating(5);
      setReviewSuccess('Your review has been securely logged and approved!');
      setTimeout(() => setReviewSuccess(''), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleProviderResponse = async (reviewId: string) => {
    const text = responseTexts[reviewId];
    if (!text?.trim()) return;

    const updated = reviews.map(r => {
      if (r.id === reviewId) {
        return {
          ...r,
          response: text,
          responseAt: new Date().toISOString()
        };
      }
      return r;
    });

    setReviews(updated);
    
    // Save locally
    try {
      const allRevs = JSON.parse(localStorage.getItem('ps_service_reviews') || '[]');
      const idx = allRevs.findIndex((r: any) => r.id === reviewId);
      if (idx !== -1) {
        allRevs[idx].response = text;
        allRevs[idx].responseAt = new Date().toISOString();
        localStorage.setItem('ps_service_reviews', JSON.stringify(allRevs));
      }
    } catch (err) {
      console.error(err);
    }

    setResponseTexts(prev => ({ ...prev, [reviewId]: '' }));
    alert('Reponse registered successfully!');
  };

  const categoryMeta: Record<string, { label: string; color: string; bg: string }> = {
    lawyer: { label: 'Property Lawyer', color: 'text-amber-500', bg: 'bg-amber-50' },
    valuer: { label: 'Certified Valuer', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    mortgage_broker: { label: 'Mortgage Broker', color: 'text-sky-500', bg: 'bg-sky-50' },
    interior_designer: { label: 'Interior Designer', color: 'text-purple-500', bg: 'bg-purple-50' },
    moving_company: { label: 'Moving Company', color: 'text-rose-500', bg: 'bg-rose-50' },
    home_inspector: { label: 'Home Inspector', color: 'text-blue-500', bg: 'bg-indigo-50' },
  };

  const currentMeta = categoryMeta[provider.category] || { label: 'Consultant', color: 'text-neutral-500', bg: 'bg-neutral-50' };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 overflow-y-auto">
      <div className="bg-white max-w-4xl w-full rounded-3xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col">
        {/* Absolute Close Header Button */}
        <button 
          type="button" 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/60 hover:bg-neutral-900 text-white p-2 rounded-full cursor-pointer transition-all active:scale-95"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Inner Window scrollable */}
        <div className="overflow-y-auto flex-1 text-left">
          {/* Header Cover Banner */}
          <div className="relative h-48 sm:h-56 bg-neutral-900">
            {provider.coverImage ? (
              <img 
                src={provider.coverImage} 
                alt={provider.businessName} 
                className="w-full h-full object-cover opacity-75"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-stone-900 to-neutral-750" />
            )}
            
            {/* Absolute Bottom Left Information Overlay */}
            <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
              <div className="flex items-center gap-4">
                {provider.logo ? (
                  <img 
                    src={provider.logo} 
                    alt={provider.businessName} 
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white bg-white shrink-0 shadow-lg"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-400 border-2 border-white flex items-center justify-center text-neutral-900 font-extrabold text-xl shrink-0 shadow-lg">
                    {provider.businessName.substring(0,2).toUpperCase()}
                  </div>
                )}
                <div className="space-y-1">
                  <span className={`text-[9px] font-mono uppercase bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full text-white font-bold tracking-wider border border-white/10 inline-block`}>
                    {currentMeta.label}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-none drop-shadow-md">
                    {provider.businessName}
                  </h2>
                  <p className="text-xs sm:text-sm text-amber-200 font-mono drop-shadow-sm font-semibold">
                    Managed by {provider.ownerName}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Workspace split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8">
            {/* Left Main Bio Column */}
            <div className="lg:col-span-8 space-y-6">
              {/* Core Description of services */}
              <div className="space-y-2">
                <h3 className="text-xs uppercase font-mono tracking-wider font-extrabold text-neutral-400">About Our Services</h3>
                <p className="text-neutral-700 text-sm leading-relaxed whitespace-pre-line">
                  {provider.description}
                </p>
              </div>

              {/* Service Areas & Range Map */}
              <div className="space-y-3 bg-stone-50 p-5 rounded-2xl border border-stone-200">
                <h4 className="text-xs uppercase font-mono tracking-wider font-bold text-neutral-500">Service Coverage Areas</h4>
                <div className="flex flex-wrap gap-2">
                  {provider.serviceArea.map((area, idx) => (
                    <span key={idx} className="flex items-center gap-1.5 text-xs font-mono font-bold text-neutral-700 bg-white px-3.5 py-1.5 rounded-xl border border-stone-200 shadow-sm">
                      <MapPin className="w-3.5 h-3.5 text-amber-500" />
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              {/* Reviews Feed Section */}
              <div className="space-y-5 pt-4">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <h3 className="text-sm font-black tracking-tight text-neutral-900 uppercase">Reviews ({reviews.length})</h3>
                  <div className="flex items-center gap-1 text-amber-500 text-sm font-mono font-bold">
                    <Star className="w-4 h-4 fill-current" />
                    {provider.rating.toFixed(1)} / 5.0
                  </div>
                </div>

                {reviews.length === 0 ? (
                  <div className="text-center p-6 bg-stone-50 rounded-2xl border border-dashed border-stone-200 text-stone-500 text-xs">
                    No verified reviews logged. Share your transaction experience below!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((rev) => (
                      <div key={rev.id} className="bg-white border border-stone-150 p-4 rounded-2xl space-y-2.5 text-xs">
                        <div className="flex items-center justify-between">
                          <div>
                            <strong className="text-neutral-900 block font-bold text-xs">{rev.title}</strong>
                            <span className="text-[10px] text-neutral-400 font-mono">By {rev.userName} • {rev.createdAt.split('T')[0]}</span>
                          </div>
                          <div className="flex items-center gap-0.5 text-amber-500 font-mono text-xs font-bold">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            {rev.rating}
                          </div>
                        </div>

                        <p className="text-stone-600 leading-relaxed text-xs">
                          {rev.comment}
                        </p>

                        {/* Provider Reply */}
                        {rev.response ? (
                          <div className="bg-stone-50 border-l-2 border-stone-300 p-3 rounded-lg mt-2 font-mono text-[11px] text-stone-500">
                            <strong className="text-stone-700 block font-bold mb-1">Response from {provider.businessName}:</strong>
                            {rev.response}
                          </div>
                        ) : (
                          /* Let providers or admin reply */
                          (currentUser?.role === 'Developer' || currentUser?.role === 'Agent' || currentUser?.role === 'SuperAdmin') && (
                            <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center gap-2">
                              <input 
                                type="text"
                                placeholder="Write official response..."
                                value={responseTexts[rev.id] || ''}
                                onChange={(e) => setResponseTexts(prev => ({ ...prev, [rev.id]: e.target.value }))}
                                className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1 text-[11px] outline-none"
                              />
                              <button 
                                type="button"
                                onClick={() => handleProviderResponse(rev.id)}
                                className="bg-neutral-950 text-white font-mono uppercase tracking-wider text-[9px] px-2.5 py-1 rounded-lg"
                              >
                                Reply
                              </button>
                            </div>
                          )
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Submitting a new review card */}
                <form onSubmit={handleAddReview} className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-3.5">
                  <h4 className="text-xs uppercase font-mono tracking-wider font-extrabold text-neutral-800">Add a Verified Review</h4>
                  
                  {reviewSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-[11px] font-mono">
                      {reviewSuccess}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-[10px] text-stone-500 font-mono font-bold block uppercase">Review Title</label>
                      <input 
                        type="text" 
                        required
                        value={newReviewTitle}
                        onChange={(e) => setNewReviewTitle(e.target.value)}
                        placeholder="e.g. Prompt conveyancing work..."
                        className="w-full text-xs bg-white border border-stone-200 rounded-xl p-2.5" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-stone-500 font-mono font-bold block uppercase">Rating</label>
                      <select 
                        value={newReviewRating}
                        onChange={(e) => setNewReviewRating(Number(e.target.value))}
                        className="w-full text-xs bg-white border border-stone-200 rounded-xl p-2.5"
                      >
                        <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                        <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                        <option value="3">⭐⭐⭐ 3 Stars</option>
                        <option value="2">⭐⭐ 2 Stars</option>
                        <option value="1">⭐ 1 Star</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-stone-500 font-mono font-bold block uppercase">Comment</label>
                    <textarea 
                      required
                      rows={3}
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      placeholder="Share your experience working with this service provider..."
                      className="w-full text-xs bg-white border border-stone-200 rounded-xl p-2.5 resize-none"
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="bg-neutral-900 border border-neutral-800 text-white font-extrabold text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-xl block ml-auto hover:bg-neutral-950 transition-all cursor-pointer"
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            </div>

            {/* Right Information Stats Panel */}
            <div className="lg:col-span-4 space-y-5">
              {/* Starting Pricing Callout Card */}
              <div className="bg-neutral-950 text-white p-5 rounded-2xl border border-white/5 space-y-4">
                <div className="border-b border-white/10 pb-3">
                  <span className="text-[9px] uppercase tracking-widest text-[#aaa] font-mono block">STARTING SERVICE FEES</span>
                  <div className="flex items-baseline gap-1 mt-1 font-mono">
                    <strong className="text-3xl font-black text-amber-400">
                      {displayStructuredPrice()}
                    </strong>
                    <span className="text-stone-400 text-xs">est. base</span>
                  </div>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="flex items-center justify-between text-[#ccc]">
                    <span>Completed Audits</span>
                    <strong className="text-white font-mono text-sm">{provider.completedJobs}+</strong>
                  </div>
                  <div className="flex items-center justify-between text-[#ccc]">
                    <span>Experience Ledger</span>
                    <strong className="text-white font-mono text-sm">{provider.yearsExperience} Years</strong>
                  </div>
                  <div className="flex items-center justify-between text-[#ccc]">
                    <span>Credentials License</span>
                    <strong className="text-amber-400 font-mono text-[10px] uppercase tracking-tight">{provider.licenseNumber}</strong>
                  </div>
                </div>

                <button 
                  type="button" 
                  onClick={onBookNow}
                  className="w-full text-center bg-amber-400 hover:bg-amber-350 text-neutral-950 font-extrabold text-[11px] uppercase tracking-widest py-3.5 rounded-xl cursor-pointer select-none active:scale-95 transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  Schedule Consultation <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Provider Quick Contact Verification */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 space-y-4 text-xs font-mono text-neutral-700">
                <strong className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold block mb-1">Verify Registrar Node</strong>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-[9px] text-[#999] block font-bold">REGISTRATION CORRIDOR</span>
                    <strong className="text-[#333] tracking-tight">{provider.location.address || 'Nairobi Westlands Corridor'}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#999] block font-bold">VERIFIED EMAIL</span>
                    <strong className="text-[#333] leading-none text-[11px]">{provider.email}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#999] block font-bold">SUPPORT LINE</span>
                    <strong className="text-[#333] tracking-tight">{provider.phone}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-200">
                  <span className="text-[9px] text-emerald-600 font-bold flex items-center gap-1 uppercase">
                    <CheckCircle className="w-3 h-3 text-emerald-500" /> Secure Escrow Approved
                  </span>
                  <p className="text-[10px] text-neutral-400 font-sans mt-0.5 font-normal">
                    PropSphere verifies all lawyers of high-court status & surveyor qualifications directly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
