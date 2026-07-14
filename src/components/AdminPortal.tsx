import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Users, 
  Settings, 
  HelpCircle, 
  Cpu, 
  TrendingUp, 
  Eye, 
  EyeOff, 
  UserPlus, 
  Trash2, 
  ShieldAlert, 
  Save, 
  MessageSquare, 
  DollarSign, 
  FileText,
  Percent,
  Video,
  Key,
  Plus,
  PlusCircle,
  Globe,
  Sparkles,
  ShieldCheck,
  Building,
  Building2,
  Lock,
  ArrowRight,
  CheckSquare,
  Square,
  Activity,
  Play,
  Pause,
  Calendar,
  Clock,
  Send
} from "lucide-react";
import { User, Project } from "../types";
import { DeveloperPackage } from "./SaaSMarketingHub";
import AdminBlogsHub from "./AdminBlogsHub";
import UserCredentialsEditor from "./UserCredentialsEditor";

interface SupportTicket {
  id: string;
  creatorName: string;
  email: string;
  userRole: string;
  subject: string;
  message: string;
  status: "Pending" | "Replied";
  replyText?: string;
  createdAt: string;
}

interface HomepageSettings {
  showHeroSection: boolean;
  showStatsSection: boolean;
  showShowcaseSection: boolean;
  showROICalculatorSection: boolean;
  showMatterportSection: boolean;
  showDevelopersSaaSSection: boolean;
  showSupportSection: boolean;
  systemLaunchVideoUrl: string;
  centralPlatformNotice: string;
  featuredProjectIds?: string[];
  dropBroadcastVideoUrl?: string;
  activeMenuIds?: string[];
  inactiveMenuIds?: string[];
}

interface AdminPortalProps {
  users: User[];
  projects: Project[];
  packages: DeveloperPackage[];
  homepageSettings: HomepageSettings;
  tickets: SupportTicket[];
  activityLogs?: any[];
  otherProperties?: any[];
  onAddActivityLog: (text: string) => void;
  onRefreshUsers: () => void;
  onRefreshPackages: () => void;
  onRefreshHomepage: () => void;
  onRefreshTickets: () => void;
  onRefreshProjects?: () => void;
  onRefreshOtherProperties?: () => void;
  impersonatedUser: User | null;
  onImpersonate: (user: User | null) => void;
}

export default function AdminPortal({
  users,
  projects,
  packages,
  homepageSettings,
  tickets,
  activityLogs = [],
  otherProperties = [],
  onAddActivityLog,
  onRefreshUsers,
  onRefreshPackages,
  onRefreshHomepage,
  onRefreshTickets,
  onRefreshProjects,
  onRefreshOtherProperties,
  impersonatedUser,
  onImpersonate
}: AdminPortalProps) {
  const [activeTab, setActiveTab] = useState<"metrics" | "users" | "packages" | "homepage" | "tickets" | "listings" | "services" | "gateways" | "other-listings" | "menu-control" | "blogs-hub">("metrics");

  // AdminLTE Interactive To-Do List State
  const [todoList, setTodoList] = useState<Array<{ id: string; text: string; done: boolean; priority: "critical" | "high" | "medium" | "completed"; time: string }>>(() => {
    try {
      const stored = localStorage.getItem("admin_todo_list");
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [
      { id: "todo-1", text: "Design 3D Digital Twin layouts for Westlands Prestige", done: false, priority: "high", time: "2 mins ago" },
      { id: "todo-2", text: "Verify Dubai Damac escrow transaction nodes", done: false, priority: "critical", time: "2 hours ago" },
      { id: "todo-3", text: "Deploy live M-Pesa sandbox credentials for test", done: true, priority: "completed", time: "1 day ago" },
      { id: "todo-4", text: "Audit high-yield off-plan pricing limits", done: false, priority: "medium", time: "2 days ago" }
    ];
  });

  const [newTodoText, setNewTodoText] = useState("");
  const [newTodoPriority, setNewTodoPriority] = useState<"critical" | "high" | "medium">("high");

  const saveTodo = (updatedList: typeof todoList) => {
    setTodoList(updatedList);
    try {
      localStorage.setItem("admin_todo_list", JSON.stringify(updatedList));
    } catch (e) {}
  };

  const handleAddTodo = () => {
    if (!newTodoText.trim()) return;
    const newTodo = {
      id: "todo-" + Date.now(),
      text: newTodoText.trim(),
      done: false,
      priority: newTodoPriority,
      time: "Just now"
    };
    const newList = [...todoList, newTodo];
    saveTodo(newList);
    setNewTodoText("");
    onAddActivityLog(`📝 SuperAdmin added To-Do task: "${newTodo.text}"`);
  };

  const handleToggleTodo = (id: string) => {
    const newList = todoList.map(t => {
      if (t.id === id) {
        const nextDone = !t.done;
        return { ...t, done: nextDone, priority: (nextDone ? "completed" as const : "medium" as const) };
      }
      return t;
    });
    saveTodo(newList);
  };

  const handleDeleteTodo = (id: string) => {
    const newList = todoList.filter(t => t.id !== id);
    saveTodo(newList);
  };

  // AdminLTE Direct Chat State
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; avatar: string; text: string; time: string; isMe: boolean }>>([
    { sender: "Agent Mike", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop", text: "Hello Admin, the Kilimani listing requires urgent floor elevation update in the db. Please approve.", time: "11:24 AM", isMe: false },
    { sender: "Sovereign Admin", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop", text: "Checking database node ledger now... I see it's pending review. Standby.", time: "11:25 AM", isMe: true },
    { sender: "Agent Mike", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop", text: "Perfect. Let us know when verified. Thanks!", time: "11:26 AM", isMe: false }
  ]);
  const [chatInput, setChatInput] = useState("");

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = {
      sender: "Sovereign Admin",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop",
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };
    setChatMessages(prev => [...prev, userMsg]);
    const typed = chatInput.trim().toLowerCase();
    setChatInput("");

    // Simulate smart agent response after 1.2 seconds
    setTimeout(() => {
      let replyText = "Understood. The master gateway ledger is analyzing that request.";
      if (typed.includes("status") || typed.includes("health")) {
        replyText = "Ledger diagnostics report: CPU is nominal, active database shards are 100% synchronized.";
      } else if (typed.includes("approve") || typed.includes("listing")) {
        replyText = "Copy that. Listing elevation checks are completed. Node cleared successfully.";
      } else if (typed.includes("mpesa") || typed.includes("payment")) {
        replyText = "Direct payment logs are secure. Handshake verification looks 100% green.";
      }
      setChatMessages(prev => [...prev, {
        sender: "Agent Support Bot",
        avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop",
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: false
      }]);
    }, 1200);
  };

  // Live Performance Chart (Random Walk data simulation)
  const [cpuHistory, setCpuHistory] = useState<number[]>([42, 38, 45, 55, 48, 52, 60, 48, 35, 42, 49, 53, 58, 47, 50]);
  const [isLiveCpuUpdating, setIsLiveCpuUpdating] = useState(true);

  React.useEffect(() => {
    if (!isLiveCpuUpdating) return;
    const interval = setInterval(() => {
      setCpuHistory(prev => {
        const lastVal = prev[prev.length - 1];
        // random walk between 20% and 85%
        const change = (Math.random() - 0.5) * 15;
        let nextVal = Math.round(lastVal + change);
        if (nextVal < 15) nextVal = 15;
        if (nextVal > 95) nextVal = 95;
        return [...prev.slice(1), nextVal];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [isLiveCpuUpdating]);

  // Color-coded Interactive Timeline state
  const [timelineEvents, setTimelineEvents] = useState<Array<{ id: string; title: string; desc: string; time: string; type: "primary" | "warning" | "success" | "danger" }>>([
    { id: "timeline-1", title: "Global Developer Onboarded", desc: "Developer account 'Sobha Realty' completed KYC node verification and joined the platform.", time: "15 minutes ago", type: "primary" },
    { id: "timeline-2", title: "M-Pesa Sandbox Handshake Active", desc: "Paybill validation webhook successfully received the test handshake from SAFARICOM nodes.", time: "1 hour ago", type: "success" },
    { id: "timeline-3", title: "Security Alert: Elevation Override", desc: "Central database node successfully contained a double-booking prevention locks bypass attempt.", time: "3 hours ago", type: "danger" },
    { id: "timeline-4", title: "Property Listing Approved", desc: "Sovereign admin approved the Kilimani Crown Towers architectural floor layouts mapping.", time: "1 day ago", type: "warning" }
  ]);
  const [newTimelineTitle, setNewTimelineTitle] = useState("");
  const [newTimelineDesc, setNewTimelineDesc] = useState("");
  const [newTimelineType, setNewTimelineType] = useState<"primary" | "warning" | "success" | "danger">("primary");

  const handleAddTimelineEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTimelineTitle.trim() || !newTimelineDesc.trim()) return;
    const event = {
      id: "timeline-" + Date.now(),
      title: newTimelineTitle.trim(),
      desc: newTimelineDesc.trim(),
      time: "Just now",
      type: newTimelineType
    };
    setTimelineEvents(prev => [event, ...prev]);
    setNewTimelineTitle("");
    setNewTimelineDesc("");
    onAddActivityLog(`📅 Timeline Event published: "${event.title}"`);
  };

  const defaultMenuIds = ["home", "properties", "videos", "other-properties", "international", "drops", "portfolio", "matchmaker", "financing", "services", "guide", "flutter", "expo", "ai-hub"];
  const [activeMenuIds, setActiveMenuIds] = useState<string[]>(homepageSettings.activeMenuIds || defaultMenuIds);
  const [inactiveMenuIds, setInactiveMenuIds] = useState<string[]>(homepageSettings.inactiveMenuIds || []);
  const [savingMenuControl, setSavingMenuControl] = useState(false);
  const [menuFeedback, setMenuFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSaveMenuControl = async () => {
    setSavingMenuControl(true);
    setMenuFeedback(null);
    try {
      const resp = await fetch("/api/admin/homepage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activeMenuIds,
          inactiveMenuIds
        })
      });
      const data = await resp.json();
      if (data.success) {
        setMenuFeedback({
          type: "success",
          text: "✨ Live platform navigation settings successfully synced and locked! Navigation sidebar is now updated for all clients."
        });
        onRefreshHomepage();
      } else {
        setMenuFeedback({
          type: "error",
          text: data.error || "Failed to update platform settings."
        });
      }
    } catch (err) {
      console.error(err);
      setMenuFeedback({ type: "error", text: "Connection failure to security nodes." });
    } finally {
      setSavingMenuControl(false);
    }
  };

  // Listings subtab
  const [listingsSubTab, setListingsSubTab] = useState<"approvals" | "direct">("approvals");

  // Super Admin direct listings states
  const [directName, setDirectName] = useState("");
  const [directId, setDirectId] = useState("");
  const [directLocation, setDirectLocation] = useState("");
  const [directTagline, setDirectTagline] = useState("");
  const [directDescription, setDirectDescription] = useState("");
  const [directPriceRange, setDirectPriceRange] = useState("");
  const [directCompletionDate, setDirectCompletionDate] = useState("");
  const [directRoiRental, setDirectRoiRental] = useState("");
  const [directRoiCapital, setDirectRoiCapital] = useState("");
  const [directDepositPercent, setDirectDepositPercent] = useState(10);
  const [directWhatsapp, setDirectWhatsapp] = useState("");
  const [directDroneUrl, setDirectDroneUrl] = useState("");
  const [directVrUrl, setDirectVrUrl] = useState("");
  const [directIsInternational, setDirectIsInternational] = useState(false);
  const [directIsFeatured, setDirectIsFeatured] = useState(false);
  const [directTikTok, setDirectTikTok] = useState("");
  const [creatingDirect, setCreatingDirect] = useState(false);

  // M-Pesa Payment Gateways form states
  const [gatewayActive, setGatewayActive] = useState(false);
  const [gatewayPaybill, setGatewayPaybill] = useState("");
  const [gatewayConsumerKey, setGatewayConsumerKey] = useState("");
  const [gatewayConsumerSecret, setGatewayConsumerSecret] = useState("");
  const [gatewayPasskey, setGatewayPasskey] = useState("");
  const [gatewayInitiatorName, setGatewayInitiatorName] = useState("");
  const [gatewayInitiatorPassword, setGatewayInitiatorPassword] = useState("");
  const [gatewayIsSandbox, setGatewayIsSandbox] = useState(false);
  const [loadingGateway, setLoadingGateway] = useState(false);
  const [savingGateway, setSavingGateway] = useState(false);
  const [testingGateway, setTestingGateway] = useState(false);
  const [gatewayTestResult, setGatewayTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // User Onboarding form states
  const [newUsername, setNewUsername] = useState("");
  const [newRole, setNewRole] = useState<"Buyer" | "Developer" | "SuperAdmin">("Developer");
  const [newCompany, setNewCompany] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [addingUser, setAddingUser] = useState(false);
  const [userActionError, setUserActionError] = useState<string | null>(null);
  const [userActionSuccess, setUserActionSuccess] = useState<string | null>(null);

  // Package pricing form states (initialized dynamically matching standard plans)
  const [pkgStarterUSD, setPkgStarterUSD] = useState(300);
  const [pkgStarterKES, setPkgStarterKES] = useState(39000);
  const [pkgProUSD, setPkgProUSD] = useState(390);
  const [pkgProKES, setPkgProKES] = useState(50700);
  const [pkgSovereignUSD, setPkgSovereignUSD] = useState(950);
  const [pkgSovereignKES, setPkgSovereignKES] = useState(123500);
  const [savingPackages, setSavingPackages] = useState(false);

  // Homepage toggles states
  const [showHero, setShowHero] = useState(homepageSettings.showHeroSection);
  const [showStats, setShowStats] = useState(homepageSettings.showStatsSection);
  const [showShowcase, setShowShowcase] = useState(homepageSettings.showShowcaseSection);
  const [showROI, setShowROI] = useState(homepageSettings.showROICalculatorSection);
  const [showMatterport, setShowMatterport] = useState(homepageSettings.showMatterportSection);
  const [showDevSaaS, setShowDevSaaS] = useState(homepageSettings.showDevelopersSaaSSection);
  const [showSupport, setShowSupport] = useState(homepageSettings.showSupportSection);
  const [videoUrl, setVideoUrl] = useState(homepageSettings.systemLaunchVideoUrl);
  const [noticeMsg, setNoticeMsg] = useState(homepageSettings.centralPlatformNotice);
  const [dropVideoUrl, setDropVideoUrl] = useState(homepageSettings.dropBroadcastVideoUrl || "");
  const [savingHomepage, setSavingHomepage] = useState(false);
  const [featuredProjectIds, setFeaturedProjectIds] = useState<string[]>(homepageSettings.featuredProjectIds || []);

  // Clickable approvals states inside developer lists
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const [moderationReason, setModerationReason] = useState<{ [key: string]: string }>({});

  // Support Ticket response states
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [ticketReply, setTicketReply] = useState("");
  const [replying, setReplying] = useState(false);

  // Production preparation states
  const [isClearingDb, setIsClearingDb] = useState(false);
  const [dbClearFeedback, setDbClearFeedback] = useState<string | null>(null);
  const [showHostingHelp, setShowHostingHelp] = useState<"vercel" | "directadmin" | null>(null);

  const handleClearDatabase = async () => {
    if (!window.confirm("CRITICAL WARNING:\n\nThis will permanently delete all mock listings, buyer bookings, developer leads, support tickets, and system activity logs from both the local memory AND the active Firestore database. This action is irreversible.\n\nAre you sure you want to clear all mock data and prepare the database for production?")) {
      return;
    }

    setIsClearingDb(true);
    setDbClearFeedback(null);

    try {
      const resp = await fetch("/api/admin/database/clear", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await resp.json();
      if (data.success) {
        setDbClearFeedback("SUCCESS: All mock listings, bookings, leads, chats, and logs have been cleared! Your database is now 100% clean and ready for production listings.");
        if (onRefreshProjects) onRefreshProjects();
        if (onRefreshTickets) onRefreshTickets();
      } else {
        setDbClearFeedback(`ERROR: ${data.message || "Wipe operation failed."}`);
      }
    } catch (err) {
      console.error(err);
      setDbClearFeedback("ERROR: Connection failed.");
    } finally {
      setIsClearingDb(false);
    }
  };

  // Services admin states
  const [srvProviders, setSrvProviders] = useState<any[]>([]);
  const [srvLoading, setSrvLoading] = useState(false);
  const [srvError, setSrvError] = useState("");

  const loadSrvProviders = async () => {
    setSrvLoading(true);
    try {
      const resp = await fetch("/api/services/providers");
      const data = await resp.json();
      if (data.success) {
        setSrvProviders(data.providers || []);
      }
    } catch (e: any) {
      setSrvError(e.message || "Failed to download providers.");
    } finally {
      setSrvLoading(false);
    }
  };

  const loadGateways = async () => {
    setLoadingGateway(true);
    try {
      const resp = await fetch("/api/admin/payment-gateways");
      const data = await resp.json();
      if (data.success && data.mpesaConfig) {
        setGatewayActive(data.mpesaConfig.isActive);
        setGatewayPaybill(data.mpesaConfig.paybillNumber || "");
        setGatewayConsumerKey(data.mpesaConfig.consumerKey || "");
        setGatewayConsumerSecret(data.mpesaConfig.consumerSecret || "");
        setGatewayPasskey(data.mpesaConfig.passkey || "");
        setGatewayInitiatorName(data.mpesaConfig.initiatorName || "");
        setGatewayInitiatorPassword(data.mpesaConfig.initiatorPassword || "");
        setGatewayIsSandbox(data.mpesaConfig.isSandbox !== false);
      }
    } catch (err) {
      console.error("Failed to load gateway config info:", err);
    } finally {
      setLoadingGateway(false);
    }
  };

  const handleSaveGatewaySettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingGateway(true);
    try {
      const payload = {
        mpesaConfig: {
          isActive: gatewayActive,
          paybillNumber: gatewayPaybill,
          consumerKey: gatewayConsumerKey,
          consumerSecret: gatewayConsumerSecret,
          passkey: gatewayPasskey,
          initiatorName: gatewayInitiatorName,
          initiatorPassword: gatewayInitiatorPassword,
          isSandbox: gatewayIsSandbox
        }
      };
      const resp = await fetch("/api/admin/payment-gateways", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (resp.ok) {
        alert("🔒 Live M-Pesa checkout credentials synchronized & locked in protected escrow storage vaults!");
        onAddActivityLog("👑 SuperAdmin updated central M-Pesa API gateway integration parameters.");
      } else {
        alert("Failed to save credentials.");
      }
    } catch (err: any) {
      alert(err.message || "Credential sync error.");
    } finally {
      setSavingGateway(false);
    }
  };

  const handleTestGatewayConnection = async () => {
    setTestingGateway(true);
    setGatewayTestResult(null);
    try {
      const resp = await fetch("/api/admin/test-payment-gateway", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consumerKey: gatewayConsumerKey,
          consumerSecret: gatewayConsumerSecret,
          isSandbox: gatewayIsSandbox,
        }),
      });
      const data = await resp.json();
      if (data.success) {
        setGatewayTestResult({
          success: true,
          message: data.message || "Connection active!",
        });
        onAddActivityLog("👑 SuperAdmin triggered test connection for central M-Pesa API integration. Handshake Successful!");
      } else {
        setGatewayTestResult({
          success: false,
          message: data.error || "Failed to make handshakes.",
        });
        onAddActivityLog("⚠️ SuperAdmin triggered test connection for central M-Pesa API integration. Handshake FAILED!");
      }
    } catch (err: any) {
      setGatewayTestResult({
        success: false,
        message: err.message || "Failed to contact proxy API server.",
      });
    } finally {
      setTestingGateway(false);
    }
  };

  const handleCreateDirectListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!directName || !directId) {
      alert("Property Name and ID Slug are required core parameters.");
      return;
    }
    setCreatingDirect(true);
    try {
      const payload = {
        name: directName,
        id: directId,
        location: directLocation || "Nairobi",
        developerId: "super-admin",
        developerName: "Super Admin Direct",
        tagline: directTagline || "Direct Master Premium Series",
        description: directDescription || "Special direct property syndication bypass program.",
        priceRange: directPriceRange || "Ksh 15,000,000 - 50,050,000",
        completionDate: directCompletionDate || "2029",
        roiRentalYield: directRoiRental || "12.0%",
        roiCapitalAppreciation: directRoiCapital || "15.0%",
        bookingDepositPercent: Number(directDepositPercent) || 10,
        whatsappPhone: directWhatsapp || "+254712345678",
        droneVideoUrl: directDroneUrl || "",
        vrTourUrl: directVrUrl || "",
        isInternational: directIsInternational,
        isFeatured: directIsFeatured,
        tiktokVideos: directTikTok ? directTikTok.split(",").map(s => s.trim()).filter(Boolean) : [],
        towers: [
          {
            name: "Direct Block A",
            floors: [
              {
                floorNumber: 1,
                units: [
                  { number: "C-101", type: "Suite", price: 120000, size: "85 SQM", status: "Available", flexStatus: "Available" },
                  { number: "C-102", type: "Penthouse", price: 250000, size: "210 SQM", status: "Available", flexStatus: "Available" }
                ]
              }
            ]
          }
        ]
      };

      const resp = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error || "Failed to publish direct listing.");
      }

      alert("🎉 Real Estate Listing published successfully! Rendered instantly on home and search grids.");
      onAddActivityLog(`👑 SuperAdmin created direct property listing "${directName}" bypass packages.`);
      
      // Clean up fields
      setDirectName("");
      setDirectId("");
      setDirectLocation("");
      setDirectTagline("");
      setDirectDescription("");
      setDirectPriceRange("");
      setDirectCompletionDate("");
      setDirectRoiRental("");
      setDirectRoiCapital("");
      setDirectWhatsapp("");
      setDirectDroneUrl("");
      setDirectVrUrl("");
      setDirectIsInternational(false);
      setDirectIsFeatured(false);
      setDirectTikTok("");
      
      if (onRefreshProjects) onRefreshProjects();
    } catch (err: any) {
      alert(err.message || "Direct listing creation failed.");
    } finally {
      setCreatingDirect(false);
    }
  };

  React.useEffect(() => {
    if (activeTab === "services") {
      loadSrvProviders();
    } else if (activeTab === "gateways") {
      loadGateways();
    }
  }, [activeTab]);

  const handleApproveSrv = async (pId: string) => {
    try {
      const resp = await fetch(`/api/services/admin/providers/${pId}/approve`, {
        method: "POST"
      });
      if (resp.ok) {
        alert("Advisor Node approved successfully on centralized registry!");
        loadSrvProviders();
        onAddActivityLog(`👑 SuperAdmin approved Professional Service advisor node ID: ${pId}.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectSrv = async (pId: string) => {
    try {
      const resp = await fetch(`/api/services/admin/providers/${pId}/reject`, {
        method: "POST"
      });
      if (resp.ok) {
        alert("Advisor Node rejected/suspended.");
        loadSrvProviders();
        onAddActivityLog(`👑 SuperAdmin suspended/rejected Professional Service advisor node ID: ${pId}.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Calculators metrics:
  const developersCount = users.filter(u => u.role === "Developer").length;
  const buyersCount = users.filter(u => u.role === "Buyer").length;
  
  // Flatten units from projects
  const allUnits = projects.flatMap(p => p.towers?.flatMap(t => t.floors?.flatMap(f => f.units || []) || []) || []);
  const unitsAdded = allUnits.length;
  const unitsSold = allUnits.filter(u => u.status === "Sold" || u.status === "Reserved").length;

  // Onboard user submission
  const handleOnboardUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserActionError(null);
    setUserActionSuccess(null);

    if (!newUsername || !newPassword) {
      setUserActionError("Username and temporary account credentials are required.");
      return;
    }

    setAddingUser(true);
    try {
      const resp = await fetch("/api/admin/users/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: newUsername,
          password: newPassword,
          role: newRole,
          companyName: newCompany || "PropSphere Hub"
        })
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error || "Failed to onboard profile.");
      }

      setUserActionSuccess(`Success! New credential token deployed for "${newUsername}" as standard ${newRole}.`);
      onAddActivityLog(`👑 SuperAdmin onboarded raw profile: "${newUsername}" (${newRole}).`);
      setNewUsername("");
      setNewPassword("");
      setNewCompany("");
      onRefreshUsers();
    } catch (err: any) {
      setUserActionError(err.message || "Onboarding failed.");
    } finally {
      setAddingUser(false);
    }
  };

  // Toggle user state (suspend/enable)
  const handleToggleUserSuspension = async (targetUser: User) => {
    setUserActionError(null);
    setUserActionSuccess(null);

    try {
      const resp = await fetch("/api/admin/users/disable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: targetUser.id,
          type: "toggle" // toggle status
        })
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error || "Failed to update profile ledger.");
      }

      const activeState = data.disabled ? "SUSPENDED" : "ENABLED";
      setUserActionSuccess(`User ${targetUser.username} is now ${activeState} permanently.`);
      onAddActivityLog(`👑 SuperAdmin modified lock states: "${targetUser.username}" state set to ${activeState}.`);
      onRefreshUsers();
    } catch (err: any) {
      setUserActionError(err.message || "Lock change failed.");
    }
  };

  // Delete user
  const handleDeleteUser = async (targetUser: User) => {
    if (!window.confirm(`Are you absolutely sure you want to completely erase user "${targetUser.username}" profile from database ledger?`)) {
      return;
    }

    setUserActionError(null);
    setUserActionSuccess(null);

    try {
      const resp = await fetch("/api/admin/users/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: targetUser.id })
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error || "Failed to erase profile.");
      }

      setUserActionSuccess(`Erased user "${targetUser.username}" profiles from distributed nodes successfully.`);
      onAddActivityLog(`👑 SuperAdmin erased profile account ledger: "${targetUser.username}".`);
      onRefreshUsers();
    } catch (err: any) {
      setUserActionError(err.message || "Erase failed.");
    }
  };

  // Save Packages update values
  const handleSavePackagesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPackages(true);

    try {
      const payload = [
        { id: "pkg-starter", priceUSD: Number(pkgStarterUSD), priceKES: Number(pkgStarterKES) },
        { id: "pkg-pro", priceUSD: Number(pkgProUSD), priceKES: Number(pkgProKES) },
        { id: "pkg-sovereign", priceUSD: Number(pkgSovereignUSD), priceKES: Number(pkgSovereignKES) }
      ];

      const resp = await fetch("/api/admin/packages/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packages: payload })
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error || "Failed to update price index.");
      }

      alert("Premium developer subscription billing plan indexes updated and synchronized successfully!");
      onAddActivityLog(`👑 SuperAdmin adjusted package subscriptions pricing matrices.`);
      onRefreshPackages();
    } catch (err: any) {
      alert(err.message || "Pricing index sync failed.");
    } finally {
      setSavingPackages(false);
    }
  };

  // Sync pricing values on mount
  React.useEffect(() => {
    const starter = packages.find(p => p.id === "pkg-starter");
    if (starter) {
      setPkgStarterUSD(starter.priceUSD);
      setPkgStarterKES(starter.priceKES);
    }
    const pro = packages.find(p => p.id === "pkg-pro");
    if (pro) {
      setPkgProUSD(pro.priceUSD);
      setPkgProKES(pro.priceKES);
    }
    const sovereign = packages.find(p => p.id === "pkg-sovereign");
    if (sovereign) {
      setPkgSovereignUSD(sovereign.priceUSD);
      setPkgSovereignKES(sovereign.priceKES);
    }
  }, [packages]);

  // Sync homepage layout details on change. We stringify the dependency so it doesn't run on every parent re-render unless values actually change.
  const homepageSettingsStr = JSON.stringify(homepageSettings);
  React.useEffect(() => {
    setShowHero(homepageSettings.showHeroSection);
    setShowStats(homepageSettings.showStatsSection);
    setShowShowcase(homepageSettings.showShowcaseSection);
    setShowROI(homepageSettings.showROICalculatorSection);
    setShowMatterport(homepageSettings.showMatterportSection);
    setShowDevSaaS(homepageSettings.showDevelopersSaaSSection);
    setShowSupport(homepageSettings.showSupportSection);
    setVideoUrl(homepageSettings.systemLaunchVideoUrl || "");
    setNoticeMsg(homepageSettings.centralPlatformNotice || "");
    setFeaturedProjectIds(homepageSettings.featuredProjectIds || []);
    setDropVideoUrl(homepageSettings.dropBroadcastVideoUrl || "");
    if (homepageSettings.activeMenuIds) {
      setActiveMenuIds(homepageSettings.activeMenuIds);
    }
    if (homepageSettings.inactiveMenuIds) {
      setInactiveMenuIds(homepageSettings.inactiveMenuIds);
    }
  }, [homepageSettingsStr]);

  // Positional ordering controls requested by SuperAdmin
  const moveProjectPosition = (projectId: string, direction: "up" | "down") => {
    const currentIndex = featuredProjectIds.indexOf(projectId);
    if (currentIndex === -1) return;
    const nextIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (nextIndex < 0 || nextIndex >= featuredProjectIds.length) return;
    
    const updatedIds = [...featuredProjectIds];
    const temp = updatedIds[currentIndex];
    updatedIds[currentIndex] = updatedIds[nextIndex];
    updatedIds[nextIndex] = temp;
    setFeaturedProjectIds(updatedIds);
  };

  const toggleFeaturedProject = (projectId: string) => {
    if (featuredProjectIds.includes(projectId)) {
      setFeaturedProjectIds(prev => prev.filter(id => id !== projectId));
    } else {
      setFeaturedProjectIds(prev => [...prev, projectId]);
    }
  };

  // Submit homepage toggle settings
  const handleSaveHomepageSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingHomepage(true);

    try {
      const payload = {
        showHeroSection: showHero,
        showStatsSection: showStats,
        showShowcaseSection: showShowcase,
        showROICalculatorSection: showROI,
        showMatterportSection: showMatterport,
        showDevelopersSaaSSection: showDevSaaS,
        showSupportSection: showSupport,
        systemLaunchVideoUrl: videoUrl,
        centralPlatformNotice: noticeMsg,
        featuredProjectIds: featuredProjectIds,
        dropBroadcastVideoUrl: dropVideoUrl
      };

      const resp = await fetch("/api/admin/homepage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error || "Failed to save homepage visibility map.");
      }

      alert("Central homepage section rendering rules and listing positions updated live!");
      onAddActivityLog(`👑 SuperAdmin customized homepage listing positions and active displays.`);
      onRefreshHomepage();
    } catch (err: any) {
      alert(err.message || "Homepage map save failed.");
    } finally {
      setSavingHomepage(false);
    }
  };

  // Submit Ticket Reply
  const handleTicketReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicketId || !ticketReply.trim()) return;

    setReplying(true);
    try {
      const resp = await fetch("/api/admin/tickets/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: selectedTicketId,
          replyText: ticketReply
        })
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error || "Reply delivery failed.");
      }

      alert("Reply rendered and dispatched to developer inbox successfully!");
      onAddActivityLog(`👑 SuperAdmin addressed custom developer ticket ${selectedTicketId}.`);
      setTicketReply("");
      setSelectedTicketId(null);
      onRefreshTickets();
    } catch (err: any) {
      alert(err.message || "Replying failed.");
    } finally {
      setReplying(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto py-8 px-4">
      
      {/* SuperAdmin Navigation Rail (3-cols) */}
      <aside className="lg:col-span-3 bg-neutral-950 text-white p-6 rounded-3xl border border-neutral-850 shadow-2xl h-fit space-y-6">
        <div className="flex items-center gap-3 border-b border-neutral-900 pb-5">
          <div className="w-10 h-10 rounded-xl bg-orange-500 text-neutral-950 flex items-center justify-center font-black shadow-lg shadow-orange-500/10">
            A
          </div>
          <div>
            <strong className="text-sm font-black text-white block">SuperAdmin Portal</strong>
            <span className="text-[10px] font-mono font-extrabold text-stone-500 uppercase tracking-widest block">
              Status: System Master
            </span>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {[
            { id: "metrics", label: "📊 Overview Metrics" },
            { id: "users", label: "👥 Users Command" },
            { id: "listings", label: "🔑 Listing Approvals" },
            { id: "other-listings", label: "🏞️ Land & Plots Desk" },
            { id: "services", label: "⚖️ Professional Partners" },
            { id: "packages", label: "💵 Developer Packages" },
            { id: "gateways", label: "💳 Payment Gateway" },
            { id: "homepage", label: "⚙️ Homepage Layout" },
            { id: "blogs-hub", label: "✍️ Market Blogs Hub" },
            { id: "menu-control", label: "📋 Navigation Control (Drag & Drop)" },
            { id: "tickets", label: `🎫 Support Desk (${tickets.filter(t => t.status === "Pending").length})` }
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setActiveTab(btn.id as any)}
              className={`w-full text-left p-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === btn.id
                  ? "bg-orange-500 text-neutral-950 font-black"
                  : "text-stone-400 hover:text-white hover:bg-neutral-900"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </nav>

        <div className="p-4 bg-neutral-900 border border-neutral-850 rounded-2xl text-[10px] text-stone-500 space-y-1">
          <span>Escrow System Node:</span>
          <strong className="text-white block font-mono">NODE_902_ONLINE</strong>
        </div>
      </aside>

      {/* SuperAdmin Workspace Panels (9-cols) */}
      <main className="lg:col-span-9 space-y-8">
        
        {/* ================= TAB 1: METRICS CENTER ================= */}
        {activeTab === "metrics" && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-2xl font-sans font-black text-neutral-950 uppercase tracking-tight">Master Platform Stats</h3>
            <p className="text-xs text-neutral-500">Live indicators aggregated from central ledger nodes tracking buyers registration, listings, and transactional volume.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
              {/* Box 1: Total Units Listed (Cyan background) */}
              <div 
                onClick={() => setActiveTab("listings")}
                className="bg-cyan-500 text-white rounded-3xl p-5 shadow-sm relative overflow-hidden group cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all"
              >
                <div className="inner space-y-1 z-10 relative">
                  <span className="text-[10px] font-mono uppercase tracking-widest block font-bold text-cyan-100">Total Units Listed</span>
                  <strong className="text-4xl font-black leading-none block">{unitsAdded}</strong>
                  <p className="text-[10px] text-cyan-50/90">Across {projects.length} properties</p>
                </div>
                <Building2 className="absolute right-4 top-4 text-white/15 w-16 h-16 pointer-events-none group-hover:scale-110 transition-transform duration-300" />
                <div className="bg-black/10 text-white/80 group-hover:bg-black/15 text-[10px] py-1 text-center font-bold uppercase tracking-wider absolute bottom-0 left-0 right-0 rounded-b-3xl transition-colors">
                  More info <ArrowRight className="inline-block w-3 h-3 ml-1" />
                </div>
              </div>

              {/* Box 2: Units Sold / Held (Green background) */}
              <div 
                onClick={() => setActiveTab("listings")}
                className="bg-emerald-500 text-white rounded-3xl p-5 shadow-sm relative overflow-hidden group cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all"
              >
                <div className="inner space-y-1 z-10 relative">
                  <span className="text-[10px] font-mono uppercase tracking-widest block font-bold text-emerald-100">Units Sold / Held</span>
                  <strong className="text-4xl font-black leading-none block">{unitsSold}</strong>
                  <p className="text-[10px] text-emerald-50/90">Escrow deposit locked</p>
                </div>
                <DollarSign className="absolute right-4 top-4 text-white/15 w-16 h-16 pointer-events-none group-hover:scale-110 transition-transform duration-300" />
                <div className="bg-black/10 text-white/80 group-hover:bg-black/15 text-[10px] py-1 text-center font-bold uppercase tracking-wider absolute bottom-0 left-0 right-0 rounded-b-3xl transition-colors">
                  More info <ArrowRight className="inline-block w-3 h-3 ml-1" />
                </div>
              </div>

              {/* Box 3: Active Developers (Amber background) */}
              <div 
                onClick={() => setActiveTab("users")}
                className="bg-amber-500 text-white rounded-3xl p-5 shadow-sm relative overflow-hidden group cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all"
              >
                <div className="inner space-y-1 z-10 relative">
                  <span className="text-[10px] font-mono uppercase tracking-widest block font-bold text-amber-100">Active Developers</span>
                  <strong className="text-4xl font-black leading-none block">{developersCount}</strong>
                  <p className="text-[10px] text-amber-50/90">Monthly SaaS sub users</p>
                </div>
                <Users className="absolute right-4 top-4 text-white/15 w-16 h-16 pointer-events-none group-hover:scale-110 transition-transform duration-300" />
                <div className="bg-black/10 text-white/80 group-hover:bg-black/15 text-[10px] py-1 text-center font-bold uppercase tracking-wider absolute bottom-0 left-0 right-0 rounded-b-3xl transition-colors">
                  More info <ArrowRight className="inline-block w-3 h-3 ml-1" />
                </div>
              </div>

              {/* Box 4: Verified Buyers (Red/Rose background) */}
              <div 
                onClick={() => setActiveTab("users")}
                className="bg-rose-500 text-white rounded-3xl p-5 shadow-sm relative overflow-hidden group cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all"
              >
                <div className="inner space-y-1 z-10 relative">
                  <span className="text-[10px] font-mono uppercase tracking-widest block font-bold text-rose-100">Verified Buyers</span>
                  <strong className="text-4xl font-black leading-none block">{buyersCount}</strong>
                  <p className="text-[10px] text-rose-50/90">Registered portfolios</p>
                </div>
                <ShieldCheck className="absolute right-4 top-4 text-white/15 w-16 h-16 pointer-events-none group-hover:scale-110 transition-transform duration-300" />
                <div className="bg-black/10 text-white/80 group-hover:bg-black/15 text-[10px] py-1 text-center font-bold uppercase tracking-wider absolute bottom-0 left-0 right-0 rounded-b-3xl transition-colors">
                  More info <ArrowRight className="inline-block w-3 h-3 ml-1" />
                </div>
              </div>
            </div>

            {/* AdminLTE Info Boxes Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-sans">
              {/* Box 1 */}
              <div className="bg-white border border-stone-200 rounded-3xl p-4 flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-teal-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-teal-500/10">
                  <Cpu className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-stone-400 block">Platform Bandwidth</span>
                  <strong className="text-lg font-sans font-black text-neutral-900 block leading-tight">70.2% Load</strong>
                  <div className="w-full bg-stone-100 h-1 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-teal-500 h-full rounded-full" style={{ width: "70.2%" }}></div>
                  </div>
                  <span className="text-[8px] text-stone-500 mt-1 block">Active central compute instances</span>
                </div>
              </div>

              {/* Box 2 */}
              <div className="bg-white border border-stone-200 rounded-3xl p-4 flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/10">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-stone-400 block">Escrow Vault</span>
                  <strong className="text-lg font-sans font-black text-neutral-900 block leading-tight">$1.48M Locked</strong>
                  <div className="w-full bg-stone-100 h-1 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: "85%" }}></div>
                  </div>
                  <span className="text-[8px] text-emerald-500 mt-1 block">↑ 85% of quarterly milestone</span>
                </div>
              </div>

              {/* Box 3 */}
              <div className="bg-white border border-stone-200 rounded-3xl p-4 flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-pink-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-pink-500/10">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-stone-400 block">AI Engine Queries</span>
                  <strong className="text-lg font-sans font-black text-neutral-900 block leading-tight">14,250 Chats</strong>
                  <div className="w-full bg-stone-100 h-1 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-pink-500 h-full rounded-full" style={{ width: "94%" }}></div>
                  </div>
                  <span className="text-[8px] text-stone-500 mt-1 block">99.8% precision index accuracy</span>
                </div>
              </div>

              {/* Box 4 */}
              <div className="bg-white border border-stone-200 rounded-3xl p-4 flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/10">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-stone-400 block">Ticket Resolution</span>
                  <strong className="text-lg font-sans font-black text-neutral-900 block leading-tight">92.5% Rate</strong>
                  <div className="w-full bg-stone-100 h-1 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-orange-500 h-full rounded-full" style={{ width: "92.5%" }}></div>
                  </div>
                  <span className="text-[8px] text-emerald-500 mt-1 block">Mean reply time: 12 minutes</span>
                </div>
              </div>
            </div>

            {/* Enhanced Live Platform Operations and Health Metrics Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Real-time System Actions Ledger (7-cols) */}
              <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 rounded-3xl p-6 text-white space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <div>
                    <strong className="text-xs font-mono uppercase text-amber-400 block tracking-wider">Live System Operations Log</strong>
                    <p className="text-[10px] text-neutral-400 font-semibold">Real-time ledger events synced from active player sessions</p>
                  </div>
                  <span className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold animate-pulse">
                    ● ONLINE WATCHDOG
                  </span>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {activityLogs.length === 0 ? (
                    <div className="text-center py-10 font-mono text-neutral-500 text-xs">
                      No system events captured in the current sandbox stream yet.
                    </div>
                  ) : (
                    activityLogs.map((log: any, idx: number) => {
                      const isBid = log.text?.toLowerCase().includes("placed");
                      const isAuth = log.text?.toLowerCase().includes("signed") || log.text?.toLowerCase().includes("registered");
                      const isMod = log.text?.toLowerCase().includes("status") || log.text?.toLowerCase().includes("verified") || log.text?.toLowerCase().includes("listing");
                      
                      return (
                        <div key={log.id || idx} className="bg-neutral-950/65 border border-neutral-850/80 p-3 rounded-2xl flex items-start gap-3 transition-all hover:bg-neutral-950">
                          <span className="text-sm mt-0.5">
                            {isBid ? "💸" : isAuth ? "👤" : isMod ? "👑" : "⚙️"}
                          </span>
                          <div className="flex-1 space-y-1">
                            <p className="text-xs text-neutral-200 leading-relaxed font-sans">{log.text}</p>
                            <div className="flex items-center gap-2 text-[9px] font-mono text-neutral-500">
                              <span className="uppercase font-bold text-neutral-400">
                                {isBid ? "Transaction" : isAuth ? "Auth" : isMod ? "Moderate" : "System"}
                              </span>
                              <span>•</span>
                              <span>{log.time || "Just now"}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Right Column: Platform Audit & Approval Ratios Visual (5-cols) */}
              <div className="lg:col-span-5 bg-white border border-stone-200 rounded-3xl p-6 space-y-5 shadow-sm text-neutral-900">
                <div>
                  <strong className="text-xs font-mono uppercase text-neutral-500 block tracking-wider">Property Integrity Metrics</strong>
                  <h4 className="text-sm font-black text-neutral-950">Active Ledger Statistics</h4>
                </div>

                {/* Listing Moderation Stats Ratio Indicators */}
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-neutral-500">Approved Listings:</span>
                    <span className="text-emerald-600">
                      {projects.filter(p => !p.approvalStatus || p.approvalStatus === "Approved").length} of {projects.length}
                    </span>
                  </div>
                  
                  {/* Custom CSS Bar Chart */}
                  <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden flex">
                    <div 
                      className="bg-emerald-500 h-full transition-all duration-500" 
                      style={{ 
                        width: `${projects.length ? (projects.filter(p => !p.approvalStatus || p.approvalStatus === "Approved").length / projects.length) * 100 : 100}%` 
                      }} 
                    />
                    <div 
                      className="bg-rose-500 h-full transition-all duration-500" 
                      style={{ 
                        width: `${projects.length ? (projects.filter(p => p.approvalStatus === "Rejected").length / projects.length) * 100 : 0}%` 
                      }} 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-2">
                  <div className="bg-emerald-50/50 border border-emerald-100 p-2.5 rounded-2xl">
                    <span className="text-[9px] text-neutral-500 font-mono block">APPROVED</span>
                    <strong className="text-emerald-750 text-base font-black font-sans">
                      {projects.filter(p => !p.approvalStatus || p.approvalStatus === "Approved").length}
                    </strong>
                  </div>
                  <div className="bg-amber-50/50 border border-amber-100 p-2.5 rounded-2xl">
                    <span className="text-[9px] text-neutral-500 font-mono block">PENDING</span>
                    <strong className="text-amber-800 text-base font-black font-sans">
                      {projects.filter(p => p.approvalStatus === "Pending").length}
                    </strong>
                  </div>
                  <div className="bg-rose-50/50 border border-rose-100 p-2.5 rounded-2xl">
                    <span className="text-[9px] text-neutral-500 font-mono block">FLAGGED</span>
                    <strong className="text-rose-750 text-base font-black font-sans">
                      {projects.filter(p => p.approvalStatus === "Rejected").length}
                    </strong>
                  </div>
                </div>

                {/* Custom Inline SVG Area Visual */}
                <div className="border border-stone-100 rounded-2xl p-4 bg-stone-50 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase">Interactive Bidding Velocity</span>
                    <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded">WEEKLY +14.2%</span>
                  </div>
                  
                  <div className="w-full h-24 flex items-end">
                    <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      {/* Area */}
                      <path 
                        d="M0 80 Q 50 40, 100 65 T 200 20 T 300 10 L 300 100 L 0 100 Z" 
                        fill="url(#chartGradient)" 
                      />
                      {/* Line */}
                      <path 
                        d="M0 80 Q 50 40, 100 65 T 200 20 T 300 10" 
                        fill="none" 
                        stroke="#f59e0b" 
                        strokeWidth="3" 
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  
                  <div className="flex justify-between text-[9px] font-mono text-neutral-400">
                    <span>Mon</span>
                    <span>Wed</span>
                    <span>Fri (Bidding Drops)</span>
                    <span>Today</span>
                  </div>
                </div>

              </div>
            </div>

            {/* AdminLTE Interactive Column Widgets: To-Do, Live Chat, Resources stream & Timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
              
              {/* Left Column: To-Do List & Live Chat (6-cols) */}
              <div className="lg:col-span-6 space-y-6">
                
                {/* To-Do List Card */}
                <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                    <div className="flex items-center gap-2">
                      <CheckSquare className="w-5 h-5 text-cyan-500" />
                      <h4 className="text-sm font-black text-neutral-950 uppercase tracking-tight">System Action To-Dos</h4>
                    </div>
                    <span className="bg-cyan-100 text-cyan-800 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                      {todoList.filter(t => !t.done).length} Tasks Left
                    </span>
                  </div>

                  {/* To-Do Stream */}
                  <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                    {todoList.map((todo) => (
                      <div 
                        key={todo.id} 
                        className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                          todo.done 
                            ? "bg-stone-50/70 border-stone-150 text-neutral-400" 
                            : "bg-white border-stone-200 text-neutral-900 hover:border-stone-300"
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <button 
                            type="button"
                            onClick={() => handleToggleTodo(todo.id)}
                            className="text-stone-400 hover:text-cyan-500 shrink-0 transition-colors"
                          >
                            {todo.done ? (
                              <CheckSquare className="w-5 h-5 text-cyan-500" />
                            ) : (
                              <Square className="w-5 h-5" />
                            )}
                          </button>
                          <span className={`text-xs font-medium truncate ${todo.done ? "line-through" : ""}`}>
                            {todo.text}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                            todo.priority === "critical" ? "bg-rose-100 text-rose-800" :
                            todo.priority === "high" ? "bg-amber-100 text-amber-800" :
                            todo.priority === "medium" ? "bg-sky-100 text-sky-800" : "bg-stone-100 text-stone-500"
                          }`}>
                            {todo.priority}
                          </span>
                          <button 
                            type="button"
                            onClick={() => handleDeleteTodo(todo.id)}
                            className="text-stone-300 hover:text-red-500 p-1 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add To-Do Input form */}
                  <div className="flex gap-2 pt-2 border-t border-stone-100">
                    <input 
                      type="text" 
                      placeholder="Enter new administrative duty..."
                      value={newTodoText}
                      onChange={(e) => setNewTodoText(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleAddTodo(); }}
                      className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white"
                    />
                    <select 
                      value={newTodoPriority}
                      onChange={(e: any) => setNewTodoPriority(e.target.value)}
                      className="text-xs bg-white border border-stone-200 rounded-xl px-2"
                    >
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                    <button 
                      type="button"
                      onClick={handleAddTodo}
                      className="bg-neutral-900 hover:bg-neutral-850 text-white p-2.5 rounded-xl flex items-center justify-center transition-colors shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Direct Desk Chat Card */}
                <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm flex flex-col h-[380px] space-y-4">
                  <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-indigo-500" />
                      <h4 className="text-sm font-black text-neutral-950 uppercase tracking-tight">Private Support Desk</h4>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-[8px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                      ● active channel
                    </span>
                  </div>

                  {/* Messages Feed */}
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex gap-2.5 ${msg.isMe ? "flex-row-reverse" : ""}`}>
                        <img 
                          src={msg.avatar} 
                          alt={msg.sender} 
                          className="w-7 h-7 rounded-full object-cover shrink-0 border"
                          referrerPolicy="no-referrer"
                        />
                        <div className="space-y-0.5 max-w-[75%]">
                          <div className={`flex items-center gap-2 ${msg.isMe ? "flex-row-reverse" : ""}`}>
                            <span className="text-[9px] font-bold text-stone-600">{msg.sender}</span>
                            <span className="text-[8px] font-mono text-stone-400">{msg.time}</span>
                          </div>
                          <div className={`p-2.5 text-xs rounded-2xl shadow-sm ${
                            msg.isMe 
                              ? "bg-neutral-950 text-white rounded-tr-none" 
                              : "bg-stone-100 text-stone-850 rounded-tl-none border border-stone-200/60"
                          }`}>
                            {msg.text}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chat Input form */}
                  <form onSubmit={handleSendChatMessage} className="flex gap-2 pt-2 border-t border-stone-100">
                    <input 
                      type="text" 
                      placeholder="Ask the Agent Support Bot or type a message..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white"
                    />
                    <button 
                      type="submit"
                      className="bg-indigo-650 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl flex items-center justify-center transition-colors shadow shadow-indigo-650/10"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>

              </div>

              {/* Right Column: Resource Flot stream & Timeline (6-cols) */}
              <div className="lg:col-span-6 space-y-6">
                
                {/* Flot Resource Monitor Card */}
                <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-pink-500 animate-pulse" />
                      <h4 className="text-sm font-black text-neutral-950 uppercase tracking-tight">Platform Resources (Flot Stream)</h4>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setIsLiveCpuUpdating(!isLiveCpuUpdating)}
                      className={`text-[9px] font-mono font-bold px-2.5 py-1 rounded-full uppercase flex items-center gap-1 border transition-all ${
                        isLiveCpuUpdating 
                          ? "bg-pink-50 text-pink-700 border-pink-200" 
                          : "bg-stone-100 text-stone-500 border-stone-200"
                      }`}
                    >
                      {isLiveCpuUpdating ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5" />}
                      {isLiveCpuUpdating ? "Live Stream" : "Paused"}
                    </button>
                  </div>

                  {/* SVG Chart */}
                  <div className="relative">
                    <svg className="w-full h-44 bg-neutral-950 rounded-2xl border border-neutral-850 p-2 overflow-hidden" viewBox="0 0 300 100" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#ec4899" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      {/* Grid Lines */}
                      <line x1="0" y1="25" x2="300" y2="25" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" />
                      <line x1="0" y1="50" x2="300" y2="50" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" />
                      <line x1="0" y1="75" x2="300" y2="75" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" />
                      {/* Area Path */}
                      <path 
                        d={`M 0 100 ${cpuHistory.map((val, i) => `L ${i * (300 / 14)} ${100 - val}`).join(" ")} L 300 100 Z`}
                        fill="url(#cpuGradient)"
                        className="transition-all duration-1000 ease-in-out"
                      />
                      {/* Line Path */}
                      <path 
                        d={cpuHistory.map((val, i) => `${i === 0 ? "M" : "L"} ${i * (300 / 14)} ${100 - val}`).join(" ")}
                        fill="none"
                        stroke="#ec4899"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-all duration-1000 ease-in-out"
                      />
                    </svg>
                    
                    {/* Floating current indicator */}
                    <div className="absolute top-3 right-3 bg-neutral-900/80 border border-neutral-800 text-white font-mono text-[9px] px-2 py-0.5 rounded font-bold">
                      Current CPU: {cpuHistory[cpuHistory.length - 1]}%
                    </div>
                  </div>

                  {/* Resources Footnote */}
                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono text-stone-500 pt-1">
                    <div className="bg-stone-50 border rounded-2xl p-2">
                      <span className="block text-[8px] uppercase text-stone-400">API Latency</span>
                      <strong className="text-neutral-900">12ms</strong>
                    </div>
                    <div className="bg-stone-50 border rounded-2xl p-2">
                      <span className="block text-[8px] uppercase text-stone-400">GC Threads</span>
                      <strong className="text-neutral-900">4 Active</strong>
                    </div>
                    <div className="bg-stone-50 border rounded-2xl p-2">
                      <span className="block text-[8px] uppercase text-stone-400">Sync Nodes</span>
                      <strong className="text-neutral-900">16 Shards</strong>
                    </div>
                  </div>
                </div>

                {/* Audit Timeline Card */}
                <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-amber-500" />
                      <h4 className="text-sm font-black text-neutral-950 uppercase tracking-tight">Active Platform Audit Timeline</h4>
                    </div>
                  </div>

                  {/* Timeline Stream */}
                  <div className="relative border-l border-stone-200 ml-3.5 pl-6 space-y-4 max-h-56 overflow-y-auto pr-1">
                    {timelineEvents.map((evt) => (
                      <div key={evt.id} className="relative">
                        {/* Bullet */}
                        <div className={`absolute -left-[31px] top-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ring-4 ${
                          evt.type === "primary" ? "bg-cyan-500 ring-cyan-100" :
                          evt.type === "success" ? "bg-emerald-500 ring-emerald-100" :
                          evt.type === "warning" ? "bg-amber-500 ring-amber-100" : "bg-rose-500 ring-rose-100"
                        }`} />
                        <div className="space-y-0.5">
                          <div className="flex items-center justify-between gap-2">
                            <h5 className="text-xs font-bold text-neutral-950 leading-tight">{evt.title}</h5>
                            <span className="text-[8px] text-stone-400 font-mono flex items-center gap-1 shrink-0">
                              <Clock className="w-2.5 h-2.5" />
                              {evt.time}
                            </span>
                          </div>
                          <p className="text-[10px] text-stone-500 leading-normal">{evt.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Event Form */}
                  <form onSubmit={handleAddTimelineEvent} className="bg-stone-50 p-3 rounded-2xl border border-stone-150 space-y-2 pt-2 pb-2">
                    <strong className="text-[9px] font-mono font-bold text-stone-400 uppercase block">Broadcast Timeline Log</strong>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                      <input 
                        type="text" 
                        required
                        placeholder="Event header..."
                        value={newTimelineTitle}
                        onChange={(e) => setNewTimelineTitle(e.target.value)}
                        className="md:col-span-4 text-[10px] px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white"
                      />
                      <input 
                        type="text" 
                        required
                        placeholder="Log detail specs..."
                        value={newTimelineDesc}
                        onChange={(e) => setNewTimelineDesc(e.target.value)}
                        className="md:col-span-5 text-[10px] px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white"
                      />
                      <select 
                        value={newTimelineType}
                        onChange={(e: any) => setNewTimelineType(e.target.value)}
                        className="md:col-span-3 text-[10px] bg-white border rounded-lg px-1 py-1.5"
                      >
                        <option value="primary">Info (Blue)</option>
                        <option value="success">Success (Green)</option>
                        <option value="warning">Pending (Amber)</option>
                        <option value="danger">Critical (Red)</option>
                      </select>
                    </div>
                    <div className="flex justify-end">
                      <button 
                        type="submit"
                        className="bg-neutral-900 hover:bg-neutral-850 text-white text-[9px] uppercase font-mono font-bold px-3 py-1 rounded-lg shadow-sm transition-colors"
                      >
                        Publish Event
                      </button>
                    </div>
                  </form>
                </div>

              </div>

            </div>

            {/* Production Preparation & Hosting Slate */}
            <div className="bg-gradient-to-r from-stone-100 to-stone-50 border border-stone-200 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-4">
                <div className="space-y-1">
                  <h4 className="text-lg font-black uppercase tracking-tight text-neutral-950 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-stone-600 animate-spin animate-duration-1000" style={{ animationDuration: "12s" }} />
                    Production Hosting & Database Clear Desk
                  </h4>
                  <p className="text-xs text-neutral-500">
                    Prepare the CRM application for live deployment on Vercel or DirectAdmin. Permanently wipe sample mock properties.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setShowHostingHelp(showHostingHelp === "vercel" ? null : "vercel")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold tracking-wider uppercase border transition-all cursor-pointer ${
                      showHostingHelp === "vercel"
                        ? "bg-neutral-950 text-white border-neutral-950"
                        : "bg-white text-neutral-700 border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    Vercel Guide
                  </button>
                  <button
                    onClick={() => setShowHostingHelp(showHostingHelp === "directadmin" ? null : "directadmin")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold tracking-wider uppercase border transition-all cursor-pointer ${
                      showHostingHelp === "directadmin"
                        ? "bg-neutral-950 text-white border-neutral-950"
                        : "bg-white text-neutral-700 border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    DirectAdmin Guide
                  </button>
                </div>
              </div>

              {/* Db Clear Status Notification */}
              {dbClearFeedback && (
                <div className={`p-4 rounded-2xl border text-xs font-mono whitespace-pre-line ${
                  dbClearFeedback.startsWith("SUCCESS")
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-rose-50 border-rose-200 text-rose-800"
                }`}>
                  {dbClearFeedback}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Clear Mock Data CTA */}
                <div className="md:col-span-4 bg-white border border-stone-200/80 p-5 rounded-2xl space-y-3 shadow-inner">
                  <span className="text-[10px] text-rose-500 font-mono font-bold uppercase tracking-wider block">Wipe Sandbox Listings</span>
                  <p className="text-xs text-neutral-600 leading-snug">
                    Permanently deletes all default properties, mock customer bookings, leads, chat history, and system audit logs.
                  </p>
                  <button
                    type="button"
                    disabled={isClearingDb}
                    onClick={handleClearDatabase}
                    className="w-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase py-3 px-4 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 text-center flex items-center justify-center gap-2"
                  >
                    {isClearingDb ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Wiping Database Slate...
                      </>
                    ) : (
                      "Clear All Mock Data"
                    )}
                  </button>
                </div>

                {/* Vercel or DirectAdmin inline tutorial display */}
                <div className="md:col-span-8 space-y-3">
                  {showHostingHelp === "vercel" ? (
                    <div className="bg-white border border-stone-200 p-5 rounded-2xl space-y-3 text-xs text-neutral-700 leading-relaxed">
                      <strong className="text-neutral-950 block font-bold text-sm">▲ Hosting on Vercel</strong>
                      <ol className="list-decimal list-inside space-y-1.5 font-medium">
                        <li>Install Vercel CLI globally: <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">npm install -g vercel</code></li>
                        <li>Log in to Vercel and run <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">vercel</code> in the workspace root</li>
                        <li>Add your Firestore configurations as environment variables in the Vercel Dashboard project settings</li>
                        <li>Verify build output is mapped to the standard SPA assets structure</li>
                      </ol>
                    </div>
                  ) : showHostingHelp === "directadmin" ? (
                    <div className="bg-white border border-stone-200 p-5 rounded-2xl space-y-3 text-xs text-neutral-700 leading-relaxed">
                      <strong className="text-neutral-950 block font-bold text-sm">⚙ Hosting on DirectAdmin Panels</strong>
                      <ol className="list-decimal list-inside space-y-1.5 font-medium">
                        <li>Build static assets locally or in CI using: <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">npm run build</code></li>
                        <li>Zip and upload the contents of the compiled <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">dist/</code> directory into your DirectAdmin <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">public_html</code> folder</li>
                        <li>Configure URL rewrites using an <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">.htaccess</code> file to route all traffic to <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">index.html</code></li>
                        <li>Set up a custom Node.js application in your DirectAdmin panel if using the server-side API proxy routes</li>
                      </ol>
                    </div>
                  ) : (
                    <div className="border border-dashed border-stone-300 p-5 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 py-8 bg-stone-50">
                      <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                        🚀
                      </div>
                      <p className="text-xs text-neutral-500 max-w-sm">
                        Select a guide above to see exact step-by-step instructions on deploying to Vercel or DirectAdmin.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 2: USER ONBOARDING & MANAGEMENT ================= */}
        {activeTab === "users" && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-2xl font-sans font-black text-neutral-950 uppercase tracking-tight">Developer & Buyer Onboarding</h3>
            <p className="text-xs text-neutral-500">Provision fresh workspace handles, activate high-status credentials, and enable/disable existing profiles.</p>

            {/* Success & Error */}
            {userActionError && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-mono">
                ⚠️ {userActionError}
              </div>
            )}
            {userActionSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-mono">
                🎉 {userActionSuccess}
              </div>
            )}

            {/* Form Onboarding */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
              <strong className="text-xs font-bold uppercase text-neutral-700 block tracking-wider mb-2">Onboarding Workspace Provisioning Tool</strong>
              <form onSubmit={handleOnboardUserSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="text-[10px] font-mono text-stone-500 block mb-1">Username / Nickname</label>
                  <input
                    type="text"
                    required
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="e.g. Al-Futtaim Developers"
                    className="w-full text-xs p-3 rounded-lg border border-stone-200 bg-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-stone-500 block mb-1">Company / Organization</label>
                  <input
                    type="text"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    placeholder="e.g. Dubai Holdings"
                    className="w-full text-xs p-3 rounded-lg border border-stone-200 bg-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-stone-500 block mb-1">Workspace Level (Role)</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as any)}
                    className="w-full text-xs p-3 rounded-lg border border-stone-200 bg-white cursor-pointer"
                  >
                    <option value="Developer">Developer SaaS Plan</option>
                    <option value="Buyer">Standard Buyer</option>
                    <option value="SuperAdmin">SuperAdmin Agent</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-mono text-stone-500 block mb-1">Temporary Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs p-3 rounded-lg border border-stone-200 bg-white"
                  />
                </div>
                <div className="md:col-span-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={addingUser}
                    className="bg-neutral-900 text-white hover:bg-neutral-850 font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl cursor-pointer disabled:opacity-50"
                  >
                    {addingUser ? "Deploying Nodes..." : "Onboard Workspace Profile"}
                  </button>
                </div>
              </form>
            </div>

            {/* List users with actions */}
            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-stone-100">
                <strong className="text-xs uppercase font-bold text-neutral-800 tracking-wider">Active Workspace Registries</strong>
              </div>
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left">
                  <thead className="bg-stone-50 uppercase text-[9px] text-neutral-500 font-mono tracking-wider border-b border-stone-100">
                    <tr>
                      <th className="p-4">UserID</th>
                      <th className="p-4">Username</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Company</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-neutral-700">
                    {users.map(u => {
                      const isDisabled = u.disabled === true;
                      const uProjects = projects.filter(p => 
                        p.developerId === u.id || 
                        p.developerName?.toLowerCase() === u.username?.toLowerCase() ||
                        (u.companyName && p.developerName?.toLowerCase() === u.companyName?.toLowerCase())
                      );

                      return (
                        <React.Fragment key={u.id}>
                          <tr 
                            className={`hover:bg-stone-50 transition-colors duration-150 cursor-pointer ${
                              expandedUserId === u.id ? "bg-amber-50/30 font-semibold" : "font-medium"
                            }`}
                            onClick={() => {
                              setExpandedUserId(expandedUserId === u.id ? null : u.id);
                              setExpandedProjectId(null);
                            }}
                          >
                            <td className="p-4 font-mono text-[10px] text-stone-500 flex items-center gap-2">
                              <span className="w-4 inline-block text-center text-amber-500">
                                {expandedUserId === u.id ? "▼" : "▶"}
                              </span>
                              {u.id}
                            </td>
                            <td className="p-4 text-neutral-900">
                              <div>
                                <span className="font-bold">{u.username}</span>
                                <span className="text-[10px] text-amber-600 bg-amber-50 font-mono font-bold px-1.5 py-0.5 rounded ml-2">
                                  {uProjects.length} listings
                                </span>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                                u.role === "SuperAdmin" ? "bg-orange-100 text-orange-850 text-orange-800" :
                                u.role === "Developer" ? "bg-amber-100 text-amber-850 text-amber-800" : "bg-neutral-100 text-neutral-850"
                              }`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="p-4 font-mono text-[10px] text-stone-500">{u.companyName || "Nairobi Co"}</td>
                            <td className="p-4">
                              <span className={`flex items-center gap-1.5 ${isDisabled ? "text-rose-500 font-black" : "text-emerald-500 font-bold"}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${isDisabled ? "bg-rose-500 animate-pulse" : "bg-emerald-500"}`}></span>
                                {isDisabled ? "SUSPENDED" : "ENABLED"}
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => handleToggleUserSuspension(u)}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-tight uppercase cursor-pointer ${
                                  isDisabled 
                                    ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100" 
                                    : "bg-amber-50 text-amber-850 hover:bg-amber-100 text-amber-800"
                                }`}
                              >
                                {isDisabled ? "Enable Access" : "Suspend (Disable)"}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(u)}
                                className="bg-stone-50 text-neutral-600 hover:bg-rose-50 hover:text-rose-600 p-1.5 rounded-lg inline-flex items-center justify-center transition-all cursor-pointer"
                                title="Delete permanently"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>

                          {/* Expansion drawer for properties listed by this developer */}
                          {expandedUserId === u.id && (
                            <tr className="bg-stone-50/50">
                              <td colSpan={6} className="p-5 border-t border-b border-stone-200">
                                <div className="space-y-4 max-w-4xl mx-auto">
                                  <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                                    <h5 className="text-[10px] font-black font-mono text-neutral-650 uppercase tracking-widest flex items-center gap-2">
                                      <span>🏢</span> PROPERTIES ASSIGNED TO THIS ROLE ({uProjects.length})
                                    </h5>
                                    <span className="text-[10px] text-neutral-400 italic">Click any card below to open approval fields</span>
                                  </div>

                                  {uProjects.length === 0 ? (
                                    <div className="p-5 bg-white rounded-2xl text-center text-stone-400 font-mono text-[11px] border border-stone-150">
                                      No property listings recognized for this user profile node.
                                    </div>
                                  ) : (
                                    <div className="space-y-3">
                                      {uProjects.map((proj) => {
                                        const pStatus = proj.approvalStatus || "Approved";
                                        const isProjExpanded = expandedProjectId === proj.id;
                                        return (
                                          <div 
                                            key={proj.id} 
                                            className="border border-stone-200 rounded-2xl overflow-hidden bg-white shadow-sm hover:border-amber-400/40 transition-all duration-300"
                                          >
                                            {/* Clickable Card Header */}
                                            <div 
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setExpandedProjectId(isProjExpanded ? null : proj.id);
                                              }}
                                              className="p-4 flex items-center justify-between gap-4 hover:bg-amber-400/[0.02] cursor-pointer select-none"
                                            >
                                              <div className="flex items-center gap-3">
                                                <span className="text-stone-400 text-xs font-semibold">
                                                  {isProjExpanded ? "▼" : "▶"}
                                                </span>
                                                <div>
                                                  <span className="font-extrabold text-xs text-neutral-900 block sm:inline">{proj.name}</span>
                                                  <span className="text-[9px] bg-stone-100 text-neutral-500 font-mono px-2 py-0.5 rounded uppercase ml-2">
                                                    {proj.location}
                                                  </span>
                                                </div>
                                              </div>
                                              
                                              <div className="flex items-center gap-2">
                                                <span className={`text-[9px] font-mono font-extrabold uppercase px-2 py-1 rounded-lg ${
                                                  pStatus === "Approved" ? "bg-emerald-100 text-emerald-800" :
                                                  pStatus === "Rejected" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-900"
                                                }`}>
                                                  {pStatus}
                                                </span>
                                              </div>
                                            </div>

                                            {/* Clickable Card Body Expansion */}
                                            {isProjExpanded && (
                                              <div 
                                                onClick={(e) => e.stopPropagation()} 
                                                className="p-4 bg-stone-50/50 border-t border-stone-150 space-y-4 text-xs animate-fade-in"
                                              >
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-[11px] font-mono mb-2">
                                                  <div><strong>Price Range:</strong> {proj.priceRange}</div>
                                                  <div><strong>ROI Estimate:</strong> {proj.roiRentalYield || "N/A"}</div>
                                                  <div><strong>Launch Status:</strong> {proj.completionDate}</div>
                                                  {proj.tiktokUrl && (
                                                    <div className="col-span-1 sm:col-span-2">
                                                      <strong>Tiktok URL:</strong> <a href={proj.tiktokUrl} target="_blank" rel="noreferrer" className="text-amber-600 underline font-bold">{proj.tiktokUrl}</a>
                                                    </div>
                                                  )}
                                                </div>

                                                <div className="space-y-1.5">
                                                  <label className="text-[10px] font-bold text-neutral-700 block uppercase tracking-wide">
                                                    Approval Status Reason / Inspector Feedback Field
                                                  </label>
                                                  <input 
                                                    type="text" 
                                                    value={moderationReason[proj.id] !== undefined ? moderationReason[proj.id] : (proj.lastModeratorReason || "")}
                                                    onChange={(e) => setModerationReason(prev => ({ ...prev, [proj.id]: e.target.value }))}
                                                    placeholder="Specify reasons for review action, approval note, or issues with listing..."
                                                    className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-white shadow-inner outline-none focus:border-amber-400"
                                                  />
                                                </div>

                                                <div className="flex justify-end gap-2 pt-3 border-t border-stone-150">
                                                  <button
                                                    type="button"
                                                    onClick={async (e) => {
                                                      e.stopPropagation();
                                                      try {
                                                        const resp = await fetch("/api/admin/projects/approve", {
                                                          method: "POST",
                                                          headers: { "Content-Type": "application/json" },
                                                          body: JSON.stringify({ 
                                                            projectId: proj.id, 
                                                            action: "approve", 
                                                            reason: moderationReason[proj.id] || "" 
                                                          })
                                                        });
                                                        if (resp.ok) {
                                                          alert(`Project "${proj.name}" listing approved successfully.`);
                                                          if (onRefreshProjects) onRefreshProjects();
                                                        }
                                                      } catch (err) {
                                                        console.error(err);
                                                      }
                                                    }}
                                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all active:scale-95 cursor-pointer shadow-sm"
                                                  >
                                                    Approve & Verify Listing
                                                  </button>
                                                  <button
                                                    type="button"
                                                    onClick={async (e) => {
                                                      e.stopPropagation();
                                                      try {
                                                        const resp = await fetch("/api/admin/projects/approve", {
                                                          method: "POST",
                                                          headers: { "Content-Type": "application/json" },
                                                          body: JSON.stringify({ 
                                                            projectId: proj.id, 
                                                            action: "reject", 
                                                            reason: moderationReason[proj.id] || "" 
                                                          })
                                                        });
                                                        if (resp.ok) {
                                                          alert(`Project "${proj.name}" listing flagged as disapproved.`);
                                                          if (onRefreshProjects) onRefreshProjects();
                                                        }
                                                      } catch (err) {
                                                        console.error(err);
                                                      }
                                                    }}
                                                    className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all active:scale-95 cursor-pointer shadow-sm"
                                                  >
                                                    Disapprove & Flag Listing
                                                  </button>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}

                                  {/* Account Credentials, Password Resets & Impersonation parameters */}
                                  <div className="pt-4 border-t border-stone-200">
                                    <UserCredentialsEditor
                                      user={u}
                                      onRefreshUsers={onRefreshUsers}
                                      onImpersonate={(impU) => onImpersonate(impU)}
                                    />
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 3: DEVELOPER PACKAGES PRICING MATRIX ================= */}
        {activeTab === "packages" && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-2xl font-sans font-black text-neutral-950 uppercase tracking-tight">SaaS Pricing Control Desk</h3>
            <p className="text-xs text-neutral-500">Edit real-time developer metrics pricing. Values adjusted here will be reflected on guest showcases to prompt conversions.</p>

            <form onSubmit={handleSavePackagesSubmit} className="space-y-6">
              {[
                { id: "pkg-starter", label: "Starter Partner Tier", desc: "For single property, up to 10 units configs.", usdState: pkgStarterUSD, usdSet: setPkgStarterUSD, kesState: pkgStarterKES, kesSet: setPkgStarterKES },
                { id: "pkg-pro", label: "Pro Multi-Tower Package (Popular)", desc: "For up to 5 properties, high limit inventory.", usdState: pkgProUSD, usdSet: setPkgProUSD, kesState: pkgProKES, kesSet: setPkgProKES },
                { id: "pkg-sovereign", label: "Sovereign Elite Enterprise Plan", desc: "Unlimited properties, bespoke virtual twins support.", usdState: pkgSovereignUSD, usdSet: setPkgSovereignUSD, kesState: pkgSovereignKES, kesSet: setPkgSovereignKES }
              ].map(pkg => (
                <div key={pkg.id} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
                  <div>
                    <strong className="text-xs uppercase font-extrabold text-neutral-900 block">{pkg.label}</strong>
                    <span className="text-[10px] text-neutral-400 block">{pkg.desc}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-mono text-stone-500 block mb-1">Standard Price (USD / Month)</label>
                      <input
                        type="number"
                        required
                        value={pkg.usdState}
                        onChange={(e) => pkg.usdSet(Number(e.target.value))}
                        className="w-full text-xs p-3 rounded-lg border border-stone-200 bg-white text-neutral-900 font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-stone-500 block mb-1">Kenya Shillings Price Equivalent (KES / Month)</label>
                      <input
                        type="number"
                        required
                        value={pkg.kesState}
                        onChange={(e) => pkg.kesSet(Number(e.target.value))}
                        className="w-full text-xs p-3 rounded-lg border border-stone-200 bg-white text-neutral-900 font-bold"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="submit"
                  disabled={savingPackages}
                  className="bg-neutral-900 text-white hover:bg-neutral-850 px-8 py-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {savingPackages ? "Dispersing Indexes..." : "Publish Packages Matrix"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= TAB 4: HOMEPAGE SETTINGS AND TOGGLES ================= */}
        {activeTab === "homepage" && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-2xl font-sans font-black text-neutral-950 uppercase tracking-tight">Homepage Rendering & Launch Controls</h3>
            <p className="text-xs text-neutral-500">Enable or disable homepage widgets directly. This map dictates visibility schemas across unauthenticated public entries instantly.</p>

            <form onSubmit={handleSaveHomepageSettings} className="space-y-6">
              
              {/* Widgets visibility toggles grid */}
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
                <strong className="text-xs uppercase font-bold text-neutral-800 tracking-wider block border-b border-stone-100 pb-2">Active Web Landing Section Visibility Map</strong>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {[
                    { state: showHero, set: setShowHero, title: "Hero Offplan Countdown Header", badge: "Hero Container" },
                    { state: showStats, set: setShowStats, title: "Nairobi Market Metrics Counters", badge: "Stats Ledger" },
                    { state: showShowcase, set: setShowShowcase, title: "Sovereign Visual Apartments Slider", badge: "Property Showcase" },
                    { state: showROI, set: setShowROI, title: "Affiliated Yield & ROI Ledger Calculator", badge: "Financial Module" },
                    { state: showMatterport, set: setShowMatterport, title: "Full-Scale 3D Virtual Walkthrough Area", badge: "Matterport Embed" },
                    { state: showDevSaaS, set: setShowDevSaaS, title: "Developer SaaS Platform Callouts UI", badge: "Marketing Pitch" },
                    { state: showSupport, set: setShowSupport, title: "Unified Ticketing Support Help Desk", badge: "Support Hub" }
                  ].map((sec, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3.5 bg-stone-50 rounded-xl border border-stone-150">
                      <div>
                        <span className="text-xs font-black text-neutral-850 block">{sec.title}</span>
                        <span className="text-[8px] font-mono text-stone-400 block uppercase font-bold tracking-widest">{sec.badge}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => sec.set(!sec.state)}
                        className={`text-[10px] px-3 py-1.5 rounded-lg font-bold font-mono uppercase tracking-wider transition-all cursor-pointer ${
                          sec.state ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-neutral-200 text-neutral-600 border border-neutral-300"
                        }`}
                      >
                        {sec.state ? "Active" : "Disabled"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Homepage Featured Listings & Positions Control requested by SuperAdmin */}
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
                <div className="border-b border-stone-100 pb-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <strong className="text-xs uppercase font-bold text-neutral-850 tracking-wider block">Homepage Featured Listings & Positions Control</strong>
                    <p className="text-[10px] text-neutral-500 mt-0.5">Determine exactly which developer products/listings appear on the public homepage and rearrange their ranking positions/order.</p>
                  </div>
                  <span className="bg-amber-100 text-neutral-950 font-mono font-extrabold text-[9px] uppercase px-2.5 py-1 rounded-full shrink-0">
                    Live Escrow Catalog
                  </span>
                </div>

                <div className="space-y-3 pt-2">
                  {projects.map((proj) => {
                    const isFeatured = featuredProjectIds.includes(proj.id);
                    const featuredIndex = featuredProjectIds.indexOf(proj.id);

                    return (
                      <div key={proj.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-150 gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center overflow-hidden shrink-0">
                            {proj.virtualTourMedia?.livingRoom ? (
                              <img src={proj.virtualTourMedia.livingRoom} alt={`${proj.name} - Luxury ${proj.type || "Apartment"} in ${proj.location}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <span className="text-amber-500 text-xs font-bold">PS</span>
                            )}
                          </div>
                          <div>
                            <span className="text-neutral-900 font-extrabold text-xs block leading-tight">{proj.name}</span>
                            <span className="text-[10px] font-mono text-stone-500 block uppercase tracking-wide">
                              By: {proj.developerName} • Loc: {proj.location}
                            </span>
                            {isFeatured ? (
                              <span className="inline-flex mt-1 items-center bg-amber-50 border border-amber-205 text-amber-800 font-mono text-[9px] font-black px-2 py-0.5 rounded">
                                ★ Featured Position {featuredIndex + 1}
                              </span>
                            ) : (
                              <span className="inline-flex mt-1 items-center bg-stone-100 border border-stone-200 text-stone-550 font-mono text-[9px] px-2 py-0.5 rounded">
                                Hidden From Homepage (Upcoming catalog pool)
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggleFeaturedProject(proj.id)}
                            className={`text-[10px] px-4 py-2 rounded-xl font-bold font-mono uppercase tracking-wider transition-all cursor-pointer ${
                              isFeatured 
                                ? "bg-amber-450 hover:bg-amber-400 text-neutral-900 font-extrabold" 
                                : "bg-white border border-stone-200 text-stone-605 hover:bg-stone-50"
                            }`}
                          >
                            {isFeatured ? "Featured" : "Hidden"}
                          </button>

                          {isFeatured && (
                            <div className="flex gap-1">
                              <button
                                type="button"
                                disabled={featuredIndex <= 0}
                                onClick={() => moveProjectPosition(proj.id, "up")}
                                className="p-2 border border-stone-200 bg-white rounded-xl hover:bg-stone-50 text-neutral-600 disabled:opacity-30 cursor-pointer text-xs"
                                title="Move Up"
                              >
                                ▲
                              </button>
                              <button
                                type="button"
                                disabled={featuredIndex === -1 || featuredIndex === featuredProjectIds.length - 1}
                                onClick={() => moveProjectPosition(proj.id, "down")}
                                className="p-2 border border-stone-200 bg-white rounded-xl hover:bg-stone-50 text-neutral-600 disabled:opacity-30 cursor-pointer text-xs"
                                title="Move Down"
                              >
                                ▼
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Video Feed & Global notice message */}
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
                <strong className="text-xs uppercase font-bold text-neutral-800 tracking-wider block">Central Launch Video & Public Broadcast Announcement</strong>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-mono font-bold text-stone-500 block mb-1">Landing Launch Video URL (Youtube / iframe embed compatible)</label>
                    <input
                      type="text"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="e.g. https://www.youtube.com/embed/dQw4w9WgXcQ"
                      className="w-full text-xs p-3 rounded-lg border border-stone-200 bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono font-bold text-stone-500 block mb-1">Prop Drops™ Live Event Video URL (Youtube, Vimeo, or self-hosted video source - embedded iframe link)</label>
                    <input
                      type="text"
                      value={dropVideoUrl}
                      onChange={(e) => setDropVideoUrl(e.target.value)}
                      placeholder="e.g. https://www.youtube.com/embed/gEPXb0F0vmo?autoplay=1&mute=1&controls=0&loop=1&playlist=gEPXb0F0vmo"
                      className="w-full text-xs p-3 rounded-lg border border-stone-200 bg-white font-mono text-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono font-bold text-stone-500 block mb-1">Central Banner Platform notice (Bypasses local state alerts)</label>
                    <textarea
                      rows={2}
                      value={noticeMsg}
                      onChange={(e) => setNoticeMsg(e.target.value)}
                      placeholder="e.g. SPECIAL LAUNCH: 20% holding deposit standard applies Nairobi developments. Book immediately."
                      className="w-full text-xs p-3 rounded-lg border border-stone-200 bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="submit"
                  disabled={savingHomepage}
                  className="bg-neutral-900 text-white hover:bg-neutral-850 px-8 py-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {savingHomepage ? "Syncing Modules..." : "Publish Layout Configurations"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= TAB 5: SUPPORT TICKETS RECEPTION DESK ================= */}
        {activeTab === "tickets" && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-2xl font-sans font-black text-neutral-950 uppercase tracking-tight">Support Desk Center</h3>
            <p className="text-xs text-neutral-500">Incoming tickets and inquiries submitted by Nairobi developers or buyers. Ensure proper assistance replies.</p>

            <div className="space-y-4">
              {tickets.length === 0 ? (
                <div className="bg-stone-50 p-8 rounded-3xl border border-stone-200 text-center text-xs text-neutral-500 font-mono">
                  No active support inquiries pending inside ledger inbox.
                </div>
              ) : (
                tickets.map(t => {
                  const isPending = t.status === "Pending";
                  const isSelected = selectedTicketId === t.id;
                  
                  return (
                    <div 
                      key={t.id} 
                      className={`p-6 rounded-3xl border flex flex-col justify-between gap-4 transition-all ${
                        isPending ? "bg-white border-amber-305 border-amber-300 shadow-sm" : "bg-white border-neutral-150 text-neutral-500"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <span className="bg-neutral-100 text-neutral-800 text-[8px] font-mono font-bold uppercase px-2 py-0.5 rounded">
                            ID: {t.id}
                          </span>
                          <span className={`ml-2 text-[8px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                            isPending ? "bg-amber-100 text-amber-805 text-amber-900" : "bg-stone-100 text-stone-500"
                          }`}>
                            {t.status}
                          </span>
                          <h4 className="text-sm font-black text-neutral-950 pt-2">{t.subject}</h4>
                          <span className="text-[10px] text-stone-400 block mt-0.5">
                            Created by: <strong>{t.creatorName}</strong> ({t.email}) • Plan: {t.userRole}
                          </span>
                        </div>
                        <span className="text-[9px] text-neutral-400 font-mono">{t.createdAt}</span>
                      </div>

                      <div className="bg-stone-50 p-4 rounded-xl text-xs text-neutral-700 font-medium whitespace-pre-line leading-relaxed border border-stone-100 italic">
                        "{t.message}"
                      </div>

                      {t.replyText && (
                        <div className="bg-orange-50/40 p-4 rounded-xl text-xs text-neutral-800 leading-relaxed border border-orange-100">
                          <strong>Admin Dispatch Reply:</strong>
                          <p className="mt-1 font-semibold">{t.replyText}</p>
                        </div>
                      )}

                      {isPending && !isSelected && (
                        <div className="flex justify-end pt-1">
                          <button
                            onClick={() => {
                              setSelectedTicketId(t.id);
                              setTicketReply("");
                            }}
                            className="bg-neutral-950 hover:bg-neutral-850 text-white font-extrabold text-[10px] uppercase tracking-wider px-5 py-2.5 rounded-xl cursor-pointer"
                          >
                            Reply to Developer
                          </button>
                        </div>
                      )}

                      {isSelected && (
                        <form onSubmit={handleTicketReplySubmit} className="space-y-3 pt-2 border-t border-stone-100">
                          <label className="text-[10px] font-mono font-bold text-neutral-600 block">Dispatch Reply Body</label>
                          <textarea
                            rows={3}
                            required
                            value={ticketReply}
                            onChange={(e) => setTicketReply(e.target.value)}
                            placeholder="Specify official advice or operational instructions for active ticket resolution..."
                            className="w-full text-xs p-3 rounded-lg border border-stone-200 bg-white"
                          />
                          <div className="flex justify-end gap-2 text-xs font-bold">
                            <button
                              type="button"
                              onClick={() => setSelectedTicketId(null)}
                              className="px-4 py-2 border border-stone-200 rounded-lg text-neutral-600 hover:bg-stone-50"
                            >
                              Abort
                            </button>
                            <button
                              type="submit"
                              disabled={replying}
                              className="bg-orange-500 text-neutral-950 px-5 py-2 hover:bg-orange-600 rounded-lg font-extrabold"
                            >
                              {replying ? "Dispatching..." : "Send Advice"}
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ================= TAB: AI-POWERED BLOGS HUB ================= */}
        {activeTab === "blogs-hub" && (
          <div className="space-y-6 animate-fade-in">
            <AdminBlogsHub />
          </div>
        )}

        {/* ================= TAB: LISTINGS & DEVELOPER APPROVALS ================= */}
        {activeTab === "listings" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-4">
              <div>
                <h3 className="text-2xl font-sans font-black text-neutral-950 uppercase tracking-tight">Listing Approvals & Developer Audits</h3>
                <p className="text-xs text-neutral-500">Moderation desk for Super Administrators to vet offplan developments, review specifications, and verify or suspend developer profiles.</p>
              </div>
            </div>

            {/* Sub-tab selection */}
            <div className="flex border-b border-stone-200 gap-4 mb-2">
              <button
                type="button"
                onClick={() => setListingsSubTab("approvals")}
                className={`pb-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                  listingsSubTab === "approvals"
                    ? "border-orange-500 text-orange-650 font-black"
                    : "border-transparent text-stone-500 hover:text-stone-800"
                }`}
              >
                👥 Developer Approvals ({projects.length})
              </button>
              <button
                type="button"
                onClick={() => setListingsSubTab("direct")}
                className={`pb-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                  listingsSubTab === "direct"
                    ? "border-orange-500 text-orange-650 font-black"
                    : "border-transparent text-stone-500 hover:text-stone-800"
                }`}
              >
                👑 Publish Super Admin Direct Listing (No Subscription Required)
              </button>
            </div>

            {listingsSubTab === "approvals" && (
              <div className="space-y-4">
                <h4 className="text-sm font-black font-mono text-neutral-800 uppercase tracking-wider">📦 Property Listings Catalog ({projects.length})</h4>
              {projects.length === 0 ? (
                <div className="bg-stone-50 p-8 rounded-3xl border border-stone-200 text-center text-xs text-neutral-500 font-mono">
                  No property listings registered on the nodes yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {projects.map((proj) => {
                    const status = proj.approvalStatus || "Approved";
                    const isDeveloperVerified = proj.developerVerified;
                    
                    return (
                      <div key={proj.id} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-base font-black text-neutral-950">{proj.name}</h4>
                              <span className="text-[10px] bg-stone-100 text-neutral-600 font-mono font-bold px-2 py-0.5 rounded">
                                ID Slug: {proj.id}
                              </span>
                            </div>
                            <p className="text-xs text-neutral-500 mt-1">
                              Developer: <span className="font-bold text-neutral-800">{proj.developerName}</span> ({proj.developerId})
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-lg ${
                              status === "Approved" ? "bg-emerald-100 text-emerald-800" :
                              status === "Rejected" ? "bg-red-100 text-red-800" :
                              "bg-amber-100 text-amber-850 text-amber-900"
                            }`}>
                              Listing: {status}
                            </span>
                            <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-lg ${
                              isDeveloperVerified ? "bg-blue-100 text-blue-800" : "bg-neutral-100 text-neutral-600"
                            }`}>
                              Developer: {isDeveloperVerified ? "Verified" : "Unverified"}
                            </span>
                          </div>
                        </div>

                        <div className="p-3.5 bg-stone-50 border border-stone-150 rounded-2xl text-xs space-y-1.5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-[11px] font-mono">
                            <div><strong>Location:</strong> {proj.location}</div>
                            <div><strong>Price:</strong> {proj.priceRange}</div>
                            <div><strong>ROI Yield:</strong> {proj.roiRentalYield || "TBD"}</div>
                            <div><strong>Completion:</strong> {proj.completionDate}</div>
                          </div>
                          <p className="text-neutral-650 italic text-[11px] font-medium leading-relaxed mt-1">
                            "{proj.tagline || 'No tagline specified.'}"
                          </p>
                        </div>

                        {/* Actions for this project item */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-stone-100">
                          <span className="text-[10px] font-mono text-neutral-400">Moderate this property listing</span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={async () => {
                                if (confirm(`Are you sure you want to approve "${proj.name}" listing?`)) {
                                  try {
                                    const resp = await fetch("/api/admin/projects/approve", {
                                      method: "POST",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ projectId: proj.id, action: "approve" })
                                    });
                                    if (resp.ok) {
                                      alert(`Project "${proj.name}" listing approved successfully!`);
                                      if (onRefreshProjects) onRefreshProjects();
                                    } else {
                                      alert("Failed to submit approval.");
                                    }
                                  } catch (err) {
                                    console.error(err);
                                  }
                                }
                              }}
                              disabled={status === "Approved"}
                              className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider cursor-pointer ${
                                status === "Approved"
                                  ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                                  : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm active:scale-95 transition-all"
                              }`}
                            >
                              Approve Listing
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                if (confirm(`Are you sure you want to reject "${proj.name}" listing?`)) {
                                  try {
                                    const resp = await fetch("/api/admin/projects/approve", {
                                      method: "POST",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ projectId: proj.id, action: "reject" })
                                    });
                                    if (resp.ok) {
                                      alert(`Project "${proj.name}" listing rejected successfully.`);
                                      if (onRefreshProjects) onRefreshProjects();
                                    } else {
                                      alert("Failed to submit rejection.");
                                    }
                                  } catch (err) {
                                    console.error(err);
                                  }
                                }
                              }}
                              disabled={status === "Rejected"}
                              className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider cursor-pointer ${
                                status === "Rejected"
                                  ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                                  : "bg-rose-600 hover:bg-rose-700 text-white shadow-sm active:scale-95 transition-all"
                              }`}
                            >
                              Reject Listing
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {listingsSubTab === "direct" && (
            <form onSubmit={handleCreateDirectListing} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-6 animate-fade-in text-left">
              <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
                <div>
                  <strong className="text-sm font-black font-mono text-neutral-850 uppercase tracking-wider">👑 Central Direct Property Creation System</strong>
                  <p className="text-[10px] text-stone-500 mt-0.5">SuperAdmin direct properties bypass developer subscription package limits, and appear directly as PropSphere verified assets.</p>
                </div>
                <span className="bg-orange-100 text-orange-900 border border-orange-200 text-[9px] font-mono font-black uppercase px-2.5 py-1 rounded-full shrink-0">
                  Global direct syndication
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Basic Info */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block font-bold">Property Name / Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dubai Marina Heights"
                    value={directName}
                    onChange={(e) => {
                      setDirectName(e.target.value);
                      if (!directId) {
                        setDirectId(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
                      }
                    }}
                    className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white transition-all outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block font-bold">Unique ID / URL Slug</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. dubai-marina-heights"
                    value={directId}
                    onChange={(e) => setDirectId(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"))}
                    className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white transition-all outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block font-bold">Location Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Westlands, Nairobi or Dubai Marina, Dubai"
                    value={directLocation}
                    onChange={(e) => setDirectLocation(e.target.value)}
                    className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white transition-all outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block font-bold">Catchy Tagline</label>
                  <input
                    type="text"
                    placeholder="e.g. Ultra luxury overlooking the city skyline"
                    value={directTagline}
                    onChange={(e) => setDirectTagline(e.target.value)}
                    className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white transition-all outline-none"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block font-bold">Detailed Property Description</label>
                  <textarea
                    placeholder="Provide exhaustive descriptions of the building frame structures, security systems, interior fixtures..."
                    value={directDescription}
                    onChange={(e) => setDirectDescription(e.target.value)}
                    rows={4}
                    className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white transition-all outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block font-bold">Price Grid / Range</label>
                  <input
                    type="text"
                    placeholder="e.g. Ksh 25,000,000 or $180,000"
                    value={directPriceRange}
                    onChange={(e) => setDirectPriceRange(e.target.value)}
                    className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white transition-all outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block font-bold">Estimated Handover / Completion Date</label>
                  <input
                    type="text"
                    placeholder="e.g. Q4 2028"
                    value={directCompletionDate}
                    onChange={(e) => setDirectCompletionDate(e.target.value)}
                    className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white transition-all outline-none"
                  />
                </div>

                {/* Financial metrics */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block font-bold">Expected Net Rental Yield</label>
                  <input
                    type="text"
                    placeholder="e.g. 11.8%"
                    value={directRoiRental}
                    onChange={(e) => setDirectRoiRental(e.target.value)}
                    className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white transition-all outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block font-bold">Annual Capital Appreciations</label>
                  <input
                    type="text"
                    placeholder="e.g. 14.5%"
                    value={directRoiCapital}
                    onChange={(e) => setDirectRoiCapital(e.target.value)}
                    className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white transition-all outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block font-bold">Required Deposit (%)</label>
                  <input
                    type="number"
                    placeholder="e.g. 10"
                    value={directDepositPercent}
                    onChange={(e) => setDirectDepositPercent(Number(e.target.value))}
                    className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white transition-all outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block font-bold">Sales Specialist WhatsApp Contact</label>
                  <input
                    type="text"
                    placeholder="e.g. +254700000000"
                    value={directWhatsapp}
                    onChange={(e) => setDirectWhatsapp(e.target.value)}
                    className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white transition-all outline-none"
                  />
                </div>

                {/* Multimedia paths */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block font-bold">Drone Walkthrough Video URL (Embed Link)</label>
                  <input
                    type="text"
                    placeholder="e.g. https://www.youtube.com/embed/..."
                    value={directDroneUrl}
                    onChange={(e) => setDirectDroneUrl(e.target.value)}
                    className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white transition-all outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block font-bold">Matterport VR / Digital Twin URL Link</label>
                  <input
                    type="text"
                    placeholder="e.g. https://my.matterport.com/show/?m=..."
                    value={directVrUrl}
                    onChange={(e) => setDirectVrUrl(e.target.value)}
                    className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white transition-all outline-none font-mono"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block font-bold">TikTok Promotion Embed IDs (Comma Separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. 71234567891234, 71234567895678"
                    value={directTikTok}
                    onChange={(e) => setDirectTikTok(e.target.value)}
                    className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white transition-all outline-none font-mono"
                  />
                </div>
              </div>

              <div className="bg-stone-50 p-5 rounded-2xl border border-stone-150 flex flex-col sm:flex-row gap-6">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-black text-neutral-850">
                  <input
                    type="checkbox"
                    checked={directIsInternational}
                    onChange={(e) => setDirectIsInternational(e.target.checked)}
                    className="w-4 h-4 rounded text-orange-500 accent-orange-500"
                  />
                  <span>🌍 IS INTERNATIONAL (DUBAI / GLOBAL LUXURY ESTATE)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-black text-neutral-850">
                  <input
                    type="checkbox"
                    checked={directIsFeatured}
                    onChange={(e) => setDirectIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-orange-500 accent-orange-500"
                  />
                  <span>★ FEATURE DIRECTLY AT THE TOP OF PROPERTIES LISTINGS PAGE</span>
                </label>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  disabled={creatingDirect}
                  className="bg-neutral-950 hover:bg-neutral-900 border border-neutral-850 text-amber-400 font-extrabold text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-xl cursor-pointer transition-all disabled:opacity-50"
                >
                  {creatingDirect ? "Publishing direct nodes..." : "👑 Publish Direct Verified Property Listing"}
                </button>
              </div>
            </form>
          )}

          {/* List of Registered Developers with Audits */}
            <div className="space-y-4 pt-4">
              <h4 className="text-sm font-black font-mono text-neutral-800 uppercase tracking-wider">🏢 Registered Developer Entities ({users.filter(u => u.role === "Developer").length})</h4>
              <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden divide-y divide-stone-100">
                {users.filter(u => u.role === "Developer").map((dev) => {
                  const isSuspended = dev.disabled;
                  
                  return (
                    <div key={dev.id} className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-stone-50/50 transition-all">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-sm text-neutral-900 font-bold">{dev.username}</strong>
                          <span className="text-[9px] bg-stone-100 text-neutral-500 font-mono px-2 py-0.5 rounded">ID: {dev.id}</span>
                        </div>
                        <p className="text-xs text-neutral-500 mt-1">{dev.email}</p>
                        {dev.companyName && (
                          <span className="text-[10px] font-mono text-amber-700 block mt-0.5 font-bold">Company: {dev.companyName}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-lg ${
                          isSuspended ? "bg-stone-100 text-stone-500" : "bg-emerald-100 text-emerald-900"
                        }`}>
                          Account: {isSuspended ? "Suspended / Rejected" : "Active & Verified"}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={async () => {
                              if (confirm(`Approve and verify developer account for "${dev.username}"?`)) {
                                try {
                                  const resp = await fetch("/api/admin/projects/approve", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ developerId: dev.id, devAction: "approve" })
                                  });
                                  if (resp.ok) {
                                    alert(`Developer "${dev.username}" approved and verified successfully!`);
                                    onRefreshUsers();
                                    if (onRefreshProjects) onRefreshProjects();
                                  } else {
                                    alert("Approval request failed.");
                                  }
                                } catch (err) {
                                  console.error(err);
                                }
                              }
                            }}
                            disabled={!isSuspended}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer ${
                              !isSuspended
                                ? "bg-stone-50 text-stone-300 cursor-not-allowed border border-stone-200"
                                : "bg-emerald-600 hover:bg-emerald-700 text-white"
                            }`}
                          >
                            Approve/Verify
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              if (confirm(`Are you sure you want to reject/suspend Developer "${dev.username}"?`)) {
                                try {
                                  const resp = await fetch("/api/admin/projects/approve", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ developerId: dev.id, devAction: "reject" })
                                  });
                                  if (resp.ok) {
                                    alert(`Developer "${dev.username}" has been suspended & rejected.`);
                                    onRefreshUsers();
                                    if (onRefreshProjects) onRefreshProjects();
                                  } else {
                                    alert("Suspension request failed.");
                                  }
                                } catch (err) {
                                  console.error(err);
                                }
                              }
                            }}
                            disabled={isSuspended}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer ${
                              isSuspended
                                ? "bg-stone-50 text-stone-300 cursor-not-allowed border border-stone-200"
                                : "bg-rose-600 hover:bg-rose-700 text-white"
                            }`}
                          >
                            Reject/Suspend
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === "services" && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-4">
              <div>
                <h3 className="text-2xl font-sans font-black text-neutral-950 uppercase tracking-tight">Professional Services & Commissions Registry</h3>
                <p className="text-xs text-neutral-500">Global ledger containing coneyancing chambers, certified valuers, mortgage broker nodes, interior designers, and moving contractors.</p>
              </div>
              <button 
                type="button" 
                onClick={loadSrvProviders} 
                className="bg-neutral-950 hover:bg-neutral-800 text-amber-400 font-mono text-[9px] uppercase tracking-wider px-4 py-2 rounded-xl"
              >
                Refresh Nodes
              </button>
            </div>

            {/* Commissions aggregation ledger card */}
            <div className="bg-neutral-950 text-white rounded-3xl p-6 border border-neutral-850 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-stone-500 font-bold block mb-1">PROPSPHERE COMMISSION SUMMARY</span>
                  <div className="flex items-baseline gap-2">
                    <strong className="text-3xl font-black text-white font-mono">
                      KES {Math.round(
                        srvProviders.reduce((sum, p) => {
                          const baseUsd = p.priceCurrency === 'KES' ? p.startingPrice / 130 : p.startingPrice;
                          const jobs = p.completedJobs || 0;
                          return sum + (baseUsd * jobs * 0.15 * 130);
                        }, 0)
                      ).toLocaleString()}
                    </strong>
                    <span className="text-xs text-emerald-450 font-bold">~ 15% Standard Fee cut</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[9px] font-mono text-stone-500 block">TOTAL BOOKINGS SOURCED</span>
                  <strong className="text-white text-xl font-bold font-mono">
                    {srvProviders.reduce((sum, p) => sum + (p.completedJobs || 0), 0)} Jobs
                  </strong>
                </div>
              </div>
            </div>

            {/* List */}
            {srvLoading ? (
              <div className="py-12 bg-white rounded-3xl border border-stone-200 text-center font-mono text-xs text-neutral-500">
                Contacting centralized services coordinator node...
              </div>
            ) : srvProviders.length === 0 ? (
              <div className="py-12 bg-white rounded-3xl border border-dashed border-stone-250 text-center font-sans text-xs text-stone-500">
                No registered service advisor nodes detected.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {srvProviders.map((p) => {
                  const pricingText = p.priceCurrency === "KES" ? `KES ${Number(p.startingPrice).toLocaleString()}` : `$${p.startingPrice}`;
                  const jobsCount = p.completedJobs || 0;
                  const estimatedGrossUsd = (p.priceCurrency === "KES" ? p.startingPrice / 130 : p.startingPrice) * jobsCount;
                  const estimatedCommKes = estimatedGrossUsd * 0.15 * 130;

                  return (
                    <div key={p.id} className="bg-white border border-stone-200 rounded-3xl p-5 hover:border-neutral-350 transition-all">
                      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                          {p.logo && (
                            <img 
                              src={p.logo} 
                              alt="BrandLogo" 
                              className="w-12 h-12 object-cover rounded-2xl border border-stone-150 shrink-0" 
                              referrerPolicy="no-referrer"
                            />
                          )}
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <strong className="text-[14px] font-bold text-neutral-900 leading-none">{p.businessName}</strong>
                              <span className={`text-[8px] font-mono uppercase font-bold tracking-widest px-2 py-0.5 rounded-full ${
                                p.verificationStatus === "approved" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" :
                                p.verificationStatus === "rejected" ? "bg-rose-50 text-rose-600 border border-rose-250" :
                                "bg-amber-50 text-amber-600 border border-amber-200"
                              }`}>
                                {p.verificationStatus}
                              </span>
                            </div>
                            <p className="text-[11px] text-neutral-500 font-sans">
                              Representative: <span className="font-semibold text-neutral-800">{p.ownerName}</span> ({p.email})
                            </p>
                            <div className="text-[10px] font-mono text-stone-400 space-x-2">
                              <span>CATEGORY: <strong className="text-[#333] uppercase">{p.category}</strong></span>
                              <span>•</span>
                              <span>LICENSE: <strong className="text-[#333]">{p.licenseNumber}</strong></span>
                              <span>•</span>
                              <span>EXPERIENCE: <strong className="text-[#333]">{p.yearsExperience} yrs</strong></span>
                            </div>
                          </div>
                        </div>

                        {/* Commissions ledger stats */}
                        <div className="bg-stone-50 border border-stone-150 rounded-2xl p-3 px-4 min-w-[180px] text-right text-xs space-y-1">
                          <span className="text-[9px] font-mono text-stone-400 uppercase tracking-wider block">Commission Sourced</span>
                          <div className="font-mono text-neutral-850 font-bold">
                            KES {Math.round(estimatedCommKes).toLocaleString()}
                          </div>
                          <span className="text-[9px] font-mono text-neutral-400 block tracking-tight">
                            ({jobsCount} Completed at starting fee of {pricingText})
                          </span>
                        </div>
                      </div>

                      {/* Bio display */}
                      <p className="text-xs text-stone-600 bg-stone-50/50 p-3 rounded-2xl border border-stone-100 mt-4 leading-relaxed">
                        {p.description}
                      </p>

                      {/* Master Admin Controls */}
                      <div className="mt-4 pt-4 border-t border-stone-150 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-stone-400">
                          REGISTERED ON CHANNEL: {p.createdAt ? p.createdAt.split("T")[0] : "Corporate launch"}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleRejectSrv(p.id)}
                            disabled={p.verificationStatus === "rejected"}
                            className="bg-rose-50 border border-rose-150 hover:bg-rose-100 text-rose-600 font-mono uppercase tracking-wider font-extrabold text-[9px] py-1.5 px-3 rounded-lg disabled:opacity-50"
                          >
                            Reject / Suspend Node
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApproveSrv(p.id)}
                            disabled={p.verificationStatus === "approved"}
                            className="bg-[#111] hover:bg-black text-[#fff] font-mono uppercase tracking-wider font-extrabold text-[9px] py-1.5 px-4 rounded-lg disabled:opacity-50"
                          >
                            Approve & Certify Node
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "gateways" && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <h3 className="text-2xl font-sans font-black text-neutral-950 uppercase tracking-tight">💳 Central Payment Gateway Command</h3>
                <p className="text-xs text-neutral-500">Enable, configure, and lock M-Pesa dynamic STK push checkout parameters, check connectivity, and dispatch billing hooks to developer portfolios.</p>
              </div>
            </div>

            {loadingGateway ? (
              <div className="py-12 bg-white rounded-3xl border border-stone-200 text-center font-mono text-xs text-stone-500">
                Opening key vault files...
              </div>
            ) : (
              <form onSubmit={handleSaveGatewaySettings} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-6">
                
                {/* Mpesa Banner status */}
                <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <strong className="text-neutral-900 text-sm font-extrabold flex items-center gap-2">
                      <Lock className="w-4 h-4 text-amber-650" /> SAFARICOM MPESA ONLINE DARAJAS EXPRESS
                    </strong>
                    <p className="text-[10px] text-stone-500">M-Pesa Daraja API triggers immediate C2B STK Prompt pushes to developer devices upon checkout requests.</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase text-stone-500">State:</span>
                    <button
                      type="button"
                      onClick={() => setGatewayActive(!gatewayActive)}
                      className={`text-[10px] px-4 py-2 rounded-xl font-bold font-mono uppercase tracking-wider transition-all cursor-pointer ${
                        gatewayActive ? "bg-emerald-600 text-white shadow-md hover:bg-emerald-500" : "bg-neutral-200 text-neutral-600 border border-neutral-300"
                      }`}
                    >
                      {gatewayActive ? "● Gateway Active" : "Disabled"}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block font-bold">M-Pesa Business Shortcode / Paybill Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 174379 (Sandbox) or Production Paybill"
                      value={gatewayPaybill}
                      onChange={(e) => setGatewayPaybill(e.target.value)}
                      className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white transition-all font-mono outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block font-bold">Lipa Na M-Pesa Online Passkey</label>
                    <input
                      type="password"
                      required
                      placeholder="bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"
                      value={gatewayPasskey}
                      onChange={(e) => setGatewayPasskey(e.target.value)}
                      className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white transition-all font-mono outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block font-bold">Daraja Consumer Key</label>
                    <input
                      type="password"
                      required
                      placeholder="Enter Safaricom developer consumer key"
                      value={gatewayConsumerKey}
                      onChange={(e) => setGatewayConsumerKey(e.target.value)}
                      className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white transition-all font-mono outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block font-bold">Daraja Consumer Secret</label>
                    <input
                      type="password"
                      required
                      placeholder="Enter Safaricom developer consumer secret"
                      value={gatewayConsumerSecret}
                      onChange={(e) => setGatewayConsumerSecret(e.target.value)}
                      className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white transition-all font-mono outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block font-bold">B2C/C2B Portal Initiator Name (Production only)</label>
                    <input
                      type="text"
                      placeholder="e.g. initiator-agent"
                      value={gatewayInitiatorName}
                      onChange={(e) => setGatewayInitiatorName(e.target.value)}
                      className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white transition-all font-mono outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block font-bold">Initiator Password (Encrypted)</label>
                    <input
                      type="password"
                      placeholder="Enter initiator credential block"
                      value={gatewayInitiatorPassword}
                      onChange={(e) => setGatewayInitiatorPassword(e.target.value)}
                      className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white transition-all font-mono outline-none"
                    />
                  </div>
                </div>

                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-150 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-0.5">
                    <strong className="text-neutral-900 text-xs font-bold block"> Daraja Sandbox Simulator Mode</strong>
                    <p className="text-[10px] text-stone-500">With sandbox mode enabled, checkout calls are routed to Safaricom API staging endpoints (shortcode 174379).</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setGatewayIsSandbox(!gatewayIsSandbox)}
                    className={`text-[10px] px-4 py-2 rounded-xl font-bold font-mono uppercase tracking-wider transition-all cursor-pointer ${
                      gatewayIsSandbox ? "bg-amber-450 text-neutral-900 font-extrabold" : "bg-neutral-900 text-white shadow-md hover:bg-black"
                    }`}
                  >
                    {gatewayIsSandbox ? "★ Sandbox Enabled" : "● Live Production"}
                  </button>
                </div>

                {gatewayTestResult && (
                  <div className={`p-4 rounded-2xl border flex flex-col gap-1.5 text-left transition-all ${
                    gatewayTestResult.success 
                      ? "bg-emerald-50 border-emerald-200 text-emerald-900" 
                      : "bg-rose-50 border-rose-200 text-rose-905 text-rose-900"
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${gatewayTestResult.success ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
                      <strong className="text-xs uppercase tracking-wider font-mono font-bold">
                        {gatewayTestResult.success ? "API Handshake Active" : "Handshake Failed"}
                      </strong>
                    </div>
                    <p className="text-[11px] leading-relaxed font-mono font-medium">{gatewayTestResult.message}</p>
                  </div>
                )}

                <div className="flex justify-end gap-2.5 border-t border-stone-100 pt-5">
                  <button
                    type="button"
                    disabled={testingGateway || savingGateway}
                    onClick={handleTestGatewayConnection}
                    className="bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 border border-stone-300 font-extrabold text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-xl cursor-pointer transition-all disabled:opacity-50"
                  >
                    {testingGateway ? "⚡ Executing Diagnostics..." : "⚡ Test Connection"}
                  </button>
                  <button
                    type="submit"
                    disabled={savingGateway || testingGateway}
                    className="bg-neutral-950 hover:bg-neutral-800 border border-neutral-850 text-amber-400 font-extrabold text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-xl cursor-pointer transition-all disabled:opacity-50"
                  >
                    {savingGateway ? "Synchronizing Vault Creds..." : "🔒 Lock & Save M-Pesa Keys"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {activeTab === "other-listings" && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <h3 className="text-2xl font-sans font-black text-neutral-950 uppercase tracking-tight">🏞️ Land & Upmarket Plots Desk</h3>
                <p className="text-xs text-neutral-500">Create, view, and delete vacant land parcels and plots across premium Nairobi neighborhoods (Kilimani, Kileleshwa, Westlands, Karen, Lavington).</p>
              </div>
            </div>

            {/* List current land holdings */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
              <h4 className="text-sm font-black text-neutral-950 uppercase tracking-wider">Current Vacant Subdivisions</h4>
              
              {otherProperties.length === 0 ? (
                <p className="text-xs text-neutral-500 italic py-4">No other properties or plots have been created yet. Use the tool below to list subdivisions.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {otherProperties.map((p: any) => (
                    <div key={p.id} className="p-4 rounded-2xl border border-stone-150 bg-stone-50 flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[9px] bg-amber-400 text-neutral-950 font-bold px-2 py-0.5 rounded uppercase tracking-wider font-mono">
                          {p.type || "Plot"}
                        </span>
                        <h5 className="text-xs font-black text-neutral-950">{p.name}</h5>
                        <p className="text-[10px] text-stone-500 font-mono">📍 {p.location} • {p.size || "N/A"} • Zoning: {p.zoning}</p>
                        <p className="text-xs font-bold text-neutral-800">KES {p.price?.toLocaleString() || "Contact Us"}</p>
                      </div>
                      <button
                        onClick={async () => {
                          if (confirm(`Are you sure you want to delete land listing "${p.name}"?`)) {
                            try {
                              const resp = await fetch(`/api/projects/other-properties/${p.id}`, { method: "DELETE" });
                              const data = await resp.json();
                              if (data.success) {
                                onRefreshOtherProperties?.();
                                onAddActivityLog(`🏞️ Deleted vacant land listing "${p.name}".`);
                              }
                            } catch (err) {
                              console.error(err);
                            }
                          }
                        }}
                        className="text-stone-400 hover:text-red-500 font-bold text-xs p-1"
                        title="Delete listing"
                      >
                        × Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Create new land listings form */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
              <h4 className="text-sm font-black text-neutral-950 uppercase tracking-wider">➕ Create Upmarket Land Subdivision</h4>
              
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const target = e.currentTarget;
                  const formData = new FormData(target);
                  
                  const payload = {
                    name: formData.get("name") as string,
                    type: formData.get("type") as string,
                    location: formData.get("location") as string,
                    price: Number(formData.get("price")),
                    size: formData.get("size") as string,
                    zoning: formData.get("zoning") as string,
                    description: formData.get("description") as string,
                    imageUrl: formData.get("imageUrl") as string || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200",
                    contactPhone: formData.get("contactPhone") as string || "+254711122233",
                    highlights: (formData.get("highlights") as string).split(",").map(s => s.trim()).filter(Boolean)
                  };

                  if (!payload.name || !payload.location || !payload.price) {
                    alert("Please fill in all required fields (Title, Area/Location, Price)");
                    return;
                  }

                  try {
                    const resp = await fetch("/api/projects/other-properties", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload)
                    });
                    const data = await resp.json();
                    if (data.success) {
                      onRefreshOtherProperties?.();
                      onAddActivityLog(`🏞️ Added vacant plot listing "${payload.name}" in ${payload.location}.`);
                      target.reset();
                      alert("Successfully listed upmarket land subdivision!");
                    } else {
                      alert("Error: " + (data.error || "Unknown error"));
                    }
                  } catch (err) {
                    console.error("Failed to post land listings", err);
                  }
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-stone-500 uppercase block font-bold">Listing Title (e.g. 0.5 Acre Residential Karen Plot)*</label>
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="Enter descriptive title"
                    className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-stone-500 uppercase block font-bold">Subdivision Type*</label>
                  <select
                    name="type"
                    className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white outline-none font-sans"
                  >
                    <option value="Land">Land Parcel</option>
                    <option value="Plot">Individual Plot</option>
                    <option value="Acreage">Acreage Estate</option>
                    <option value="Commercial Land">Commercial Sub-div</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-stone-500 uppercase block font-bold">Upmarket Area / Location*</label>
                  <select
                    name="location"
                    className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white outline-none font-sans"
                  >
                    <option value="Kilimani">Kilimani</option>
                    <option value="Kileleshwa">Kileleshwa</option>
                    <option value="Westlands">Westlands</option>
                    <option value="Karen">Karen</option>
                    <option value="Lavington">Lavington</option>
                    <option value="Gigiri">Gigiri</option>
                    <option value="Muthaiga">Muthaiga</option>
                    <option value="Runda">Runda</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-stone-500 uppercase block font-bold">Price (KES)*</label>
                  <input
                    name="price"
                    type="number"
                    required
                    placeholder="Price in Kenya Shillings (e.g. 45000000)"
                    className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-stone-500 uppercase block font-bold">Size Dimension (e.g. 0.5 Acres, 100x50, 2.5 Acres)</label>
                  <input
                    name="size"
                    type="text"
                    placeholder="e.g. 0.5 Acres"
                    className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-stone-500 uppercase block font-bold">Zoning Permissions (e.g. Multi-family, Single Dwelling, Commercial)</label>
                  <input
                    name="zoning"
                    type="text"
                    placeholder="e.g. Residential (Max 4 Floors)"
                    className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white outline-none"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-mono text-stone-500 uppercase block font-bold">Main Description</label>
                  <textarea
                    name="description"
                    rows={2}
                    placeholder="Detailed description of the vacant land, proximity to roads, water connection..."
                    className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white outline-none"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-mono text-stone-500 uppercase block font-bold">Bullet Highlights (comma-separated, e.g. Tarmacked approach, Red Soil, Red Soil, Clean Title)</label>
                  <input
                    name="highlights"
                    type="text"
                    placeholder="Red Soil, Freehold Title, Near Hub Mall, Gated Security"
                    className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-stone-500 uppercase block font-bold">Featured Image URL (Leave blank for default field drone image)</label>
                  <input
                    name="imageUrl"
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-stone-500 uppercase block font-bold">Owner/Broker Contact Mobile Phone</label>
                  <input
                    name="contactPhone"
                    type="text"
                    placeholder="+254711122233"
                    className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white outline-none font-mono"
                  />
                </div>

                <div className="md:col-span-2 flex justify-end border-t border-stone-100 pt-4 mt-2">
                  <button
                    type="submit"
                    className="bg-neutral-950 hover:bg-neutral-800 text-amber-400 font-extrabold text-[10px] uppercase tracking-widest px-8 py-3.5 rounded-xl cursor-pointer"
                  >
                    🚀 Dispatch Subdivision to Marketplace
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === "menu-control" && (() => {
          const MENU_METADATA: Record<string, { label: string, desc: string, icon: string, color: string }> = {
            "home": { label: "Home", desc: "Overview of listings, metrics, and real-time updates", icon: "🏠", color: "from-blue-500 to-cyan-400" },
            "properties": { label: "Property Listings", desc: "Browse luxury commercial & residential properties in Nairobi", icon: "🔍", color: "from-amber-500 to-orange-400" },
            "videos": { label: "Video Tours", desc: "Watch high-definition video walkthroughs of listed properties", icon: "🎥", color: "from-purple-500 to-indigo-400" },
            "other-properties": { label: "Land & Plots", desc: "Find prime residential & commercial plots of land for sale", icon: "🏞️", color: "from-emerald-500 to-teal-400" },
            "international": { label: "International Listings", desc: "Explore luxury off-plan properties in Dubai and globally", icon: "🌍", color: "from-indigo-500 to-purple-400" },
            "drops": { label: "Off-Plan Drops", desc: "Get real-time direct developer releases & countdowns", icon: "⏰", color: "from-red-500 to-rose-400" },
            "portfolio": { label: "3D Digital Twins", desc: "Interactive floor plans, layout maps, and virtual models", icon: "🏢", color: "from-stone-600 to-stone-400" },
            "matchmaker": { label: "Investment Matcher", desc: "Find properties with the best return on investment", icon: "✨", color: "from-amber-400 to-yellow-300" },
            "financing": { label: "Mortgage & Financing", desc: "Calculate monthly mortgage costs and check escrow accounts", icon: "📈", color: "from-sky-500 to-indigo-400" },
            "services": { label: "Expert Legal Services", desc: "Access verified lawyers, valuation experts, and advisors", icon: "⚖️", color: "from-violet-500 to-fuchsia-400" },
            "blogs": { label: "Market Blogs", desc: "Read our AI-powered property insights and market blogs", icon: "📝", color: "from-amber-600 to-amber-400" },
            "guide": { label: "Help Guide & Rules", desc: "Platform tutorials, standard operating procedures, and commissions", icon: "📖", color: "from-lime-500 to-emerald-400" },
            "flutter": { label: "Flutter App Simulator", desc: "Test the platform's mobile app client in real-time", icon: "📱", color: "from-cyan-500 to-blue-400" },
            "expo": { label: "React Native App", desc: "Simulate mobile layouts, notifications, and biometrics", icon: "🚀", color: "from-emerald-600 to-teal-500" },
            "ai-hub": { label: "AI Assistant Center", desc: "Interact with our predictive AI tools and market assistant", icon: "🧠", color: "from-pink-500 to-purple-500" }
          };

          // Drag and Drop Local States & Handlers
          return (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                <div>
                  <h3 className="text-2xl font-sans font-black text-neutral-950 uppercase tracking-tight">📋 Navigation Menu Controls</h3>
                  <p className="text-xs text-neutral-500">
                    Live dynamic routing & menu controllers. Drag & drop elements to re-order the client navigation sidebar, or toggle items between active & inactive columns instantly.
                  </p>
                </div>
              </div>

              {menuFeedback && (
                <div className={`p-4 rounded-2xl text-xs font-semibold border ${
                  menuFeedback.type === "success"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-red-50 border-red-200 text-red-800"
                }`}>
                  {menuFeedback.text}
                </div>
              )}

              {/* Drag and Drop Workspace */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* ACTIVE COL */}
                <div 
                  className="bg-stone-50 border border-stone-200 rounded-3xl p-6 space-y-4 min-h-[500px] flex flex-col"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const id = e.dataTransfer.getData("text/plain");
                    const source = e.dataTransfer.getData("source");
                    if (!id || source === "active") return;
                    
                    // Move from inactive to active
                    setInactiveMenuIds(prev => prev.filter(item => item !== id));
                    setActiveMenuIds(prev => [...prev, id]);
                  }}
                >
                  <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <h4 className="text-sm font-black text-neutral-900 uppercase tracking-wider">🟢 Active Navigation Menu Items ({activeMenuIds.length})</h4>
                    </div>
                    <span className="text-[10px] font-mono text-stone-400">Order: Top-to-Bottom</span>
                  </div>

                  <p className="text-[11px] text-stone-500 leading-relaxed">
                    These items are live in the client navigation menu. Grab and drag cards to sort order, or click the control buttons.
                  </p>

                  <div className="space-y-2.5 flex-1">
                    {activeMenuIds.length === 0 ? (
                      <div className="border border-dashed border-stone-300 rounded-2xl p-8 text-center text-xs text-stone-400 italic">
                        No active tabs. Drag tabs here to activate.
                      </div>
                    ) : (
                      activeMenuIds.map((id, index) => {
                        const meta = MENU_METADATA[id] || { label: id, desc: "", icon: "❓", color: "from-stone-500 to-stone-400" };
                        return (
                          <div
                            key={id}
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData("text/plain", id);
                              e.dataTransfer.setData("source", "active");
                            }}
                            className="bg-white border border-stone-200 p-3.5 rounded-2xl shadow-sm flex items-center justify-between gap-3 group hover:border-amber-400 hover:shadow-md transition-all cursor-grab active:cursor-grabbing"
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center text-lg shrink-0 text-white shadow-inner`}>
                                {meta.icon}
                              </div>
                              <div className="overflow-hidden">
                                <strong className="text-xs font-black text-neutral-900 block truncate">{meta.label}</strong>
                                <span className="text-[10px] text-stone-400 block truncate">{meta.desc}</span>
                              </div>
                            </div>

                            {/* Controls */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => {
                                  if (index > 0) {
                                    const nextList = [...activeMenuIds];
                                    const temp = nextList[index];
                                    nextList[index] = nextList[index - 1];
                                    nextList[index - 1] = temp;
                                    setActiveMenuIds(nextList);
                                  }
                                }}
                                disabled={index === 0}
                                className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-500 hover:text-stone-900 disabled:opacity-30 cursor-pointer"
                                title="Move Up"
                              >
                                ▲
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (index < activeMenuIds.length - 1) {
                                    const nextList = [...activeMenuIds];
                                    const temp = nextList[index];
                                    nextList[index] = nextList[index + 1];
                                    nextList[index + 1] = temp;
                                    setActiveMenuIds(nextList);
                                  }
                                }}
                                disabled={index === activeMenuIds.length - 1}
                                className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-500 hover:text-stone-900 disabled:opacity-30 cursor-pointer"
                                title="Move Down"
                              >
                                ▼
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuIds(prev => prev.filter(item => item !== id));
                                  setInactiveMenuIds(prev => {
                                    if (!prev.includes(id)) return [...prev, id];
                                    return prev;
                                  });
                                }}
                                className="p-1.5 rounded-lg border border-red-100 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-[10px] uppercase cursor-pointer"
                                title="Deactivate"
                              >
                                Hide
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* INACTIVE COL */}
                <div 
                  className="bg-stone-50 border border-stone-200 rounded-3xl p-6 space-y-4 min-h-[500px] flex flex-col"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const id = e.dataTransfer.getData("text/plain");
                    const source = e.dataTransfer.getData("source");
                    if (!id || source === "inactive") return;
                    
                    // Move from active to inactive
                    setActiveMenuIds(prev => prev.filter(item => item !== id));
                    setInactiveMenuIds(prev => {
                      if (!prev.includes(id)) return [...prev, id];
                      return prev;
                    });
                  }}
                >
                  <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
                      <h4 className="text-sm font-black text-stone-500 uppercase tracking-wider">🔴 Inactive / Hidden Tabs ({inactiveMenuIds.length})</h4>
                    </div>
                  </div>

                  <p className="text-[11px] text-stone-500 leading-relaxed">
                    These tabs are completely hidden from the main client navigation panel. Drag tabs back into the Left column or click "Activate" to restore.
                  </p>

                  <div className="space-y-2.5 flex-1">
                    {inactiveMenuIds.length === 0 ? (
                      <div className="border border-dashed border-stone-200 rounded-2xl p-8 text-center text-xs text-stone-400 italic">
                        No inactive tabs. Drag active tabs here to hide them.
                      </div>
                    ) : (
                      inactiveMenuIds.map((id) => {
                        const meta = MENU_METADATA[id] || { label: id, desc: "", icon: "❓", color: "from-stone-400 to-stone-300" };
                        return (
                          <div
                            key={id}
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData("text/plain", id);
                              e.dataTransfer.setData("source", "inactive");
                            }}
                            className="bg-stone-100 border border-stone-200 p-3.5 rounded-2xl flex items-center justify-between gap-3 opacity-75 hover:opacity-100 transition-all cursor-grab active:cursor-grabbing"
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className="w-10 h-10 rounded-xl bg-stone-200 flex items-center justify-center text-lg shrink-0 text-stone-500 shadow-inner">
                                {meta.icon}
                              </div>
                              <div className="overflow-hidden">
                                <strong className="text-xs font-black text-stone-600 block truncate">{meta.label}</strong>
                                <span className="text-[10px] text-stone-400 block truncate">{meta.desc}</span>
                              </div>
                            </div>

                            {/* Action to Activate */}
                            <button
                              type="button"
                              onClick={() => {
                                setInactiveMenuIds(prev => prev.filter(item => item !== id));
                                setActiveMenuIds(prev => {
                                  if (!prev.includes(id)) return [...prev, id];
                                  return prev;
                                });
                              }}
                              className="p-1.5 px-3 rounded-lg border border-emerald-100 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 font-extrabold text-[10px] uppercase tracking-wider cursor-pointer shrink-0"
                            >
                              Show
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

              </div>

              {/* Action Toolbar */}
              <div className="bg-neutral-950 p-6 rounded-3xl border border-neutral-850 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider">Sync Navigation Terminal Order</h4>
                  <p className="text-[11px] text-stone-400">
                    Saves current active/inactive states and drag sequence to persistent storage for all connecting client portals.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("Restore default platform navigation structure?")) {
                        setActiveMenuIds(defaultMenuIds);
                        setInactiveMenuIds([]);
                      }
                    }}
                    className="bg-transparent hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-stone-400 hover:text-white font-extrabold text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-xl cursor-pointer"
                  >
                    Restore Default Menu
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveMenuControl}
                    disabled={savingMenuControl}
                    className="bg-orange-500 hover:bg-orange-400 text-neutral-950 font-black text-[10px] uppercase tracking-widest px-8 py-3.5 rounded-xl cursor-pointer shadow-lg shadow-orange-500/10 disabled:opacity-50"
                  >
                    {savingMenuControl ? "Locking Navigation Setup..." : "🔒 Save & Sync Navigation Menu"}
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

      </main>

    </div>
  );
}
