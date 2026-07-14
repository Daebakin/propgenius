import React, { useState, useRef, useEffect } from "react";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  ChevronUp, 
  ChevronDown, 
  Check, 
  Music, 
  Sparkles, 
  MessageSquare,
  X,
  Send
} from "lucide-react";
import { Project } from "../types";

interface Props {
  project: Project;
}

const mockComments = [
  { name: "@investor_caleb", text: "Westlands premium sector is highly resilient. Stretched payment layout makes this extremely attractive. 🔥", time: "2h ago", likes: 24 },
  { name: "@amina_nairobi", text: "Is the rooftop pool fully heated? Looking forward to private viewing schedules.", time: "4h ago", likes: 18 },
  { name: "@diaspora_deals", text: "We verified their Escrow framework. Complete capital security. Mapped coordinates look accurate.", time: "1d ago", likes: 45 },
  { name: "@prop_scout_ke", text: "Appreciation rate here is higher than the standard Kilimani averages. Highly recommended index portfolio slot.", time: "2d ago", likes: 31 },
  { name: "@architect_omari", text: "Clean layout lines, structural double-glazing frames. Solid building parameters.", time: "3d ago", likes: 12 },
];

export const PropertyTikTokShowcase: React.FC<Props> = ({ project }) => {
  const videos = (project.tiktokVideos || []).filter(vid => 
    vid && (vid.toLowerCase().includes("tiktok.com") || vid.toLowerCase().includes("tiktok"))
  );

  if (videos.length === 0) {
    return null;
  }

  const [activeIdx, setActiveIdx] = useState(0);
  const [likesCount, setLikesCount] = useState<Record<number, number>>({});
  const [hasLiked, setHasLiked] = useState<Record<number, boolean>>({});
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [userComments, setUserComments] = useState(mockComments);
  const [copiedLink, setCopiedLink] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Initialize randomized baseline likes for each video on mount
  useEffect(() => {
    const counts: Record<number, number> = {};
    videos.forEach((_, idx) => {
      counts[idx] = Math.floor(250 + (idx * 115) + (project.name.length * 8));
    });
    setLikesCount(counts);
  }, [videos, project.name]);

  const activeVideo = videos[activeIdx];

  // Detect content type
  const isDirectMp4 = 
    activeVideo.endsWith(".mp4") || 
    activeVideo.includes("assets.mixkit.co") || 
    activeVideo.includes("/videos/");

  const getEmbedSource = (item: string) => {
    if (!item) return "";
    if (item.includes("tiktok.com/embed/")) return item;
    if (isDirectMp4) return item;

    // Check if it's a Youtube short or standard video
    if (item.includes("youtube.com") || item.includes("youtu.be")) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = item.match(regExp);
      if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}?autoplay=1&mute=${isMuted ? "1" : "0"}&playlist=${match[2]}&loop=1&controls=0&modestbranding=1`;
      }
    }

    // TikTok raw link
    const tiktokReg = /\/video\/(\d+)/;
    const match = item.match(tiktokReg);
    if (match && match[1]) {
      return `https://www.tiktok.com/embed/v2/${match[1]}?autoplay=1&mute=${isMuted ? "1" : "0"}`;
    }

    // Try extracting numeric ID
    if (/^\d+$/.test(item)) {
      return `https://www.tiktok.com/embed/v2/${item}?autoplay=1&mute=${isMuted ? "1" : "0"}`;
    }

    return item;
  };

  const handleLikeToggle = () => {
    const currentlyLiked = !!hasLiked[activeIdx];
    setHasLiked(prev => ({ ...prev, [activeIdx]: !currentlyLiked }));
    setLikesCount(prev => ({
      ...prev,
      [activeIdx]: currentlyLiked ? prev[activeIdx] - 1 : prev[activeIdx] + 1
    }));
  };

  const handleShare = () => {
    navigator.clipboard.writeText(activeVideo);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const clickComment = {
      name: "@prop_investor",
      text: commentText,
      time: "Just now",
      likes: 0
    };
    setUserComments([clickComment, ...userComments]);
    setCommentText("");
  };

  const handleNext = () => {
    setActiveIdx(prev => (prev + 1) % videos.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setActiveIdx(prev => (prev - 1 + videos.length) % videos.length);
    setIsPlaying(true);
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
      <div>
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-extrabold text-neutral-950 flex items-center gap-1.5">
            <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500/20" /> Property Shorts Showcase
          </h4>
          <span className="bg-stone-100 border border-stone-200 rounded-xl px-2.5 py-1 text-[10px] font-mono text-stone-500 font-bold uppercase tracking-widest">
            TikTok Mapped {activeIdx + 1}/{videos.length}
          </span>
        </div>
        <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold mt-0.5">Explore immersive digital-twin swipe feeds</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 lg:gap-8 items-stretch w-full overflow-hidden">
        {/* TikTok Smartphone Viewframe Container Column */}
        <div className="sm:col-span-5 flex justify-center items-center">
          <div className="relative w-full max-w-[270px] xs:max-w-[290px] sm:max-w-[280px] md:max-w-[300px] lg:max-w-[290px] xl:max-w-[315px] aspect-[9/16] rounded-[2.5rem] overflow-hidden bg-black shadow-2xl border-4 border-neutral-900 ring-2 ring-stone-100 flex-shrink-0">
            
            {/* Static Top Notch spacer */}
            <div className="absolute top-0 inset-x-0 h-6 bg-black/40 z-30 flex items-center justify-center">
              <div className="w-20 h-4 bg-neutral-900 rounded-full" />
            </div>

            <div className="w-full h-full relative group">
              {isDirectMp4 ? (
                <video
                  ref={videoRef}
                  src={activeVideo}
                  className="w-full h-full object-cover"
                  autoPlay={isPlaying}
                  loop
                  muted={isMuted}
                  playsInline
                />
              ) : (
                <iframe
                  src={getEmbedSource(activeVideo)}
                  title={`TikTok short ${activeIdx + 1}`}
                  className="w-full h-full border-0 animate-fade-in"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
                  allowFullScreen
                />
              )}

              {/* Dark gradient overlay bottom portion for high readability */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-5 pt-10 z-20 flex flex-col justify-end space-y-2 pointer-events-none">
                
                <div className="flex items-center gap-1.5 pointer-events-auto">
                  <span className="text-white text-xs font-black truncate">@{project.developerName.replace(/\s+/g, "").toLowerCase()}</span>
                  <span className="bg-amber-400 text-neutral-950 text-[8px] font-bold px-1 rounded-sm uppercase tracking-wide">verified</span>
                </div>

                <p className="text-white/90 text-[10.5px] leading-snug line-clamp-2 select-text pointer-events-auto">
                  Discover {project.name}. Featuring custom dynamic spaces, elevated finishes, and high-yield returns. {project.tagline}
                </p>

                <div className="flex items-center gap-1.5 text-stone-300 text-[10px] pointer-events-auto">
                  <Music className="w-3 h-3 text-amber-400 animate-spin" style={{ animationDuration: "6s" }} />
                  <span className="truncate w-36 font-medium">Original Audio • PropSphere Studios</span>
                </div>
              </div>

              {/* Float HUD Buttons Right Column inside Player */}
              <div className="absolute right-3 bottom-20 z-25 flex flex-col items-center space-y-4 pointer-events-auto">
                
                {/* Profile Avatar Disc */}
                <div className="relative group/avatar cursor-pointer">
                  <div className="w-10 h-10 rounded-full border border-white/80 overflow-hidden bg-neutral-800 flex items-center justify-center p-0.5 animate-pulse">
                    <div className="w-full h-full rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center font-extrabold text-xs">
                      {project.developerName.charAt(0)}
                    </div>
                  </div>
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-500 border border-white flex items-center justify-center text-white text-[9px] font-black hover:scale-110 select-none">
                    +
                  </div>
                </div>

                {/* Like Column */}
                <div className="flex flex-col items-center">
                  <button 
                    onClick={handleLikeToggle}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all bg-black/40 hover:bg-black/60 backdrop-blur-md cursor-pointer group-active/like:scale-125 ${
                      hasLiked[activeIdx] ? "text-red-500 scale-105" : "text-white hover:text-red-400"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${hasLiked[activeIdx] ? "fill-red-500" : ""}`} />
                  </button>
                  <span className="text-[10px] text-white font-bold font-mono mt-1">{likesCount[activeIdx] || 410}</span>
                </div>

                {/* Comments Bubble */}
                <div className="flex flex-col items-center">
                  <button 
                    onClick={() => setShowComments(true)}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all bg-black/40 hover:bg-black/60 backdrop-blur-md cursor-pointer text-white hover:text-amber-400"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </button>
                  <span className="text-[10px] text-white font-bold font-mono mt-1">{userComments.length}</span>
                </div>

                {/* Share bubble */}
                <div className="flex flex-col items-center">
                  <button 
                    onClick={handleShare}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all bg-black/40 hover:bg-black/60 backdrop-blur-md cursor-pointer text-white hover:text-amber-400"
                    title="Copy video link"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <span className="text-[10px] text-white font-bold font-mono mt-1">Share</span>
                </div>
              </div>

              {/* Quick Play/Pause & Mute controls on-video overlays */}
              <div className="absolute top-10 left-3 z-30 flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setIsMuted(!isMuted);
                    if (videoRef.current) {
                      videoRef.current.muted = !isMuted;
                    }
                  }}
                  className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-md flex items-center justify-center text-white cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                </button>

                {isDirectMp4 && (
                  <button
                    onClick={() => {
                      const nextPlaying = !isPlaying;
                      setIsPlaying(nextPlaying);
                      if (videoRef.current) {
                        if (nextPlaying) videoRef.current.play();
                        else videoRef.current.pause();
                      }
                    }}
                    className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-md flex items-center justify-center text-white cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-amber-400" />}
                  </button>
                )}
              </div>

              {/* Float Link Copy Alert Notification */}
              {copiedLink && (
                <div className="absolute inset-x-4 top-1/3 z-50 bg-neutral-900/90 text-white rounded-xl py-2 px-3 text-center text-xs font-bold border border-zinc-700 animate-bounce flex items-center justify-center gap-1.5">
                  <Check className="w-4 h-4 text-amber-400" /> Walkthrough Link Seeded!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Video Swipe Navigation Panel and dynamic property details */}
        <div className="sm:col-span-7 flex flex-col justify-center space-y-4 w-full">
          <div className="bg-stone-50 border border-stone-200/60 p-4 rounded-2xl space-y-2">
            <strong className="text-xs font-mono font-black uppercase text-neutral-500 block">Short Guide Instructions</strong>
            <p className="text-xs text-neutral-600 leading-relaxed">
              These mobile reels leverage visual vertical architecture media perfectly configured for modern offplan investors. Swipe or navigate through other listed video segments of this unit blueprint.
            </p>
            <div className="flex items-center gap-2 pt-1.5">
              <button
                onClick={handlePrev}
                className="flex-1 py-2 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-xs font-black text-neutral-900 flex items-center justify-center gap-1 hover:shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <ChevronUp className="w-4 h-4 text-amber-500" /> Previous Loop
              </button>
              <button
                onClick={handleNext}
                className="flex-1 py-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-xs font-black text-white flex items-center justify-center gap-1 hover:shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                Next Walkthrough <ChevronDown className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-[11px] font-mono">
            <div className="bg-stone-50 border border-stone-100 p-2.5 rounded-xl">
              <span className="text-neutral-500 block">Property Rating</span>
              <strong className="text-neutral-900 text-xs font-bold font-sans mt-0.5 block">★ {project.overallRating || "5.0"} (Verifiable)</strong>
            </div>
            <div className="bg-stone-50 border border-stone-100 p-2.5 rounded-xl">
              <span className="text-neutral-500 block">Est. Monthly Views</span>
              <strong className="text-neutral-900 text-xs font-bold font-sans mt-0.5 block">14,280+ unique hits</strong>
            </div>
          </div>

          {/* Quick list of direct links and formats */}
          <div className="p-3 border border-stone-200/50 rounded-2xl bg-white space-y-1">
            <span className="text-[10px] uppercase font-mono text-stone-400 font-bold block">Source Metadata Link</span>
            <div className="text-xs font-mono text-stone-600 truncate bg-stone-50 p-2 rounded-lg border border-stone-100 flex items-center justify-between">
              <span className="truncate flex-1 pr-2">{activeVideo}</span>
              <span className="text-[10px] text-amber-600 font-bold shrink-0 uppercase">
                {isDirectMp4 ? "Direct MP4" : activeVideo.includes("youtube") ? "YouTube" : "TikTok"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Slide-in Comments Overlay Drawer simulation */}
      {showComments && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-end justify-center p-4">
          <div className="bg-white rounded-t-3xl w-full max-w-md h-[450px] p-5 flex flex-col justify-between shadow-2xl animate-in slide-in-from-bottom border border-stone-300">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <strong className="text-sm font-black text-neutral-900 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-amber-500" /> Comments ({userComments.length})
                </strong>
                <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Unfiltered verified buyers feedback</p>
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
              {userComments.map((comment, idx) => (
                <div key={idx} className="flex gap-2.5 items-start bg-stone-50/50 p-2.5 rounded-xl border border-stone-100/85">
                  <div className="w-7 h-7 rounded-full bg-stone-200 flex items-center justify-center font-bold text-[10px] text-stone-700 shrink-0 capitalize">
                    {comment.name.replace("@", "").charAt(0)}
                  </div>
                  <div className="flex-x space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-black text-neutral-900">{comment.name}</span>
                      <span className="text-[9px] text-neutral-400 font-mono">{comment.time}</span>
                    </div>
                    <p className="text-xs text-neutral-600 leading-snug">{comment.text}</p>
                    <div className="flex items-center gap-1.5 pt-1 text-[10px] font-mono text-stone-400">
                      <button className="hover:text-red-400 flex items-center gap-0.5 cursor-pointer">
                        <Heart className="w-3 h-3 hover:fill-red-400" /> {comment.likes}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Comment input form */}
            <form onSubmit={handleAddComment} className="border-t border-stone-100 pt-3 flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Ask about deposits, construction timelines..."
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
};
