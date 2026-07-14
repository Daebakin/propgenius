// FILE: services/serviceService.ts

import { ServiceProvider, ServiceBooking, ServiceReview, ServiceProviderStats } from '../types/services';

const BASE_URL = '/api/services';

// Local memory mock data for immediate preview and reliable fallback
const MOCK_PROVIDERS: ServiceProvider[] = [
  {
    id: 'prov-lawyer-1',
    businessName: 'Nairobi Conveyancing & Legal Advocates',
    ownerName: 'Albert Ndwiga, LL.M.',
    email: 'contact@nairobihomeslaw.co.ke',
    phone: '+254 711 222 333',
    category: 'lawyer',
    description: 'Expert property acquisition, title deed searches, transfer of lease, and secure mortgage charge registration. 15+ years experience in Westlands and Nairobi Luxury corridor.',
    logo: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=120&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    coverImage: 'https://images.unsplash.com/photo-1505664194779-8bebcb95c37d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    licenseNumber: 'LSK-2011/3452',
    yearsExperience: 15,
    serviceArea: ['Westlands', 'Kilimani', 'Kileleshwa', 'Karen', 'Runda'],
    startingPrice: 350, // USD
    priceCurrency: 'USD',
    rating: 4.9,
    totalReviews: 24,
    isVerified: true,
    verificationStatus: 'approved',
    isActive: true,
    completedJobs: 134,
    location: {
      address: 'Delta Corner, Tower B, 7th Floor, Westlands',
      city: 'Nairobi'
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'prov-valuer-1',
    businessName: 'Apex Kenya Valuation & Surveying Group',
    ownerName: 'Janet Mwangi',
    email: 'info@apexvaluation.co.ke',
    phone: '+254 722 555 444',
    category: 'valuer',
    description: 'Certified and licensed real estate valuers. Providing mortgage collateral appraisals, market investment studies, and structural integrity assessments.',
    logo: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=120&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    coverImage: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    licenseNumber: 'VRB-2014-9981',
    yearsExperience: 11,
    serviceArea: ['Mombasa', 'Nairobi', 'Kisumu', 'Eldoret'],
    startingPrice: 15000, // KES
    priceCurrency: 'KES',
    rating: 4.7,
    totalReviews: 18,
    isVerified: true,
    verificationStatus: 'approved',
    isActive: true,
    completedJobs: 98,
    location: {
      address: 'Pine Tree Plaza, Suite 4A, Kabarnet Rd',
      city: 'Nairobi'
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'prov-broker-1',
    businessName: 'Shilling & Dollar Mortgage Consultants',
    ownerName: 'David Kiptoo',
    email: 'david@shillingdollar.com',
    phone: '+254 733 999 888',
    category: 'mortgage_broker',
    description: 'Get match-made with prime cooperative mortgage interest rates. We facilitate negotiations with Standard Chartered, NCBA, and KCB for foreign/local buyers.',
    logo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=120&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    licenseNumber: 'CBK-MB-2018/092',
    yearsExperience: 8,
    serviceArea: ['Nairobi', 'Diaspora (US/UK/Canada)'],
    startingPrice: 200, // USD
    priceCurrency: 'USD',
    rating: 4.8,
    totalReviews: 31,
    isVerified: true,
    verificationStatus: 'approved',
    isActive: true,
    completedJobs: 210,
    location: {
      address: 'The Alchemist Compound, Office Suite B, Parklands',
      city: 'Nairobi'
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'prov-designer-1',
    businessName: 'Minimalist Nairobi Interiors',
    ownerName: 'Chloe Adhiambo',
    email: 'chloe@minimalistdesign.co.ke',
    phone: '+254 721 888 777',
    category: 'interior_designer',
    description: 'Bespoke apartment staging, spatial layout planning, upscale furniture packages, and modern Scandinavian/African-fusion aesthetics for luxury high-rises.',
    logo: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=120&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    coverImage: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    licenseNumber: 'KIDA-2020-05',
    yearsExperience: 6,
    serviceArea: ['Kilimani', 'Lavington', 'Riverside', 'Rosslyn'],
    startingPrice: 40000, 
    priceCurrency: 'KES',
    rating: 4.6,
    totalReviews: 12,
    isVerified: true,
    verificationStatus: 'approved',
    isActive: true,
    completedJobs: 45,
    location: {
      address: 'Sarit Centre Area, Woodvale Grove',
      city: 'Nairobi'
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'prov-mover-1',
    businessName: 'KejaMove Logistics Premium',
    ownerName: 'Erick Omwamba',
    email: 'ops@kejamove.com',
    phone: '+254 755 111 222',
    category: 'moving_company',
    description: 'Stress-free residential and corporate luxury moving. Includes expert packing, fragile material handling, furniture disassembly & precise assembly, and full transit insurance.',
    logo: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=120&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    coverImage: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    licenseNumber: 'NTSA-LOG-4491-X',
    yearsExperience: 9,
    serviceArea: ['All Kenya Counties', 'East Africa Relocations'],
    startingPrice: 15000,
    priceCurrency: 'KES',
    rating: 4.8,
    totalReviews: 43,
    isVerified: true,
    verificationStatus: 'approved',
    isActive: true,
    completedJobs: 339,
    location: {
      address: 'Mombasa Road, Industrial Area Gate 3',
      city: 'Nairobi'
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'prov-inspector-1',
    businessName: 'SafeHome Inspections East Africa',
    ownerName: 'Marcus Vance',
    email: 'marcus@safehomeEA.com',
    phone: '+254 788 444 333',
    category: 'home_inspector',
    description: 'Comprehensive pre-purchase property surveys. Thermal moisture detection, concrete strength verification, plumbing audits, electrical grid testing, and expert report handover.',
    logo: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=120&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    coverImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    licenseNumber: 'NCA-ENG-8821',
    yearsExperience: 10,
    serviceArea: ['Nairobi Metro', 'Thika', 'Kiambu Corridor'],
    startingPrice: 250,
    priceCurrency: 'USD',
    rating: 4.9,
    totalReviews: 14,
    isVerified: true,
    verificationStatus: 'approved',
    isActive: true,
    completedJobs: 82,
    location: {
      address: 'Karen Professional Centre, Block C',
      city: 'Nairobi'
    },
    createdAt: new Date().toISOString()
  }
];

const MOCK_BOOKINGS: ServiceBooking[] = [
  {
    id: 'bk-1',
    providerId: 'prov-lawyer-1',
    providerName: 'Nairobi Conveyancing & Legal Advocates',
    userId: 'user-buyer-1',
    userName: 'John Doe',
    userEmail: 'buyer@propsphere.com',
    userPhone: '+254 700 111 222',
    propertyId: 'sky-gardens',
    serviceType: 'Title Deed Charge Registration & Search',
    description: 'Require legal security check and escrow alignment for high-end unit purchase at Sky Gardens Tower A.',
    preferredDate: '2026-06-25',
    preferredTime: '10:00 AM',
    budget: 450,
    status: 'pending',
    bookingReference: 'PSB-LAWYER-3392',
    amount: 350,
    paymentStatus: 'pending',
    createdAt: new Date().toISOString()
  }
];

const MOCK_REVIEWS: ServiceReview[] = [
  {
    id: 'rev-1',
    providerId: 'prov-lawyer-1',
    userId: 'user-buyer-2',
    userName: 'Celine Mwende',
    rating: 5,
    title: 'Extremely professional advocates!',
    comment: 'Helped us secure our Kilimani off-plan title checks within 4 days. Incredible communication throughout the conveyancing process.',
    isVerifiedPurchase: true,
    isApproved: true,
    createdAt: new Date().toISOString(),
    response: 'Thank you Celine! We are absolutely delighted to have protected your real estate acquisition.',
    responseAt: new Date().toISOString()
  }
];

// Helper to load state from localStorage for mock data persistence
const loadFromStorage = (key: string, initial: any) => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : initial;
  } catch {
    return initial;
  }
};

const saveToStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(e);
  }
};

export class ServiceService {
  private static getStoredProviders(): ServiceProvider[] {
    return loadFromStorage('ps_service_providers', MOCK_PROVIDERS);
  }

  private static setStoredProviders(provs: ServiceProvider[]) {
    saveToStorage('ps_service_providers', provs);
  }

  private static getStoredBookings(): ServiceBooking[] {
    return loadFromStorage('ps_service_bookings', MOCK_BOOKINGS);
  }

  private static setStoredBookings(bks: ServiceBooking[]) {
    saveToStorage('ps_service_bookings', bks);
  }

  private static getStoredReviews(): ServiceReview[] {
    return loadFromStorage('ps_service_reviews', MOCK_REVIEWS);
  }

  private static setStoredReviews(revs: ServiceReview[]) {
    saveToStorage('ps_service_reviews', revs);
  }

  static async getProviders(category?: string): Promise<ServiceProvider[]> {
    try {
      const url = category ? `${BASE_URL}/providers?category=${category}` : `${BASE_URL}/providers`;
      const res = await fetch(url);
      if (res.ok) {
        const body = await res.json();
        return body.providers;
      }
    } catch (e) {
      console.warn('Fallback to local storage due to API connection delay:', e);
    }
    
    // Local storage fallback
    const all = this.getStoredProviders();
    const active = all.filter(p => p.isActive);
    if (category) {
      return active.filter(p => p.category === category);
    }
    return active;
  }

  static async getProviderById(id: string): Promise<ServiceProvider | null> {
    try {
      const res = await fetch(`${BASE_URL}/providers/${id}`);
      if (res.ok) {
        const body = await res.json();
        return body.provider;
      }
    } catch (e) {
      console.warn('Fallback to local storage for single provider:', e);
    }
    return this.getStoredProviders().find(p => p.id === id) || null;
  }

  static async registerProvider(providerData: Omit<ServiceProvider, 'id' | 'rating' | 'totalReviews' | 'isVerified' | 'verificationStatus' | 'isActive' | 'completedJobs' | 'createdAt'>): Promise<ServiceProvider> {
    const rawForm = {
      ...providerData,
      id: `prov-${Date.now()}`,
      rating: 5.0,
      totalReviews: 0,
      isVerified: false,
      verificationStatus: 'pending',
      isActive: true,
      completedJobs: 0,
      createdAt: new Date().toISOString()
    };

    try {
      const res = await fetch(`${BASE_URL}/providers/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rawForm)
      });
      if (res.ok) {
        const body = await res.json();
        return body.provider;
      }
    } catch (e) {
      console.warn('Saving provider registration locally:', e);
    }

    // Local storage backup
    const current = this.getStoredProviders();
    current.push(rawForm as unknown as ServiceProvider);
    this.setStoredProviders(current);
    return rawForm as unknown as ServiceProvider;
  }

  static async createBooking(bookingData: Omit<ServiceBooking, 'id' | 'bookingReference' | 'paymentStatus' | 'createdAt'>): Promise<ServiceBooking> {
    const freshBooking: ServiceBooking = {
      ...bookingData,
      id: `bk-${Date.now()}`,
      bookingReference: `PSB-${bookingData.serviceType.substring(0,3).toUpperCase()}-${Math.floor(Math.random() * 9000) + 1000}`,
      paymentStatus: 'pending',
      createdAt: new Date().toISOString()
    };

    try {
      const res = await fetch(`${BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(freshBooking)
      });
      if (res.ok) {
        const body = await res.json();
        return body.booking;
      }
    } catch (e) {
      console.warn('Saving booking locally:', e);
    }

    // Local storage backup
    const current = this.getStoredBookings();
    current.push(freshBooking);
    this.setStoredBookings(current);
    return freshBooking;
  }

  static async getProviderBookings(providerId: string): Promise<ServiceBooking[]> {
    try {
      const res = await fetch(`${BASE_URL}/providers/${providerId}/bookings`);
      if (res.ok) {
        const body = await res.json();
        return body.bookings;
      }
    } catch (e) {
      console.warn('Fetching bookings locally:', e);
    }
    return this.getStoredBookings().filter(b => b.providerId === providerId);
  }

  static async updateBookingStatus(bookingId: string, status: ServiceBooking['status'], notes?: string): Promise<ServiceBooking | null> {
    try {
      const res = await fetch(`${BASE_URL}/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes })
      });
      if (res.ok) {
        const body = await res.json();
        return body.booking;
      }
    } catch (e) {
      console.warn('Updating booking locally:', e);
    }

    const current = this.getStoredBookings();
    const idx = current.findIndex(b => b.id === bookingId);
    if (idx !== -1) {
      current[idx] = {
        ...current[idx],
        status,
        notes: notes || current[idx].notes,
        respondedAt: new Date().toISOString(),
        completedAt: status === 'completed' ? new Date().toISOString() : current[idx].completedAt
      };
      
      // Update provider job count if completed
      if (status === 'completed') {
        const provs = this.getStoredProviders();
        const pIdx = provs.findIndex(p => p.id === current[idx].providerId);
        if (pIdx !== -1) {
          provs[pIdx].completedJobs += 1;
          this.setStoredProviders(provs);
        }
      }

      this.setStoredBookings(current);
      return current[idx];
    }
    return null;
  }

  static async getUserBookings(email: string): Promise<ServiceBooking[]> {
    const current = this.getStoredBookings();
    return current.filter(b => b.userEmail === email);
  }

  static async submitReview(providerId: string, reviewData: Omit<ServiceReview, 'id' | 'isApproved' | 'createdAt'>): Promise<ServiceReview> {
    const freshReview: ServiceReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      isApproved: true,
      createdAt: new Date().toISOString()
    };

    try {
      const res = await fetch(`${BASE_URL}/providers/${providerId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(freshReview)
      });
      if (res.ok) {
        const body = await res.json();
        return body.review;
      }
    } catch (e) {
      console.warn('Saving review locally:', e);
    }

    // Local storage backup
    const current = this.getStoredReviews();
    current.push(freshReview);
    this.setStoredReviews(current);

    // Recalculate provider profile ratings
    const provs = this.getStoredProviders();
    const pIdx = provs.findIndex(p => p.id === providerId);
    if (pIdx !== -1) {
      const reviews = current.filter(r => r.providerId === providerId);
      const totalScore = reviews.reduce((sum, r) => sum + r.rating, 0);
      provs[pIdx].rating = Number((totalScore / reviews.length).toFixed(1));
      provs[pIdx].totalReviews = reviews.length;
      this.setStoredProviders(provs);
    }

    return freshReview;
  }

  static async getReviews(providerId: string): Promise<ServiceReview[]> {
    const current = this.getStoredReviews();
    return current.filter(r => r.providerId === providerId && r.isApproved);
  }

  static async getProviderStats(providerId: string): Promise<ServiceProviderStats> {
    const bks = this.getStoredBookings().filter(b => b.providerId === providerId);
    const completed = bks.filter(b => b.status === 'completed');
    const totalEarnings = completed.reduce((sum, b) => sum + (b.budget || b.amount || 0), 0);
    const revs = this.getStoredReviews().filter(r => r.providerId === providerId);
    const avgRating = revs.length > 0 ? (revs.reduce((sum, r) => sum + r.rating, 0) / revs.length) : 4.8;

    return {
      totalBookings: bks.length,
      completedBookings: completed.length,
      averageRating: Number(avgRating.toFixed(1)),
      responseRate: 98, // %
      averageResponseTimeHours: 1.5,
      totalEarnings
    };
  }

  // SuperAdmin Workflows
  static async getPendingProviders(): Promise<ServiceProvider[]> {
    try {
      const res = await fetch(`${BASE_URL}/admin/pending`);
      if (res.ok) {
        const body = await res.json();
        return body.providers;
      }
    } catch (e) {
      console.warn('Fetching pending locally:', e);
    }
    return this.getStoredProviders().filter(p => p.verificationStatus === 'pending');
  }

  static async approveProvider(id: string): Promise<ServiceProvider | null> {
    try {
      const res = await fetch(`${BASE_URL}/admin/providers/${id}/approve`, { method: 'POST' });
      if (res.ok) {
        const body = await res.json();
        return body.provider;
      }
    } catch (e) {
      console.warn('Approving provider locally:', e);
    }

    const current = this.getStoredProviders();
    const idx = current.findIndex(p => p.id === id);
    if (idx !== -1) {
      current[idx] = {
        ...current[idx],
        isVerified: true,
        verificationStatus: 'approved'
      };
      this.setStoredProviders(current);
      return current[idx];
    }
    return null;
  }

  static async rejectProvider(id: string): Promise<ServiceProvider | null> {
    try {
      const res = await fetch(`${BASE_URL}/admin/providers/${id}/reject`, { method: 'POST' });
      if (res.ok) {
        const body = await res.json();
        return body.provider;
      }
    } catch (e) {
      console.warn('Rejecting provider locally:', e);
    }

    const current = this.getStoredProviders();
    const idx = current.findIndex(p => p.id === id);
    if (idx !== -1) {
      current[idx] = {
        ...current[idx],
        isVerified: false,
        verificationStatus: 'rejected'
      };
      this.setStoredProviders(current);
      return current[idx];
    }
    return null;
  }
}
