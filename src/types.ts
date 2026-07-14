export interface Unit {
  id?: string;
  number: string;
  type: string;
  price: number;
  size: string;
  status: "Available" | "Reserved" | "Sold" | "Coming Soon" | "VIP Access" | "Flash Deal" | "Prop Drop";
  flexStatus: "Available" | "Reserved" | "Sold" | "Coming Soon" | "Purple" | "VIP Access" | "Flash Deal" | "Prop Drop";
  tower?: string;
  floor?: number;
  discount?: number;
  bedrooms?: number;
  bathrooms?: number;
  viewType?: string;
  availability?: boolean;
  reservationStatus?: "None" | "Queued" | "ActiveWindow" | "Expired" | "Completed";
  propertyDNA?: {
    investmentScore: number;
    rentalScore: number;
    lifestyleScore: number;
    familyScore: number;
    luxuryScore: number;
    viewScore: number;
    sunlightScore: number;
    privacyScore: number;
    noiseScore: number;
    accessibilityScore: number;
  };
  metadata?: Record<string, any>;
}

export interface Floor {
  floorNumber: number;
  units: Unit[];
}

export interface Tower {
  name: string;
  floors: Floor[];
}

export interface FAQ {
  q: string;
  a: string;
}

export interface Project {
  id: string;
  name: string;
  location: string;
  developerId: string;
  developerName: string;
  tagline: string;
  description: string;
  priceRange: string;
  completionDate: string;
  constructionProgress: number;
  roiRentalYield: string;
  roiCapitalAppreciation: string;
  overallRating: number;
  developerVerified: boolean;
  approvalStatus?: "Pending" | "Approved" | "Rejected";
  status?: "offplan" | "ongoing" | "completed";
  type?: "Apartment" | "Villa" | "Penthouse" | "Townhouse" | "Commercial" | string;
  views?: number;
  isFeatured?: boolean;
  amenities: string[];
  droneVideoUrl: string;
  locationHighlights: string[];
  towers: Tower[];
  currency?: string;
  bookingDepositPercent?: number;
  vrTourUrl?: string;
  virtualTourMedia: {
    livingRoom?: string;
    kitchen?: string;
    masterBedroom?: string;
    balconyView?: string;
    amenities?: string;
    [key: string]: string | undefined;
  };
  virtualTourMetadata?: Record<string, {
    title: string;
    aiDescription: string;
    seoAlt: string;
  }>;
  faqs: FAQ[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  tiktokVideos?: string[];
  tiktokUrl?: string;
  whatsappPhone?: string;
  lastModeratorReason?: string;
  isInternational?: boolean;
}

export interface MatchmakerResult {
  marketAnalysisSummary: string;
  matches: Array<{
    projectId: string;
    projectLabel: string;
    unitNumber: string;
    unitType: string;
    priceUSD: number;
    matchPercent: number;
    reason: string;
    lifestyleFit: string;
  }>;
}

export interface Booking {
  id: string;
  projectName: string;
  unitNumber: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  paymentPlan: string;
  bookingFeePaid: number;
  status: string;
  date: string;
  documentsSigned: boolean;
  kycDocumentUrl?: string;
}

export interface Lead {
  id: string;
  buyerName: string;
  email: string;
  phone: string;
  budget: number;
  projectInterest: string;
  status: string;
  AIQualificationSummary: string;
}

export interface WhatsAppChat {
  id: string;
  phoneNumber: string;
  buyerName: string;
  status: string;
  messages: Array<{
    sender: "buyer" | "ai-assistant";
    text: string;
    timestamp: string;
  }>;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: "Buyer" | "Developer" | "SuperAdmin" | "Agent";
  companyName?: string;
  whatsappNumber?: string;
  passwordHash?: string;
  createdAt: string;
  disabled?: boolean;
  trialActivated?: boolean;
  subscriptionType?: string;
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Multi-Tenant SaaS Organizations Model
export interface Organization {
  id: string;
  name: string;
  domain?: string;
  status: "Active" | "Suspended" | "PendingApproval";
  createdAt: string;
}

// Multi-Tenant SaaS Developer Accounts Model
export interface DeveloperAccount {
  id: string;
  userId: string;
  organizationId: string;
  role: "Owner" | "Admin" | "Member";
  status: "Active" | "Invited" | "Suspended";
  createdAt: string;
}

// Multi-Tenant SaaS Workspace Model
export interface Workspace {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
}

// Multi-Tenant SaaS Team Member Link Model
export interface TeamMember {
  id: string;
  organizationId: string;
  userId: string;
  userEmail: string;
  username: string;
  role: "Owner" | "Admin" | "Member";
  status: "Active" | "Invited";
  createdAt: string;
}

// Multi-Tenant SaaS Audit Log Model
export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userEmail: string;
  action: string;
  details: string;
  ipAddress?: string;
  organizationId: string;
  workspaceId?: string;
}

export interface OtherProperty {
  id: string;
  name: string;
  type: "Land" | "Plot";
  location: string;
  price: number;
  size: string;
  zoning: string;
  description: string;
  highlights: string[];
  imageUrl: string;
  views: number;
  developerFriendly: boolean;
  contactPhone?: string;
  createdAt?: string;
}

export interface VisualCustomization {
  id: string;
  elementId: string;
  styleOverrides: {
    fontFamily?: string;
    fontSize?: string;
    textColor?: string;
    backgroundColor?: string;
    fontWeight?: string;
    letterSpacing?: string;
    lineHeight?: string;
    textTransform?: string;
    textDecoration?: string;
  };
  textContent?: string;
  imageUrl?: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  imageUrl?: string;
  category: string;
  createdAt: string;
  views: number;
  status: "Draft" | "Published";
}

