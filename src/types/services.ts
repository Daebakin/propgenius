// FILE: types/services.ts

export type ServiceCategory = 
  | 'lawyer'
  | 'valuer'
  | 'mortgage_broker'
  | 'interior_designer'
  | 'moving_company'
  | 'home_inspector';

export interface ServiceProvider {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  category: ServiceCategory;
  description: string;
  logo?: string;
  coverImage?: string;
  licenseNumber: string;
  licenseDocument?: string;
  yearsExperience: number;
  serviceArea: string[];
  startingPrice: number;
  priceCurrency: 'USD' | 'KES';
  rating: number;
  totalReviews: number;
  isVerified: boolean;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  isActive: boolean;
  completedJobs: number;
  location: {
    lat?: number;
    lng?: number;
    address: string;
    city: string;
  };
  createdAt: string;
}

export interface ServiceReview {
  id: string;
  providerId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  createdAt: string;
  response?: string;
  responseAt?: string;
}

export interface ServiceBooking {
  id: string;
  providerId: string;
  providerName: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  propertyId?: string;
  serviceType: string;
  description: string;
  preferredDate: string;
  preferredTime?: string;
  budget?: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  bookingReference: string;
  amount?: number;
  paymentStatus?: 'pending' | 'paid' | 'refunded';
  notes?: string;
  respondedAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface ServiceProviderStats {
  totalBookings: number;
  completedBookings: number;
  averageRating: number;
  responseRate: number;
  averageResponseTimeHours: number;
  totalEarnings: number;
}
