// FILE: pages/ServicesPage.tsx

import React from 'react';
import ServicesMarketplace from '../components/services/ServicesMarketplace';

interface ServicesPageProps {
  currentUser: any;
  formatPrice: (priceVal: number, project?: any) => string;
  displayCurrency: 'USD' | 'KES';
}

export default function ServicesPage({
  currentUser,
  formatPrice,
  displayCurrency
}: ServicesPageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Services Header Area */}
      <div className="mb-6 text-left border-b border-stone-200 pb-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase bg-neutral-900 text-amber-400 px-2.5 py-1 rounded-md font-extrabold tracking-wider">
            PropSphere Services
          </span>
          <p className="text-[11px] text-neutral-400 mt-1 font-mono">
            Secure client conveyancing, evaluations, and mortgage structures synchronized under 2h SLAs.
          </p>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-amber-600 font-bold bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/15">
          <span>Escrow Protected Brokerage</span>
        </div>
      </div>

      {/* Main Marketplace */}
      <ServicesMarketplace 
        currentUser={currentUser}
        formatPrice={formatPrice}
        displayCurrency={displayCurrency}
      />
    </div>
  );
}
