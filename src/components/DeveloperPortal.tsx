import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Building2, 
  Settings, 
  Users, 
  Activity, 
  TrendingUp, 
  PhoneCall, 
  Mail, 
  Send, 
  Coins, 
  Plus, 
  Edit3, 
  Sparkles, 
  ShieldCheck, 
  BarChart3, 
  Percent, 
  CheckCircle,
  FileUp,
  Share2,
  Trash2,
  Eye,
  Flame,
  MessageSquare,
  ArrowRight,
  Lock
} from "lucide-react";
import { Project, Unit, Lead, WhatsAppChat, User } from "../types";

interface DeveloperPortalProps {
  projects: Project[];
  activeProject: Project;
  bookingsCount: number;
  leads: Lead[];
  whatsappChats: WhatsAppChat[];
  selectedProjectId: string;
  onSelectProjectId: (id: string) => void;
  onUpdateUnit: (towerName: string, unitNumber: string, status: string, flexHighlight: string) => void;
  onRetrainAIAssistant: (customContext: string) => void;
  onAddActivityLog: (text: string) => void;
  currentUser?: User | null;
  onAddProject?: (project: Project) => void;
  onUpdateProject?: (project: Project) => void;
  formatPrice?: (priceVal: number, project?: any) => string;
}

export default function DeveloperPortal({
  projects,
  activeProject,
  bookingsCount,
  leads,
  whatsappChats,
  selectedProjectId,
  onSelectProjectId,
  onUpdateUnit,
  onRetrainAIAssistant,
  onAddActivityLog,
  currentUser,
  onAddProject,
  onUpdateProject,
  formatPrice
}: DeveloperPortalProps) {
  const [devSubTab, setDevSubTab] = useState<"dashboard" | "add_property" | "inventory" | "knowledge" | "crm" | "marketing" | "analytics" | "tenant_saas">("dashboard");

  // SaaS tenant states
  const [organization, setOrganization] = useState<any>(null);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loadingSaaS, setLoadingSaaS] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Member");
  const [inviteMsg, setInviteMsg] = useState("");

  const loadTenantProfile = async () => {
    setLoadingSaaS(true);
    try {
      const headers: any = { "Content-Type": "application/json" };
      if (currentUser) {
        headers["x-user-id"] = currentUser.id;
        headers["x-user-email"] = currentUser.email;
        headers["x-user-role"] = currentUser.role;
      }
      const resp = await fetch("/api/saas/tenant/profile", { headers });
      const data = await resp.json();
      if (data.success) {
        setOrganization(data.organization);
        setWorkspaces(data.workspaces);
        setTeamMembers(data.teamMembers);
        setAuditLogs(data.auditLogs);
      }
    } catch (e) {
      console.error("Failed to load multi-tenant security logs:", e);
    } finally {
      setLoadingSaaS(false);
    }
  };

  React.useEffect(() => {
    if (devSubTab === "tenant_saas") {
      loadTenantProfile();
    }
  }, [devSubTab]);

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !inviteEmail) {
      alert("Please provide the legal name and active email contact.");
      return;
    }
    try {
      const headers: any = { "Content-Type": "application/json" };
      if (currentUser) {
        headers["x-user-id"] = currentUser.id;
        headers["x-user-email"] = currentUser.email;
        headers["x-user-role"] = currentUser.role;
      }
      const resp = await fetch("/api/saas/tenant/members", {
        method: "POST",
        headers,
        body: JSON.stringify({ username: inviteName, email: inviteEmail, role: inviteRole })
      });
      const data = await resp.json();
      if (resp.ok) {
        setInviteMsg("Success! Team member added into isolated secure group.");
        setInviteName("");
        setInviteEmail("");
        setTeamMembers(data.members || []);
        loadTenantProfile();
        setTimeout(() => setInviteMsg(""), 4000);
      } else {
        alert(data.error || "Failed inviting member.");
      }
    } catch (err) {
      console.error(err);
    }
  };
  
  // Mode Selection: "create" | "edit"
  const [propertyEditorMode, setPropertyEditorMode] = useState<"create" | "edit">("create");

  // States for adding properties completely
  const [projName, setProjName] = useState("");
  const [projSlug, setProjSlug] = useState("");
  const [projLocation, setProjLocation] = useState("Kilimani, Nairobi");
  const [projTagline, setProjTagline] = useState("");
  const [projDescription, setProjDescription] = useState("");
  const [projPriceRange, setProjPriceRange] = useState("$95,000 - $240,000");
  const [projCompletionDate, setProjCompletionDate] = useState("June 2028");
  const [projRentalYield, setProjRentalYield] = useState("10.8%");
  const [projCapitalAppreciation, setProjCapitalAppreciation] = useState("13.5%");
  
  // New input attributes for Edit integration
  const [projVRUrl, setProjVRUrl] = useState(activeProject?.vrTourUrl || "");
  const [projWhatsapp, setProjWhatsapp] = useState(activeProject?.whatsappPhone || "+254712345678");
  const [projDroneUrl, setProjDroneUrl] = useState(activeProject?.droneVideoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ");
  const [projCurrency, setProjCurrency] = useState(activeProject?.currency || "USD");
  const [projDepositPercent, setProjDepositPercent] = useState(activeProject?.bookingDepositPercent || 2);
  const [projTikTokVideos, setProjTikTokVideos] = useState<string>(activeProject?.tiktokVideos ? activeProject.tiktokVideos.join(", ") : "");
  const [projIsInternational, setProjIsInternational] = useState<boolean>(activeProject?.isInternational || false);

  const [projAmenities, setProjAmenities] = useState<string[]>(activeProject?.amenities || [
    "Heated Rooftop Infinity Pool",
    "Full Backup Generator & Borehole",
    "24/7 Smart Security & Reception",
    "Duplex Wellness Gym & CrossFit Center"
  ]);
  const [newAmenity, setNewAmenity] = useState("");

  const [projLocationHighlights, setProjLocationHighlights] = useState<string[]>([
    "3 minutes walk to premium local shopping hubs",
    "Easy direct bypass routing avoiding heavy CBD gridlocks"
  ]);
  const [newHighlight, setNewHighlight] = useState("");

  const [virtualTours, setVirtualTours] = useState<Array<{
    key: string;
    url: string;
    title: string;
    aiDescription: string;
    seoAlt: string;
  }>>([
    {
      key: "livingRoom",
      url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
      title: "Majestic Heights Lounge",
      aiDescription: "Enormous living room space featuring full-height structural glass wall overlooking Westlands skyline and custom Italian marble flooring.",
      seoAlt: "luxury flat living room Nairobi Westlands offplan pre-sale"
    },
    {
      key: "kitchen",
      url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
      title: "Chef's Culinary Studio",
      aiDescription: "Open-plan kitchen integrated with integrated smart appliances, bespoke quartz breakfast islands, and automated mood-light fixtures.",
      seoAlt: "modern open kitchen marble breakfast island architectural plans"
    },
    {
      key: "masterBedroom",
      url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80",
      title: "Panoramic Master Retreat",
      aiDescription: "King suite connected to a private glass balcony with built-in wooden walking closets and premium dual-sink vanity bathroom fittings.",
      seoAlt: "grand master suite offplan preconstruction nairobi penthouse"
    },
    {
      key: "balconyView",
      url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      title: "The Observatory Deck",
      aiDescription: "Spacious private glass-railed balcony with stunning panoramic views of the Nairobi Arboretum forest canopy.",
      seoAlt: "private panoramic terrace penthouse canopy view premium developments"
    },
    {
      key: "amenities",
      url: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80",
      title: "Summit Azure Infinity Pool",
      aiDescription: "Breathtaking 20-meter heated rooftop pool with sunken pool deck loungers and full operational cocktail juice bar for residents.",
      seoAlt: "heated rooftop infinity pool lounge nairobi condominium"
    }
  ]);

  const imgLivingRoom = virtualTours.find(t => t.key === "livingRoom")?.url || "";
  const imgKitchen = virtualTours.find(t => t.key === "kitchen")?.url || "";
  const imgBedroom = virtualTours.find(t => t.key === "masterBedroom")?.url || "";
  const imgBalcony = virtualTours.find(t => t.key === "balconyView")?.url || "";
  const imgAmenities = virtualTours.find(t => t.key === "amenities")?.url || "";

  // SEO Configurations
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");

  // Structured Grid Generator parameters (towers creator)
  const [newTowerName, setNewTowerName] = useState("Tower Alpha");
  const [numFloorsToG, setNumFloorsToG] = useState(3);
  const [unitsPerFToG, setUnitsPerFToG] = useState(3);
  const [baseUnitPriceG, setBaseUnitPriceG] = useState(95000);
  const [baseUnitTypeG, setBaseUnitTypeG] = useState("1 Bedroom Luxury Studio");
  const [baseUnitSizeG, setBaseUnitSizeG] = useState("65 SQM");

  const [isAddingProject, setIsAddingProject] = useState(false);
  const [addProjectError, setAddProjectError] = useState<string | null>(null);
  const [addProjectSuccess, setAddProjectSuccess] = useState<string | null>(null);

  const [dragActiveStates, setDragActiveStates] = useState<Record<string, boolean>>({});
  const [newSceneTitle, setNewSceneTitle] = useState("");

  const handleDragOver = (e: React.DragEvent, key: string) => {
    e.preventDefault();
    setDragActiveStates(prev => ({ ...prev, [key]: true }));
  };

  const handleDragLeave = (e: React.DragEvent, key: string) => {
    e.preventDefault();
    setDragActiveStates(prev => ({ ...prev, [key]: false }));
  };

  const updateTourField = (key: string, field: "url" | "title" | "aiDescription" | "seoAlt", value: string) => {
    setVirtualTours(prev => prev.map(t => {
      if (t.key === key) {
        return { ...t, [field]: value };
      }
      return t;
    }));
  };

  const handleDrop = (e: React.DragEvent, key: string) => {
    e.preventDefault();
    setDragActiveStates(prev => ({ ...prev, [key]: false }));
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const base64Url = event.target.result as string;
          updateTourField(key, "url", base64Url);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const base64Url = event.target.result as string;
          updateTourField(key, "url", base64Url);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerAIAssistForTour = (key: string, title: string) => {
    if (!title) return;
    const desc = `Immersive offplan panoramic walkthrough showcasing ${title}. Designed featuring natural illumination, refined spatial margins, customized built-in cabinetry, and high-efficiency double-glazed soundproof framing optimized for Nairobi high-income residents looking for excellent yields.`;
    const seo = `${title.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim()} premium offplan apartment nairobi kenya buy early bird special`;
    
    setVirtualTours(prev => prev.map(t => {
      if (t.key === key) {
        return { 
          ...t, 
          aiDescription: desc,
          seoAlt: seo
        };
      }
      return t;
    }));
    if (onAddActivityLog) {
      onAddActivityLog(`🤖 AI Assist: Formulated descriptions and optimized SEO headings for "${title}".`);
    }
  };

  const handleAddCustomScene = () => {
    if (!newSceneTitle.trim()) return;
    const key = "custom_" + Date.now();
    setVirtualTours(prev => [
      ...prev,
      {
        key,
        url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
        title: newSceneTitle.trim(),
        aiDescription: `Bespoke virtual twin perspective showing proposed ${newSceneTitle.trim()} configured with exceptional premium fitouts.`,
        seoAlt: `${newSceneTitle.toLowerCase().trim()} offplan preconstruction nairobi`
      }
    ]);
    setNewSceneTitle("");
    if (onAddActivityLog) {
      onAddActivityLog(`🏗️ Custom walkthrough tour scene added: "${newSceneTitle.trim()}".`);
    }
  };

  const handleDeleteScene = (keyToDelete: string) => {
    setVirtualTours(prev => prev.filter(t => t.key !== keyToDelete));
    if (onAddActivityLog) {
      onAddActivityLog(`🗑️ Removed virtual tour scene key: "${keyToDelete}".`);
    }
  };

  const handleProjNameChange = (nameVal: string) => {
    setProjName(nameVal);
    const generatedSlug = nameVal
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setProjSlug(generatedSlug);
    setSeoTitle(`${nameVal} | Premium Offplan Nairobi Real Estate`);
    setSeoDescription(`Invest early inside ${nameVal} offplan suites situated in ${projLocation}. Enjoy high yields, payment structures & world-class lifestyle.`);
    setSeoKeywords(`nairobi property, ${nameVal} for sale, luxury apartment, offplan kenya`);
  };

  const handleApplyPreset = (presetName: "boutique" | "tall_tower" | "gated_suburb") => {
    if (presetName === "boutique") {
      setProjName("Lavington Edge Suites");
      setProjSlug("lavington-edge-suites");
      setProjLocation("Lavington, Nairobi");
      setProjTagline("Crafted boutique residential flats with lush garden pathways");
      setProjDescription("Lavington Edge represents sophisticated minimalist charm. Our limited suites are located near Lavington Mall, presenting the ultimate combination of serenity, top security and proximity to premier high schools.");
      setProjPriceRange("$115,000 - $250,000");
      setProjCompletionDate("December 2027");
      setProjRentalYield("10.5%");
      setProjCapitalAppreciation("13.2%");
      setSeoTitle("Lavington Edge Suites | Modern Offplan Lavington Developments");
      setSeoDescription("Limited collection of boutique suites in the leafy heart of Lavington. Capitalize on high rental demand & early-bird prices.");
      setSeoKeywords("lavington edge, offplan lavington, boutique apartments nairobi, luxury home");
      setNewTowerName("Block A");
      setNumFloorsToG(4);
      setUnitsPerFToG(2);
      setBaseUnitPriceG(115000);
      setBaseUnitTypeG("2 Bedroom Premium");
      setBaseUnitSizeG("85 SQM");
      setVirtualTours([
        {
          key: "livingRoom",
          url: "https://images.unsplash.com/photo-1627141301383-4a187fd76b97?auto=format&fit=crop&w=1200&q=80",
          title: "Lavington Ivy Living",
          aiDescription: "A sundrenched, organic living space lined with handcrafted teak sliding panels opening onto private garden pathways.",
          seoAlt: "Lavington boutique apartment elegant living room teak sliding panels"
        },
        {
          key: "kitchen",
          url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
          title: "Ivy Boutique Kitchen",
          aiDescription: "Gourmet open kitchen featuring integrated mahogany panels and premium German cooker systems.",
          seoAlt: "lavington boutique kitchen bespoke mahogany marble countertops"
        },
        {
          key: "masterBedroom",
          url: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
          title: "Silent Garden Master Suite",
          aiDescription: "Lush primary room with double-glazed noise cancellation and floor-to-ceiling views of local foliage.",
          seoAlt: "serene boutique master suite preconstruction nairobi development"
        },
        {
          key: "balconyView",
          url: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&q=80",
          title: "Ivy Garden Pocket Terrace",
          aiDescription: "Private pocket balcony with vertical planter installations and wooden flooring tiles.",
          seoAlt: "pocket terrace cozy garden seating private lavington flat"
        },
        {
          key: "amenities",
          url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
          title: "Ivy Club Wellness Pavilion",
          aiDescription: "Exclusive boutique residents gym and peaceful glass yoga room with views of mature acacia trees.",
          seoAlt: "residents private club wellness gymnasium garden view"
        }
      ]);
    } else if (presetName === "tall_tower") {
      setProjName("Kilimani Crown Towers");
      setProjSlug("kilimani-crown-towers");
      setProjLocation("Kilimani, Nairobi");
      setProjTagline("Vanguard vertical architecture featuring signature rooftop sky-lounges");
      setProjDescription("Rising 18 stories, Kilimani Crown Towers delivers soaring glass facades, smart keyless home lock installations, and a central dual-level residents club. Positioned perfectly for premium service apartment returns.");
      setProjPriceRange("$130,000 - $380,000");
      setProjCompletionDate("September 2028");
      setProjRentalYield("12.0%");
      setProjCapitalAppreciation("15.5%");
      setSeoTitle("Kilimani Crown Towers | Vertical Premium Developments");
      setSeoDescription("Own a sovereign signature sky suite in Kilimani. 18 floors of modern architectural excellence with premium service apartment operators.");
      setSeoKeywords("kilimani crown towers, buy sky suite nairobi, vertical offplan property kenya");
      setNewTowerName("Vanguard Tower");
      setNumFloorsToG(5);
      setUnitsPerFToG(3);
      setBaseUnitPriceG(130000);
      setBaseUnitTypeG("2 Bedroom Sky Suite");
      setBaseUnitSizeG("95 SQM");
      setVirtualTours([
        {
          key: "livingRoom",
          url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
          title: "Crown Sky Lounge",
          aiDescription: "Panoramic lounge with high structural heights featuring double height glass wall looking downtown.",
          seoAlt: "kilimani tall highrise lounge 360 panoramic views of city skyline"
        },
        {
          key: "kitchen",
          url: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80",
          title: "Crown Culinary Deck",
          aiDescription: "Premium kitchen fitted with smart keyless appliances and built-in automation touch screens.",
          seoAlt: "kilimani crown luxury kitchen fitted smart systems and ambient lighting"
        },
        {
          key: "masterBedroom",
          url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80",
          title: "15th Floor Crown Retreat",
          aiDescription: "Bespoke floating bed frame facing complete sky vistas and electronic smart sheer blinds.",
          seoAlt: "luxury sky master suite high rise tower view kilimani offplan"
        },
        {
          key: "balconyView",
          url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
          title: "Breathtaking Horizon Balcony",
          aiDescription: "Seventeenth storey outdoor cantilever deck overlooking Westlands financial hub.",
          seoAlt: "tall tower sky view balcony glass guard rail looking towards nairobi cbd"
        },
        {
          key: "amenities",
          url: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80",
          title: "Crown Infinity Skylounge Pool",
          aiDescription: "Grand dual-level heated rooftop pool under an architectural glass skylight structure.",
          seoAlt: "heated rooftop glass infinity lounge and pool system"
        }
      ]);
    } else {
      setProjName("Runda Oak Villas");
      setProjSlug("runda-oak-villas");
      setProjLocation("Runda, Nairobi");
      setProjTagline("Exclusive modern country homes wrapped in age-old cedar woodlands");
      setProjDescription("A collection of luxury villas featuring floor-to-ceiling windows, private swimming pools, and dedicated staff quarters. Located within an premium secure gated compound in Nairobi's most prestigious postal code.");
      setProjPriceRange("$420,000 - $850,000");
      setProjCompletionDate("December 2029");
      setProjRentalYield("8.5%");
      setProjCapitalAppreciation("16.0%");
      setSeoTitle("Runda Oak Villas | Prestigious Countryside Estates");
      setSeoDescription("Pre-sale release of exclusive colonial-style state villas in secure Runda. Experience unrivaled residential prestige and unmatched privacy.");
      setSeoKeywords("runda villas for sale, luxury gated community kenya, runda oak estates");
      setNewTowerName("Oak Villa Block");
      setNumFloorsToG(2);
      setUnitsPerFToG(2);
      setBaseUnitPriceG(420000);
      setBaseUnitTypeG("3 Bedroom Signature Duplex");
      setBaseUnitSizeG("210 SQM");
      setVirtualTours([
        {
          key: "livingRoom",
          url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
          title: "Oak Manor Great Lounge",
          aiDescription: "Grand countryside drawing room with stone-faced fireplace hearth and high vaulted wooden ceilings.",
          seoAlt: "runda country mansion luxury drawing room fireplace traditional hearth"
        },
        {
          key: "kitchen",
          url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
          title: "Oak Country Conservatory Kitchen",
          aiDescription: "Rustic open-plan kitchen with modern range stove, built-in cold room pantry, and white marble counters.",
          seoAlt: "manor luxury country kitchen wood panels marble island runda"
        },
        {
          key: "masterBedroom",
          url: "https://images.unsplash.com/photo-1505693395321-883724634266?auto=format&fit=crop&w=1200&q=80",
          title: "Presidential Cedar Suite",
          aiDescription: "Vaulted Master Room featuring integrated walk-in dressing suite and private fireplace.",
          seoAlt: "mansion presidential bed chamber wood rafters looking at private oakwoods"
        },
        {
          key: "balconyView",
          url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
          title: "Great Manor Veranda",
          aiDescription: "Expansive solid slate porch leading down to mature private cedar lawns.",
          seoAlt: "private estate porch overlook garden forest runda villa"
        },
        {
          key: "amenities",
          url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
          title: "Oak Forest Wellness Spa",
          aiDescription: "Exclusive private heated plunge wellness pool, Finnish pine sauna, and private massage rooms.",
          seoAlt: "mansion private wellness spa hot spring cedar deck"
        }
      ]);
    }
  };

  const handleAddProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddProjectError(null);
    setAddProjectSuccess(null);

    if (!projName || !projSlug) {
      setAddProjectError("Please fill out the Property Name and unique slug handle.");
      return;
    }

    setIsAddingProject(true);

    if (propertyEditorMode === "edit") {
      try {
        const headers: any = { "Content-Type": "application/json" };
        if (currentUser) {
          headers["x-user-id"] = currentUser.id;
          headers["x-user-email"] = currentUser.email;
          headers["x-user-role"] = currentUser.role;
        }
        const response = await fetch("/api/projects/edit", {
          method: "POST",
          headers,
          body: JSON.stringify({
            id: projSlug,
            name: projName,
            location: projLocation,
            tagline: projTagline,
            description: projDescription,
            priceRange: projPriceRange,
            completionDate: projCompletionDate,
            roiRentalYield: projRentalYield,
            roiCapitalAppreciation: projCapitalAppreciation,
            amenities: projAmenities,
            locationHighlights: projLocationHighlights,
            bookingDepositPercent: Number(projDepositPercent),
            vrTourUrl: projVRUrl,
            whatsappPhone: projWhatsapp,
            droneVideoUrl: projDroneUrl,
            currency: projCurrency,
            tiktokVideos: projTikTokVideos ? projTikTokVideos.split(",").map(v => v.trim()).filter(Boolean) : [],
            isInternational: projIsInternational
          })
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to update project data.");
        }
        setAddProjectSuccess(`Property "${projName}" configuration edited and synchronized successfully on the server!`);
        onAddActivityLog(`🔧 Property updated: "${projName}" settings synchronized on live server node.`);
        if (onUpdateProject) {
          onUpdateProject(data.project);
        }
      } catch (err: any) {
        setAddProjectError(err.message || "Editing failed.");
      } finally {
        setIsAddingProject(false);
      }
      return;
    }

    try {
      // Auto-generate the complex inventory grid array based on the developer specifications
      const generatedTowers = [
        {
          name: newTowerName || "Tower A",
          floors: Array.from({ length: numFloorsToG }).map((_, floorIdx) => {
            const flNum = numFloorsToG - floorIdx; // e.g. 3, 2, 1
            return {
              floorNumber: flNum,
              units: Array.from({ length: unitsPerFToG }).map((_, unitIdx) => {
                const uNumCode = `${newTowerName.charAt(0).toUpperCase()}-${flNum}0${unitIdx + 1}`;
                return {
                  number: uNumCode,
                  type: baseUnitTypeG || "Executive Studio",
                  price: Number(baseUnitPriceG) + (floorIdx * 3500), // higher floors get slightly pricier layout
                  size: baseUnitSizeG || "60 SQM",
                  status: "Available" as const,
                  flexStatus: "Available" as const
                };
              })
            };
          })
        }
      ];

      const payload = {
        name: projName,
        id: projSlug,
        location: projLocation,
        developerId: currentUser?.id || "dev-premium-spaces",
        developerName: currentUser?.username || "Premium Spaces East Africa",
        tagline: projTagline,
        description: projDescription,
        priceRange: projPriceRange,
        completionDate: projCompletionDate,
        roiRentalYield: projRentalYield,
        roiCapitalAppreciation: projCapitalAppreciation,
        amenities: projAmenities,
        droneVideoUrl: projDroneUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ",
        vrTourUrl: projVRUrl || "",
        whatsappPhone: projWhatsapp || "",
        bookingDepositPercent: Number(projDepositPercent) || 20,
        currency: projCurrency || "USD",
        tiktokVideos: projTikTokVideos ? projTikTokVideos.split(",").map(v => v.trim()).filter(Boolean) : [],
        locationHighlights: projLocationHighlights,
        isInternational: projIsInternational,
        towers: generatedTowers,
        virtualTourMedia: {
          livingRoom: virtualTours.find(t => t.key === "livingRoom")?.url || "",
          kitchen: virtualTours.find(t => t.key === "kitchen")?.url || "",
          masterBedroom: virtualTours.find(t => t.key === "masterBedroom")?.url || "",
          balconyView: virtualTours.find(t => t.key === "balconyView")?.url || "",
          amenities: virtualTours.find(t => t.key === "amenities")?.url || "",
        },
        virtualTourMetadata: virtualTours.reduce((acc, t) => {
          acc[t.key] = {
            title: t.title,
            aiDescription: t.aiDescription,
            seoAlt: t.seoAlt
          };
          return acc;
        }, {} as Record<string, { title: string; aiDescription: string; seoAlt: string }>),
        faqs: [
          { q: "Is the project registered with the National Construction Authority (NCA)?", a: "Yes, fully approved with certified regulatory licenses available on the developer portal." },
          { q: "What is the expected payment structure timeline?", a: "We support spread plans matching active milestone completions in secure Escrow hold." }
        ],
        seoTitle,
        seoDescription,
        seoKeywords
      };

      const headers: any = { "Content-Type": "application/json" };
      if (currentUser) {
        headers["x-user-id"] = currentUser.id;
        headers["x-user-email"] = currentUser.email;
        headers["x-user-role"] = currentUser.role;
      }
      const response = await fetch("/api/projects", {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to register property workspace.");
      }

      setAddProjectSuccess(`Property "${projName}" registered dynamically on the server index!`);
      onAddActivityLog(`🏗️ New launch added: "${projName}" with ${numFloorsToG * unitsPerFToG} units in ${projLocation}.`);
      
      // Update parent state
      if (onAddProject) {
        onAddProject(data.project);
      }

      // Reset dynamic states
      setProjName("");
      setProjSlug("");
      setProjTagline("");
      setProjDescription("");
      
    } catch (err: any) {
      setAddProjectError(err.message || "A network failure occurred. Please retry.");
    } finally {
      setIsAddingProject(false);
    }
  };

  // States for Inventory Engine edits
  const [selectedTower, setSelectedTower] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [newStatus, setNewStatus] = useState("Available");
  const [newFlexStatus, setNewFlexStatus] = useState("Available");

  // States for AI brochure trainer
  const [guideText, setGuideText] = useState("");
  const [isRetraining, setIsRetraining] = useState(false);
  const [retrainSuccess, setRetrainSuccess] = useState(false);

  // States for Marketing Center
  const [campaignName, setCampaignName] = useState("");
  const [campaignMedium, setCampaignMedium] = useState("WhatsApp");
  const [campaignGroup, setCampaignGroup] = useState("Waitlisted Buyers (Nairobi Expatriates)");
  const [campaignsList, setCampaignsList] = useState([
    { id: "c-1", name: "Sky Gardens VIP 1-Hour Early Bird Blast", medium: "WhatsApp", group: "Premium Investors", sentAt: "June 2026", status: "Delivered", responses: 84 },
    { id: "c-2", name: "Kilimani Duplex Spot Price Reduction", medium: "Email", group: "Budget Matchmakers", sentAt: "June 2026", status: "Opened", responses: 42 }
  ]);

  const handleRetrainSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guideText.trim()) return;
    setIsRetraining(true);
    setRetrainSuccess(false);
    setTimeout(() => {
      setIsRetraining(false);
      setRetrainSuccess(true);
      onRetrainAIAssistant(guideText);
      onAddActivityLog(`🤖 Developer uploaded custom brochure specs: retrained Gemini Advisor context.`);
    }, 2000);
  };

  const handleSendCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignName.trim()) return;
    const newCamp = {
      id: `c-custom-${Date.now()}`,
      name: campaignName,
      medium: campaignMedium,
      group: campaignGroup,
      sentAt: "Just launched",
      status: "Actively Launching",
      responses: 0
    };
    setCampaignsList(prev => [newCamp, ...prev]);
    onAddActivityLog(`📣 Developer launched marketing blast: "${campaignName}" targeting ${campaignGroup}.`);
    setCampaignName("");
    alert(`Marketing launch successful! Broadcast queued for ${campaignGroup} via ${campaignMedium}.`);
  };

  // Pre-calculate floor state count
  const allUnits = activeProject.towers.flatMap(t => t.floors.flatMap(fl => fl.units));
  const totalUnits = allUnits.length;
  const availableUnits = allUnits.filter(u => u.status === "Available").length;
  const reservedUnits = allUnits.filter(u => u.status === "Reserved").length;
  const soldUnits = allUnits.filter(u => u.status === "Sold").length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* SaaS Hub Left Sidebar Controls (3 cols) */}
      <aside className="lg:col-span-3 bg-neutral-900 text-white p-5 rounded-3xl border border-neutral-800 shadow-xl h-fit space-y-6">
        <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-400 to-pink-500 text-neutral-950 flex items-center justify-center font-black shadow shadow-amber-400/10">
            D
          </div>
          <div>
            <strong className="text-sm font-black text-white block">
              {currentUser ? currentUser.username : "Dev SaaS Hub"}
            </strong>
            <span className="text-[10px] font-mono font-extrabold text-neutral-500 uppercase tracking-widest block">
              {currentUser && currentUser.companyName ? currentUser.companyName : "Level: Sovereign Partner"}
            </span>
          </div>
        </div>

        {/* Selected Project global switcher inside Developer area */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-mono text-neutral-400 block font-bold">Select Active Project</label>
          <select
            value={selectedProjectId}
            onChange={(e) => {
              onSelectProjectId(e.target.value);
              setSelectedTower("");
              setSelectedUnit("");
            }}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-semibold text-amber-400 outline-none"
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Portal Nav tabs */}
        <nav className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wider">
          {[
            { id: "dashboard", label: "Developer Dashboard", icon: BarChart3 },
            { id: "add_property", label: "Add Property / Product", icon: Plus, badge: "NEW" },
            { id: "inventory", label: "Inventory Engine", icon: Building2 },
            { id: "tenant_saas", label: "Tenant Org & Security", icon: ShieldCheck, badge: "SaaS" },
            { id: "crm", label: "CRM & WhatsApp leads", icon: Users, badge: "Sim" },
            { id: "knowledge", label: "AI Brochure Trainer", icon: Sparkles },
            { id: "marketing", label: "Marketing Campaigns", icon: Share2 },
            { id: "analytics", label: "Heatmap click analytics", icon: Activity }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setDevSubTab(item.id as any)}
              className={`flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all ${
                devSubTab === item.id
                  ? "bg-amber-400 text-neutral-950 shadow-md shadow-amber-400/10"
                  : "text-neutral-400 hover:bg-neutral-950 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2">
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-emerald-600 text-white px-1.5 py-0.5 rounded text-[8px] font-mono font-bold animate-pulse">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main SaaS panel workspace (9 cols) */}
      <main className="lg:col-span-9 space-y-8">
        
        {/* ================= SUBTAB: SaaS INTERACTIVE DASHBOARD ================= */}
        {devSubTab === "dashboard" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-neutral-950 tracking-tight">{activeProject.name} Launch Stats</h2>
                <p className="text-xs text-neutral-500 font-mono">Managed under developer: {activeProject.developerName}</p>
              </div>
              <span className="bg-emerald-100 border border-emerald-200 text-emerald-800 text-[10px] font-mono font-bold px-2.5 py-1 rounded">
                Live Escrow Sync: Active
              </span>
            </div>

            {/* General metrics: Styled as AdminLTE Small Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 font-sans">
              
              {/* Box 1: Total Unit Inventory (Cyan) */}
              <div 
                onClick={() => setDevSubTab("inventory")}
                className="bg-cyan-500 text-white rounded-3xl p-5 shadow-sm relative overflow-hidden group cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all"
              >
                <div className="inner space-y-1 z-10 relative">
                  <span className="text-[9px] font-mono uppercase tracking-widest block font-bold text-cyan-100">Total Inventory</span>
                  <strong className="text-3xl font-black leading-none block">{totalUnits} Rooms</strong>
                  <p className="text-[10px] text-cyan-50/95">Mapped floor matrices</p>
                </div>
                <Building2 className="absolute right-4 top-4 text-white/15 w-14 h-14 pointer-events-none group-hover:scale-110 transition-transform duration-300" />
                <div className="bg-black/10 text-white/80 group-hover:bg-black/15 text-[9px] py-1 text-center font-bold uppercase tracking-wider absolute bottom-0 left-0 right-0 rounded-b-3xl transition-colors">
                  View Floors <ArrowRight className="inline-block w-3 h-3 ml-1" />
                </div>
              </div>

              {/* Box 2: Active Hold Locked (Amber) */}
              <div 
                onClick={() => setDevSubTab("crm")}
                className="bg-amber-500 text-white rounded-3xl p-5 shadow-sm relative overflow-hidden group cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all"
              >
                <div className="inner space-y-1 z-10 relative">
                  <span className="text-[9px] font-mono uppercase tracking-widest block font-bold text-amber-100">Hold Locked</span>
                  <strong className="text-3xl font-black leading-none block">{reservedUnits} Reserved</strong>
                  <p className="text-[10px] text-amber-50/95">Awaiting 2% downpayment</p>
                </div>
                <Lock className="absolute right-4 top-4 text-white/15 w-14 h-14 pointer-events-none group-hover:scale-110 transition-transform duration-300" />
                <div className="bg-black/10 text-white/80 group-hover:bg-black/15 text-[9px] py-1 text-center font-bold uppercase tracking-wider absolute bottom-0 left-0 right-0 rounded-b-3xl transition-colors">
                  Manage Leads <ArrowRight className="inline-block w-3 h-3 ml-1" />
                </div>
              </div>

              {/* Box 3: Cleared Escrow Deed (Green) */}
              <div 
                onClick={() => setDevSubTab("crm")}
                className="bg-emerald-500 text-white rounded-3xl p-5 shadow-sm relative overflow-hidden group cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all"
              >
                <div className="inner space-y-1 z-10 relative">
                  <span className="text-[9px] font-mono uppercase tracking-widest block font-bold text-emerald-100">Escrow Cleared</span>
                  <strong className="text-3xl font-black leading-none block">{soldUnits} Sold out</strong>
                  <p className="text-[10px] text-emerald-50/95">Title deeds generated</p>
                </div>
                <ShieldCheck className="absolute right-4 top-4 text-white/15 w-14 h-14 pointer-events-none group-hover:scale-110 transition-transform duration-300" />
                <div className="bg-black/10 text-white/80 group-hover:bg-black/15 text-[9px] py-1 text-center font-bold uppercase tracking-wider absolute bottom-0 left-0 right-0 rounded-b-3xl transition-colors">
                  Escrow Ledgers <ArrowRight className="inline-block w-3 h-3 ml-1" />
                </div>
              </div>

              {/* Box 4: Available Spot (Blue/Indigo) */}
              <div 
                onClick={() => setDevSubTab("inventory")}
                className="bg-indigo-500 text-white rounded-3xl p-5 shadow-sm relative overflow-hidden group cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all"
              >
                <div className="inner space-y-1 z-10 relative">
                  <span className="text-[9px] font-mono uppercase tracking-widest block font-bold text-indigo-100">Available Spot</span>
                  <strong className="text-3xl font-black leading-none block">{availableUnits} Free</strong>
                  <p className="text-[10px] text-indigo-50/95">Open for live booking</p>
                </div>
                <Activity className="absolute right-4 top-4 text-white/15 w-14 h-14 pointer-events-none group-hover:scale-110 transition-transform duration-300" />
                <div className="bg-black/10 text-white/80 group-hover:bg-black/15 text-[9px] py-1 text-center font-bold uppercase tracking-wider absolute bottom-0 left-0 right-0 rounded-b-3xl transition-colors">
                  Check Units <ArrowRight className="inline-block w-3 h-3 ml-1" />
                </div>
              </div>

            </div>

            {/* Income forecast visualization chart */}
            <div className="bg-neutral-950 text-white p-6 rounded-3xl border border-neutral-800 space-y-4">
              <strong className="text-sm font-bold uppercase font-mono text-neutral-400 block pb-1 border-b border-neutral-900">
                Constructed Milestone Escrow Drawdown projections
              </strong>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-820 space-y-1">
                  <span className="text-[9px] text-neutral-500 font-mono block">Secured client deposit hold (2%)</span>
                  <strong className="text-xl font-black font-mono text-white">${(bookingsCount * 2500).toLocaleString()} USD</strong>
                  <p className="text-[9px] text-neutral-400">Locked inside central Escrow bank ledger.</p>
                </div>
                <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-820 space-y-1">
                  <span className="text-[9px] text-neutral-500 font-mono block">Awaiting pre-sales 20% release</span>
                  <strong className="text-xl font-black font-mono text-amber-400">${(reservedUnits * 24000).toLocaleString()}</strong>
                  <p className="text-[9px] text-rose-400">Triggers on certified foundation pile levels.</p>
                </div>
                <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-820 space-y-1">
                  <span className="text-[9px] text-neutral-500 font-mono block">Platform commission saas cuts (2.5%)</span>
                  <strong className="text-xl font-black font-mono text-white">${(soldUnits * 3200).toLocaleString()}</strong>
                  <p className="text-[9px] text-neutral-400">Platform billing fee deducted at handover schedules.</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ================= SUBTAB: ADD PROPERTY / PRODUCT ENGINE ================= */}
        {devSubTab === "add_property" && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
                <div>
                  <h3 className="text-xl font-black text-neutral-900 uppercase tracking-tight">Sovereign Property Creator</h3>
                  <p className="text-xs text-neutral-500">Configure new properties with live multi-storey nested tower inventory, beautiful visual imagery, and metadata SEO attributes.</p>
                </div>
                <span className="bg-neutral-950 text-white font-mono font-bold text-[9px] px-2 py-1 rounded">
                  Status: Connected Live Server
                </span>
              </div>

              {/* Creator vs Editor Mode Selectors */}
              <div className="flex bg-stone-100 p-1.5 rounded-2xl border border-stone-200 w-fit gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setPropertyEditorMode("create");
                    setProjName("");
                    setProjSlug("");
                    setProjTagline("");
                    setProjDescription("");
                    setProjVRUrl("");
                    setProjTikTokVideos("");
                    setProjIsInternational(false);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    propertyEditorMode === "create"
                      ? "bg-white text-neutral-950 shadow-sm"
                      : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  ➕ Create New Property
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPropertyEditorMode("edit");
                    if (activeProject) {
                      setProjName(activeProject.name);
                      setProjSlug(activeProject.id);
                      setProjLocation(activeProject.location);
                      setProjTagline(activeProject.tagline || "");
                      setProjDescription(activeProject.description || "");
                      setProjPriceRange(activeProject.priceRange || "");
                      setProjCompletionDate(activeProject.completionDate || "");
                      setProjRentalYield(activeProject.roiRentalYield || "");
                      setProjCapitalAppreciation(activeProject.roiCapitalAppreciation || "");
                      setProjAmenities(activeProject.amenities || []);
                      setProjLocationHighlights(activeProject.locationHighlights || []);
                      setProjVRUrl(activeProject.vrTourUrl || "");
                      setProjWhatsapp(activeProject.whatsappPhone || "+254712345678");
                      setProjDroneUrl(activeProject.droneVideoUrl || "");
                      setProjCurrency(activeProject.currency || "USD");
                      setProjDepositPercent(activeProject.bookingDepositPercent || 2);
                      setProjTikTokVideos(activeProject.tiktokVideos ? activeProject.tiktokVideos.join(", ") : "");
                      setProjIsInternational(activeProject.isInternational || false);
                    }
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    propertyEditorMode === "edit"
                      ? "bg-white text-neutral-950 shadow-sm"
                      : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  📝 Edit "{activeProject?.name || "Active Property"}"
                </button>
              </div>

              {/* Predefined High-Yield Presets to accelerate testing */}
              <div className="bg-stone-50 p-5 rounded-2xl border border-stone-100 space-y-3">
                <span className="text-[10px] uppercase font-mono font-black text-neutral-500 block">Accelerated Workspace Presets</span>
                <p className="text-xs text-neutral-500">Load pristine Nairobi offplan configurations instantly to verify automated layouts, coordinates, and real-time synchronizations.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => handleApplyPreset("boutique")}
                    className="p-3 rounded-xl border border-stone-200 bg-white text-left hover:border-amber-400 hover:shadow-sm transition-all"
                  >
                    <strong className="text-xs text-neutral-900 block font-bold">Lavington Edge Suites</strong>
                    <span className="text-[10px] text-neutral-500 block">4 Floors Boutique concept • 10.5% ROI</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset("tall_tower")}
                    className="p-3 rounded-xl border border-stone-200 bg-white text-left hover:border-amber-400 hover:shadow-sm transition-all"
                  >
                    <strong className="text-xs text-neutral-900 block font-bold">Kilimani Crown Towers</strong>
                    <span className="text-[10px] text-neutral-500 block">5 Floors Skylounge concept • 12% ROI</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset("gated_suburb")}
                    className="p-3 rounded-xl border border-stone-200 bg-white text-left hover:border-amber-400 hover:shadow-sm transition-all"
                  >
                    <strong className="text-xs text-neutral-900 block font-bold">Runda Oak Villas</strong>
                    <span className="text-[10px] text-neutral-500 block">2 Floors Gated Forest luxury • 8.5% ROI</span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleAddProjectSubmit} className="space-y-8">
                {/* Error & Success States */}
                {addProjectError && (
                  <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-mono">
                    ⚠️ {addProjectError}
                  </div>
                )}
                {addProjectSuccess && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-mono">
                    🎉 {addProjectSuccess}
                  </div>
                )}

                {/* Section 1: Basic Info & Financial Projections */}
                <div className="space-y-4">
                  <strong className="text-xs uppercase tracking-wider font-mono text-neutral-400 block border-b border-stone-100 pb-2">
                    1. Basic & Financial Characteristics
                  </strong>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-mono font-bold text-neutral-600 block mb-1">Development name</label>
                      <input
                        type="text"
                        required
                        value={projName}
                        onChange={(e) => handleProjNameChange(e.target.value)}
                        placeholder="e.g. Westlands Prestige Towers"
                        className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-white text-neutral-900 focus:outline-none focus:border-amber-400 cursor-text"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono font-bold text-neutral-600 block mb-1">Dynamic unique URL handle (Slug)</label>
                      <input
                        type="text"
                        required
                        value={projSlug}
                        onChange={(e) => setProjSlug(e.target.value)}
                        placeholder="e.g. westlands-prestige-towers"
                        className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-stone-50 text-neutral-600 font-mono focus:outline-none focus:border-amber-400 font-semibold cursor-text"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[11px] font-mono font-bold text-neutral-600 block mb-1">Location Address</label>
                      <input
                        type="text"
                        value={projLocation}
                        onChange={(e) => setProjLocation(e.target.value)}
                        className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono font-bold text-neutral-600 block mb-1">Price Range Label</label>
                      <input
                        type="text"
                        value={projPriceRange}
                        onChange={(e) => setProjPriceRange(e.target.value)}
                        className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono font-bold text-neutral-600 block mb-1">Completion target</label>
                      <input
                        type="text"
                        value={projCompletionDate}
                        onChange={(e) => setProjCompletionDate(e.target.value)}
                        className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[11px] font-mono font-bold text-neutral-600 block mb-1">Offplan short tagline</label>
                      <input
                        type="text"
                        value={projTagline}
                        onChange={(e) => setProjTagline(e.target.value)}
                        placeholder="Eco-luxury boutique styling with green terraces"
                        className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono font-bold text-neutral-600 block mb-1">Estimated annual yield</label>
                      <input
                        type="text"
                        value={projRentalYield}
                        onChange={(e) => setProjRentalYield(e.target.value)}
                        placeholder="e.g. 11.2%"
                        className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono font-bold text-neutral-600 block mb-1">Appreciation prospects</label>
                      <input
                        type="text"
                        value={projCapitalAppreciation}
                        onChange={(e) => setProjCapitalAppreciation(e.target.value)}
                        placeholder="e.g. 14.5%"
                        className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono font-bold text-neutral-600 block mb-1">Development description</label>
                    <textarea
                      rows={3}
                      value={projDescription}
                      onChange={(e) => setProjDescription(e.target.value)}
                      placeholder="An elegant architectural masterpiece rising in premium Nairobi, offering residents unprecedented access..."
                      className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* International Category Specific Tuning */}
                  <div className="bg-amber-50/40 p-5 rounded-2xl border border-amber-200/60 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 bg-amber-400 text-neutral-950 rounded-lg text-xs font-bold font-mono">🌍 DUBAI PLATINUM</span>
                      <h4 className="text-xs font-bold text-amber-950 uppercase tracking-widest leading-none">International Luxury Real Estate Channel</h4>
                    </div>
                    <p className="text-[11px] text-zinc-500 max-w-xl leading-relaxed">
                      Enable this to syndicate this listing directly onto the **Dubai luxury Portfolio**. International properties bypass the Nairobi SEO indexing registry and load directly into international landing terminals (e.g., DAMAC, Emirates, or Dubai Marina highlights).
                    </p>
                    <div className="flex items-center gap-3 pt-1">
                      <input
                        type="checkbox"
                        id="is-international-sync"
                        checked={projIsInternational}
                        onChange={(e) => setProjIsInternational(e.target.checked)}
                        className="w-4.5 h-4.5 rounded text-amber-500 focus:ring-amber-500 border-stone-300 accent-amber-550 cursor-pointer"
                      />
                      <label htmlFor="is-international-sync" className="text-xs font-extrabold text-neutral-900 cursor-pointer select-none">
                        Syndicate as International Luxury Property Listing (e.g. Dubai DAMAC Towers, Burj Khalifa Precinct)
                      </label>
                    </div>
                  </div>

                  {/* Dynamic Launch Media & Currency Rules */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                    <div>
                      <label className="text-[11px] font-mono font-bold text-neutral-600 block mb-1">Currency Standard</label>
                      <select
                        value={projCurrency}
                        onChange={(e) => setProjCurrency(e.target.value)}
                        className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-white"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="KES">KES (KES)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-mono font-bold text-neutral-600 block mb-1">Lock Hold Deposit (%)</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={projDepositPercent}
                        onChange={(e) => setProjDepositPercent(Number(e.target.value))}
                        className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[11px] font-mono font-bold text-neutral-600 block mb-1">Walkthrough VR Space Embed URL</label>
                      <input
                        type="text"
                        value={projVRUrl}
                        onChange={(e) => setProjVRUrl(e.target.value)}
                        placeholder="e.g. https://vr.justeasy.cn/view/1u7w11x77w0v81s0-1758796643.html"
                        className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-white font-mono"
                      />
                    </div>
                    <div className="md:col-span-4">
                      <label className="text-[11px] font-mono font-bold text-neutral-600 block mb-1">Drone Flyby Video Embed / iframe URL</label>
                      <input
                        type="text"
                        value={projDroneUrl}
                        onChange={(e) => setProjDroneUrl(e.target.value)}
                        placeholder="e.g. https://www.youtube.com/embed/..."
                        className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-white font-mono"
                      />
                    </div>
                    <div className="md:col-span-4">
                      <label className="text-[11px] font-mono font-bold text-neutral-600 block mb-1">TikTok Showcase Video Links (Comma-separated video URLs)</label>
                      <input
                        type="text"
                        value={projTikTokVideos}
                        onChange={(e) => setProjTikTokVideos(e.target.value)}
                        placeholder="e.g. https://www.tiktok.com/@propsphere/video/72123456789, https://www.tiktok.com/@propsphere/video/72987654321"
                        className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-white font-mono"
                      />
                      <span className="text-[10px] text-stone-400 mt-1 block">
                        Add links to TikTok media showcasing properties in portrait form. These render inside an immersive, touch-optimized TikTok-style video reel on the property page.
                      </span>
                    </div>
                    <div className="md:col-span-4">
                      <label className="text-[11px] font-mono font-bold text-neutral-600 block mb-1">Developer Inquiry WhatsApp Number (International format)</label>
                      <input
                        type="text"
                        value={projWhatsapp}
                        onChange={(e) => setProjWhatsapp(e.target.value)}
                        placeholder="e.g. +254712345678"
                        className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-white font-mono text-black font-semibold"
                      />
                      <span className="text-[10px] text-stone-400 mt-1 block">
                        Used on the property details page. When clients click the inquiry button, they will be redirected to WhatsApp with your customized property details automatically loaded.
                      </span>
                    </div>
                  </div>

                  {/* Amenities List & Custom Input inside Developer Dashboard */}
                  <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-4">
                    <div>
                      <strong className="text-xs uppercase tracking-wider font-mono text-neutral-500 block mb-1">Property Amenities & DNA Features Checklist</strong>
                      <p className="text-[10px] text-stone-400">Specify, toggle, or add custom design amenities. These will render as pristine uneditable view badges on your frontend catalog profile page.</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {projAmenities.length === 0 ? (
                        <span className="text-xs text-stone-400 italic">No amenities allocated yet. Toggle presets below or type a custom feature.</span>
                      ) : (
                        projAmenities.map((amenity, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-300 text-xs px-3 py-1 rounded-full font-bold shadow-sm">
                            {amenity}
                            <button
                              type="button"
                              onClick={() => setProjAmenities(prev => prev.filter(a => a !== amenity))}
                              className="text-amber-500 hover:text-amber-700 font-extrabold focus:outline-none ml-1.5 text-sm leading-none"
                              title="Remove amenity"
                            >
                              &times;
                            </button>
                          </span>
                        ))
                      )}
                    </div>

                    <div className="flex gap-2 max-w-md">
                      <input
                        type="text"
                        placeholder="e.g. Roof lounge solar canopy, squash courts..."
                        value={newAmenity}
                        onChange={(e) => setNewAmenity(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (newAmenity.trim() && !projAmenities.includes(newAmenity.trim())) {
                              setProjAmenities(prev => [...prev, newAmenity.trim()]);
                              setNewAmenity("");
                            }
                          }
                        }}
                        className="flex-1 bg-white border border-stone-200 text-xs px-3 py-2.5 rounded-xl outline-none focus:border-amber-400 text-black font-semibold"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newAmenity.trim() && !projAmenities.includes(newAmenity.trim())) {
                            setProjAmenities(prev => [...prev, newAmenity.trim()]);
                            setNewAmenity("");
                          }
                        }}
                        className="bg-neutral-950 text-white hover:bg-neutral-800 text-xs font-black px-4 py-2.5 rounded-xl transition-colors shrink-0 uppercase tracking-wider"
                      >
                        + Add Feature
                      </button>
                    </div>

                    <div className="pt-2 border-t border-stone-200">
                      <span className="text-[10px] uppercase font-mono font-bold text-neutral-400 block mb-2">Preset Accents Suggestions</span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          "Heated Rooftop Infinity Pool",
                          "Duplex Wellness Center & Yoga Deck",
                          "Private Residents Cinema Room",
                          "Full Backup Generator & Borehole",
                          "24/7 Smart Security & Reception",
                          "Children's Soft Play Area",
                          "Rooftop Coffee Lounge",
                          "EV Car Charging Terminals",
                          "Solar Panel Water Heating Systems",
                          "Private lift access directly into your residence"
                        ].map((preset) => {
                          const isSelected = projAmenities.includes(preset);
                          return (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => {
                                if (isSelected) {
                                  setProjAmenities(prev => prev.filter(a => a !== preset));
                                } else {
                                  setProjAmenities(prev => [...prev, preset]);
                                }
                              }}
                              className={`text-[10px] px-2.5 py-1 rounded-lg border font-mono transition-all duration-200 ${
                                isSelected
                                  ? "bg-neutral-900 border-neutral-950 text-amber-400 font-bold"
                                  : "bg-white border-stone-200 text-neutral-500 hover:border-stone-400"
                              }`}
                            >
                              {preset} {isSelected ? "✓" : "+"}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Structured Towers & Multi-storey grid configurations */}
                <div className="space-y-4 bg-stone-50 p-5 rounded-2xl border border-stone-100">
                  <strong className="text-xs uppercase tracking-wider font-mono text-neutral-500 block border-b border-stone-200 pb-2">
                    2. Dynamic Multi-Storey Tower config (No simulation)
                  </strong>
                  <p className="text-xs text-neutral-500 font-mono">
                    Constructs an instant scalable floor layout. On creation, this generator populates the database and builds the physical digital twin rooms automatically.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[11px] font-mono font-bold text-neutral-700 block mb-1">Tower prefix name</label>
                      <input
                        type="text"
                        value={newTowerName}
                        onChange={(e) => setNewTowerName(e.target.value)}
                        className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono font-bold text-neutral-700 block mb-1">Floors count</label>
                      <select
                        value={numFloorsToG}
                        onChange={(e) => setNumFloorsToG(Number(e.target.value))}
                        className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-white"
                      >
                        {[2, 3, 4, 5, 6, 8].map((n) => (
                          <option key={n} value={n}>{n} Floors</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-mono font-bold text-neutral-700 block mb-1">Units per floor</label>
                      <select
                        value={unitsPerFToG}
                        onChange={(e) => setUnitsPerFToG(Number(e.target.value))}
                        className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-white"
                      >
                        {[2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>{n} Rooms per floor</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[11px] font-mono font-bold text-neutral-700 block mb-1">Base Room Price (USD)</label>
                      <input
                        type="number"
                        value={baseUnitPriceG}
                        onChange={(e) => setBaseUnitPriceG(Number(e.target.value))}
                        className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono font-bold text-neutral-700 block mb-1">Default Unit Category</label>
                      <select
                        value={baseUnitTypeG}
                        onChange={(e) => setBaseUnitTypeG(e.target.value)}
                        className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-white"
                      >
                        <option value="Executive Studio">Executive Studio</option>
                        <option value="1 Bedroom Premium">1 Bedroom Premium</option>
                        <option value="2 Bedroom Sky Suite">2 Bedroom Sky Suite</option>
                        <option value="3 Bedroom Signature Duplex">3 Bedroom Signature Duplex</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-mono font-bold text-neutral-700 block mb-1">Room Size Label</label>
                      <input
                        type="text"
                        value={baseUnitSizeG}
                        onChange={(e) => setBaseUnitSizeG(e.target.value)}
                        className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Virtual images asset list */}
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-3">
                    <div>
                      <strong className="text-xs uppercase tracking-wider font-mono text-neutral-800 block">
                        3. Immersive Virtual Spaces & Asset Metadata Manager
                      </strong>
                      <p className="text-xs text-neutral-500 mt-1">
                        Drag & drop renderings, customize titles, auto-generate AI descriptors, and fine-tune SEO alt metadata tags.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Executive Cigar Lounge"
                        value={newSceneTitle}
                        onChange={(e) => setNewSceneTitle(e.target.value)}
                        className="text-[11px] px-3 py-1.5 rounded-lg border border-stone-200 bg-white font-sans max-w-[180px] focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomScene}
                        className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-mono text-[10px] uppercase font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Scene
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {virtualTours.map((tour) => {
                      const isDragActive = dragActiveStates[tour.key] || false;
                      const isCustom = tour.key.startsWith("custom_");

                      return (
                        <div 
                          key={tour.key} 
                          className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 hover:border-stone-300 transition-all grid grid-cols-1 lg:grid-cols-12 gap-5 relative group/card"
                        >
                          {/* Image preview / drag and drop zone */}
                          <div className="lg:col-span-4 flex flex-col gap-2">
                            <label className="text-[10px] uppercase font-mono font-bold text-neutral-500 block">
                              Scene Viewport Image File/URL
                            </label>
                            
                            <div
                              onDragOver={(e) => handleDragOver(e, tour.key)}
                              onDragLeave={(e) => handleDragLeave(e, tour.key)}
                              onDrop={(e) => handleDrop(e, tour.key)}
                              className={`h-36 rounded-xl border-2 border-dashed relative overflow-hidden transition-all flex flex-col items-center justify-center cursor-pointer ${
                                isDragActive 
                                  ? "border-amber-400 bg-amber-50/50" 
                                  : "border-stone-200 hover:border-neutral-400 bg-white"
                              }`}
                              onClick={() => document.getElementById(`file-input-${tour.key}`)?.click()}
                            >
                              {tour.url ? (
                                <div className="absolute inset-0 w-full h-full group">
                                  <img 
                                    src={tour.url} 
                                    alt={tour.title} 
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                    <FileUp className="w-6 h-6 text-white" />
                                    <span className="text-[10px] text-white font-mono uppercase tracking-wider font-bold">
                                      Drop to Replace
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-center p-4 space-y-1">
                                  <FileUp className="w-7 h-7 text-stone-400 mx-auto" />
                                  <span className="text-[10px] font-mono text-neutral-500 block uppercase font-bold">
                                    Drag & Drop or Click
                                  </span>
                                  <span className="text-[9px] text-neutral-400 block">
                                    PNG, JPG, WebP up to 10MB
                                  </span>
                                </div>
                              )}
                            </div>

                            <input 
                              type="file" 
                              id={`file-input-${tour.key}`}
                              accept="image/*"
                              className="hidden" 
                              onChange={(e) => handleFileChange(e, tour.key)}
                            />

                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] text-neutral-400 font-mono block">Image Path/URL:</span>
                              <input
                                type="text"
                                value={tour.url}
                                onChange={(e) => updateTourField(tour.key, "url", e.target.value)}
                                className="flex-1 text-[9px] bg-transparent font-mono text-stone-500 hover:text-stone-700 focus:text-stone-800 border-none p-0 focus:outline-none focus:ring-0 overflow-ellipsis truncate"
                                title={tour.url}
                                placeholder="Paste manual URL path"
                              />
                            </div>
                          </div>

                          {/* Controls column */}
                          <div className="lg:col-span-8 flex flex-col justify-between gap-3">
                            <div className="space-y-2.5">
                              {/* Header Title with Custom action */}
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-[9px] uppercase font-mono font-bold px-2 py-0.5 rounded-md bg-stone-200 text-stone-700">
                                    {tour.key === "livingRoom" ? "Living Room View" :
                                     tour.key === "kitchen" ? "Gourmet Kitchen" :
                                     tour.key === "masterBedroom" ? "Master Bedroom" :
                                     tour.key === "balconyView" ? "Outdoor Terrace" :
                                     tour.key === "amenities" ? "Amenities / Rooftop" :
                                     tour.key.startsWith("custom_") ? "Custom Space Room" : tour.key}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => triggerAIAssistForTour(tour.key, tour.title)}
                                    className="px-2 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-[9px] uppercase font-mono font-bold flex items-center gap-1 transition-all active:scale-95"
                                    title="Auto-generate AI marketing descriptions and optimized search engine rankings tags"
                                  >
                                    <Sparkles className="w-3 h-3" />
                                    AI Assist Draft
                                  </button>
                                  {isCustom && (
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteScene(tour.key)}
                                      className="p-1 text-stone-400 hover:text-red-500 rounded transition-colors"
                                      title="Remove Custom Scene"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* On-screen inputs */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <label className="text-[10px] font-mono font-bold text-stone-600 block mb-0.5">
                                    Space Architectural Title
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    value={tour.title}
                                    onChange={(e) => updateTourField(tour.key, "title", e.target.value)}
                                    placeholder="e.g. Summit Infinity Deck"
                                    className="w-full text-[11px] py-1.5 px-3 rounded-lg border border-stone-200 bg-white font-sans focus:outline-none focus:ring-1 focus:ring-amber-500"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-mono font-bold text-stone-600 block mb-0.5">
                                    SEO Target Alt Tag
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    value={tour.seoAlt}
                                    onChange={(e) => updateTourField(tour.key, "seoAlt", e.target.value)}
                                    placeholder="seo-keywords, luxury-nairobi-apartments"
                                    className="w-full text-[11px] py-1.5 px-3 rounded-lg border border-stone-200 bg-white font-sans focus:outline-none focus:ring-1 focus:ring-amber-500"
                                  />
                                </div>
                              </div>

                              {/* Copilot conversational AI assistant description */}
                              <div>
                                <label className="text-[10px] font-mono font-bold text-stone-600 block mb-0.5">
                                  AI Conversational Helper Companion Description
                                </label>
                                <textarea
                                  required
                                  rows={2}
                                  value={tour.aiDescription}
                                  onChange={(e) => updateTourField(tour.key, "aiDescription", e.target.value)}
                                  placeholder="Describe layouts, premium finish materials, key features. The PropSphere Conversational AI uses this context verbatim to detail the property to potential leads..."
                                  className="w-full text-[11px] p-2.5 rounded-lg border border-stone-200 bg-white font-sans focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none leading-relaxed"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Section 4: Property SEO Metadata Package */}
                <div className="space-y-4 bg-amber-50/20 p-5 rounded-2xl border border-amber-200/40">
                  <div className="flex items-center gap-2 border-b border-amber-100 pb-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <strong className="text-xs uppercase tracking-wider font-mono text-neutral-800 block">
                      4. Real Estate SEO Metadata (Google & Search engines optimization)
                    </strong>
                  </div>
                  <p className="text-xs text-neutral-600 font-medium">Configure active search rankings tags dynamically synchronized with the brand name.</p>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-mono font-bold text-neutral-700 block mb-1">Custom SEO Title tag</label>
                      <input
                        type="text"
                        value={seoTitle}
                        onChange={(e) => setSeoTitle(e.target.value)}
                        className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-white text-neutral-900 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono font-bold text-neutral-700 block mb-1">Search description tag</label>
                      <input
                        type="text"
                        value={seoDescription}
                        onChange={(e) => setSeoDescription(e.target.value)}
                        className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono font-bold text-neutral-700 block mb-1">Keywords Index tags</label>
                      <input
                        type="text"
                        value={seoKeywords}
                        onChange={(e) => setSeoKeywords(e.target.value)}
                        placeholder="nairobi, property offplan, investment house"
                        className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-white font-mono text-neutral-700 text-[11px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => {
                      setProjName("");
                      setProjSlug("");
                      setProjTagline("");
                      setProjDescription("");
                      setAddProjectError(null);
                      setAddProjectSuccess(null);
                    }}
                    className="px-5 py-3 rounded-xl border border-stone-200 text-xs font-bold text-neutral-700 hover:bg-stone-50"
                  >
                    Clear Workspace
                  </button>
                  <button
                    type="submit"
                    disabled={isAddingProject}
                    className="bg-neutral-900 text-white hover:bg-neutral-850 px-6 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
                  >
                    {isAddingProject ? (
                      <>
                        <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        {propertyEditorMode === "edit" ? "Synchronizing changes..." : "Registering Property Workspace..."}
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        {propertyEditorMode === "edit" ? "Save Project Changes" : "Deploy Active Development Space"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= SUBTAB: INVENTORY MANAGEMENT ENGINE ================= */}
        {devSubTab === "inventory" && (
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-neutral-950 uppercase tracking-tight">Active Inventory Ledger Engine</h3>
                <p className="text-xs text-neutral-500">Edit unit-status records, adjust base pricing formulas, or apply flash discounts.</p>
              </div>
              <span className="bg-neutral-950 text-white font-mono font-bold text-[9px] px-2 py-0.5 rounded">
                Durable CRM Linked
              </span>
            </div>

            {/* Quick Adjustment Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              
              <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-4">
                <strong className="text-xs uppercase font-mono text-neutral-400 block tracking-wider">Unit State Control console</strong>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono font-bold text-neutral-400 block">Select Block / Tower</label>
                    <select
                      value={selectedTower}
                      onChange={(e) => setSelectedTower(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3.5 py-2 text-xs"
                    >
                      <option value="">-- Choose Tower --</option>
                      {activeProject.towers.map(t => (
                        <option key={t.name} value={t.name}>{t.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono font-bold text-neutral-400 block">Select Unit Number</label>
                    <select
                      value={selectedUnit}
                      onChange={(e) => setSelectedUnit(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3.5 py-2 text-xs"
                    >
                      <option value="">-- Choose Unit --</option>
                      {selectedTower && activeProject.towers.find(t => t.name === selectedTower)?.floors.map(fl => (
                        fl.units.map(u => (
                          <option key={u.number} value={u.number}>{u.number} ({formatPrice ? formatPrice(u.price, activeProject) : `$${u.price.toLocaleString()}`} - {u.status})</option>
                        ))
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono font-bold text-neutral-400 block">New Reservation Status</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3.5 py-2 text-xs"
                    >
                      <option value="Available">Available</option>
                      <option value="Reserved">Reserved</option>
                      <option value="Sold">Sold</option>
                      <option value="Coming Soon">Coming Soon</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono font-bold text-neutral-400 block">Friday Drops Event Highlighter</label>
                    <select
                      value={newFlexStatus}
                      onChange={(e) => setNewFlexStatus(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3.5 py-2 text-xs"
                    >
                      <option value="Available">No Highlight</option>
                      <option value="Purple">Mark as FLASH DEALS (Purple border/glow)</option>
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      if (!selectedTower || !selectedUnit) {
                        alert("Select Tower and Unit first!");
                        return;
                      }
                      onUpdateUnit(selectedTower, selectedUnit, newStatus, newFlexStatus);
                      alert(`Successfully synchronized ${selectedUnit} status on Proposphere ledger.`);
                    }}
                    className="w-full bg-neutral-950 hover:bg-stone-850 text-white font-extrabold text-xs py-3 rounded-xl uppercase tracking-widest cursor-pointer"
                  >
                    Sync State Ledger
                  </button>
                </div>
              </div>

              {/* Current units layout grid overview */}
              <div className="space-y-3">
                <strong className="text-xs uppercase font-mono text-neutral-400 block tracking-wider">Unit Layout Ledger</strong>
                
                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                  {activeProject.towers.map(t => (
                    <div key={t.name} className="border border-stone-150 rounded-xl p-3 bg-stone-50 space-y-2">
                      <strong className="text-xs text-neutral-900 block font-mono">{t.name} Towers Structure</strong>
                      <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
                        {t.floors.flatMap(fl => fl.units).map(u => (
                          <div 
                            key={u.number} 
                            onClick={() => {
                              setSelectedTower(t.name);
                              setSelectedUnit(u.number);
                              setNewStatus(u.status);
                            }}
                            className={`p-1.5 rounded border cursor-pointer font-bold transition-all ${
                              u.status === "Available" 
                                ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                                : u.status === "Reserved" 
                                ? "bg-amber-50 border-amber-300 text-amber-800" 
                                : "bg-stone-200 border-stone-300 text-neutral-500"
                            }`}
                          >
                            <span>{u.number}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ================= SUBTAB: TENANT ORG, WORKSPACES & TEAM MEMBER SECURITY ================= */}
        {devSubTab === "tenant_saas" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl text-white space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="bg-amber-400 text-neutral-950 font-mono font-bold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
                    SaaS Organization Environment
                  </span>
                  <h3 className="text-xl font-black mt-1 uppercase tracking-tight">
                    {organization?.name || "Premium Real Estate Spaces"}
                  </h3>
                  <p className="text-stone-400 text-xs">
                    Tenant ID: <span className="font-mono text-amber-300">{organization?.id || "org-premium-spaces"}</span> • Domain: <span className="font-mono text-white">{organization?.domain || "propsphere.com"}</span>
                  </p>
                </div>
                <div className="bg-neutral-800 border border-neutral-700 px-4 py-2.5 rounded-2xl flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <div className="text-left">
                    <span className="text-[9px] uppercase font-mono text-neutral-400 block font-semibold leading-none">Security Shield</span>
                    <span className="text-xs font-bold font-mono text-white">ACTIVE SHIELD LOCK</span>
                  </div>
                </div>
              </div>

              {/* Connected isolated workspaces info cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-850 space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-neutral-400 block">Workspace Isolation</span>
                  <strong className="text-sm block text-amber-400">Isolated Cloud Firestore Partition</strong>
                  <p className="text-[10px] text-neutral-400 leading-normal">
                    Cryptographically locked. Cross-tenant reads are prevented at the router endpoint & security policy layers.
                  </p>
                </div>
                <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-850 space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-neutral-400 block">Active Team Members</span>
                  <strong className="text-sm block text-white">{teamMembers.length} Accounts Bound</strong>
                  <p className="text-[10px] text-neutral-400 leading-normal">
                    Role-Based Access Control (RBAC) active. Actions are tracked in the non-repudiation audit ledger.
                  </p>
                </div>
                <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-850 space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-neutral-400 block">Active Workspace ID</span>
                  <strong className="text-sm block text-amber-400 font-mono">{(workspaces[0]?.id) || "ws-premium-spaces"}</strong>
                  <p className="text-[10px] text-neutral-400 leading-normal">
                    Primary multi-tower repository assigned. All project records, tours, CRM data bind exclusively to this scope.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Team Members Management Panel (5 cols) */}
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm lg:col-span-6 space-y-6">
                <div>
                  <h4 className="text-sm uppercase font-black tracking-wider text-neutral-950 flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-500" /> Team & Workspace Roles
                  </h4>
                  <p className="text-xs text-stone-500 mt-1 leading-normal">
                    Manage project developer access within your isolated cloud container.
                  </p>
                </div>

                {/* Invite Inline form */}
                <form onSubmit={handleInviteMember} className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
                  <strong className="text-[11px] uppercase font-bold text-neutral-500 block">Provision New Team Member</strong>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-mono font-bold text-neutral-400 block">Full Name</label>
                      <input
                        type="text"
                        placeholder="e.g. John K."
                        value={inviteName}
                        onChange={(e) => setInviteName(e.target.value)}
                        className="w-full bg-white border border-stone-250 rounded-xl px-3 py-1.5 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-mono font-bold text-neutral-400 block">Email Address</label>
                      <input
                        type="email"
                        placeholder="john@propsphere.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className="w-full bg-white border border-stone-250 rounded-xl px-3 py-1.5 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-1">
                    <div className="flex items-center gap-2">
                      <label className="text-[9px] uppercase font-mono font-bold text-neutral-400">Access Role:</label>
                      <select
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value)}
                        className="bg-white border border-stone-250 rounded-lg px-2 py-1 text-xs"
                      >
                        <option value="Member">Member</option>
                        <option value="Admin">Admin (Full Write Access)</option>
                        <option value="Owner">Owner</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="bg-neutral-950 hover:bg-neutral-850 text-white font-extrabold text-[10px] px-4 py-2 rounded-xl uppercase tracking-wider cursor-pointer"
                    >
                      Provision Member
                    </button>
                  </div>

                  {inviteMsg && (
                    <div className="bg-emerald-50 border border-emerald-150 p-2 text-center rounded-xl text-[11px] font-medium text-emerald-800">
                      {inviteMsg}
                    </div>
                  )}
                </form>

                {/* Team member List */}
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  <strong className="text-[11px] uppercase font-bold text-neutral-400 block tracking-wider">Active Workspace Personnel</strong>
                  {teamMembers.length === 0 ? (
                    <p className="text-xs text-neutral-550 p-4 text-center border border-dashed rounded-xl">No active members found.</p>
                  ) : (
                    teamMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3.5 bg-stone-50 border border-stone-200 rounded-xl">
                        <div>
                          <strong className="text-xs text-neutral-950 block">{member.username}</strong>
                          <span className="text-[10px] text-stone-400 font-mono tracking-tight">{member.userEmail}</span>
                        </div>
                        <div className="text-right">
                          <span className="bg-neutral-950 text-amber-400 border border-neutral-900 font-mono font-extrabold text-[9px] px-2 py-0.5 rounded block uppercase">
                            {member.role}
                          </span>
                          <span className="text-[9px] text-emerald-600 font-bold block mt-1">Status: Active</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Dynamic Non-Repudiation Security Audit Logs (7 cols) */}
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm lg:col-span-6 space-y-4">
                <div>
                  <h4 className="text-sm uppercase font-black tracking-wider text-neutral-950 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-red-500" /> Tenant-Aware Audit Trail
                  </h4>
                  <p className="text-xs text-stone-500 mt-1 leading-normal">
                    Immutable security audit ledger entries of active multi-tenant organization.
                  </p>
                </div>

                <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                  {loadingSaaS ? (
                    <div className="text-center py-10">
                      <div className="w-6 h-6 border-2 border-stone-300 border-t-amber-400 rounded-full animate-spin mx-auto"></div>
                      <p className="text-xs text-stone-400 mt-2">Loading cryptographically locked ledgers...</p>
                    </div>
                  ) : auditLogs.length === 0 ? (
                    <div className="p-8 text-center border-2 border-dashed border-stone-150 rounded-2xl">
                      <p className="text-xs text-stone-400">Security ledger is currently pristine. No actions tracked yet.</p>
                    </div>
                  ) : (
                    auditLogs.map((log) => (
                      <div key={log.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs hover:border-amber-300 transition-all space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="bg-stone-200 text-zinc-800 text-[8px] font-bold px-1.5 py-0.2 rounded font-mono">
                            {log.action}
                          </span>
                          <span className="text-[10px] text-stone-400 font-mono">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-900 leading-normal">{log.details}</p>
                        <div className="flex items-center justify-between text-[9px] text-neutral-400 pt-1 border-t border-stone-100 font-mono">
                          <span>User: {log.userEmail}</span>
                          <span>Workspace: Primary</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ================= SUBTAB: CRM & WHATSAPP QUALIFIER ================= */}
        {devSubTab === "crm" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Qualified leads index list (5 cols) */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm md:col-span-5 space-y-4">
              <strong className="text-xs uppercase font-mono text-neutral-400 block">AI Vetted Sales leads</strong>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {leads.map((l, idx) => (
                  <div key={idx} className="bg-stone-50 p-4.5 rounded-xl border border-stone-200 space-y-1.5 text-xs">
                    <div className="flex justify-between font-bold">
                      <span className="text-neutral-950 font-extrabold">{l.buyerName}</span>
                      <span className="bg-amber-100 border border-amber-200 text-amber-850 px-1 rounded text-[9px]">
                        {l.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 font-mono leading-normal">
                      Phone: {l.phone} • Budget: ${l.budget.toLocaleString()}
                    </p>
                    <p className="text-[10px] italic leading-normal text-stone-600 bg-white p-2 rounded border border-stone-150">
                      <strong>AI Summary:</strong> {l.AIQualificationSummary}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Simulated Live Lead WhatsApp Feed (7 cols) */}
            <div className="bg-emerald-50/20 p-6 rounded-3xl border border-emerald-100 md:col-span-7 space-y-4">
              <strong className="text-xs uppercase font-mono text-emerald-800 block flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-600 fill-current" /> WhatsApp Chat Assistant
              </strong>
              <p className="text-[11px] text-stone-600 leading-normal">
                Every visitor who clicks WhatsApp can chat directly with a virtual assistant or a live agent to get details about the property launch.
              </p>

              {whatsappChats.map((chat, idx) => (
                <div key={idx} className="bg-white p-4 rounded-2xl border border-emerald-100 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <div>
                      <strong className="text-xs text-neutral-900 block">{chat.buyerName}</strong>
                      <span className="text-stone-400 text-[10px]">{chat.phoneNumber}</span>
                    </div>
                    <span className="bg-emerald-50 border border-emerald-150 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded">
                      {chat.status}
                    </span>
                  </div>

                  <div className="space-y-2 h-[180px] overflow-y-auto text-xs pr-1">
                    {chat.messages.map((m, mIdx) => (
                      <div key={mIdx} className={`flex flex-col ${m.sender === "buyer" ? "items-start" : "items-end"}`}>
                        <div className={`p-2 rounded-xl max-w-[85%] leading-relaxed ${
                          m.sender === "buyer" 
                            ? "bg-stone-100 text-neutral-900 shadow-sm" 
                            : "bg-emerald-600 text-white font-medium"
                        }`}>
                          {m.text}
                        </div>
                        <span className="text-[8px] text-stone-400 mt-0.5 font-semibold">{m.timestamp}</span>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => alert("Sovereign sales representative dispatch complete!")}
                    className="w-full bg-emerald-650 hover:bg-emerald-705 text-white font-bold text-xs py-2 rounded-lg text-center font-mono tracking-wide bg-emerald-600 uppercase"
                  >
                    Escalate to Sovereign Live Sales Agent
                  </button>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ================= SUBTAB: AI CHAT BROCHURE TRAINER ================= */}
        {devSubTab === "knowledge" && (
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-wider">AI Knowledge Base Engineering</span>
                <h3 className="text-lg font-black text-neutral-950 tracking-tight">Train Your Gemini Advisory Bot</h3>
              </div>
              <span className="bg-neutral-950 text-white font-mono font-bold text-[9px] px-2 py-0.5 rounded">
                Gemini-3.5-flash
              </span>
            </div>

            <p className="text-xs text-neutral-500 leading-relaxed">
              Before a drop, paste project brochures, interior specs, payment exceptions, or construction reports below. PropSphere retrains the Gemini matchmaker system immediately so client chats query real data, not placeholder answers.
            </p>

            <form onSubmit={handleRetrainSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono font-extrabold text-neutral-400 block">Project Specs Brochure Context (Text/Raw)</label>
                <textarea
                  required
                  rows={6}
                  value={guideText}
                  onChange={(e) => setGuideText(e.target.value)}
                  placeholder="e.g., Tower B concrete is 100% complete. Special 7% discount is now active for foreign buyers who wire the lock fee directly inside June. All 2 bedrooms use natural mahogany wood layouts..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-stone-50 p-4 rounded-xl border border-stone-150">
                <span className="text-[11px] text-stone-500 font-mono leading-tight">
                  ⚡ <strong>SaaS Automation:</strong> This context binds with the system instructions inside the Express server chatbot endpoint.
                </span>
                <button
                  type="submit"
                  disabled={isRetraining}
                  className="bg-amber-400 hover:bg-amber-300 text-neutral-950 font-extrabold text-xs px-6 py-3 rounded-lg uppercase tracking-wider flex items-center gap-1.5 shrink-0"
                >
                  {isRetraining ? (
                    <>
                      <FileUp className="w-4 h-4 animate-bounce" /> Retraining Gemini Hub...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 fill-current" /> Retrain Project Bot
                    </>
                  )}
                </button>
              </div>
            </form>

            {retrainSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-805 p-4 rounded-xl text-xs font-mono font-bold text-center">
                ✓ RETRAIN CYCLE COMPLETE: Gemini model vector specifications successfully updated inside server context!
              </div>
            )}
          </div>
        )}

        {/* ================= SUBTAB: CAMPAIGNS HUB ================= */}
        {devSubTab === "marketing" && (
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-black text-neutral-950 uppercase tracking-tight">Direct Sales Marketing Hub</h3>
              <p className="text-xs text-neutral-500">Blast mass updates, notify active waitlists when drop hours open, and calculate conversion click rates.</p>
            </div>

            <form onSubmit={handleSendCampaign} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end bg-stone-50 p-5 rounded-2xl border border-stone-150">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono text-neutral-400 font-bold block">Campaign Title</label>
                <input
                  type="text"
                  required
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g. Sky-Gardens Floor 4 Launch Live NOW!"
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono text-neutral-400 font-bold block">Delivery Medium</label>
                <select
                  value={campaignMedium}
                  onChange={(e) => setCampaignMedium(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs"
                >
                  <option value="WhatsApp">WhatsApp Blast (Simulated)</option>
                  <option value="Email">Email Blast (Simulated)</option>
                  <option value="SMS">SMS Notification Alert (Simulated)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono text-neutral-400 font-bold block">Target Audience</label>
                <select
                  value={campaignGroup}
                  onChange={(e) => setCampaignGroup(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs"
                >
                  <option value="Waitlisted Buyers (Nairobi Expatriates)">Waitlisted Buyers (Nairobi Expatriates)</option>
                  <option value="Matchmaker Matchers (Budget $100k-$200k)">Matchmaker Matchers ($100k-$200k)</option>
                  <option value="Foreign Luxury Investors (London Corridor)">Foreign Investors (London Hub)</option>
                </select>
              </div>

              <button
                type="submit"
                className="col-span-1 md:col-span-3 bg-neutral-950 hover:bg-stone-850 text-white font-extrabold text-xs py-3 rounded-xl uppercase tracking-widest cursor-pointer"
              >
                Launch Marketing Alert Broadcast
              </button>
            </form>

            <div className="space-y-3">
              <strong className="text-xs uppercase font-mono tracking-wider text-neutral-400 block">Delivered Campaigns history</strong>
              <div className="space-y-3">
                {campaignsList.map((c, idx) => (
                  <div key={idx} className="bg-stone-50 p-4 rounded-xl border border-stone-200 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <div>
                      <strong className="text-neutral-900 block font-sans font-bold">{c.name}</strong>
                      <span>Med: {c.medium} • Target: {c.group} • Sent At: {c.sentAt}</span>
                    </div>
                    <div className="text-right">
                      <span className="bg-emerald-100 border border-emerald-200 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded block">
                        {c.status}
                      </span>
                      <strong className="text-stone-700 text-[11px] block mt-1">{c.responses} Responses</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ================= SUBTAB: HEATMAPS ANALYTICS ================= */}
        {devSubTab === "analytics" && (
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-black text-neutral-950 uppercase tracking-tight">Active Analytics Heatmaps</h3>
              <p className="text-xs text-neutral-500">Track user clicks, virtual-tour views, and hot units highlighting inside active developments.</p>
            </div>

            <div className="border border-stone-200 p-6 rounded-2xl bg-neutral-900 space-y-4">
              <div className="flex items-center justify-between font-mono text-neutral-400 text-[11px] border-b border-neutral-800 pb-3">
                <span>View Heatmap overlays: Tower A Floor select clicks</span>
                <span>Active Views: 1,843 tracked views</span>
              </div>

              {/* Grid block overlays representing high action spots */}
              <div className="grid grid-cols-4 gap-4 text-center text-xs font-mono">
                {[
                  { room: "A-101", views: 24, label: "Quiet Node", color: "bg-blue-500/10 border-blue-500/30 text-blue-400" },
                  { room: "A-102", views: 189, label: "Medium Hot", color: "bg-amber-500/30 border-amber-500/50 text-amber-300" },
                  { room: "A-201", views: 423, label: "CRITICAL BOILING SPOT", color: "bg-red-500/50 border-red-500/70 text-red-100 animate-pulse" },
                  { room: "A-202", views: 21, label: "Quiet Node", color: "bg-blue-500/10 border-blue-500/30 text-blue-400" },
                  { room: "Penthouse P-1", views: 512, label: "BOILING VIP BLOCK", color: "bg-red-500/60 border-red-500/80 text-white animate-pulse" },
                  { room: "Penthouse P-2", views: 99, label: "Cool Spot", color: "bg-emerald-500/20 border-emerald-500/40 text-emerald-400" },
                  { room: "B-201", views: 312, label: "Highly active", color: "bg-amber-500/40 border-amber-500/60 text-amber-200" },
                  { room: "B-202", views: 28, label: "Quiet Node", color: "bg-blue-500/10 border-blue-500/30 text-blue-400" }
                ].map((spot, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border flex flex-col justify-between h-24 ${spot.color}`}>
                    <strong className="text-sm block">{spot.room}</strong>
                    <div>
                      <span className="text-[9px] block uppercase font-black">{spot.label}</span>
                      <strong className="text-[10px] block mt-0.5">{spot.views} Views</strong>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-[10px] text-neutral-500 text-center font-mono pt-3">
                Heatmap parameters calibrate from live page views, virtual Matterport tour clicks, and chat matchmaker inquiries.
              </p>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
