import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Building2, 
  Clock, 
  TrendingUp, 
  MessageSquare, 
  Sparkles, 
  LayoutDashboard, 
  MapPin, 
  DollarSign, 
  ShieldCheck, 
  Users, 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  Compass, 
  BookOpen, 
  HelpCircle, 
  Phone, 
  Sliders, 
  Building, 
  Briefcase, 
  FolderLock, 
  Plus, 
  Check, 
  AlertCircle, 
  Eye, 
  X,
  FileText,
  Percent,
  ChevronRight,
  Send,
  Loader2,
  Settings,
  Menu,
  Scale,
  Smartphone,
  Globe,
  Brain,
  Bot
} from "lucide-react";
import PropDropsEvent from "./components/PropDropsEvent";
import PLOSHomepage from "./components/PLOSHomepage";
import BuyerPortal from "./components/BuyerPortal";
import { PropertyTikTokShowcase } from "./components/PropertyTikTokShowcase";
import DeveloperPortal from "./components/DeveloperPortal";
import AuthModal from "./components/AuthModal";
import SaaSMarketingHub from "./components/SaaSMarketingHub";
import AdminPortal from "./components/AdminPortal";
import AgentDashboard from "./components/AgentDashboard";
import ServicesPage from "./pages/ServicesPage";
import PropertiesPage from "./pages/PropertiesPage";
import PropertyVideosPage from "./pages/PropertyVideosPage";
import OtherPropertiesPage from "./pages/OtherPropertiesPage";
import YellowPencilEditor from "./components/YellowPencilEditor";
import InternationalPortfolioPage, { dubaiPreVetted } from "./pages/InternationalPortfolioPage";
import OperationsPlaybook from "./components/OperationsPlaybook";
import FlutterDeveloperHub from "./components/FlutterDeveloperHub";
import ReactNativeDeveloperHub from "./components/ReactNativeDeveloperHub";
import { Project, Booking, Lead, WhatsAppChat, MatchmakerResult, User } from "./types";
import AdaptiveAIHub, { logAIInteraction } from "./components/AdaptiveAIHub";
import QRPlacardScanner from "./components/QRPlacardScanner";
import PropertySearchRobot from "./components/PropertySearchRobot";
import SEOMetaPanel from "./components/SEOMetaPanel";
import BlogsPanel from "./components/BlogsPanel";

export default function App() {
  // Navigation & Persona Selectors
  const [activeTab, setActiveTab ] = useState<"home" | "drops" | "portfolio" | "matchmaker" | "buyer" | "developers" | "financing" | "about" | "admin" | "agent" | "services" | "properties" | "guide" | "flutter" | "expo" | "international" | "ai-hub" | "blogs" | "videos" | "other-properties">("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [displayCurrency, setDisplayCurrency] = useState<"KES" | "USD">("KES");
  
  // Real authentication states
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("propsphere_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalInitialTab, setAuthModalInitialTab] = useState<"login" | "register">("login");
  const [impersonatedUser, setImpersonatedUser] = useState<User | null>(null);
  const effectiveUser = impersonatedUser || currentUser;
  const [currentPersona, setCurrentPersona] = useState<"Buyer" | "Developer" | "SuperAdmin" | "Agent">(() => {
    const saved = localStorage.getItem("propsphere_user");
    if (saved) {
      try {
        return JSON.parse(saved).role;
      } catch (e) {}
    }
    return "Buyer";
  });

  // In-Memory Synchronized States updated from back-end server
  const [projects, setProjects] = useState<Project[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [whatsappChats, setWhatsappChats] = useState<WhatsAppChat[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // Administrative / Super Admin centralized system state
  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [developerPackages, setDeveloperPackages] = useState<any[]>([
    { id: "pkg-starter", name: "Starter Tier plan", priceUSD: 300, priceKES: 39000, projectsLimit: 1, unitsLimit: 10, aiTier: "Gemini 1.5 Flash API proxy", support: "Standard ticket support (24h)" },
    { id: "pkg-pro", name: "Pro Multi-Tower Package", priceUSD: 390, priceKES: 50700, projectsLimit: 5, unitsLimit: 150, aiTier: "Dedicated Gemini 1.5 Pro Agent", support: "Priority WhatsApp dispatch (3h)" },
    { id: "pkg-sovereign", name: "Sovereign Enterprise Master", priceUSD: 950, priceKES: 123500, projectsLimit: 999, unitsLimit: 9999, aiTier: "Custom Fine-tuned LLM Instance", support: "Bespoke dedicated account lead" }
  ]);
  const [homepageSettings, setHomepageSettings] = useState<any>({
    showHeroSection: true,
    showStatsSection: true,
    showShowcaseSection: true,
    showROICalculatorSection: true,
    showMatterportSection: true,
    showDevelopersSaaSSection: true,
    showSupportSection: true,
    systemLaunchVideoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    centralPlatformNotice: "SPECIAL MULTI-TOWER LAUNCH: Kenya shillings active with 20% deposit locks."
  });
  const [supportTickets, setSupportTickets] = useState<any[]>([]);
  const [vrSaveMsg, setVrSaveMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Land / plots and WP Yellow Pencil Visual Customizations
  const [otherProperties, setOtherProperties] = useState<any[]>([]);
  const [visualCustomizations, setVisualCustomizations] = useState<Record<string, any>>({});

  const fetchOtherProperties = async () => {
    try {
      const resp = await fetch("/api/projects/other-properties");
      const data = await resp.json();
      if (data.success && data.otherProperties) {
        setOtherProperties(data.otherProperties);
      }
    } catch (err) {
      console.error("Failed to load other properties", err);
    }
  };

  const fetchVisualCustomizations = async () => {
    try {
      const resp = await fetch("/api/projects/visual-customizations");
      const data = await resp.json();
      if (data.success && data.customizations) {
        setVisualCustomizations(data.customizations);
      }
    } catch (err) {
      console.error("Failed to load visual customizations", err);
    }
  };

  const compileCustomizationsToCSS = () => {
    return Object.entries(visualCustomizations).map(([selectorOrId, customVal]) => {
      const custom = customVal as any;
      const styleObj = custom.styleOverrides || {};
      let rules = "";
      if (styleObj.fontFamily) rules += `font-family: ${styleObj.fontFamily} !important; `;
      if (styleObj.fontSize) rules += `font-size: ${styleObj.fontSize} !important; `;
      if (styleObj.textColor) rules += `color: ${styleObj.textColor} !important; `;
      if (styleObj.backgroundColor) rules += `background-color: ${styleObj.backgroundColor} !important; `;
      if (styleObj.fontWeight) rules += `font-weight: ${styleObj.fontWeight} !important; `;
      if (styleObj.letterSpacing) rules += `letter-spacing: ${styleObj.letterSpacing} !important; `;
      if (styleObj.lineHeight) rules += `line-height: ${styleObj.lineHeight} !important; `;
      if (styleObj.textTransform) rules += `text-transform: ${styleObj.textTransform} !important; `;
      
      if (rules) {
        const isDataId = !selectorOrId.startsWith("#") && !selectorOrId.startsWith(".") && !selectorOrId.includes(" ") && !selectorOrId.includes(">");
        const selector = isDataId ? `[data-pencil-id="${selectorOrId}"]` : selectorOrId;
        return `${selector} { ${rules} }\n`;
      }
      return "";
    }).join("");
  };

  useEffect(() => {
    const applyTextAndImageOverrides = () => {
      Object.entries(visualCustomizations).forEach(([selectorOrId, customVal]) => {
        const custom = customVal as any;
        const isDataId = !selectorOrId.startsWith("#") && !selectorOrId.startsWith(".") && !selectorOrId.includes(" ") && !selectorOrId.includes(">");
        const selector = isDataId ? `[data-pencil-id="${selectorOrId}"]` : selectorOrId;

        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach((el) => {
            const htmlEl = el as HTMLElement;
            // Don't interrupt active typing/modifications in editor
            if (htmlEl.getAttribute("data-pencil-active") === "true") return;

            if (custom.textContent !== undefined && custom.textContent !== "") {
              if (htmlEl.innerText !== custom.textContent) {
                htmlEl.innerText = custom.textContent;
              }
            }

            if (custom.imageUrl && htmlEl.tagName.toLowerCase() === "img") {
              const imgEl = htmlEl as HTMLImageElement;
              if (imgEl.src !== custom.imageUrl) {
                imgEl.src = custom.imageUrl;
              }
            }
          });
        } catch (err) {
          // ignore
        }
      });
    };

    applyTextAndImageOverrides();

    const observer = new MutationObserver(() => {
      applyTextAndImageOverrides();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
    };
  }, [visualCustomizations]);

  const handleSaveCustomization = async (elementId: string, updates: any) => {
    try {
      const resp = await fetch("/api/projects/visual-customizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ elementId, updates })
      });
      const data = await resp.json();
      if (data.success && data.customizations) {
        setVisualCustomizations(data.customizations);
      }
    } catch (err) {
      console.error("Failed to save customization", err);
    }
  };

  const handleWipeCustomization = async (elementId: string) => {
    try {
      const resp = await fetch("/api/projects/visual-customizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ elementId, updates: { styleOverrides: {}, textContent: "", imageUrl: "" } })
      });
      const data = await resp.json();
      if (data.success && data.customizations) {
        setVisualCustomizations(data.customizations);
      }
    } catch (err) {
      console.error("Failed to wipe customization", err);
    }
  };

  const getCustomized = (elementId: string, defaultText: string, defaultStyles: string = "") => {
    const item = visualCustomizations[elementId];
    if (!item) return { text: defaultText, className: defaultStyles, style: {} as React.CSSProperties, imageUrl: "" };
    
    const text = item.textContent !== undefined && item.textContent !== "" ? item.textContent : defaultText;
    const style: React.CSSProperties = {};
    const styles = item.styleOverrides || {};
    if (styles.fontFamily) style.fontFamily = styles.fontFamily;
    if (styles.fontSize) style.fontSize = styles.fontSize;
    if (styles.textColor) style.color = styles.textColor;
    if (styles.backgroundColor) style.backgroundColor = styles.backgroundColor;
    if (styles.fontWeight) style.fontWeight = styles.fontWeight;
    if (styles.letterSpacing) style.letterSpacing = styles.letterSpacing;
    if (styles.lineHeight) style.lineHeight = styles.lineHeight;
    if (styles.textTransform) style.textTransform = styles.textTransform as any;
    if (styles.textDecoration) style.textDecoration = styles.textDecoration;
    
    return { text, className: defaultStyles, style, imageUrl: item.imageUrl || "" };
  };

  // Active Project & Interactive Building Selectors
  const [selectedProjectId, setSelectedProjectId] = useState<string>("sky-gardens");
  const [selectedTowerIndex, setSelectedTowerIndex] = useState<number>(0);
  const [selectedUnit, setSelectedUnit] = useState<any | null>(null);

  // --- Dynamic URL Slug & SEO Routing Synchronization ---
  useEffect(() => {
    // Parse URL on initial mount
    const path = window.location.pathname.replace(/^\/+/, '').replace(/\/+$/, '');
    const segments = path.split('/');
    const tabSegment = segments[0];

    const validTabs = ["home", "drops", "portfolio", "matchmaker", "buyer", "developers", "financing", "about", "admin", "agent", "services", "properties", "guide", "flutter", "expo", "international", "ai-hub", "blogs", "videos", "other-properties"];

    if (tabSegment === "login") {
      setAuthModalInitialTab("login");
      setShowAuthModal(true);
      setActiveTab("home");
    } else if (tabSegment === "register") {
      setAuthModalInitialTab("register");
      setShowAuthModal(true);
      setActiveTab("home");
    } else if (tabSegment && validTabs.includes(tabSegment)) {
      setActiveTab(tabSegment as any);
    } else if (tabSegment === 'project' && segments[1]) {
      setActiveTab('portfolio');
      setSelectedProjectId(segments[1]);
    } else if (tabSegment) {
      const knownProjectIds = ['sky-gardens', 'westlands-heights', 'kilimani-elite'];
      if (knownProjectIds.includes(tabSegment)) {
        setActiveTab('portfolio');
        setSelectedProjectId(tabSegment);
      }
    }
  }, []);

  // Sync active tab state changes back to window address bar as path slugs
  useEffect(() => {
    let path = "/";
    if (showAuthModal) {
      path = `/${authModalInitialTab}`;
    } else if (activeTab !== "home") {
      if (activeTab === "portfolio" && selectedProjectId) {
        path = `/project/${selectedProjectId}`;
      } else {
        path = `/${activeTab}`;
      }
    }

    if (window.location.pathname !== path) {
      window.history.pushState({ activeTab, selectedProjectId, showAuthModal, authModalInitialTab }, "", path);
    }
  }, [activeTab, selectedProjectId, showAuthModal, authModalInitialTab]);

  // Handle forward/back navigation in browser
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\/+/, '').replace(/\/+$/, '');
      const segments = path.split('/');
      const tabSegment = segments[0] || 'home';

      const validTabs = ["home", "drops", "portfolio", "matchmaker", "buyer", "developers", "financing", "about", "admin", "agent", "services", "properties", "guide", "flutter", "expo", "international", "ai-hub", "blogs", "videos", "other-properties"];

      if (tabSegment === "login") {
        setAuthModalInitialTab("login");
        setShowAuthModal(true);
        setActiveTab("home");
      } else if (tabSegment === "register") {
        setAuthModalInitialTab("register");
        setShowAuthModal(true);
        setActiveTab("home");
      } else if (validTabs.includes(tabSegment)) {
        setShowAuthModal(false);
        setActiveTab(tabSegment as any);
      } else if (tabSegment === 'project' && segments[1]) {
        setShowAuthModal(false);
        setActiveTab('portfolio');
        setSelectedProjectId(segments[1]);
      } else {
        setShowAuthModal(false);
        const knownProjectIds = ['sky-gardens', 'westlands-heights', 'kilimani-elite'];
        if (knownProjectIds.includes(tabSegment)) {
          setActiveTab('portfolio');
          setSelectedProjectId(tabSegment);
        } else {
          setActiveTab('home');
        }
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);
  // --------------------------------------------------------

  const getWhatsAppLink = (project: any, unit?: any) => {
    const rawPhone = project?.whatsappPhone || "+254735286836";
    const cleanNum = rawPhone.replace(/[^0-9]/g, "");
    
    // Shortened referral link style
    const pageUrl = `${window.location.origin}/?project=${project?.id || ""}`;
    
    let text = `Hello! I am highly interested in your listed property "${project?.name || ""}" located at ${project?.location || ""}.\n\n`;
    if (unit) {
      const typeStr = unit.type || "Apartment";
      text += `🎯 Checked Unit Details:\n- Unit Number: No. ${unit.number}\n- Category: ${typeStr} (${unit.size})\n- Price: ${project?.currency || 'USD'} ${Number(unit.price).toLocaleString()}\n\n`;
    }
    text += `Please send me the pricing prospectus booklet and details! Here is the direct listing link: ${pageUrl}`;
    
    return `https://wa.me/${cleanNum}?text=${encodeURIComponent(text)}`;
  };
  
  // Virtual Tour View Tabs
  const [activeTourTab, setActiveTourTab] = useState<string>("livingRoom");
  const [showVRSpace, setShowVRSpace] = useState(false);
  const [customAmenityInput, setCustomAmenityInput] = useState("");
  
  // Dedicated Project AI Chat state
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ sender: "user" | "bot"; text: string }>>([
    { sender: "bot", text: "Habari! I am your interactive AI Advisor. Ask me anything about layouts, price models, ROI details, or cash discounts!" }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // AI Matchmaker Input details
  const [matchBudget, setMatchBudget] = useState<number>(150000);
  const [matchLifestyle, setMatchLifestyle] = useState<string>("Elegance with wellness and pool relaxation");
  const [matchLocation, setMatchLocation] = useState<string>("Westlands, Nairobi");
  const [matchCommute, setMatchCommute] = useState<string>("Quiet access to Nairobi Expressway");
  const [matchSchool, setMatchSchool] = useState<boolean>(true);
  const [matchInvestment, setMatchInvestment] = useState<boolean>(true);
  const [matchResult, setMatchResult] = useState<MatchmakerResult | null>(null);
  const [matchmakerLoading, setMatchmakerLoading] = useState(false);

  // Booking / Reserve Interactive Modal state
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [reserveUnitDetails, setReserveUnitDetails] = useState<any>(null);
  const [reserveProjectName, setReserveProjectName] = useState("");
  const [reserveBuyerName, setReserveBuyerName] = useState("");
  const [reserveBuyerEmail, setReserveBuyerEmail] = useState("");
  const [reserveBuyerPhone, setReserveBuyerPhone] = useState("");
  const [reservePaymentPlan, setReservePaymentPlan] = useState("Installment Spread (20-60-20)");
  const [kycFile, setKycFile] = useState<string>("passport_main_copy.pdf");
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState("");
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  // Developer Management Form states
  const [devSelectedUnit, setDevSelectedUnit] = useState<string>("");
  const [devSelectedTower, setDevSelectedTower] = useState<string>("");
  const [devNewStatus, setDevNewStatus] = useState<string>("Available");
  const [devNewFlexStatus, setDevNewFlexStatus] = useState<string>("Available");

  // CRM Update feedback state
  const [crmFeedback, setCrmFeedback] = useState<string>("");

  // Financing Calculator simulator states
  const [calcPropertyVal, setCalcPropertyVal] = useState<number>(120000);
  const [calcDownpayment, setCalcDownpayment] = useState<number>(24000);
  const [calcRate, setCalcRate] = useState<number>(13.5); // Average mortgage rate in Kenya shillings / stable USD
  const [calcPeriod, setCalcPeriod] = useState<number>(15);

  // Unified Tenant/User Aware Fetch Header Injector
  const authenticatedFetch = (url: string, init?: RequestInit) => {
    const headers = {
      ...(init?.headers || {}),
      "Content-Type": "application/json"
    } as any;

    const effU = impersonatedUser || currentUser;
    if (effU) {
      headers["x-user-id"] = effU.id;
      headers["x-user-email"] = effU.email;
      headers["x-user-role"] = effU.role;
    }

    return fetch(url, {
      ...init,
      headers
    });
  };

  // Dynamic fetchers for Admin Control Desk elements
  const fetchAdminUsers = async () => {
    try {
      const resp = await authenticatedFetch("/api/admin/users");
      const data = await resp.json();
      if (resp.ok) setAdminUsers(data.users);
    } catch (err) {
      console.error("Failed to load user directories", err);
    }
  };

  const fetchPackages = async () => {
    try {
      const resp = await authenticatedFetch("/api/admin/packages");
      const data = await resp.json();
      if (resp.ok) setDeveloperPackages(data.packages);
    } catch (err) {
      console.error("Failed to load package plans", err);
    }
  };

  const fetchHomepageSettings = async () => {
    try {
      const resp = await authenticatedFetch("/api/admin/homepage");
      const data = await resp.json();
      if (resp.ok) setHomepageSettings(data.settings);
    } catch (err) {
      console.error("Failed to load homepage map settings", err);
    }
  };

  const fetchTickets = async () => {
    try {
      const resp = await authenticatedFetch("/api/admin/tickets");
      const data = await resp.json();
      if (resp.ok) setSupportTickets(data.tickets);
    } catch (err) {
      console.error("Failed to load support ticket ledgers", err);
    }
  };

  // Initialize and synchronise state records from backend APIs
  const fetchAllData = async () => {
    try {
      // Fetch either tenant-aware saas data or full projects list based on developer role
      const isDeveloper = currentUser?.role === "Developer";
      const url = isDeveloper ? "/api/saas/tenant/dashboard" : "/api/projects";
      const resp = await authenticatedFetch(url);
      const data = await resp.json();

      const mergeDubaiList = (backendList: any[]) => {
        const merged = [...backendList];
        dubaiPreVetted.forEach(dub => {
          if (!merged.some(p => p.id === dub.id)) {
            merged.push(dub);
          }
        });
        return merged;
      };

      if (isDeveloper && data.success) {
        setProjects(mergeDubaiList(data.projects || []));
        setBookings(data.bookings);
        setLeads(data.leads);
        setWhatsappChats(data.chats);
      } else {
        setProjects(mergeDubaiList(data.projects || []));
        if (data.activityLogs) setActivityLogs(data.activityLogs);

        const bookRes = await authenticatedFetch("/api/bookings");
        const bookData = await bookRes.json();
        setBookings(bookData.bookings || []);
        setLeads(bookData.leads || []);
        setWhatsappChats(bookData.whatsappChats || []);
      }

      // Async fetch custom platform parameters & support
      fetchPackages();
      fetchHomepageSettings();
      fetchOtherProperties();
      fetchVisualCustomizations();

      if (currentUser?.role === "SuperAdmin" || currentPersona === "SuperAdmin") {
        fetchAdminUsers();
        fetchTickets();
      }

      setLoadingProjects(false);
    } catch (e) {
      console.error("Error connecting to backend services", e);
    }
  };

  useEffect(() => {
    fetchAllData();
    const pollInterval = setInterval(fetchAllData, 12000);
    return () => clearInterval(pollInterval);
  }, []);

  // Adaptive AI Telemetry Observers
  useEffect(() => {
    logAIInteraction("tab-switch", activeTab, `User navigated to the "${activeTab}" view category`);
  }, [activeTab]);

  useEffect(() => {
    if (selectedProjectId) {
      logAIInteraction("project-view", selectedProjectId, `User loaded details for project: ${selectedProjectId}`);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    if (selectedUnit) {
      logAIInteraction("unit-click", selectedUnit.number, `User inspected apartment block: Unit ${selectedUnit.number} (${selectedUnit.type}) priced at $${selectedUnit.price}`);
    }
  }, [selectedUnit]);

  // Deep-link query string processing on startup or load
  useEffect(() => {
    if (!loadingProjects && projects.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const urlProj = params.get("project") || params.get("projectId");
      const urlUnit = params.get("unit") || params.get("unitNumber");
      if (urlProj) {
        setSelectedProjectId(urlProj);
        setActiveTab("portfolio");
        if (urlUnit) {
          const proj = projects.find(p => p.id === urlProj) || dubaiPreVetted.find(p => p.id === urlProj);
          if (proj) {
            let found = false;
            for (let tIdx = 0; tIdx < proj.towers.length; tIdx++) {
              const tower = proj.towers[tIdx];
              for (const floor of tower.floors) {
                const unit = floor.units.find(u => u.number.toLowerCase() === urlUnit.toLowerCase());
                if (unit) {
                  setSelectedTowerIndex(tIdx);
                  setSelectedUnit(unit);
                  found = true;
                  break;
                }
              }
              if (found) break;
            }
          }
        }
      }
    }
  }, [loadingProjects, projects]);

  const handleSiteVisitQRScan = (projectId: string, unitNumber: string, logActionText?: string) => {
    setSelectedProjectId(projectId);
    setActiveTab("portfolio");
    
    const proj = projects.find(p => p.id === projectId) || dubaiPreVetted.find(p => p.id === projectId);
    if (proj) {
      let found = false;
      for (let tIdx = 0; tIdx < proj.towers.length; tIdx++) {
        const tower = proj.towers[tIdx];
        for (const floor of tower.floors) {
          const unit = floor.units.find(u => u.number.toLowerCase() === unitNumber.toLowerCase());
          if (unit) {
            setSelectedTowerIndex(tIdx);
            setSelectedUnit(unit);
            found = true;
            break;
          }
        }
        if (found) break;
      }
    }

    const actionLabel = logActionText || `Scanned physical placard QR code for Unit ${unitNumber}`;
    logAIInteraction("site-visit-qr-scan", unitNumber, `[QR PLACARD DEEP-LINK] ${actionLabel} in project ${projectId}`);
  };

  const activeProject = React.useMemo(() => {
    let found = projects.find(p => p.id === selectedProjectId);
    if (found) return found;
    found = dubaiPreVetted.find(p => p.id === selectedProjectId);
    if (found) return found;
    return projects[0] || dubaiPreVetted[0];
  }, [projects, selectedProjectId]);

  const formatPrice = (priceVal: number, project: any = activeProject) => {
    const projBaseCurrency = project?.currency || (project?.id === "only-you-in-kilimani" ? "KES" : "USD");

    if (displayCurrency === "KES") {
      if (projBaseCurrency === "KES") {
        return `KES ${Math.round(priceVal).toLocaleString()}`;
      } else {
        // Base is USD, convert to KES
        const converted = priceVal * 130;
        return `KES ${Math.round(converted).toLocaleString()}`;
      }
    } else {
      // Displaying in USD
      if (projBaseCurrency === "KES") {
        // Base is KES, convert to USD
        const converted = priceVal / 130;
        return `$${Math.round(converted).toLocaleString()} USD`;
      } else {
        return `$${Math.round(priceVal).toLocaleString()} USD`;
      }
    }
  };

  useEffect(() => {
    setShowVRSpace(false);
    if (activeProject && activeProject.towers && activeProject.towers[0]) {
      const firstTower = activeProject.towers[0];
      const firstFloor = firstTower.floors && firstTower.floors[0];
      const firstUnit = firstFloor && firstFloor.units && firstFloor.units[0];
      if (firstUnit) {
        setCalcPropertyVal(firstUnit.price);
        const depPercent = activeProject.bookingDepositPercent || 2; 
        setCalcDownpayment(Math.round(firstUnit.price * (depPercent / 100)));
      }
    }
  }, [selectedProjectId, activeProject]);

  const handleSendMessageToAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userText = chatMessage;
    setChatMessage("");
    setChatHistory(prev => [...prev, { sender: "user", text: userText }]);
    setChatLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: selectedProjectId,
          message: userText
        })
      });
      const data = await response.json();
      setChatHistory(prev => [...prev, { sender: "bot", text: data.text }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { sender: "bot", text: "Apologies, I encountered a connection issue. How else may I assist you?" }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleRunMatchmaker = async (e: React.FormEvent) => {
    e.preventDefault();
    setMatchmakerLoading(true);
    setMatchResult(null);

    // Track search criteria in AI database
    logAIInteraction("search", "matchmaker", `Criteria - Budget: $${matchBudget}, Lifestyle: ${matchLifestyle}, Hub: ${matchLocation}`);

    try {
      const response = await fetch("/api/matchmaker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          budget: matchBudget,
          lifestyle: matchLifestyle,
          locationPref: matchLocation,
          commuteNeed: matchCommute,
          schoolPriority: matchSchool,
          investmentScorePriority: matchInvestment
        })
      });
      const data = await response.json();
      setMatchResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setMatchmakerLoading(false);
    }
  };

  const handleReserveFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reserveBuyerName || !reserveBuyerEmail) {
      alert("Please provide the key buyer credentials prior to reservation lock.");
      return;
    }

    setIsSubmittingBooking(true);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName: reserveProjectName,
          unitNumber: reserveUnitDetails.number,
          buyerName: reserveBuyerName,
          buyerEmail: reserveBuyerEmail,
          buyerPhone: reserveBuyerPhone,
          paymentPlan: reservePaymentPlan,
          bookingFeePaid: reserveUnitDetails.price * ((activeProject?.bookingDepositPercent || 2) / 100), // dynamic lock fee based on currency rules
          kycDocumentName: kycFile
        })
      });
      
      if (response.ok) {
        // Track booking in AI database
        logAIInteraction("reservation", reserveUnitDetails.number, `Secured pre-sales lock for Unit ${reserveUnitDetails.number} in ${reserveProjectName} ($${reserveUnitDetails.price})`);

        setBookingSuccessMsg(`Congratulations! Lock Deposit fully cleared for Unit ${reserveUnitDetails.number}. Your reservation is officially registered!`);
        await fetchAllData();
        setTimeout(() => {
          setShowReserveModal(false);
          setBookingSuccessMsg("");
          setReserveBuyerName("");
          setReserveBuyerEmail("");
          setReserveBuyerPhone("");
        }, 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  const triggerReserveModal = (projectObj: Project, unitObj: any) => {
    setReserveProjectName(projectObj.name);
    setReserveUnitDetails(unitObj);
    setShowReserveModal(true);
  };

  const updateUnitStatus = async (towerName: string, unitNumber: string, status: string, flexStatus: string) => {
    try {
      const response = await authenticatedFetch(`/api/inventory/project/${selectedProjectId}/units/${unitNumber}`, {
        method: "PATCH",
        body: JSON.stringify({
          status
        })
      });
      if (response.ok) {
        setCrmFeedback(`Unit ${unitNumber} status modified successfully to ${status}.`);
        await fetchAllData();
        setTimeout(() => setCrmFeedback(""), 4000);
      } else {
        // Fallback for non-inventory configurations
        const fallback = await authenticatedFetch("/api/projects/update-unit", {
          method: "POST",
          body: JSON.stringify({
            projectId: selectedProjectId,
            towerName,
            unitNumber,
            status,
            flexStatus
          })
        });
        if (fallback.ok) {
          setCrmFeedback(`Unit ${unitNumber} status updated on fallback repository.`);
          await fetchAllData();
          setTimeout(() => setCrmFeedback(""), 4000);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateLeadStatus = async (leadId: string, status: string, comments: string) => {
    try {
      const response = await fetch("/api/leads/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, status, comments })
      });
      if (response.ok) {
        setCrmFeedback("Lead profile synchronized!");
        await fetchAllData();
        setTimeout(() => setCrmFeedback(""), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Financial calculations
  const calcPrincipal = calcPropertyVal - calcDownpayment;
  const calcMonthlyRate = (calcRate / 12) / 100;
  const calcTotalMonths = calcPeriod * 12;
  const computedMonthlyPayment = calcMonthlyRate > 0 
    ? (calcPrincipal * calcMonthlyRate * Math.pow(1 + calcMonthlyRate, calcTotalMonths)) / (Math.pow(1 + calcMonthlyRate, calcTotalMonths) - 1)
    : calcPrincipal / calcTotalMonths;

  return (
    <div className="min-h-screen bg-stone-50 text-neutral-900 font-sans selection:bg-amber-400 selection:text-neutral-900">
      
      {impersonatedUser && (
        <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-neutral-950 font-bold px-4 py-2 text-center text-xs shadow-md flex items-center justify-center gap-4 animate-fade-in z-[100] relative">
          <span className="flex items-center gap-1.5 uppercase font-black tracking-wider text-[11px]">
            👤 Impersonation Mode Active
          </span>
          <span>
            Operating Nairobi nodes as: <strong className="underline text-black font-black">{impersonatedUser.username}</strong> ({impersonatedUser.email}) with role: <strong className="font-mono bg-black/10 px-1.5 py-0.5 rounded font-black text-[10px] uppercase">{impersonatedUser.role}</strong>
          </span>
          <button
            onClick={() => setImpersonatedUser(null)}
            className="bg-black hover:bg-black/90 text-amber-400 hover:text-white font-extrabold text-[10px] uppercase px-3 py-1 rounded-lg shadow-sm cursor-pointer transition-all active:scale-95 ml-2"
          >
            Exit Impersonation
          </button>
        </div>
      )}
      
      {/* Top Banner Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          
          {/* Brand Identity / Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-stone-300 via-stone-100 to-stone-400 text-stone-800 flex items-center justify-center shadow-md border border-stone-200 shrink-0 relative overflow-hidden group">
              <Bot className="w-6 h-6 text-stone-700 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]" />
              {/* Glowing Cybernetic Eyes */}
              <div className="absolute top-[16px] left-[13px] flex gap-[6px]">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_4px_#22d3ee] animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_4px_#22d3ee] animate-pulse" />
              </div>
            </div>
            <div>
              <span className="text-xl font-black uppercase tracking-tight text-neutral-950 flex items-center gap-1 leading-none">
                PropSphere <span className="text-xs bg-amber-400 text-neutral-950 px-2 py-0.5 rounded font-mono font-bold tracking-widest leading-none">2.0</span>
              </span>
              <p className="text-[10px] text-neutral-500 font-mono font-semibold uppercase tracking-wider mt-1">Premium Launch Hub • East Africa</p>
            </div>
          </div>

          {/* Current Terminal Badge (desktop only) */}
          <div className="hidden md:flex items-center gap-2 bg-stone-100 border border-stone-200 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-neutral-800">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Active Terminal: <span className="text-neutral-950 font-black font-mono">{activeTab}</span>
          </div>

          {/* Clean Right Controls */}
          <div className="flex items-center gap-2">
            {currentUser ? (
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-sm text-xs max-w-[140px] xs:max-w-none">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-bold text-neutral-800 truncate max-w-[80px] xs:max-w-none">{currentUser.username}</span>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-neutral-950 hover:bg-neutral-800 text-amber-400 px-3.5 py-2 rounded-xl text-xs font-bold tracking-wider uppercase shadow-md transition-all shrink-0 border border-neutral-850 flex items-center gap-1.5 cursor-pointer"
                id="header-sign-in-button"
              >
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden xs:inline">Sign In</span>
              </button>
            )}

            {/* Menu Trigger Button */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-xl transition-all flex items-center gap-1.5 shadow focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer text-xs font-black uppercase tracking-wider"
              title="Open Navigation Drawer"
              id="menu-trigger-btn"
            >
              <Menu className="w-4 h-4" />
              <span>Menu</span>
            </button>
          </div>

        </div>
      </header>

      {/* Off-Canvas Navigation Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop Layer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-neutral-950/50 backdrop-blur-sm z-50 cursor-pointer"
            />

            {/* Sidebar drawer panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm sm:max-w-md bg-white border-l border-stone-200 z-[100] p-6 flex flex-col justify-between shadow-2xl overflow-y-auto"
              id="off-canvas-sidebar"
            >
              <div className="space-y-8">
                {/* Drawer Header */}
                <div className="flex items-center justify-between border-b border-stone-150 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-stone-300 via-stone-100 to-stone-400 text-stone-850 flex items-center justify-center font-bold text-sm shrink-0 relative overflow-hidden">
                      <Bot className="w-5 h-5 text-stone-700" />
                      {/* Glowing Cybernetic Eyes */}
                      <div className="absolute top-[12px] left-[10px] flex gap-[5px]">
                        <span className="w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_2px_#22d3ee] animate-pulse" />
                        <span className="w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_2px_#22d3ee] animate-pulse" />
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-black uppercase tracking-wider text-neutral-950 block">PropSphere OS</span>
                      <p className="text-[9px] text-neutral-400 uppercase tracking-widest leading-none font-mono font-semibold">East Africa Catalog Hub</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 py-1 text-xs rounded-full hover:bg-stone-100 text-stone-500 hover:text-neutral-900 transition-all font-mono font-black"
                  >
                    × Close
                  </button>
                </div>

                {/* User Info inside menu */}
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80">
                  {currentUser ? (
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-neutral-950 flex items-center justify-center font-black text-sm shadow-inner">
                          {currentUser.username.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <strong className="text-xs font-black text-neutral-950 block">{currentUser.username}</strong>
                          <span className="text-[10px] text-stone-500 font-mono block">{currentUser.email}</span>
                          <span className={`inline-flex items-center mt-1 text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider leading-none ${
                            currentUser.role === "Developer" 
                              ? "bg-blue-105 text-blue-700" 
                              : currentUser.role === "SuperAdmin" 
                              ? "bg-purple-105 text-purple-700 font-black" 
                              : "bg-amber-105 text-amber-800"
                          }`}>
                            {currentUser.role === "SuperAdmin" ? "Super Admin" : currentUser.role}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          localStorage.removeItem("propsphere_user");
                          setCurrentUser(null);
                          setCurrentPersona("Buyer");
                          setActiveTab("home");
                          setIsMenuOpen(false);
                        }}
                        className="w-full mt-4 bg-white border border-stone-250 hover:bg-red-50 hover:text-red-600 font-bold font-mono tracking-wider text-[10px] py-2 rounded-xl text-stone-500 text-center block transition-all cursor-pointer uppercase"
                      >
                        Disconnect Session (Logout)
                      </button>
                    </div>
                  ) : (
                    <div className="text-center space-y-2 py-1">
                      <p className="text-xs font-semibold text-neutral-600">You are currently navigating as a guest partner.</p>
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          setShowAuthModal(true);
                        }}
                        className="w-full bg-neutral-950 text-amber-400 font-bold text-xs uppercase py-2.5 rounded-xl block text-center"
                      >
                        Connect Verified Account
                      </button>
                    </div>
                  )}
                </div>

                {/* Vertical menu tabs with rich styling */}
                <div className="space-y-4">
                  <span className="text-[9px] uppercase font-mono font-bold tracking-widest text-neutral-400 block px-1">Navigation Terminals</span>
                  
                  <div className="grid grid-cols-1 gap-2">
                    {(() => {
                      const effectiveUser = impersonatedUser || currentUser;
                      const activeRole = effectiveUser ? effectiveUser.role : null;
                      const isRealAdmin = currentUser?.role === "SuperAdmin";
                      
                      const publicTabsMap: Record<string, any> = {
                        "home": { id: "home", label: "Home", desc: "Overview of listings, metrics, and real-time updates", icon: Building2 },
                        "properties": { id: "properties", label: "Property Listings", desc: "Browse luxury commercial & residential properties in Nairobi", icon: Compass },
                        "videos": { id: "videos", label: "Video Tours", desc: "Watch high-definition video walkthroughs of listed properties", icon: Play },
                        "other-properties": { id: "other-properties", label: "Land & Plots", desc: "Find prime residential & commercial plots of land for sale", icon: Compass },
                        "international": { id: "international", label: "International Listings", desc: "Explore luxury off-plan properties in Dubai and globally", icon: Globe },
                        "drops": { id: "drops", label: "Off-Plan Drops", desc: "Get real-time direct developer releases & countdowns", icon: Clock },
                        "portfolio": { id: "portfolio", label: "Interactive Layouts", desc: "Interactive floor plans, layout maps, and virtual models", icon: Building },
                        "matchmaker": { id: "matchmaker", label: "Investment Matcher", desc: "Find properties with the best return on investment", icon: Sparkles },
                        "financing": { id: "financing", label: "Mortgage & Financing", desc: "Calculate monthly mortgage costs and check escrow accounts", icon: TrendingUp },
                        "services": { id: "services", label: "Expert Legal Services", desc: "Access verified lawyers, valuation experts, and advisors", icon: Scale },
                        "blogs": { id: "blogs", label: "Market Blogs", desc: "Read our AI-powered property insights and market blogs", icon: FileText },
                        "guide": { id: "guide", label: "Help Guide & Rules", desc: "Platform tutorials, standard operating procedures, and commissions", icon: BookOpen },
                        "ai-hub": { id: "ai-hub", label: "AI Assistant Center", desc: "Interact with our predictive AI tools and market assistant", icon: Brain }
                      };

                      const defaultOrder = ["home", "properties", "videos", "other-properties", "international", "drops", "portfolio", "matchmaker", "financing", "services", "blogs", "guide", "ai-hub"];
                      let activeMenuIds = homepageSettings?.activeMenuIds || defaultOrder;
                      if (homepageSettings?.activeMenuIds && !homepageSettings.activeMenuIds.includes("videos")) {
                        activeMenuIds = [...homepageSettings.activeMenuIds];
                        activeMenuIds.splice(2, 0, "videos");
                      }

                      const publicItems = activeMenuIds
                        .map(id => publicTabsMap[id])
                        .filter(Boolean)
                        .filter(item => item.id !== "flutter" && item.id !== "expo");

                      const items = [
                        ...publicItems,
                        ...((activeRole === "Buyer" || isRealAdmin)
                          ? [{ id: "buyer", label: "Buyer Portal", desc: "View your personal transactions, saved units, and documents", icon: ShieldCheck }]
                          : []
                        ),
                        ...((activeRole === "Developer" || isRealAdmin)
                          ? [{ id: "developers", label: "Developer Portal", desc: "Manage property listings, incoming buyer leads, and marketing", icon: LayoutDashboard }]
                          : []
                        ),
                        ...((activeRole === "Agent" || isRealAdmin)
                          ? [{ id: "agent", label: "Broker / Agent Portal", desc: "Track performance, calculate commissions, and manage sales", icon: Briefcase }]
                          : []
                        ),
                        ...(isRealAdmin
                          ? [{ id: "admin", label: "Admin Control Panel", desc: "Platform settings, database logs, and site-wide metrics", icon: Settings }]
                          : []
                        )
                      ];

                      return items.map((item) => {
                        const IconComp = item.icon;
                        const isSelected = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setActiveTab(item.id as any);
                              setIsMenuOpen(false);
                            }}
                            className={`w-full flex items-start gap-3.5 p-3 rounded-2xl text-left border transition-all hover:bg-stone-50 cursor-pointer duration-150 ${
                              isSelected
                                ? "bg-amber-50 text-neutral-950 border-amber-200 font-extrabold shadow-sm"
                                : "bg-white text-neutral-600 border-stone-150"
                            }`}
                          >
                            <div className={`p-2 rounded-xl border mt-0.5 shrink-0 ${
                              isSelected ? "bg-amber-400 text-neutral-950 border-amber-305" : "bg-stone-100 text-stone-400 border-stone-200"
                            }`}>
                              <IconComp className="w-4 h-4 shrink-0 font-bold" />
                            </div>
                            <div>
                              <span className={`text-[13px] font-black leading-tight block ${isSelected ? "text-neutral-950" : "text-neutral-800"}`}>
                                {item.label}
                              </span>
                              <span className="text-[10px] font-medium text-stone-400 mt-0.5 block leading-tight">
                                {item.desc}
                              </span>
                            </div>
                          </button>
                        );
                      });
                    })()}
                  </div>

                  {/* High-Impact WhatsApp Executive Desk CTA */}
                  <div className="bg-emerald-50/90 border border-emerald-200/80 p-4.5 rounded-2xl space-y-3 shadow-sm mt-2 text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-8.5 h-8.5 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
                        <MessageSquare className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-emerald-950 block leading-tight">WhatsApp Chat</span>
                        <span className="text-[10px] text-emerald-600 block mt-0.5 font-mono font-bold">WhatsApp: +254 735 286 836</span>
                      </div>
                    </div>
                    <p className="text-[10.5px] text-emerald-800 leading-normal font-medium">
                      Inquire directly for property consultations, title deed verification, and exclusive launch-day discounts.
                    </p>
                    <a
                      href="https://wa.me/254735286836?text=Hello%20PropSphere%20Executive%20Desk%2C%20I%20am%20interested%20in%20arranging%20a%20site%20consultation%20and%20receiving%2520listing%20prospectuses."
                      target="_blank"
                      rel="noreferrer"
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-center font-bold text-xs py-2.5 rounded-xl block transition-all uppercase tracking-wider cursor-pointer shadow-sm shadow-emerald-500/10 active:scale-95"
                    >
                      Connect on WhatsApp
                    </a>
                  </div>
                </div>

              </div>

              {currentUser && (
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 mt-8 space-y-1.5 text-center shadow-inner">
                  <span className="text-[10px] uppercase font-mono font-extrabold text-emerald-600 flex items-center justify-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" /> Active Portal Session
                  </span>
                  <p className="text-[10px] text-stone-500 leading-normal leading-tight">
                    You are signed in as <strong className="text-stone-850 font-extrabold uppercase">{currentUser.role}</strong>. Your session is active and secure.
                  </p>
                </div>
              )}

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Container Wrapper */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {loadingProjects || !activeProject ? (
          <div className="bg-white p-24 rounded-3xl text-center border border-stone-200/80 shadow-sm min-h-[400px] flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 animate-spin text-amber-500 mb-4" />
            <h3 className="text-lg font-black text-neutral-900 tracking-tight uppercase">Loading PropSphere...</h3>
            <p className="text-xs text-neutral-500 mt-2 max-w-sm mx-auto">
              Connecting with Nairobi properties and loading layout details. Please wait.
            </p>
          </div>
        ) : (
          <>
            {/* Global Quick Banner: Alerting of the live Prop Drop happening this week */}
        <div className="bg-gradient-to-r from-neutral-950 to-stone-900 text-white p-4 rounded-2xl mb-8 flex flex-col md:flex-row items-center justify-between gap-4 border border-neutral-800 shadow relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-amber-500/15 blur-2xl rounded-full" />
          <div className="flex items-center gap-3 relative z-10">
            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500/10 border border-red-500/40">
              <span className="h-1.5 w-1.5 animate-ping rounded-full bg-red-400" />
            </span>
            <div>
              <p className="text-xs font-mono text-amber-400 uppercase tracking-widest font-bold">Countdown Live Event Active</p>
              <h4 className="text-sm font-bold text-stone-200">The next VIP units drops is Friday, 3:00 PM EAT. Ensure details are loaded.</h4>
            </div>
          </div>
          <button
            onClick={() => setActiveTab("drops")}
            className="bg-amber-400 hover:bg-amber-300 text-neutral-950 px-4 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase shadow transition-all shrink-0 flex items-center gap-1"
          >
            Enter Drop Room <ArrowRight className="w-3" />
          </button>
        </div>

        {activeTab === "international" && (
          <InternationalPortfolioPage
            projects={projects}
            onSelectProject={(id) => {
              setSelectedProjectId(id);
              setSelectedTowerIndex(0);
              setSelectedUnit(null);
              setActiveTab("portfolio");
            }}
            currentUser={currentUser}
            onNavigateToTab={(tab) => setActiveTab(tab as any)}
          />
        )}

        {activeTab === "properties" && (
          <PropertiesPage
            projects={projects}
            onSelectProject={(id) => {
              setSelectedProjectId(id);
              setSelectedTowerIndex(0);
              setSelectedUnit(null);
              setActiveTab("portfolio");
            }}
            formatPrice={(price) => formatPrice(price, activeProject)}
            displayCurrency={displayCurrency}
          />
        )}

        {activeTab === "videos" && (
          <PropertyVideosPage
            projects={projects}
            onSelectProject={(id) => {
              setSelectedProjectId(id);
              setSelectedTowerIndex(0);
              setSelectedUnit(null);
              setActiveTab("portfolio");
            }}
            onNavigateToTab={(tab) => setActiveTab(tab as any)}
            formatPrice={(price) => formatPrice(price, activeProject)}
          />
        )}

        {activeTab === "other-properties" && (
          <OtherPropertiesPage
            otherProperties={otherProperties}
            onAddActivityLog={(txt) => {
              const newLog = {
                id: `act-${Date.now()}`,
                type: "system",
                text: txt,
                time: "Just now"
              };
              setActivityLogs(prev => [newLog, ...prev]);
            }}
            formatPrice={(price) => formatPrice(price, activeProject)}
          />
        )}

        {activeTab === "home" && (
          <PLOSHomepage
            projects={projects}
            activeProject={activeProject}
            onSelectProject={(id) => {
              setSelectedProjectId(id);
              setSelectedTowerIndex(0);
              setSelectedUnit(null);
              setActiveTab("portfolio");
            }}
            onTriggerReserve={(proj, unit) => {
              triggerReserveModal(proj, unit);
            }}
            onNavigateToTab={(tabName) => {
              if ((tabName as any) === "battle") {
                setActiveTab("buyer");
              } else {
                setActiveTab(tabName as any);
              }
            }}
            homepageSettings={homepageSettings}
            getCustomized={getCustomized}
          />
        )}

        {/* ================================== 1. FRIDAY DEALS BROADCAST TAB ================================== */}
        {activeTab === "drops" && (
          <div className="space-y-8">
            <PropDropsEvent 
              activityLogs={activityLogs} 
              homepageSettings={homepageSettings}
              onSelectUnit={(pName, unitNum) => {
                const proj = projects.find(p => p.name === pName);
                if (proj) {
                  setSelectedProjectId(proj.id);
                  setActiveTab("portfolio");
                  // find unit to auto-focus
                  for (let i = 0; i < proj.towers.length; i++) {
                    for (const fl of proj.towers[i].floors) {
                      const u = fl.units.find(un => un.number === unitNum);
                      if (u) {
                        setSelectedTowerIndex(i);
                        setSelectedUnit(u);
                      }
                    }
                  }
                }
              }} 
            />

            {/* Quick Informational Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "How Prop Drops Work",
                  desc: "Every Friday at 3:00 PM, custom units with pre-cleared land titles are unlocked on PropSphere. Watch the countdown timer, join the live queue, and put down a holding deposit via secure digital escrow.",
                  footer: "No brokerage fees • Verified status",
                  color: "border-l-amber-500"
                },
                {
                  title: "Dynamic Floor releases",
                  desc: "Off-plan developments typically lock pricing behind opaque agent calls. In contrast, PropSphere hosts visible digital mock buildings that automatically flash purple during discount hours so you execute instantly.",
                  footer: "Live CRM connectivity",
                  color: "border-l-blue-500"
                },
                {
                  title: "Verified Escrow Escarpments",
                  desc: "Deposits are safeguarded directly with partnering banks and only released to developers upon verifiable construction milestones, backed by continuous drone progress logs.",
                  footer: "Safe & certified county titles",
                  color: "border-l-green-500"
                }
              ].map((card, idx) => (
                <div key={idx} className={`bg-white p-5 rounded-2xl shadow-sm border border-stone-200/80 border-l-4 ${card.color}`}>
                  <h4 className="font-bold text-sm text-neutral-950 uppercase tracking-wide">{card.title}</h4>
                  <p className="text-xs text-neutral-500 mt-2 leading-relaxed">{card.desc}</p>
                  <span className="text-[10px] text-neutral-400 font-bold block mt-4 uppercase tracking-widest">{card.footer}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================== 2. PROPERTIES PORTFOLIO & DIGITAL TWIN ================================== */}
        {activeTab === "portfolio" && (
          <div className="space-y-8">
            
            {/* Project Selection Tabs */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-500" />
                <div>
                  <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block leading-none font-bold">Select Off-Plan Development</label>
                  <span className="text-sm font-bold text-neutral-950">Active Nairobi Microsites</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {projects.length === 0 ? (
                  <div className="flex items-center gap-2 text-xs text-stone-500 px-3 py-1">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading PropSphere projects...
                  </div>
                ) : (
                  projects.filter(p => !p.isInternational || p.id === selectedProjectId).map((proj) => (
                    <button
                      key={proj.id}
                      onClick={() => {
                        setSelectedProjectId(proj.id);
                        setSelectedTowerIndex(0);
                        setSelectedUnit(null);
                      }}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                        selectedProjectId === proj.id
                          ? "bg-neutral-950 text-white border-neutral-950 shadow-md"
                          : "bg-stone-50 text-neutral-600 border-stone-200/80 hover:bg-stone-100"
                      }`}
                    >
                      {proj.isInternational ? "🌍 " : ""}{proj.name}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* QR Placard Scanner Hub */}
            {activeProject && (
              <QRPlacardScanner
                activeProject={activeProject}
                onSelectUnit={handleSiteVisitQRScan}
                formatPrice={(priceVal) => formatPrice(priceVal, activeProject)}
              />
            )}

            {loadingProjects ? (
              <div className="bg-white p-12 rounded-3xl text-center border border-stone-200/80">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-amber-500 mb-2" />
                <p className="text-sm text-neutral-500 font-semibold uppercase tracking-wider">Loading Property Layouts...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* LEFT COLLUMN: Interactive Layout + Virtual Tours (7 cols) */}
                <div className="lg:col-span-7 space-y-8">
                  
                  {/* Interactive Layout Section Card */}
                  <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-2xl font-black tracking-tight text-neutral-950">{activeProject.name} Interactive Model</h3>
                          {activeProject.developerVerified && (
                            <span className="bg-green-50 text-green-700 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-green-200 flex items-center gap-0.5">
                              <ShieldCheck className="w-3.5 h-3.5" /> Verified Developer
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-500 flex items-center gap-1 font-semibold uppercase tracking-wider">
                          <MapPin className="w-3.5 h-3.5 text-red-500" /> {activeProject.location} • {activeProject.developerName}
                        </p>
                      </div>

                      {/* Tower Selector in Project */}
                      <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200 self-start">
                        {activeProject.towers.map((tower, idx) => (
                          <button
                            key={tower.name}
                            onClick={() => {
                              setSelectedTowerIndex(idx);
                              setSelectedUnit(null);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              selectedTowerIndex === idx
                                ? "bg-white text-neutral-950 shadow-sm"
                                : "text-neutral-500 hover:text-neutral-950"
                            }`}
                          >
                            {tower.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-neutral-600 leading-relaxed italic border-l-2 border-stone-300 pl-3">
                      "{activeProject.tagline}"
                    </p>

                    {/* Color Legend for Tower Grid */}
                    <div className="flex flex-wrap gap-x-4 gap-y-2 py-2 bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs">
                      <span className="font-bold text-[10px] uppercase tracking-wider text-neutral-400 flex items-center mr-1">Legend:</span>
                      <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded bg-emerald-500 border border-emerald-600 block shadow-sm" /> Available</span>
                      <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded bg-amber-500 border border-amber-600 block shadow-sm" /> Reserved</span>
                      <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded bg-red-600 border border-red-700 block shadow-sm" /> Sold</span>
                      <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded bg-blue-550 border border-blue-600 block shadow-sm" /> Coming Soon</span>
                      <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded bg-fuchsia-600 border border-fuchsia-700 block shadow-sm" /> FLASH DEAL</span>
                    </div>

                    {/* Interactive Floor-by-Floor Block Matrix */}
                    <div className="space-y-3 pt-2">
                      {activeProject.towers[selectedTowerIndex]?.floors.map((fl) => (
                        <div key={fl.floorNumber} className="flex items-center gap-3 bg-stone-50/50 p-2 rounded-xl border border-stone-250/60 hover:bg-stone-50 transition-colors">
                          <div className="w-16 text-center font-mono text-xs font-bold text-neutral-400 uppercase tracking-widest shrink-0 border-r border-stone-200 py-1.5">
                            Floor {fl.floorNumber}
                          </div>
                          <div className="flex-1 grid grid-cols-3 gap-2">
                            {fl.units.map((unit) => {
                              // Color code styles
                              let colorBg = "bg-stone-200 hover:bg-stone-300 border-stone-300 text-neutral-800";
                              if (unit.status === "Available" && unit.flexStatus === "Purple") {
                                colorBg = "bg-fuchsia-600 hover:bg-fuchsia-700 border-fuchsia-700 text-white";
                              } else if (unit.status === "Available") {
                                colorBg = "bg-emerald-500 hover:bg-emerald-600 border-emerald-600 text-white";
                              } else if (unit.status === "Reserved") {
                                colorBg = "bg-amber-500 hover:bg-amber-600 border-amber-600 text-white";
                              } else if (unit.status === "Sold") {
                                colorBg = "bg-red-600 hover:bg-red-700 border-red-700 text-white";
                              } else if (unit.status === "Coming Soon") {
                                colorBg = "bg-blue-500 hover:bg-blue-600 border-blue-600 text-white";
                              }

                              const isCurrentSelect = selectedUnit?.number === unit.number;

                              return (
                                <button
                                  key={unit.number}
                                  onClick={() => setSelectedUnit(unit)}
                                  className={`p-2.5 rounded-lg border text-xs font-bold transition-all text-center relative overflow-hidden flex flex-col items-center justify-center cursor-pointer shadow-sm active:scale-95 ${colorBg} ${
                                    isCurrentSelect ? "ring-2 ring-neutral-950 ring-offset-2 scale-102" : ""
                                  }`}
                                  title={`Unit ${unit.number} - ${unit.type}`}
                                >
                                  <span className="block">{unit.number}</span>
                                  <span className="text-[9px] font-normal opacity-85 block truncate w-full max-w-[80px] mt-0.5">{unit.type}</span>
                                  {unit.flexStatus === "Purple" && (
                                    <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-yellow-300 animate-pulse" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-[11px] text-neutral-500 font-medium italic flex items-center gap-1 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                      <AlertCircle className="w-4 h-4 text-neutral-400 shrink-0" />
                      Tip: Clicking on any color-coded unit block opens its price catalog, ROI reports, virtual tour snapshots, and secure booking portal directly in the right sidebar.
                    </div>
                  </div>

                  {/* Dynamic Property Specifications Card (No Hardcoded Info) */}
                  <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
                    <div>
                      <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-black block mb-1">
                        PROPERTY BLUEPRINT & DESCRIPTION
                      </span>
                      <h3 className="text-xl font-black text-neutral-950">Architectural Design & Vision</h3>
                    </div>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {activeProject.description || "An elegant architectural masterpiece rising in premium Nairobi, offering residents unprecedented access to key transport bypass corridors, state-of-the-art backup borehole configurations, and refined community living."}
                    </p>
                    
                    <div className="pt-4 border-t border-stone-100 space-y-3">
                      <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-black block">
                        EXCEPTIONAL AMENITIES & DNA FEATURES
                      </span>
                      {activeProject.amenities && activeProject.amenities.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                          {activeProject.amenities.map((amenity, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2.5 text-xs text-left p-3 rounded-2xl border bg-stone-50/70 border-stone-150 text-neutral-900 transition-colors hover:bg-stone-100/80"
                            >
                              <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                                <Check className="w-3.5 h-3.5 text-emerald-600 font-extrabold stroke-[4]" />
                              </div>
                              <span className="truncate font-semibold">{amenity}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-stone-400 italic font-mono">No specific premium amenities configured for this property profile.</p>
                      )}
                    </div>
                  </div>

                  {/* Virtual Tour Ecosystem Tabs */}
                  <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-lg font-extrabold text-neutral-950 flex items-center gap-1.5">
                          <Eye className="w-5 h-5 text-amber-500" /> Virtual Twin Tour Walkthrough
                        </h4>
                        <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold">Unsplash UHD Render Previews</p>
                      </div>

                      {/* Tabs */}
                      <div className="flex flex-wrap gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200">
                        {activeProject.vrTourUrl && (
                          <button
                            onClick={() => setShowVRSpace(!showVRSpace)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                              showVRSpace
                                ? "bg-amber-400 text-neutral-950 shadow-sm"
                                : "bg-neutral-950 text-white hover:bg-neutral-800"
                            }`}
                          >
                            {showVRSpace ? "View Photographic Previews" : "🌐 Live Interactive VR Space"}
                          </button>
                        )}
                        {!showVRSpace && Object.keys(activeProject.virtualTourMedia || {}).map((key) => {
                          const tabTitle = activeProject.virtualTourMetadata?.[key]?.title || key.replace(/([A-Z])/g, ' $1');
                          return (
                            <button
                              key={key}
                              onClick={() => {
                                setShowVRSpace(false);
                                setActiveTourTab(key);
                              }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${
                                activeTourTab === key
                                  ? "bg-white text-neutral-950 shadow-sm"
                                  : "text-neutral-500 hover:text-neutral-950"
                              }`}
                            >
                              {tabTitle}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Active Panoramic Image view or Dynamic VR Space */}
                    {showVRSpace && activeProject.vrTourUrl ? (
                      <div className="relative rounded-2xl overflow-hidden aspect-video bg-stone-100 border border-stone-200 shadow-inner">
                        <iframe
                          src={activeProject.vrTourUrl}
                          title={`${activeProject.name} Interactive 3D Walkthrough`}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; xr-spatial-tracking"
                          allowFullScreen
                        />
                      </div>
                    ) : (() => {
                      const safeTourTab = (activeProject.virtualTourMedia && (activeProject.virtualTourMedia as any)[activeTourTab])
                        ? activeTourTab
                        : (activeProject.virtualTourMedia ? Object.keys(activeProject.virtualTourMedia)[0] : "livingRoom");

                      return (
                        <div className="relative rounded-2xl overflow-hidden aspect-video bg-stone-100 border border-stone-200 shadow-inner group">
                          {activeProject.virtualTourMedia && (activeProject.virtualTourMedia as any)[safeTourTab] ? (
                            <img
                              src={(activeProject.virtualTourMedia as any)[safeTourTab]}
                              alt={activeProject.virtualTourMetadata?.[safeTourTab]?.seoAlt || `${safeTourTab} walkthrough render`}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-full h-full bg-stone-100 flex items-center justify-center">
                              <span className="text-sm font-mono text-stone-400">No Image Render Loaded</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-neutral-950/20 flex flex-col justify-between p-4">
                            <span className="bg-black/60 text-white border border-stone-700 text-[10px] font-mono px-2 py-0.5 rounded-md self-start font-bold">
                              360 Twin Rendering Active
                            </span>
                            <div>
                              <strong className="text-white text-sm block font-bold capitalize">
                                {activeProject.virtualTourMetadata?.[safeTourTab]?.title || safeTourTab.replace(/([A-Z])/g, ' $1')}
                              </strong>
                              <p className="text-[11px] text-stone-300">
                                {activeProject.virtualTourMetadata?.[safeTourTab]?.aiDescription || "High fidelity layout mapped from Nairobi County Approved architectural blueprints. Matterport links enabled for active agents."}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <Users className="w-4 h-4 text-amber-500" /> 120 Agents actively viewing this sector right now.
                      </div>
                      <div className="flex gap-2">
                        <span className="bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-neutral-600 block">
                          360 Kuula Stream
                        </span>
                        <span className="bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-neutral-600 block">
                          Matterport Live
                        </span>
                      </div>
                    </div>

                    {/* Logged-In User VR Link Editor Panel */}
                    {currentUser ? (
                      <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-4.5 mt-3 space-y-3 text-left">
                        <div className="flex items-center gap-2">
                          <Plus className="w-4 h-4 text-amber-600 shrink-0" />
                          <strong className="text-xs font-mono text-neutral-900 uppercase tracking-tight block">👑 Dynamic VR Tour Link Editor Panel</strong>
                        </div>
                        <p className="text-[11px] text-zinc-500 leading-normal">
                          Signed in as <strong className="text-zinc-800">{currentUser.username || currentUser.email}</strong> ({currentUser.role}). Enter or modify the walkthrough tour URL below to sync changes live with the database.
                        </p>
                        
                        <form
                          onSubmit={async (e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const val = formData.get("vrLinkInput") as string;
                            try {
                              const res = await fetch("/api/projects/edit", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ id: activeProject.id, vrTourUrl: val })
                              });
                              const data = await res.json();
                              if (data.success) {
                                setProjects(prev => prev.map(p => p.id === activeProject.id ? { ...p, vrTourUrl: val } : p));
                                setVrSaveMsg({ type: "success", text: "Successfully saved Interactive VR Tour Walkthrough link." });
                              } else {
                                setVrSaveMsg({ type: "error", text: data.error || "Failed to update VR walkthrough parameter." });
                              }
                            } catch (err: any) {
                              setVrSaveMsg({ type: "error", text: "Connection error: " + err.message });
                            }
                            setTimeout(() => setVrSaveMsg(null), 5000);
                          }}
                          className="flex gap-2"
                        >
                          <input
                            type="url"
                            name="vrLinkInput"
                            placeholder="Enter 3D Web Tour URL (e.g., https://kuula.co/share/collection/...)"
                            defaultValue={activeProject.vrTourUrl || ""}
                            className="flex-1 bg-white border border-stone-300 text-black text-xs px-3.5 py-2 rounded-xl focus:border-stone-500 focus:ring-1 focus:ring-stone-500 outline-none"
                            required
                          />
                          <button
                            type="submit"
                            className="bg-neutral-950 hover:bg-stone-850 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all uppercase tracking-wider shrink-0 cursor-pointer"
                          >
                            Save Link
                          </button>
                        </form>

                        {vrSaveMsg && (
                          <div className={`p-2.5 rounded-xl text-xs font-semibold ${
                            vrSaveMsg.type === "success" 
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-250 animate-fadeIn" 
                              : "bg-red-50 text-red-800 border border-red-250 animate-fadeIn"
                          }`}>
                            {vrSaveMsg.text}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-amber-50/50 border border-amber-205 rounded-2xl p-4.5 mt-3 text-left">
                        <p className="text-stone-700 text-[11px] leading-relaxed font-semibold">
                          💡 <strong>Notice:</strong> Need to update property walkthrough links? Log in to your **"Authorized Agent"** or **"Developer Portal"** account, then use this secure interface to save interactive VR walkthrough URL guides instantly.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Tiktok/Vertical Short Video Showcase Section */}
                  <PropertyTikTokShowcase project={activeProject} />

                </div>

                {/* RIGHT COLUMN: Selective unit catalog + Project AI advisor (5 cols) */}
                <div className="lg:col-span-5 space-y-8">
                  
                  {/* Selective Unit Overview Panel */}
                  <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-5">
                    <div className="bg-stone-100 -m-6 mb-0 p-5 rounded-t-3xl border-b border-stone-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-neutral-400 block">Inspect Selection</span>
                        <h4 className="text-sm font-black text-neutral-950">Property Catalog Details</h4>
                      </div>
                      <span className="text-[10px] bg-amber-400 text-neutral-950 font-bold px-2.5 py-0.5 rounded-full font-mono">
                        Active Profile
                      </span>
                    </div>

                    {selectedUnit ? (
                      <div className="space-y-4 pt-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-2xl font-black text-neutral-950">Unit {selectedUnit.number}</span>
                            <p className="text-xs text-neutral-500 font-semibold">{selectedUnit.type} • {selectedUnit.size}</p>
                          </div>
                          
                          <div className="text-right">
                            <span className="text-xs text-neutral-400 uppercase font-mono tracking-widest block font-bold">Standard Price</span>
                            <span className="text-2xl font-black text-neutral-950 text-amber-500">
                              {formatPrice(selectedUnit.price, activeProject)}
                            </span>
                          </div>
                        </div>

                        {/* Status Check badge */}
                        <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
                          <span className="text-neutral-500 font-medium">Availability Class:</span>
                          <span className={`font-mono font-bold uppercase px-3 py-1 rounded text-xs ${
                            selectedUnit.status === "Available" 
                              ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" 
                              : selectedUnit.status === "Reserved"
                              ? "bg-amber-400/10 text-amber-600 border border-amber-400/20"
                              : "bg-red-600/10 text-red-600 border border-red-500/20"
                          }`}>
                            {selectedUnit.status} {selectedUnit.flexStatus === "Purple" ? "(Flash Discount Apply)" : ""}
                          </span>
                        </div>

                        {/* ROI Estimates Widget */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 shadow-inner">
                            <span className="text-[10px] text-neutral-400 uppercase font-mono font-bold tracking-wider block">Estimated Rental Yield</span>
                            <strong className="text-lg font-black text-neutral-900 block mt-1">{activeProject.roiRentalYield} <span className="text-xs font-normal text-neutral-500">p.a.</span></strong>
                            <span className="text-[9px] text-green-600 font-mono font-semibold">East Africa premium range</span>
                          </div>
                          <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 shadow-inner">
                            <span className="text-[10px] text-neutral-400 uppercase font-mono font-bold tracking-wider block">Compounded Appreciation</span>
                            <strong className="text-lg font-black text-neutral-900 block mt-1">{activeProject.roiCapitalAppreciation} <span className="text-xs font-normal text-neutral-500">p.a.</span></strong>
                            <span className="text-[9px] text-neutral-400 font-mono font-semibold">5-year forecast model</span>
                          </div>
                        </div>

                        {/* Action buttons with high-yield Developer WhatsApp contact */}
                        {selectedUnit.status === "Available" ? (
                          <div className="space-y-2 pt-2">
                            <button
                              onClick={() => triggerReserveModal(activeProject, selectedUnit)}
                              className="w-full bg-neutral-950 hover:bg-stone-850 text-white font-bold text-xs px-4 py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-98 uppercase tracking-wider"
                            >
                              <ShieldCheck className="w-5 h-5 text-amber-450" /> Book Unit Now (2% Hold Deposit)
                            </button>
                            
                            <a
                              href={getWhatsAppLink(activeProject, selectedUnit)}
                              target="_blank"
                              rel="noreferrer"
                              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 uppercase tracking-wider"
                            >
                              <MessageSquare className="w-4.5 h-4.5 text-white animate-pulse" /> Inquire via WhatsApp
                            </a>

                            <p className="text-[10px] text-neutral-400 text-center font-medium leading-relaxed">
                              Securing deposits instantly allocates the unit to your account. Or request offplan floor sheets from the creator.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2 pt-2">
                            <button
                              disabled
                              className="w-full bg-stone-100 border border-stone-200 text-stone-400 font-extrabold text-xs px-4 py-3.5 rounded-xl text-center uppercase cursor-not-allowed"
                            >
                              Unit currently {selectedUnit.status}
                            </button>

                            <a
                              href={getWhatsAppLink(activeProject, selectedUnit)}
                              target="_blank"
                              rel="noreferrer"
                              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 uppercase tracking-wider"
                            >
                              <MessageSquare className="w-4 h-4 text-white" /> Inquire Availability on WhatsApp
                            </a>

                            <button
                              onClick={() => setActiveTab("matchmaker")}
                              className="w-full border border-dashed border-stone-300 text-stone-600 font-bold text-xs px-4 py-2.5 rounded-xl text-center hover:bg-stone-50 active:scale-98 transition-all"
                            >
                              Find Similar Units via AI Matchmaker
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4 pt-1">
                        <div className="text-center py-6 space-y-3 bg-stone-50 rounded-2xl border border-stone-150 p-4">
                          <Building2 className="w-9 h-9 text-stone-400 mx-auto animate-bounce" />
                          <div>
                            <strong className="text-sm font-bold text-neutral-800 block">No Apartment Selected</strong>
                            <p className="text-[11px] text-neutral-500 leading-relaxed">Pick any unit block in the grid model to inspect its detailed floor map, premium custom metrics, and reserve allocation status.</p>
                          </div>
                        </div>

                        {/* General Quick WhatsApp Builder triggers */}
                        <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-4 space-y-3">
                          <div className="flex gap-2.5">
                            <MessageSquare className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-xs font-bold text-neutral-900 block">Developer Direct Channel</strong>
                              <p className="text-[10px] text-neutral-500 leading-relaxed">Have custom spatial configuration requests or ready for a structured high-yield physical walkthrough?</p>
                            </div>
                          </div>
                          
                          <a
                            href={getWhatsAppLink(activeProject)}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 uppercase tracking-wider"
                          >
                            <MessageSquare className="w-4 h-4 fill-white text-emerald-600" /> Start Builder Chat
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Project Specific AI Assistant */}
                  <div className="bg-neutral-950 text-white p-6 rounded-3xl shadow-lg space-y-4 border border-zinc-800 relative overflow-hidden">
                    
                    {/* Background faint mesh glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full blur-2xl pointer-events-none" />

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-500 text-neutral-950 flex items-center justify-center font-black shadow shadow-amber-400/20 shrink-0">
                        AI
                      </div>
                      <div>
                        <strong className="text-sm font-bold text-white block capitalize">{activeProject.name} Smart Agent</strong>
                        <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Connected to Gemini 3.5
                        </span>
                      </div>
                    </div>

                    {/* Chat History window */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 h-[220px] overflow-y-auto space-y-3 text-xs scrollbar-thin scrollbar-thumb-zinc-800">
                      {chatHistory.map((ch, idx) => (
                        <div key={idx} className={`flex flex-col ${ch.sender === "user" ? "items-end" : "items-start"}`}>
                          <div className={`p-2.5 rounded-xl max-w-[85%] leading-relaxed ${
                            ch.sender === "user" 
                              ? "bg-amber-400 text-neutral-950 font-bold" 
                              : "bg-neutral-950 text-neutral-200 border border-neutral-850"
                          }`}>
                            {ch.text}
                          </div>
                        </div>
                      ))}
                      {chatLoading && (
                        <div className="flex items-center gap-1.5 text-neutral-400 font-mono italic">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Gemini preparing strategic advice...
                        </div>
                      )}
                    </div>

                    {/* Quick assistance helper nodes */}
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        `What is the ROI profile of ${activeProject.name}?`,
                        "What cash discounts apply?",
                        "What is nearby school or expressway distance?"
                      ].map((promptText, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => {
                            setChatMessage(promptText);
                          }}
                          className="bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-[10px] font-semibold text-neutral-300 px-2.5 py-1 rounded-lg transition-colors text-left"
                        >
                          {promptText}
                        </button>
                      ))}
                    </div>

                    {/* Input form */}
                    <form onSubmit={handleSendMessageToAI} className="flex gap-2">
                      <input
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder={`Ask anything about ${activeProject.name}...`}
                        className="flex-1 bg-neutral-900 text-white rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-amber-400 outline-none border border-neutral-800 placeholder-neutral-500"
                        id="chat-ai-input"
                      />
                      <button
                        type="submit"
                        className="bg-amber-400 text-neutral-950 px-3 py-2 rounded-xl hover:bg-amber-300 font-bold text-xs transition-all flex items-center justify-center shrink-0 shadow shadow-amber-400/10"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>

                  {/* Construction progress and timelines widget */}
                  <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
                    <strong className="text-xs text-neutral-400 uppercase font-mono tracking-widest block font-bold">Construction Tracker</strong>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-neutral-900">Overall Completion State:</span>
                      <span className="font-mono text-neutral-950 font-black">{activeProject.constructionProgress}% Completed</span>
                    </div>
                    <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden border border-stone-200 shadow-inner">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" 
                        style={{ width: `${activeProject.constructionProgress}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-neutral-500 space-y-1 block font-medium">
                      <div className="flex justify-between"><span>Scheduled Handover:</span> <strong className="text-neutral-900">{activeProject.completionDate}</strong></div>
                      <div className="flex justify-between"><span>Authority Clearance:</span> <strong className="text-emerald-600 font-semibold">County Occupancy pre-checked</strong></div>
                    </div>
                  </div>

                </div>

              </div>

              {/* Dynamic full-width SEO Optimization Hub & Interlinks (SuperAdmins only) */}
              {currentUser?.role === "SuperAdmin" && (
                <div className="mt-8">
                  <SEOMetaPanel 
                    project={activeProject} 
                    allProjects={projects} 
                    onSelectProject={(id) => {
                      setSelectedProjectId(id);
                      // Scroll back up to the twin model smoothly
                      window.scrollTo({ top: 300, behavior: "smooth" });
                    }}
                  />
                </div>
              )}
            </>
            )}

          </div>
        )}

        {/* ================================== 3. AI BUYER MATCHMAKER ================================== */}
        {activeTab === "matchmaker" && (
          <div className="space-y-8">
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200 shadow-sm relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-48 bg-stone-100 blur-2xl rounded-full" />
              
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 bg-amber-400/10 border border-amber-400/30 text-amber-700 px-3 py-1 rounded-full text-xs font-mono tracking-wide font-bold uppercase mb-4">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Precision AI Algorithm Matches
                </div>
                <h3 className="text-3xl font-black tracking-tight text-neutral-950">
                  Revolutionary AI Buyer Matchmaker
                </h3>
                <p className="text-stone-500 mt-2 text-sm leading-relaxed">
                  Provide your budget, investment targets, and lifestyle specifics. Our Gemini-backed property engine analyzes every floor level layout to present matching available apartments in Kilimani and Westlands.
                </p>
              </div>

              {/* Input Form Dashboard */}
              <form onSubmit={handleRunMatchmaker} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-6 border-t border-stone-100 relative z-10">
                
                {/* Budget Slider */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider block">
                    Target Budget Limit (USD): <span className="text-amber-500 font-black">${matchBudget.toLocaleString()}</span>
                  </label>
                  <input
                    type="range"
                    min="60000"
                    max="350000"
                    step="5000"
                    value={matchBudget}
                    onChange={(e) => setMatchBudget(Number(e.target.value))}
                    className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-neutral-950"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400 font-mono font-bold">
                    <span>$60,000</span>
                    <span>$200,000</span>
                    <span>$350,000</span>
                  </div>
                </div>

                {/* Preferred Location */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider block">Preferred Nairobi Hubs</label>
                  <select
                    value={matchLocation}
                    onChange={(e) => setMatchLocation(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:ring-1 focus:ring-amber-400 outline-none"
                  >
                    <option value="Westlands, Nairobi">Westlands Corridor (Eco luxury focus)</option>
                    <option value="Chaka Road, Kilimani">Kilimani Corridor (Family boutique setup)</option>
                    <option value="Rapid Expressway connection points">Expressway Interchange nodes</option>
                  </select>
                </div>

                {/* Lifestyle Input text */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider block">Describe Lifestyle Profile & Amenities Interest</label>
                  <input
                    type="text"
                    value={matchLifestyle}
                    onChange={(e) => setMatchLifestyle(e.target.value)}
                    placeholder="e.g., Active single executive, needs co-working zone, fast commute to expressway, rooftop pool..."
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                  />
                </div>

                {/* Commute demands */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider block">Specific commutes / proximity demands</label>
                  <input
                    type="text"
                    value={matchCommute}
                    onChange={(e) => setMatchCommute(e.target.value)}
                    placeholder="e.g. 10 minutes to central business district or Westgate Mall"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs focus:ring-1 focus:ring-amber-400 outline-none"
                  />
                </div>

                {/* Checkboxes for Priorities */}
                <div className="flex flex-col gap-3 justify-center">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={matchSchool}
                      onChange={(e) => setMatchSchool(e.target.checked)}
                      className="w-4.5 h-4.5 rounded text-neutral-950 focus:ring-neutral-900 border-stone-300 accent-neutral-950"
                    />
                    <div>
                      <span className="text-xs font-bold block text-neutral-800">School Proximity Priority</span>
                      <span className="text-[10px] text-stone-500">Filters with Peponi Prep and French Lycée access maps</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={matchInvestment}
                      onChange={(e) => setMatchInvestment(e.target.checked)}
                      className="w-4.5 h-4.5 rounded text-neutral-950 focus:ring-neutral-900 border-stone-300 accent-neutral-950"
                    />
                    <div>
                      <span className="text-xs font-bold block text-neutral-800">High Yield Investment Score Focus</span>
                      <span className="text-[10px] text-stone-500">Sorts by capital appreciation compounded indexes</span>
                    </div>
                  </label>
                </div>

                {/* Submit button */}
                <div className="md:col-span-2 pt-4">
                  <button
                    type="submit"
                    disabled={matchmakerLoading}
                    className="w-full bg-neutral-950 hover:bg-stone-850 text-white font-extrabold text-sm px-6 py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 uppercase tracking-widest cursor-pointer"
                    id="find-match-btn"
                  >
                    {matchmakerLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin text-amber-400" /> Computing Nairobi Property Databases...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" /> Calibrate AI Matching Units <ArrowRight className="w-4" />
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>

            {/* Recommendations Output Block */}
            {matchResult && (
              <div className="space-y-6">
                
                {/* Macro Economic Brief */}
                <div className="bg-amber-400/5 border border-amber-400/20 rounded-2xl p-5 shadow-sm space-y-2">
                  <h4 className="text-xs font-mono font-bold text-amber-700 uppercase tracking-widest flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-amber-500" /> Nairobi Real Estate Economic Analyst Briefing
                  </h4>
                  <p className="text-xs text-stone-700 leading-relaxed font-medium">
                    {matchResult.marketAnalysisSummary}
                  </p>
                </div>

                {/* List of matched available units */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {matchResult.matches.map((match, mIdx) => (
                    <div key={mIdx} className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                      <div className="bg-stone-100 p-5 border-b border-stone-200 flex items-center justify-between">
                        <div>
                          <span className="bg-neutral-950 text-amber-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                            {match.projectLabel}
                          </span>
                          <h4 className="text-xl font-black text-neutral-995 mt-1">Unit {match.unitNumber}</h4>
                        </div>
                        
                        <div className="text-right">
                          <span className="text-[10px] text-emerald-600 font-mono font-bold uppercase tracking-wider block bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">
                            {match.matchPercent}% Compatibility
                          </span>
                          <span className="text-xs text-neutral-400 font-mono block mt-1">
                            {(() => {
                              const matchProj = projects.find(p => p.id === match.projectId);
                              return matchProj?.currency === "KES" ? "KES Price" : "USD Price";
                            })()}
                          </span>
                        </div>
                      </div>

                      {/* Info Panel body */}
                      <div className="p-6 space-y-4 flex-1">
                        <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                          <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-150">
                            <span className="text-[10px] text-neutral-400 uppercase font-mono block">Unit Configuration</span>
                            <span className="text-neutral-800 text-xs block truncate font-bold mt-0.5">{match.unitType}</span>
                          </div>
                          <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-150">
                            <span className="text-[10px] text-neutral-400 uppercase font-mono block">Standard Price</span>
                            <span className="text-neutral-900 font-mono font-black text-xs block mt-0.5">
                              {(() => {
                                const matchProj = projects.find(p => p.id === match.projectId);
                                return formatPrice(match.priceUSD, matchProj);
                              })()}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <strong className="text-xs font-bold text-neutral-850 block">AI Logic Compatibility Analysis:</strong>
                          <p className="text-[11px] text-stone-600 leading-relaxed">
                            {match.reason}
                          </p>
                        </div>

                        <div className="space-y-1 block bg-stone-50/50 p-3 rounded-xl border border-stone-150">
                          <strong className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block font-bold">Matched Lifestyle Benefits:</strong>
                          <p className="text-[11px] text-stone-500 italic">
                            {match.lifestyleFit}
                          </p>
                        </div>
                      </div>

                      {/* Card actions */}
                      <div className="p-5 bg-stone-50 border-t border-stone-200 flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedProjectId(match.projectId);
                            setActiveTab("portfolio");
                            
                            const matchedProject = projects.find(pr => pr.id === match.projectId);
                            if (matchedProject) {
                              for (let i = 0; i < matchedProject.towers.length; i++) {
                                for (const fl of matchedProject.towers[i].floors) {
                                  const un = fl.units.find(u => u.number === match.unitNumber);
                                  if (un) {
                                    setSelectedTowerIndex(i);
                                    setSelectedUnit(un);
                                  }
                                }
                              }
                            }
                          }}
                          className="flex-1 bg-neutral-950 hover:bg-stone-850 text-white text-xs font-bold py-2.5 rounded-xl text-center uppercase tracking-wider block transition-all cursor-pointer"
                        >
                          View Interactive Twin Mode
                        </button>
                        <button
                          onClick={() => {
                            const foundProj = projects.find(pr => pr.id === match.projectId);
                            if (foundProj) {
                              const placeholderUnit = {
                                number: match.unitNumber,
                                price: match.priceUSD,
                                type: match.unitType,
                                size: "Premium SQM",
                                status: "Available" as const,
                                flexStatus: "Available" as const
                              };
                              triggerReserveModal(foundProj, placeholderUnit);
                            }
                          }}
                          className="bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-black px-4 py-2.5 rounded-xl uppercase tracking-wider block transition-all cursor-pointer"
                        >
                          Reserve Drop Fee
                        </button>
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            )}

          </div>
        )}

        {/* ================================== 3. SECURE CLIENT BUYER WORKSPACE ================================== */}
        {activeTab === "buyer" && (
          (effectiveUser?.role === "Buyer") ? (
            <BuyerPortal
              projects={projects}
              bookings={bookings}
              activeProject={activeProject}
              currentUser={effectiveUser}
              onSelectProject={(id) => {
                setSelectedProjectId(id);
                setActiveTab("portfolio");
              }}
              onNavigateToTab={(tabName) => {
                if (tabName === "battle") {
                  setActiveTab("buyer");
                } else {
                  setActiveTab(tabName as any);
                }
              }}
            />
          ) : (
            <div className="bg-white max-w-lg mx-auto p-8 rounded-3xl border border-stone-200 text-center shadow-lg space-y-6 pt-12 pb-12 my-10 animate-fade-in" id="buyer-restricted-container">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-500 border border-amber-200 text-2xl font-bold animate-pulse">
                🔒
              </div>
              <div className="space-y-2">
                <span className="text-[9px] uppercase tracking-widest font-mono text-amber-600 bg-amber-50 px-2.5 py-1 rounded font-extrabold">Security Check</span>
                <h3 className="text-xl font-black text-neutral-900 uppercase tracking-tight">Buyer Workspace Locked</h3>
                <p className="text-xs text-neutral-500 leading-relaxed max-w-sm mx-auto">
                  Secure client ledgers are conditionally restricted to logged in corporate buyers. Please sign in to access your dashboard.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setShowAuthModal(true)}
                  className="w-full bg-neutral-950 hover:bg-neutral-850 text-amber-400 font-bold text-xs uppercase py-3 rounded-2xl shadow transition-all tracking-wider"
                >
                  Sign In with Buyer Credentials
                </button>
              </div>
            </div>
          )
        )}

        {/* ================================== 4. FINANCING MORTGAGE CALCULATOR ================================== */}
        {activeTab === "financing" && (
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-8">
            <div>
              <span className="text-xs font-mono font-bold text-amber-600 uppercase tracking-widest block mb-2">Pre-checked Partner Programs</span>
              <h3 className="text-2xl font-black text-neutral-950 tracking-tight">PropSphere Mortgage & Cash Flow Projection Center</h3>
              <p className="text-xs text-neutral-500 max-w-xl leading-relaxed mt-1">
                Kenya shilling or USD stable interest rates customized directly with cooperative mortgage partners. Complete off-plan investment capital modeling beforehand.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 border-t border-stone-100">
              
              {/* Calculator settings (5 cols) */}
              <div className="lg:col-span-5 space-y-5">
                <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-widest">Adjust Projections Details</h4>
                
                <div className="space-y-1">
                  <label className="text-xs text-neutral-600 block">Property Valuation ({activeProject?.currency || "USD"})</label>
                  <input
                    type="number"
                    value={calcPropertyVal}
                    onChange={(e) => setCalcPropertyVal(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-600 block">Buyer Downpayment ({activeProject?.currency || "USD"})</label>
                  <input
                    type="number"
                    value={calcDownpayment}
                    onChange={(e) => setCalcDownpayment(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-600 block">Annual Interest Rate (%)</label>
                  <input
                    type="number"
                    value={calcRate}
                    onChange={(e) => setCalcRate(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-600 block">Amortization Period (Years)</label>
                  <input
                    type="number"
                    value={calcPeriod}
                    onChange={(e) => setCalcPeriod(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>

                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs text-neutral-500 font-medium leading-relaxed">
                  NOTE: Under standard off-plan cash payment structured schedules, cash buyers enjoy a **5% direct discount** while installment structures request zero interest margins during construction progress phases.
                </div>
              </div>

              {/* Computations result metrics (7 cols) */}
              <div className="lg:col-span-7 bg-stone-50 p-6 md:p-8 rounded-3xl border border-stone-250 shadow-inner flex flex-col justify-between">
                <div>
                  <strong className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 block font-black">Hold Projections Matrix</strong>
                  <div className="mt-4 space-y-6">
                    <div>
                      <span className="text-xs text-neutral-500 block font-semibold uppercase tracking-wider">Estimated Monthly Payment ({activeProject?.currency || "USD"})</span>
                      <strong className="text-4xl md:text-5xl font-black text-neutral-950 block mt-1 font-mono">
                        {formatPrice(Math.round(computedMonthlyPayment), activeProject)}<span className="text-lg font-normal text-stone-500"> /mo</span>
                      </strong>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-6 border-t border-stone-200 text-xs">
                      <div>
                        <span className="text-neutral-400 block">Principal Borrowed</span>
                        <strong className="text-neutral-900 block font-mono font-bold mt-0.5">{formatPrice(calcPrincipal, activeProject)}</strong>
                      </div>
                      <div>
                        <span className="text-neutral-400 block">Total Payments</span>
                        <strong className="text-neutral-900 block font-mono font-bold mt-0.5">{formatPrice(Math.round(computedMonthlyPayment * calcTotalMonths), activeProject)}</strong>
                      </div>
                      <div>
                        <span className="text-neutral-400 block">Interest Incurred</span>
                        <strong className="text-neutral-900 block font-mono font-bold mt-0.5">{formatPrice(Math.round((computedMonthlyPayment * calcTotalMonths) - calcPrincipal), activeProject)}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <strong className="text-xs font-bold text-neutral-850 block">Interested in partnering banking approvals?</strong>
                    <p className="text-[11px] text-neutral-500">Generate pre-qualification document through our PropSphere mortgage pipeline.</p>
                  </div>
                  <button
                    onClick={() => {
                      alert("PropSphere PDF loan pre-check report generated successfully using standard mortgage indexes.");
                    }}
                    className="bg-neutral-950 text-white font-bold text-xs px-4 py-2 rounded-xl uppercase tracking-wider shadow hover:bg-stone-800 transition-all cursor-pointer"
                  >
                    Generate Pre-Check Report
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ================================== 5. DEVELOPER DASHBOARD COMMAND CENTER ================================== */}
        {activeTab === "developers" && (
          (effectiveUser?.role === "Developer") ? (
            <DeveloperPortal
              projects={projects}
              activeProject={activeProject}
              bookingsCount={bookings.length}
              leads={leads}
              whatsappChats={whatsappChats}
              selectedProjectId={selectedProjectId}
              onSelectProjectId={(id) => setSelectedProjectId(id)}
              onUpdateUnit={(tower, number, status, flex) => updateUnitStatus(tower, number, status, flex)}
              onAddActivityLog={(text) => {
                setActivityLogs(prev => [
                  { id: `act-${Date.now()}`, time: "Just now", type: "system", text },
                  ...prev
                ]);
              }}
              onAddProject={(newProj) => {
                setProjects(prev => {
                  if (prev.some(p => p.id === newProj.id)) return prev;
                  return [...prev, newProj];
                });
                setSelectedProjectId(newProj.id);
              }}
              onUpdateProject={(newProj) => {
                setProjects(prev => prev.map(p => p.id === newProj.id ? newProj : p));
              }}
              currentUser={effectiveUser}
              onRetrainAIAssistant={async (customContext) => {
                try {
                  const res = await fetch("/api/chat/retrain", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ customContext })
                  });
                  if (res.ok) {
                    alert("Corporate PropSphere Gemini sales brain has been successfully retrained with current brochure parameters!");
                  }
                } catch (e) {
                  console.error(e);
                  alert("Error calling server retraining endpoints.");
                }
              }}
            />
          ) : (
            <SaaSMarketingHub
              packages={developerPackages}
              onTriggerAuth={() => setShowAuthModal(true)}
            />
          )
        )}

        {/* ================================== 6. SUPER ADMIN MASTER DESK ================================== */}
        {activeTab === "admin" && (
          currentUser?.role === "SuperAdmin" ? (
            <AdminPortal
              users={adminUsers}
              projects={projects}
              packages={developerPackages}
              homepageSettings={homepageSettings}
              tickets={supportTickets}
              activityLogs={activityLogs}
              otherProperties={otherProperties}
              onAddActivityLog={(text) => {
                setActivityLogs(prev => [
                  { id: `act-${Date.now()}`, time: "Just now", type: "system", text },
                  ...prev
                ]);
              }}
              onRefreshUsers={fetchAdminUsers}
              onRefreshPackages={fetchPackages}
              onRefreshHomepage={fetchHomepageSettings}
              onRefreshTickets={fetchTickets}
              onRefreshProjects={fetchAllData}
              onRefreshOtherProperties={fetchOtherProperties}
              impersonatedUser={impersonatedUser}
              onImpersonate={(usr) => setImpersonatedUser(usr)}
            />
          ) : (
            <div className="text-center py-20 bg-stone-50 rounded-3xl border border-stone-200 p-6 space-y-4 max-w-lg mx-auto">
              <span className="text-4xl">🔒</span>
              <h3 className="text-xl font-black text-neutral-900 uppercase">SuperAdmin Desk Locked</h3>
              <p className="text-xs text-neutral-500">Access to platform logs, ledger databases, and user onboarding controls is restricted to authorized credentials.</p>
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-neutral-950 text-amber-400 font-extrabold text-xs uppercase tracking-widest px-6 py-3 rounded-xl cursor-pointer"
              >
                Sign In with Super Admin Account
              </button>
            </div>
          )
        )}

        {/* ================================== 7. AGENT MASTER DASHBOARD & DAEBAK AI ================================== */}
        {activeTab === "agent" && (
          (effectiveUser?.role === "Agent") ? (
            <AgentDashboard
              projects={projects}
              currentUser={effectiveUser}
              onRefreshProjects={fetchAllData}
              onAddActivityLog={(text) => {
                setActivityLogs(prev => [
                  { id: `act-${Date.now()}`, time: "Just now", type: "system", text },
                  ...prev
                ]);
              }}
            />
          ) : (
            <div className="text-center py-20 bg-stone-50 rounded-3xl border border-stone-200 p-6 space-y-4 max-w-lg mx-auto">
              <span className="text-4xl">🔒</span>
              <h3 className="text-xl font-black text-neutral-900 uppercase">Agent Dashboard Locked</h3>
              <p className="text-xs text-neutral-500">Access to agent features, property configuration matrices, and virtual setups is restricted to authorized agent credentials.</p>
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-neutral-950 text-amber-400 font-extrabold text-xs uppercase tracking-widest px-6 py-3 rounded-xl cursor-pointer"
              >
                Sign In with Agent Account
              </button>
            </div>
          )
        )}

        {activeTab === "services" && (
          <ServicesPage 
            currentUser={currentUser}
            formatPrice={formatPrice}
            displayCurrency={displayCurrency}
          />
        )}

        {activeTab === "guide" && (
          <OperationsPlaybook />
        )}

        {activeTab === "flutter" && (
          <FlutterDeveloperHub />
        )}

        {activeTab === "expo" && (
          <ReactNativeDeveloperHub />
        )}

        {activeTab === "ai-hub" && (
          <AdaptiveAIHub />
        )}

        {activeTab === "blogs" && (
          <BlogsPanel />
        )}

          </>
        )}
      </main>

      {/* ================================== BUYER HOVER RESERVE ESCALATION MODAL ================================== */}
      {showReserveModal && reserveUnitDetails && (
        <div className="fixed inset-0 z-50 bg-neutral-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200">
            
            {/* Header */}
            <div className="bg-neutral-950 text-white p-6 relative">
              <button
                onClick={() => setShowReserveModal(false)}
                className="absolute top-4 right-4 text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              
              <span className="text-[9px] font-mono tracking-widest text-amber-400 uppercase font-bold">Secure Holder Deposit Portal</span>
              <h4 className="text-xl font-black mt-1">Reserve Unit {reserveUnitDetails.number}</h4>
              <p className="text-xs text-stone-400 mt-1">{reserveProjectName} • {reserveUnitDetails.type}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleReserveFormSubmit} className="p-6 space-y-4">
              
              {bookingSuccessMsg ? (
                <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-200 text-xs font-bold space-y-1">
                  <p>{bookingSuccessMsg}</p>
                  <p className="text-[10px] text-neutral-500 font-normal">Escrow hold holds secure for 5 working days for sales review.</p>
                </div>
              ) : (
                <>
                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80 text-xs space-y-2">
                    <div className="flex justify-between font-bold">
                      <span className="text-neutral-500">Unit Standard Price:</span>
                      <strong className="text-neutral-950">{formatPrice(reserveUnitDetails.price, activeProject)}</strong>
                    </div>
                    <div className="flex justify-between font-bold text-emerald-600">
                      <span>Live Drop lock deposit ({activeProject?.bookingDepositPercent || 2}%):</span>
                      <strong className="font-mono">
                        {formatPrice(reserveUnitDetails.price * ((activeProject?.bookingDepositPercent || 2) / 100), activeProject)}
                      </strong>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-850 block">Buyer Full Name</label>
                    <input
                      type="text"
                      required
                      value={reserveBuyerName}
                      onChange={(e) => setReserveBuyerName(e.target.value)}
                      placeholder="e.g. Caleb Kiprop Omondi"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-850 block">E-mail Address</label>
                    <input
                      type="email"
                      required
                      value={reserveBuyerEmail}
                      onChange={(e) => setReserveBuyerEmail(e.target.value)}
                      placeholder="caleb@example.com"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-850 block">Phone Number (Include Country Code)</label>
                    <input
                      type="text"
                      value={reserveBuyerPhone}
                      onChange={(e) => setReserveBuyerPhone(e.target.value)}
                      placeholder="+254 712 345 678"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-850 block">Preferred Payment Schedule</label>
                    <select
                      value={reservePaymentPlan}
                      onChange={(e) => setReservePaymentPlan(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs"
                    >
                      <option value="Installment Spread (20-60-20)">Installment Structure (20% Dep, 60% construction, 20% handover)</option>
                      <option value="Cash Purchase (5% Discount applied)">Cash Outright Discount (-5%)</option>
                      <option value="Mortgage Supported Partner Structure">Mortgage supported partner structure</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-850 block">KYC Supporting Documentation (ID/Passport copy)</label>
                    <input
                      type="text"
                      className="w-full bg-stone-100 border border-stone-200 rounded-xl px-3.5 py-2 text-xs italic text-stone-500"
                      value={kycFile}
                      onChange={(e) => setKycFile(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingBooking}
                    className="w-full bg-neutral-950 hover:bg-stone-850 text-white font-extrabold text-sm py-3.5 rounded-xl uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                  >
                    {isSubmittingBooking ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin text-amber-400" /> Locking Escrow Ledger...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-amber-400" /> Complete Secure Hold Booking
                      </>
                    )}
                  </button>
                </>
              )}

            </form>
          </div>
        </div>
      )}

      {/* Real-time Authentication Gateway overlay */}
      <AuthModal
        isOpen={showAuthModal}
        initialTab={authModalInitialTab}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          localStorage.setItem("propsphere_user", JSON.stringify(user));
          setCurrentPersona(user.role);
          // Redirect to appropriate dashboard section
          if (user.role === "SuperAdmin") {
            setActiveTab("admin");
          } else if (user.role === "Developer") {
            setActiveTab("developers");
          } else if (user.role === "Agent") {
            setActiveTab("agent");
          } else {
            setActiveTab("buyer");
          }
        }}
      />

      {/* Floating Visitor AI Search Robot Assistant */}
      <PropertySearchRobot
        projects={projects}
        onSelectProject={(id) => {
          setSelectedProjectId(id);
          setActiveTab("portfolio");
        }}
        onNavigateToTab={(tab) => {
          setActiveTab(tab);
        }}
      />

      {/* Footer Content Deck */}
      <footer className="bg-neutral-950 text-stone-400 py-12 border-t border-neutral-900 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3">
            <span className="text-white text-lg font-black uppercase tracking-tight flex items-center gap-2">
              PROPSPHERE <span className="text-xs bg-amber-400 text-neutral-950 px-2 py-0.5 rounded font-mono font-bold leading-none">2.0</span>
            </span>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Kenya's premier sales & scheduling platform for premium boutique off-plan, ongoing, and completed residential towers.
            </p>
            <div className="text-[10px] font-mono text-amber-500/80 font-bold">
              © 2026 PropSphere East Africa. All rights reserved.
            </div>
          </div>

          <div>
            <strong className="text-white text-xs uppercase tracking-wider block font-bold mb-3">Developments Corridor</strong>
            <ul className="text-xs space-y-2 font-medium">
              <li><button onClick={() => { setSelectedProjectId("sky-gardens"); setActiveTab("portfolio"); }} className="hover:text-amber-400 block text-left">Sky Gardens (Westlands)</button></li>
              <li><button onClick={() => { setSelectedProjectId("westlands-heights"); setActiveTab("portfolio"); }} className="hover:text-amber-400 block text-left">Westlands Heights (Raphta Road)</button></li>
              <li><button onClick={() => { setSelectedProjectId("kilimani-elite"); setActiveTab("portfolio"); }} className="hover:text-amber-400 block text-left">Kilimani Elite Boutique Apartments</button></li>
            </ul>
          </div>

          <div>
            <strong className="text-white text-xs uppercase tracking-wider block font-bold mb-3">AI Platforms</strong>
            <ul className="text-xs space-y-2 font-medium">
              <li><button onClick={() => setActiveTab("matchmaker")} className="hover:text-amber-400">Matchmaker Recommendations</button></li>
              <li><button onClick={() => { setSelectedProjectId("sky-gardens"); setActiveTab("portfolio"); }} className="hover:text-amber-400">Interactive Gemini Tour Assistant</button></li>
              <li><button onClick={() => setActiveTab("drops")} className="hover:text-amber-400">Live Prop Drops Events</button></li>
            </ul>
          </div>

          <div className="space-y-2">
            <strong className="text-white text-xs uppercase tracking-wider block font-bold mb-3">Partner Program & Escrow</strong>
            <p className="text-[11px] text-stone-500 leading-relaxed font-medium">
              Approved and regulated directly block-by-block under the Nairobi Lands & County Registries and escrow integration agreements with prime banks.
            </p>
            <span className="bg-emerald-950 border border-emerald-800 text-emerald-400 text-[10px] font-mono px-3 py-1 rounded inline-block font-bold">
              100% Secure Client Trust Backed
            </span>
          </div>

        </div>
      </footer>

      {/* Yellow Pencil Visual Theme Overrides (For Logged in SuperAdmins) */}
      <YellowPencilEditor 
        customizations={visualCustomizations} 
        onSaveCustomization={handleSaveCustomization} 
        onWipeCustomization={handleWipeCustomization}
        currentUser={currentUser || { role: currentPersona, username: "Guest" }}
      />

      {/* Compiled visual customizations injected globally */}
      <style dangerouslySetInnerHTML={{ __html: compileCustomizationsToCSS() }} />

    </div>
  );
}
