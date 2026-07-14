import React, { useState, useRef, useEffect, useMemo } from "react";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Music, 
  Sparkles, 
  Check, 
  X, 
  Send, 
  MessageSquare, 
  Phone, 
  ArrowRight, 
  Video, 
  Filter, 
  Layers,
  MapPin,
  Flame,
  CheckCircle,
  ExternalLink,
  Search,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Palette
} from "lucide-react";
import { Project } from "../types";

export interface VideoTour {
  id: string;
  category: "apartments-sale" | "furnished-apartments" | "houses-rent";
  title: string;
  location: string;
  videoUrl: string;
  developerName: string;
  developerUsername: string;
  caption: string;
  soundName: string;
  likes: string;
  commentsCount: number;
  price: string;
  projectId?: string;
  whatsappPhone?: string;
  comments: Array<{ name: string; text: string; time: string; likes: number }>;
}

interface PropertyVideosPageProps {
  projects: Project[];
  onSelectProject: (projectId: string) => void;
  onNavigateToTab: (tab: any) => void;
  formatPrice: (priceVal: number) => string;
}

export default function PropertyVideosPage({
  projects,
  onSelectProject,
  onNavigateToTab,
  formatPrice
}: PropertyVideosPageProps) {

  // Dynamic list built in real-time from registered projects to satisfy user synchronization requirement
  const toursData: VideoTour[] = useMemo(() => {
    if (!projects || projects.length === 0) {
      return [];
    }

    const list: VideoTour[] = [];

    projects.forEach((project, index) => {
      // Collect all video URLs for this project
      const videoItems: { url: string; labelSuffix?: string }[] = [];

      if (project.tiktokVideos && project.tiktokVideos.length > 0) {
        project.tiktokVideos.forEach((vidUrl, vidIdx) => {
          if (vidUrl) {
            videoItems.push({
              url: vidUrl,
              labelSuffix: project.tiktokVideos!.length > 1 ? ` (Part ${vidIdx + 1})` : ""
            });
          }
        });
      }

      if (project.tiktokUrl && !videoItems.some(v => v.url === project.tiktokUrl)) {
        videoItems.push({ url: project.tiktokUrl, labelSuffix: " (TikTok Video)" });
      }

      if (project.droneVideoUrl && !videoItems.some(v => v.url === project.droneVideoUrl)) {
        videoItems.push({ url: project.droneVideoUrl, labelSuffix: " (Walkthrough Tour)" });
      }

      // If no custom videos are defined, provide a fallback walkthrough loop
      if (videoItems.length === 0) {
        const fallbacks = [
          "https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-interior-design-32321-large.mp4",
          "https://assets.mixkit.co/videos/preview/mixkit-interior-of-a-luxury-apartment-living-room-32323-large.mp4",
          "https://assets.mixkit.co/videos/preview/mixkit-view-of-a-modern-swimming-pool-and-residential-building-40049-large.mp4",
          "https://assets.mixkit.co/videos/preview/mixkit-drone-shot-of-luxury-real-estate-with-private-swimming-pool-42525-large.mp4"
        ];
        videoItems.push({ url: fallbacks[index % fallbacks.length], labelSuffix: " (Featured Walkthrough)" });
      }

      // Determine logical category based on properties
      let category: "apartments-sale" | "furnished-apartments" | "houses-rent" = "apartments-sale";
      const typeLower = (project.type || "").toLowerCase();
      const descLower = (project.description || "").toLowerCase();
      const nameLower = (project.name || "").toLowerCase();

      const isFurnished = descLower.includes("furnished") || 
                          nameLower.includes("furnished") || 
                          project.id.includes("furnished") ||
                          project.id === "kilimani-elite";

      if (isFurnished) {
        category = "furnished-apartments";
      } else if (typeLower.includes("villa") || typeLower.includes("house") || typeLower.includes("townhouse") || typeLower.includes("mansion")) {
        category = "houses-rent";
      } else {
        category = "apartments-sale";
      }

      const devUsername = (project.developerName || "DaebakRealty")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");

      const customComments = [
        { name: "@nairobi_investor", text: `Unbelievable specs. The layout inside ${project.name} looks stunning.`, time: "1h ago", likes: 21 },
        { name: "@prop_scout_ke", text: `I toured this specific location in ${project.location.split(",")[0]}. Top tier neighborhood!`, time: "3h ago", likes: 12 },
        { name: "@amina_lux", text: "What is the construction progress or completion timeline for these units?", time: "1d ago", likes: 8 }
      ];

      videoItems.forEach((item, itemIdx) => {
        list.push({
          id: `tour-${project.id}-${itemIdx}`,
          projectId: project.id,
          category,
          title: `${project.name}${item.labelSuffix || ""}`,
          location: project.location,
          videoUrl: item.url,
          developerName: project.developerName || "PropSphere Partner",
          developerUsername: devUsername,
          caption: `${project.tagline || "Exclusive Luxury Listing"}. ${project.description}`,
          soundName: `Original Audio - ${project.developerName || "PropSphere"}`,
          likes: `${(4.5 + (index * 0.8 + itemIdx * 0.4) % 3.5).toFixed(1)}K`,
          commentsCount: customComments.length,
          price: project.priceRange || "Inquire Price",
          whatsappPhone: project.whatsappPhone || "+254735286836",
          comments: customComments
        });
      });
    });

    return list;
  }, [projects]);

  // Filter and Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Dynamic list of unique locations extracted from toursData
  const uniqueLocations = useMemo(() => {
    const locs = new Set<string>();
    toursData.forEach(t => {
      // Extract neighborhood / first part of location
      const part = t.location.split(",")[0].trim();
      if (part) {
        locs.add(part);
      }
    });
    return Array.from(locs).sort();
  }, [toursData]);
  
  // Dynamic list filtered by category, location and search query
  const filteredTours = useMemo(() => {
    return toursData.filter(tour => {
      // 1. Category/Type Filter
      if (selectedCategory !== "all" && tour.category !== selectedCategory) {
        return false;
      }

      // 2. Location Filter
      if (selectedLocation !== "all") {
        const neighborhood = tour.location.split(",")[0].trim().toLowerCase();
        if (neighborhood !== selectedLocation.toLowerCase()) {
          return false;
        }
      }

      // 3. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = tour.title.toLowerCase().includes(q);
        const matchesLoc = tour.location.toLowerCase().includes(q);
        const matchesCaption = tour.caption.toLowerCase().includes(q);
        const matchesDev = tour.developerName.toLowerCase().includes(q) || tour.developerUsername.toLowerCase().includes(q);
        if (!matchesTitle && !matchesLoc && !matchesCaption && !matchesDev) {
          return false;
        }
      }

      return true;
    });
  }, [toursData, selectedCategory, selectedLocation, searchQuery]);

  // Current playing tour inside the smartphone mockup modal
  const [activeTour, setActiveTour] = useState<VideoTour | null>(null);
  const [isImmersiveOpen, setIsImmersiveOpen] = useState(false);

  // Helper to detect YouTube URL
  const isYouTubeUrl = (url: string) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  // Helper to generate optimized YouTube Embed URL
  const getYouTubeEmbedUrl = (url: string, muted: boolean, playing: boolean) => {
    let videoId = "";
    if (url.includes("embed/")) {
      videoId = url.split("embed/")[1]?.split("?")[0] || "";
    } else if (url.includes("v=")) {
      videoId = url.split("v=")[1]?.split("&")[0] || "";
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
    }
    
    if (!videoId) return url;
    
    return `https://www.youtube.com/embed/${videoId}?autoplay=${playing ? 1 : 0}&mute=${muted ? 1 : 0}&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3`;
  };

  // Helper to detect TikTok URL
  const isTikTokUrl = (url: string) => {
    return url.includes("tiktok.com");
  };

  // Helper to generate TikTok Embed URL
  const getTikTokEmbedUrl = (url: string) => {
    const matches = url.match(/\/video\/(\d+)/);
    if (matches && matches[1]) {
      return `https://www.tiktok.com/embed/v2/${matches[1]}`;
    }
    if (url.includes("embed")) return url;
    return url;
  };

  // Player controls
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [likesState, setLikesState] = useState<Record<string, number>>({});
  const [hasLiked, setHasLiked] = useState<Record<string, boolean>>({});
  const [commentText, setCommentText] = useState("");
  const [customComments, setCustomComments] = useState<Record<string, typeof toursData[0]["comments"]>>({});
  const [copiedLink, setCopiedLink] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Likes tracking
  const currentLikes = useMemo(() => {
    if (!activeTour) return "0.0K";
    if (likesState[activeTour.id] !== undefined) {
      return `${likesState[activeTour.id].toFixed(1)}K`;
    }
    return activeTour.likes;
  }, [activeTour, likesState]);

  const currentComments = useMemo(() => {
    if (!activeTour) return [];
    return customComments[activeTour.id] || activeTour.comments;
  }, [activeTour, customComments]);

  // Handle Play/Pause
  const togglePlay = () => {
    if (!activeTour) return;
    const nextPlaying = !isPlaying;
    setIsPlaying(nextPlaying);
    if (videoRef.current && !isYouTubeUrl(activeTour.videoUrl)) {
      if (nextPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  };

  // Toggle Mute
  const toggleMute = () => {
    if (!activeTour) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (videoRef.current && !isYouTubeUrl(activeTour.videoUrl)) {
      videoRef.current.muted = nextMuted;
    }
  };

  // Like Toggle Handler
  const handleLikeToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeTour) return;
    const tourId = activeTour.id;
    const isLiked = !hasLiked[tourId];
    
    setHasLiked(prev => ({ ...prev, [tourId]: isLiked }));
    
    let base = parseFloat(activeTour.likes);
    if (isNaN(base)) base = 4.2;
    
    const updatedCount = isLiked ? base + 0.1 : base - 0.1;
    setLikesState(prev => ({
      ...prev,
      [tourId]: Math.max(0, updatedCount)
    }));
  };

  // Share link copy
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeTour) return;
    const referralLink = `${window.location.origin}/?tab=videos&tour=${activeTour.id}`;
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Post comment inside current tour session
  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTour || !commentText.trim()) return;

    const newComment = {
      name: "@prop_investor",
      text: commentText,
      time: "Just now",
      likes: 0
    };

    const list = customComments[activeTour.id] || activeTour.comments;
    setCustomComments(prev => ({
      ...prev,
      [activeTour.id]: [newComment, ...list]
    }));
    setCommentText("");
  };

  // Select Tour and open popup
  const handleSelectTour = (tour: VideoTour) => {
    setActiveTour(tour);
    setIsImmersiveOpen(true);
    setIsPlaying(true);
    setTimeout(() => {
      if (videoRef.current && !isYouTubeUrl(tour.videoUrl)) {
        videoRef.current.load();
        videoRef.current.play().catch(() => {});
      }
    }, 100);
  };

  // Navigate through filtered list in modal
  const handlePrevTour = () => {
    if (!activeTour || filteredTours.length <= 1) return;
    const idx = filteredTours.findIndex(t => t.id === activeTour.id);
    let prevIdx = idx - 1;
    if (prevIdx < 0) prevIdx = filteredTours.length - 1;
    handleSelectTour(filteredTours[prevIdx]);
  };

  const handleNextTour = () => {
    if (!activeTour || filteredTours.length <= 1) return;
    const idx = filteredTours.findIndex(t => t.id === activeTour.id);
    let nextIdx = idx + 1;
    if (nextIdx >= filteredTours.length) nextIdx = 0;
    handleSelectTour(filteredTours[nextIdx]);
  };

  const handleCloseImmersive = () => {
    setIsImmersiveOpen(false);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const hasActiveFilters = searchQuery !== "" || selectedLocation !== "all" || selectedCategory !== "all";

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedLocation("all");
    setSelectedCategory("all");
  };

  // WhatsApp helper
  const getWhatsAppLink = (tour: VideoTour) => {
    const phone = (tour.whatsappPhone || "254735286836").replace(/[^0-9]/g, "");
    return `https://wa.me/${phone}?text=${encodeURIComponent(`Hello! I watched the video tour walkthrough for "${tour.title}" (${tour.location}) and I am highly interested in discussing unit specifications and payment options.`)}`;
  };

  return (
    <div id="property-videos-page" className="space-y-8 animate-fade-in pb-16">
      
      {/* Visual Header Banner */}
      <div className="bg-neutral-950 p-8 sm:p-12 rounded-3xl border border-neutral-850 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-br from-amber-500/15 to-transparent blur-3xl rounded-full pointer-events-none" />
        <div className="max-w-3xl space-y-3 relative z-10">
          <span className="bg-amber-400 text-neutral-950 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full inline-flex items-center gap-1.5 shadow-sm">
            <Video className="w-3.5 h-3.5" /> Synchronized Walkthrough Loops
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-none uppercase">
            Real Estate in Nairobi, Hand-delivered
          </h1>
          <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
            Live interactive loops directly mapped with pre-vetted Nairobi and Dubai portfolios. Browse immersive property walkthroughs, explore unit layouts, or initiate instant secure WhatsApp chats.
          </p>
        </div>
      </div>

      {/* Advanced Filter Section */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4.5 h-4.5 text-amber-500" />
            <span className="text-xs font-mono font-black uppercase text-stone-500">Filter video walk-through library</span>
          </div>
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="text-stone-400 hover:text-stone-900 font-mono text-[10px] uppercase font-bold flex items-center gap-1 bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded-lg transition-all"
            >
              <RotateCcw className="w-3 h-3" /> Clear Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Filter 1: Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search by title, neighborhood, developer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 focus:border-amber-400 hover:border-stone-300 text-stone-800 font-medium text-xs py-3 pl-10 pr-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all shadow-sm"
            />
          </div>

          {/* Filter 2: Location Selector */}
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 focus:border-amber-400 hover:border-stone-300 text-stone-800 font-bold text-xs py-3 pl-10 pr-8 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer appearance-none shadow-sm transition-all"
            >
              <option value="all">📍 All Locations</option>
              {uniqueLocations.map(loc => (
                <option key={loc} value={loc}>
                  {loc} Neighborhood
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-stone-400 text-[10px] font-mono">
              ▼
            </div>
          </div>

          {/* Filter 3: Category / Type Selector */}
          <div className="relative">
            <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 focus:border-amber-400 hover:border-stone-300 text-stone-800 font-bold text-xs py-3 pl-10 pr-8 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer appearance-none shadow-sm transition-all"
            >
              <option value="all">🏢 All Property Types</option>
              <option value="apartments-sale">Apartments for Sale</option>
              <option value="furnished-apartments">Furnished Apartments</option>
              <option value="houses-rent">Houses & Villas</option>
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-stone-400 text-[10px] font-mono">
              ▼
            </div>
          </div>
        </div>
      </div>

      {/* Video Tours Main Desktop Responsive Grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <strong className="text-xs font-mono uppercase tracking-wider text-stone-500">
            Available Walkthroughs ({filteredTours.length})
          </strong>
          {hasActiveFilters && (
            <span className="text-[10px] font-mono text-amber-600 font-extrabold bg-amber-50 px-2.5 py-0.5 rounded-md">
              Filtered View
            </span>
          )}
        </div>

        {filteredTours.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-3">
            <Video className="w-12 h-12 mx-auto text-stone-300 animate-bounce" />
            <h3 className="text-sm font-bold text-neutral-900 uppercase font-sans">No matching video tours found</h3>
            <p className="text-xs text-neutral-500 max-w-md mx-auto">
              We couldn't find any video walkthroughs matching "{searchQuery}" in location "{selectedLocation}" of category "{selectedCategory}". Try resetting filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-2 px-4 py-2 bg-stone-900 hover:bg-stone-850 text-white font-mono text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shadow-md"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredTours.map((tour) => (
              <VideoTourCard
                key={tour.id}
                tour={tour}
                onSelect={handleSelectTour}
                onSelectProject={onSelectProject}
                onNavigateToTab={onNavigateToTab}
                isYouTubeUrl={isYouTubeUrl}
                isTikTokUrl={isTikTokUrl}
              />
            ))}
          </div>
        )}
      </div>

      {/* IMMERSIVE POPUP MODAL WITH SMARTPHONE MOCKUP (TIKTOK STYLE) */}
      {isImmersiveOpen && activeTour && (
        <div className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          
          {/* Close Backdrop clicker */}
          <div className="absolute inset-0 cursor-default" onClick={handleCloseImmersive} />

          {/* Modal Header Controls */}
          <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
            <button
              onClick={handleCloseImmersive}
              className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/10 flex items-center justify-center cursor-pointer active:scale-95 transition-all shadow-lg"
              title="Close Walkthrough"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Core Interactive Layout Wrapper */}
          <div className="relative w-full max-w-5xl z-10 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8 py-6">
            
            {/* Prev Tour Navigation Button (Left Side) */}
            {filteredTours.length > 1 && (
              <button
                onClick={handlePrevTour}
                className="absolute left-0 lg:static w-11 h-11 rounded-full bg-black/50 hover:bg-black/70 border border-white/10 text-white flex items-center justify-center cursor-pointer active:scale-95 transition-all shadow-lg shrink-0 z-20"
                title="Previous Tour"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Smartphone Mockup Panel */}
            <div className="relative w-full max-w-[310px] sm:max-w-[330px] aspect-[9/16] rounded-[2.5rem] overflow-hidden bg-neutral-950 shadow-2xl border-[6px] border-neutral-900 ring-4 ring-neutral-900/15 flex-shrink-0">
              
              {/* Notch */}
              <div className="absolute top-0 inset-x-0 h-6 bg-black/40 z-40 flex items-center justify-center pointer-events-none">
                <div className="w-16 h-3.5 bg-neutral-900 rounded-full flex items-center justify-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-850" />
                  <span className="w-7 h-1 rounded-full bg-neutral-800" />
                </div>
              </div>

              {/* Video Player Section */}
              <div onClick={togglePlay} className="w-full h-full relative cursor-pointer">
                {isYouTubeUrl(activeTour.videoUrl) ? (
                  <iframe
                    src={getYouTubeEmbedUrl(activeTour.videoUrl, isMuted, isPlaying)}
                    className="w-full h-full object-cover border-none"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : isTikTokUrl(activeTour.videoUrl) ? (
                  <iframe
                    src={getTikTokEmbedUrl(activeTour.videoUrl)}
                    className="w-full h-full object-cover border-none"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    ref={videoRef}
                    src={activeTour.videoUrl}
                    className="w-full h-full object-cover"
                    autoPlay={isPlaying}
                    loop
                    muted={isMuted}
                    playsInline
                  />
                )}

                {/* Overlays */}
                <div className="absolute top-8 left-4 z-30 flex items-center gap-1.5">
                  <span className="bg-rose-600 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md flex items-center gap-1 shadow animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-white inline-block animate-ping" />
                    Live Walkthrough
                  </span>
                </div>

                {/* Mute toggle overlay */}
                <div className="absolute top-8 right-4 z-30">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMute();
                    }}
                    className="w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md flex items-center justify-center text-white border border-white/10 transition-transform active:scale-95 cursor-pointer shadow-lg"
                    title={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                  </button>
                </div>

                {/* Central Play indicator overlay */}
                {!isPlaying && !isYouTubeUrl(activeTour.videoUrl) && (
                  <div className="absolute inset-0 bg-black/25 flex items-center justify-center z-20">
                    <div className="w-16 h-16 rounded-full bg-rose-600 flex items-center justify-center text-white shadow-xl transform scale-110 transition-transform">
                      <Play className="w-8 h-8 fill-white ml-1" />
                    </div>
                  </div>
                )}

                {/* Bottom Captions Vignette */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/55 to-transparent p-5 pt-16 z-25 flex flex-col justify-end space-y-2 pointer-events-none">
                  <div className="flex items-center gap-1.5 pointer-events-auto">
                    <span className="text-white text-xs font-black truncate">@{activeTour.developerUsername}</span>
                    <span className="bg-amber-400 text-neutral-950 text-[8px] font-extrabold px-1.5 py-0.5 rounded-sm uppercase tracking-wide">verified</span>
                  </div>

                  <p className="text-white/95 text-[11px] leading-relaxed line-clamp-3 select-text pointer-events-auto">
                    {activeTour.caption}
                  </p>

                  <div className="flex items-center gap-1.5 text-stone-350 text-[9.5px] pointer-events-auto">
                    <Music className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: "6s" }} />
                    <span className="truncate w-40 font-medium">{activeTour.soundName}</span>
                  </div>
                </div>

                {/* Sidebar HUD (Likes, Comments, Share, WhatsApp) */}
                <div className="absolute right-3.5 bottom-24 z-30 flex flex-col items-center space-y-4 pointer-events-auto">
                  
                  {/* Likes count */}
                  <div className="flex flex-col items-center">
                    <button 
                      onClick={handleLikeToggle}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all bg-black/45 hover:bg-black/65 border border-white/10 backdrop-blur-md cursor-pointer active:scale-125 ${
                        hasLiked[activeTour.id] ? "text-rose-500 scale-105" : "text-white hover:text-rose-400"
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${hasLiked[activeTour.id] ? "fill-rose-500 text-rose-500" : ""}`} />
                    </button>
                    <span className="text-[10px] text-white/90 font-black font-mono mt-1 drop-shadow">
                      {currentLikes}
                    </span>
                  </div>

                  {/* Comments toggle */}
                  <div className="flex flex-col items-center">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowComments(true);
                      }}
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all bg-black/45 hover:bg-black/65 border border-white/10 backdrop-blur-md cursor-pointer text-white hover:text-amber-400 active:scale-95"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </button>
                    <span className="text-[10px] text-white/90 font-black font-mono mt-1 drop-shadow">
                      {currentComments.length}
                    </span>
                  </div>

                  {/* Share option */}
                  <div className="flex flex-col items-center">
                    <button 
                      onClick={handleShare}
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all bg-black/45 hover:bg-black/65 border border-white/10 backdrop-blur-md cursor-pointer text-white hover:text-amber-400 active:scale-95"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                    <span className="text-[10px] text-white/90 font-black font-mono mt-1 drop-shadow">Share</span>
                  </div>
                </div>

                {/* Copied pop-up */}
                {copiedLink && (
                  <div className="absolute inset-x-4 top-1/3 z-50 bg-neutral-900/95 text-white rounded-xl py-2 px-3 text-center text-xs font-bold border border-zinc-700 animate-bounce flex items-center justify-center gap-1.5 shadow-xl">
                    <Check className="w-4 h-4 text-amber-400" /> Walkthrough Link Seeded!
                  </div>
                )}

              </div>
            </div>

            {/* Right Information & Controls Side Panel */}
            <div className="w-full lg:w-[480px] bg-neutral-900 text-white rounded-3xl p-6 border border-neutral-800 shadow-2xl space-y-6 shrink-0 text-left">
              
              <div className="border-b border-neutral-800 pb-4 space-y-2">
                <span className="text-[9px] font-mono font-black text-rose-500 uppercase tracking-widest block">
                  NOW PLAYING IMMERSIVE PRE-VETTED MATCH
                </span>
                <h3 className="text-xl font-black tracking-tight leading-tight uppercase font-sans">
                  {activeTour.title}
                </h3>
                <p className="text-xs text-neutral-400 flex items-center gap-1 font-semibold">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" /> {activeTour.location}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase font-mono text-neutral-500 font-extrabold block">
                  Budget Value
                </span>
                <strong className="text-2xl font-black text-emerald-400 block">
                  {activeTour.price}
                </strong>
              </div>

              <div className="space-y-2 bg-neutral-950 p-4 rounded-2xl border border-neutral-850">
                <span className="text-[10px] uppercase font-mono text-amber-500 font-extrabold block">
                  Walkthrough Specifications & Thesis
                </span>
                <p className="text-neutral-300 text-xs leading-relaxed max-h-[120px] overflow-y-auto">
                  {activeTour.caption}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono text-neutral-500 font-bold block">
                    Assigned Partner
                  </span>
                  <span className="text-xs font-bold text-neutral-200 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block animate-pulse" /> {activeTour.developerName}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono text-neutral-500 font-bold block">
                    Phone
                  </span>
                  <span className="text-xs font-mono text-stone-400 truncate block">
                    {activeTour.whatsappPhone}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                {activeTour.projectId && (
                  <button
                    onClick={() => {
                      onSelectProject(activeTour.projectId!);
                      onNavigateToTab("portfolio");
                      handleCloseImmersive();
                    }}
                    className="flex-1 py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-500 text-neutral-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-md"
                  >
                    <Layers className="w-4 h-4" /> View Layout Specs
                  </button>
                )}
                
                <a
                  href={getWhatsAppLink(activeTour)}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-lg shadow-emerald-500/10"
                >
                  <Phone className="w-4 h-4" /> WhatsApp Chat
                </a>
              </div>

              <button
                onClick={() => setShowComments(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-stone-300 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-neutral-700/50 transition-colors"
              >
                <MessageSquare className="w-4 h-4" /> View Verified Investor Comments ({currentComments.length})
              </button>
            </div>

            {/* Next Tour Navigation Button (Right Side) */}
            {filteredTours.length > 1 && (
              <button
                onClick={handleNextTour}
                className="absolute right-0 lg:static w-11 h-11 rounded-full bg-black/50 hover:bg-black/70 border border-white/10 text-white flex items-center justify-center cursor-pointer active:scale-95 transition-all shadow-lg shrink-0 z-20"
                title="Next Tour"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

          </div>
        </div>
      )}

      {/* Embedded Simulation Comments Drawer */}
      {showComments && activeTour && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center p-4">
          <div className="bg-white rounded-t-3xl w-full max-w-md h-[460px] p-5 flex flex-col justify-between shadow-2xl animate-in slide-in-from-bottom border border-stone-200">
            
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <strong className="text-sm font-black text-neutral-900 flex items-center gap-1.5">
                  <MessageSquare className="w-4.5 h-4.5 text-amber-500" /> Comments ({currentComments.length})
                </strong>
                <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mt-0.5">Verified investor community feed</p>
              </div>
              <button 
                onClick={() => setShowComments(false)}
                className="p-1 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>

            {/* Comments Stream Scroller */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1">
              {currentComments.map((comment, idx) => (
                <div key={idx} className="flex gap-2.5 items-start bg-stone-50/50 p-2.5 rounded-xl border border-stone-100/80">
                  <div className="w-7 h-7 rounded-full bg-stone-200 flex items-center justify-center font-bold text-[10px] text-stone-700 shrink-0 capitalize">
                    {comment.name.replace("@", "").charAt(0)}
                  </div>
                  <div className="flex-1 space-y-0.5 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-black text-neutral-900">{comment.name}</span>
                      <span className="text-[9px] text-neutral-400 font-mono">{comment.time}</span>
                    </div>
                    <p className="text-xs text-neutral-600 leading-snug break-words">{comment.text}</p>
                    <div className="flex items-center gap-1.5 pt-1 text-[10px] font-mono text-stone-400">
                      <button className="hover:text-rose-400 flex items-center gap-0.5 cursor-pointer">
                        <Heart className="w-3 h-3 hover:fill-rose-400" /> {comment.likes}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Comment Form */}
            <form onSubmit={handlePostComment} className="border-t border-stone-100 pt-3 flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Ask about price terms, layouts, deposits..."
                className="flex-1 text-xs p-3 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-400 font-medium"
              />
              <button
                type="submit"
                className="w-10 h-10 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// ================= INDIVIDUAL VIDEO CARD COMPONENT =================
interface VideoTourCardProps {
  tour: VideoTour;
  onSelect: (tour: VideoTour) => void;
  onSelectProject: (projectId: string) => void;
  onNavigateToTab: (tab: any) => void;
  isYouTubeUrl: (url: string) => boolean;
  isTikTokUrl: (url: string) => boolean;
}

function VideoTourCard({
  tour,
  onSelect,
  onSelectProject,
  onNavigateToTab,
  isYouTubeUrl,
  isTikTokUrl
}: VideoTourCardProps) {
  const [hovered, setHovered] = useState(false);
  const cardVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (cardVideoRef.current) {
      if (hovered) {
        cardVideoRef.current.play().catch(() => {});
      } else {
        cardVideoRef.current.pause();
        cardVideoRef.current.currentTime = 0;
      }
    }
  }, [hovered]);

  const neighborhood = tour.location.split(",")[0].trim();
  const cleanedWhatsAppPhone = (tour.whatsappPhone || "254735286836")
    .replace(/[^0-9]/g, "");

  return (
    <div 
      id={`tour-card-${tour.id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(tour)}
      className="group bg-white rounded-3xl border border-stone-200/80 overflow-hidden hover:shadow-xl hover:scale-[1.02] hover:border-amber-300 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Thumbnail / Video Container */}
      <div className="relative w-full aspect-[4/5] bg-stone-900 overflow-hidden shrink-0">
        {/* Dynamic Hover Play Video or Static Thumbnail Cover */}
        {!isYouTubeUrl(tour.videoUrl) && !isTikTokUrl(tour.videoUrl) ? (
          <video
            ref={cardVideoRef}
            src={tour.videoUrl}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            muted
            loop
            playsInline
          />
        ) : (
          /* For YouTube/TikTok we show a gorgeous dynamic Unsplash background matching category */
          <img
            src={
              tour.category === "furnished-apartments"
                ? "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=600"
                : tour.category === "houses-rent"
                ? "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=600"
                : "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=600"
            }
            alt={tour.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {/* Video Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30 opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <span className="bg-stone-900/85 backdrop-blur-md text-[9px] font-mono font-bold text-white uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/10">
            {tour.category === "apartments-sale" 
              ? "Apartment" 
              : tour.category === "furnished-apartments" 
              ? "Furnished" 
              : "House"}
          </span>
          <span className="bg-amber-400 text-neutral-950 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
            <MapPin className="w-3 h-3 text-neutral-950" /> {neighborhood}
          </span>
        </div>

        {/* Play Icon or Autoplay Tag Overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 transform group-hover:scale-110 transition-transform duration-300">
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </div>
        </div>

        {/* Hover Hint */}
        <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
          <span className="text-[10px] font-mono font-black text-amber-300 uppercase tracking-widest drop-shadow">
            {!isYouTubeUrl(tour.videoUrl) && !isTikTokUrl(tour.videoUrl) 
              ? hovered ? "Playing Preview..." : "Hover to Play" 
              : "Interactive Walkthrough"}
          </span>
        </div>

        {/* Price Tag in Bottom Right */}
        <div className="absolute bottom-4 right-4 z-10 bg-emerald-600 text-white font-extrabold text-xs px-3 py-1.5 rounded-xl border border-emerald-500/30 shadow-md">
          {tour.price}
        </div>
      </div>

      {/* Description & Footer Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] text-stone-400 font-mono">
            <span>@{tour.developerUsername}</span>
            <span className="w-1 h-1 rounded-full bg-stone-300" />
            <span>{tour.likes} Likes</span>
          </div>
          <h4 className="text-sm font-bold text-neutral-900 line-clamp-1 group-hover:text-amber-600 transition-colors">
            {tour.title}
          </h4>
          <p className="text-stone-500 text-xs line-clamp-2 leading-relaxed">
            {tour.caption}
          </p>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(tour);
            }}
            className="flex-1 py-2 px-3 bg-stone-900 hover:bg-stone-850 text-white font-bold text-[10.5px] uppercase tracking-wider rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1 shadow-sm"
          >
            <Play className="w-3 h-3 fill-white" /> Immersive Tour
          </button>
          
          <a
            href={`https://wa.me/${cleanedWhatsAppPhone}?text=${encodeURIComponent(`Hello! I watched the video tour walkthrough for "${tour.title}" (${tour.location}) and would like to learn more.`)}`}
            target="_blank"
            referrerPolicy="no-referrer"
            onClick={(e) => e.stopPropagation()}
            className="px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10.5px] uppercase tracking-wider rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1 shrink-0 shadow-sm"
            title="WhatsApp Developer"
          >
            <Phone className="w-3 h-3" /> Chat
          </a>
        </div>
      </div>
    </div>
  );
}
