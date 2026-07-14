// FILE: components/services/ServiceProviderDashboard.tsx

import React, { useState, useEffect } from 'react';
import { 
  Briefcase, CheckCircle, Clock, DollarSign, Star, Calendar, 
  MapPin, Edit, Eye, MessageSquare, AlertCircle, RefreshCw, Layers 
} from 'lucide-react';
import { ServiceProvider, ServiceBooking, ServiceReview, ServiceProviderStats } from '../../types/services';
import { ServiceService } from '../../services/serviceService';

interface ServiceProviderDashboardProps {
  provider: ServiceProvider;
  currentUser: any;
  onUpdateProvider: (updated: ServiceProvider) => void;
  formatPrice: (priceVal: number, project?: any) => string;
}

export default function ServiceProviderDashboard({
  provider,
  currentUser,
  onUpdateProvider,
  formatPrice
}: ServiceProviderDashboardProps) {
  // Tabs: 'bookings', 'analytics', 'settings', 'reviews'
  const [activeSubTab, setActiveSubTab] = useState<'bookings' | 'analytics' | 'settings' | 'reviews'>('bookings');
  
  // Bookings list state
  const [bookings, setBookings] = useState<ServiceBooking[]>([]);
  const [bookingsFilter, setBookingsFilter] = useState<ServiceBooking['status'] | 'all'>('all');
  
  // Stats analytics state
  const [stats, setStats] = useState<ServiceProviderStats | null>(null);
  
  // Reviews list state
  const [reviews, setReviews] = useState<ServiceReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Settings Edit form state
  const [editBusinessName, setEditBusinessName] = useState(provider.businessName);
  const [editOwnerName, setEditOwnerName] = useState(provider.ownerName);
  const [editPhone, setEditPhone] = useState(provider.phone);
  const [editDescription, setEditDescription] = useState(provider.description);
  const [editStartingPrice, setEditStartingPrice] = useState(provider.startingPrice);
  const [editPriceCurrency, setEditPriceCurrency] = useState<'USD' | 'KES'>(provider.priceCurrency || 'KES');

  // Selected booking management
  const [selectedBooking, setSelectedBooking] = useState<ServiceBooking | null>(null);
  const [statusUpdateNotes, setStatusUpdateNotes] = useState('');

  // Availability calendar state (mon-fri checkboxes)
  const [availabilityDays, setAvailabilityDays] = useState<string[]>(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const bks = await ServiceService.getProviderBookings(provider.id);
      setBookings(bks);

      const st = await ServiceService.getProviderStats(provider.id);
      setStats(st);

      const rvs = await ServiceService.getReviews(provider.id);
      setReviews(rvs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [provider.id]);

  const handleUpdateStatus = async (bookingId: string, newStatus: ServiceBooking['status']) => {
    try {
      const updated = await ServiceService.updateBookingStatus(bookingId, newStatus, statusUpdateNotes);
      if (updated) {
        setBookings(prev => prev.map(b => b.id === bookingId ? updated : b));
        
        // Refresh analytics and logs
        const newStats = await ServiceService.getProviderStats(provider.id);
        setStats(newStats);
        
        setSuccessMsg(`Booking status adjusted to ${newStatus} successfully!`);
        setStatusUpdateNotes('');
        setSelectedBooking(null);
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ServiceProvider = {
      ...provider,
      businessName: editBusinessName,
      ownerName: editOwnerName,
      phone: editPhone,
      description: editDescription,
      startingPrice: Number(editStartingPrice),
      priceCurrency: editPriceCurrency
    };

    onUpdateProvider(updated);
    
    // Save to localStorage list directly too
    try {
      const allProvs = JSON.parse(localStorage.getItem('ps_service_providers') || '[]');
      const idx = allProvs.findIndex((p: any) => p.id === provider.id);
      if (idx !== -1) {
        allProvs[idx] = updated;
        localStorage.setItem('ps_service_providers', JSON.stringify(allProvs));
      }
    } catch (err) {
      console.error(err);
    }

    setSuccessMsg('Public provider profile updated successfully.');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const formatGeneralPrice = (valUSD: number) => {
    return formatPrice(valUSD);
  };

  const toggleDay = (day: string) => {
    if (availabilityDays.includes(day)) {
      setAvailabilityDays(prev => prev.filter(d => d !== day));
    } else {
      setAvailabilityDays(prev => [...prev, day]);
    }
  };

  const filteredBookings = bookingsFilter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === bookingsFilter);

  return (
    <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-6 text-left">
      {/* Upper header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-neutral-900 tracking-tight">
              {provider.businessName} Control Panel
            </h2>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 font-extrabold uppercase border border-amber-500/20">
              Active Provider Node
            </span>
          </div>
          <p className="text-neutral-500 text-xs mt-0.5 font-mono">
            Registrar reference ID: {provider.id} • License status: <span className="font-bold text-neutral-800">{provider.licenseNumber}</span>
          </p>
        </div>

        <button 
          onClick={loadDashboardData}
          type="button" 
          disabled={loading}
          className="bg-stone-50 border border-stone-200 hover:bg-stone-100 flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest px-4 py-2 rounded-xl text-[#333] cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Sync data
        </button>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-mono">
          🎉 {successMsg}
        </div>
      )}

      {/* Sub Tabs Toggle */}
      <div className="flex flex-wrap items-center gap-1.5 bg-stone-50 p-1 rounded-2xl border border-stone-150">
        <button
          type="button"
          onClick={() => setActiveSubTab('bookings')}
          className={`flex-1 min-w-[120px] text-center font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'bookings' ? 'bg-neutral-950 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          Active Bookings ({bookings.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('analytics')}
          className={`flex-1 min-w-[120px] text-center font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'analytics' ? 'bg-neutral-950 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          Earnings & Metrics
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('settings')}
          className={`flex-1 min-w-[120px] text-center font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'settings' ? 'bg-neutral-950 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          Public Bio & Calendar
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('reviews')}
          className={`flex-1 min-w-[120px] text-center font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'reviews' ? 'bg-neutral-950 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          User Reviews ({reviews.length})
        </button>
      </div>

      {/* SUBTAB: ACTIVE BOOKINGS */}
      {activeSubTab === 'bookings' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-12 space-y-4">
            {/* Filter buttons */}
            <div className="flex flex-wrap items-center gap-1.5 pb-2">
              {(['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setBookingsFilter(filter)}
                  className={`text-[10px] font-mono uppercase font-bold tracking-wider px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                    bookingsFilter === filter 
                      ? 'bg-neutral-900 border-neutral-950 text-white' 
                      : 'border-stone-200 text-stone-500 bg-white hover:bg-stone-50'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* List */}
            {filteredBookings.length === 0 ? (
              <div className="text-center p-12 bg-stone-50 border border-dashed border-stone-250 rounded-2xl text-stone-500 text-xs">
                No active service bookings identified for filter "{bookingsFilter}".
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredBookings.map((b) => (
                  <div key={b.id} className="border border-stone-200 rounded-2xl p-5 space-y-4 bg-white hover:border-neutral-350 transition-all flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-stone-400 font-bold uppercase tracking-widest">{b.bookingReference}</span>
                        <span className={`font-mono text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full ${
                          b.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                          b.status === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                          b.status === 'confirmed' ? 'bg-sky-50 text-sky-600 border border-sky-200' :
                          'bg-neutral-50 text-neutral-600 border border-neutral-200'
                        }`}>
                          {b.status}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <strong className="text-xs text-neutral-900 block leading-tight">{b.serviceType}</strong>
                        <span className="text-[10px] text-neutral-400 block font-mono">Customer: {b.userName} ({b.userEmail})</span>
                      </div>

                      <p className="text-[11px] text-stone-600 leading-normal line-clamp-2 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                        {b.description}
                      </p>

                      <div className="grid grid-cols-2 gap-3 text-[10px] font-mono text-[#555] bg-stone-50/50 p-2.5 rounded-xl">
                        <div>
                          <span className="text-neutral-400 block font-medium">DATE & TIME</span>
                          <span className="text-neutral-800 font-semibold">{b.preferredDate} @ {b.preferredTime}</span>
                        </div>
                        <div>
                          <span className="text-neutral-400 block font-medium">EST BUDGET</span>
                          <span className="text-neutral-800 font-semibold">{formatGeneralPrice(b.budget || 250)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Manage row */}
                    {selectedBooking?.id === b.id ? (
                      <div className="space-y-3 pt-3 border-t border-stone-150">
                        <textarea 
                          rows={2}
                          value={statusUpdateNotes}
                          onChange={(e) => setStatusUpdateNotes(e.target.value)}
                          placeholder="Provide status updates, coordination hours, or completions notes..."
                          className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-2 resize-none"
                        />
                        <div className="flex items-center gap-1.5 justify-end">
                          <button 
                            type="button" 
                            onClick={() => setSelectedBooking(null)}
                            className="text-[9px] uppercase font-bold tracking-widest text-neutral-500 bg-stone-50 border border-stone-200 py-1.5 px-3 rounded-lg"
                          >
                            Close
                          </button>
                          <button 
                            type="button" 
                            onClick={() => handleUpdateStatus(b.id, 'confirmed')}
                            className="text-[9px] uppercase font-bold tracking-widest text-sky-600 bg-sky-50 border border-sky-200 py-1.5 px-3 rounded-lg"
                          >
                            Approve
                          </button>
                          <button 
                            type="button" 
                            onClick={() => handleUpdateStatus(b.id, 'completed')}
                            className="text-[9px] uppercase font-bold tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-200 py-1.5 px-3 rounded-lg"
                          >
                            Completed Offer
                          </button>
                          <button 
                            type="button" 
                            onClick={() => handleUpdateStatus(b.id, 'cancelled')}
                            className="text-[9px] uppercase font-bold tracking-widest text-red-600 bg-red-50 border border-red-200 py-1.5 px-3 rounded-lg"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="pt-3 border-t border-stone-150 flex items-center justify-between">
                        <strong className="text-[10px] text-stone-400 font-mono">COMMISSION: 15% Platform</strong>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedBooking(b);
                            setStatusUpdateNotes(b.notes || '');
                          }}
                          className="bg-neutral-950 text-white font-mono uppercase tracking-widest text-[9px] px-3.5 py-1.5 rounded-xl block hover:bg-neutral-900 cursor-pointer text-right"
                        >
                          Modify Status
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB: EARNINGS & METRICS */}
      {activeSubTab === 'analytics' && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-stone-50 border border-stone-200 p-5 rounded-2xl text-left">
              <span className="text-[9px] uppercase font-mono text-neutral-400 font-bold tracking-wider">Gross Sourced Bookings</span>
              <strong className="text-2xl font-black text-neutral-950 block mt-1 font-mono">{stats.totalBookings}</strong>
              <span className="text-[10px] text-neutral-400 font-mono mt-0.5 block">{stats.completedBookings} Completed</span>
            </div>
            <div className="bg-stone-50 border border-stone-200 p-5 rounded-2xl text-left">
              <span className="text-[9px] uppercase font-mono text-neutral-400 font-bold tracking-wider">Advisor Earnings</span>
              <strong className="text-2xl font-black text-emerald-600 block mt-1 font-mono">{formatGeneralPrice(stats.totalEarnings || 500)}</strong>
              <span className="text-[10px] text-neutral-400 font-mono mt-0.5 block">After 15% commissions</span>
            </div>
            <div className="bg-stone-50 border border-stone-200 p-5 rounded-2xl text-left">
              <span className="text-[9px] uppercase font-mono text-neutral-400 font-bold tracking-wider">Average Rating Node</span>
              <div className="flex items-center gap-1 block mt-1 font-mono">
                <strong className="text-2xl font-black text-neutral-950">{stats.averageRating}</strong>
                <Star className="w-4 h-4 text-amber-500 fill-current" />
              </div>
              <span className="text-[10px] text-neutral-400 font-mono mt-0.5 block">Top Verified Class</span>
            </div>
            <div className="bg-stone-50 border border-stone-200 p-5 rounded-2xl text-left">
              <span className="text-[9px] uppercase font-mono text-neutral-400 font-bold tracking-wider">SLA Response rate</span>
              <strong className="text-2xl font-black text-amber-600 block mt-1 font-mono">{stats.responseRate}%</strong>
              <span className="text-[10px] text-neutral-400 font-mono mt-0.5 block">Avg Response: {stats.averageResponseTimeHours} hrs</span>
            </div>
          </div>

          <div className="p-5 bg-neutral-950 text-white rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
            <div>
              <strong className="text-amber-400 uppercase tracking-widest font-black block">PROPSPHERE commission ledger payout</strong>
              <p className="text-stone-400 text-[10px] font-sans mt-0.5 font-normal">Our system processes billing and payouts twice a month on the 1st and 15th directly to designated client-escrow accounts.</p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-neutral-500 block text-[9px] uppercase">ESTIMATED NET PAYOUT</span>
              <strong className="text-white text-xl font-bold">{formatGeneralPrice(stats.totalEarnings * 0.85)}</strong>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB: SETTINGS & CALENDAR */}
      {activeSubTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Settings form */}
          <form onSubmit={handleSaveSettings} className="lg:col-span-8 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider font-extrabold text-neutral-400 mb-2">Edit Public Listing</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-stone-500 font-mono font-bold block uppercase">Business Name</label>
                <input 
                  type="text" 
                  value={editBusinessName} 
                  onChange={(e) => setEditBusinessName(e.target.value)}
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-3" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-stone-500 font-mono font-bold block uppercase">Representative</label>
                <input 
                  type="text" 
                  value={editOwnerName} 
                  onChange={(e) => setEditOwnerName(e.target.value)}
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-3" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-6 space-y-1">
                <label className="text-[10px] text-stone-500 font-mono font-bold block uppercase">Primary Business Phone</label>
                <input 
                  type="text" 
                  value={editPhone} 
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-3" 
                />
              </div>
              <div className="md:col-span-4 space-y-1">
                <label className="text-[10px] text-stone-500 font-mono font-bold block uppercase">Starting Consultation Fee</label>
                <input 
                  type="number" 
                  value={editStartingPrice} 
                  onChange={(e) => setEditStartingPrice(Number(e.target.value))}
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-3 font-mono font-bold" 
                />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] text-stone-500 font-mono font-bold block uppercase">Currency</label>
                <select 
                  value={editPriceCurrency} 
                  onChange={(e) => setEditPriceCurrency(e.target.value as 'USD' | 'KES')}
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-3"
                >
                  <option value="KES">KES</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-stone-500 font-mono font-bold block uppercase">Comprehensive Bio Of Services</label>
              <textarea 
                rows={4}
                value={editDescription} 
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-3 resize-none" 
              />
            </div>

            <button 
              type="submit"
              className="bg-neutral-900 border border-neutral-800 text-white font-extrabold text-[10px] uppercase tracking-widest px-5 py-3.5 rounded-xl block ml-auto hover:bg-neutral-950 transition-all cursor-pointer"
            >
              Update Profile Details
            </button>
          </form>

          {/* Calendar settings */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider font-extrabold text-neutral-400 mb-2">Availability Calendar</h3>
            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-3">
              <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mb-1">Set Weekly Office Hours</span>
              
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                <label key={day} className="flex items-center gap-2.5 text-xs text-neutral-700 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={availabilityDays.includes(day)}
                    onChange={() => toggleDay(day)}
                    className="w-4 h-4 text-amber-500 border-stone-300 rounded focus:ring-amber-500" 
                  />
                  <span>{day}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB: REVIEWS LIST */}
      {activeSubTab === 'reviews' && (
        <div className="space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-wider font-extrabold text-neutral-400">User Reviews Managed</h3>
          {reviews.length === 0 ? (
            <div className="text-center p-8 bg-stone-50 border border-dashed border-stone-250 rounded-2xl text-stone-500 text-xs">
              No verified user reviews submitted yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="border border-stone-200 rounded-2xl p-4 space-y-3 text-xs bg-white flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <strong className="text-neutral-900 block font-bold">{rev.title}</strong>
                      <div className="flex items-center gap-0.5 text-amber-500 font-mono font-black">
                        <Star className="w-3 h-3 fill-current" /> {rev.rating}
                      </div>
                    </div>
                    <span className="text-[10px] text-neutral-450 block font-mono">Submitted by {rev.userName} on {rev.createdAt.split('T')[0]}</span>
                    <p className="text-stone-605 leading-relaxed text-xs italic bg-stone-50/50 p-2.5 rounded-xl">
                      "{rev.comment}"
                    </p>
                  </div>

                  {rev.response ? (
                    <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-150 mt-2 text-[10px] text-stone-500 font-mono">
                      <strong className="text-stone-700 block font-bold">Your Response:</strong>
                      {rev.response}
                    </div>
                  ) : (
                    <div className="mt-2 text-right">
                      <button 
                        type="button"
                        onClick={() => {
                          const resp = prompt(`Enter your official public response to ${rev.userName}:`);
                          if (resp?.trim()) {
                            // Update locally and in memory
                            const updated = reviews.map(r => r.id === rev.id ? { ...r, response: resp, responseAt: new Date().toISOString() } : r);
                            setReviews(updated);
                            try {
                              const allRevs = JSON.parse(localStorage.getItem('ps_service_reviews') || '[]');
                              const idx = allRevs.findIndex((r: any) => r.id === rev.id);
                              if (idx !== -1) {
                                allRevs[idx].response = resp;
                                allRevs[idx].responseAt = new Date().toISOString();
                                localStorage.setItem('ps_service_reviews', JSON.stringify(allRevs));
                              }
                            } catch (e) {
                              console.error(e);
                            }
                          }
                        }}
                        className="bg-neutral-950 text-white font-mono uppercase tracking-widest text-[8px] px-3 py-1.5 rounded-lg inline-block hover:bg-neutral-900 cursor-pointer"
                      >
                        Write Response
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
