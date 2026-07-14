import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bot, Send, X, MessageSquare, Sparkles, Building, ArrowRight, Loader2, Coins } from "lucide-react";
import { Project } from "../types";

interface PropertySearchRobotProps {
  projects: Project[];
  onSelectProject: (id: string) => void;
  onNavigateToTab: (tab: any) => void;
}

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

export default function PropertySearchRobot({
  projects,
  onSelectProject,
  onNavigateToTab,
}: PropertySearchRobotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Hello! I am your **Daebak Property Search Robot** 🤖. I specialize in finding the absolute finest luxury developments, apartments, and investment-grade properties in Nairobi.\n\nTell me: what kind of property, budget, or return profile (ROI) are you looking for?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessageAlert, setHasNewMessageAlert] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setHasNewMessageAlert(false);
    }
    // Auto scroll
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Prepare properties list as context for the backend
      const activeProperties = projects.map((p) => ({
        name: p.name,
        location: p.location,
        tagline: p.tagline,
        priceRange: p.priceRange,
        amenities: p.amenities,
        roiRentalYield: p.roiRentalYield,
        roiCapitalAppreciation: p.roiCapitalAppreciation,
        completionDate: p.completionDate,
      }));

      const response = await fetch("/api/chat/daebak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          agentName: "Daebak Search Robot",
          agentProperties: activeProperties,
        }),
      });

      const data = await response.json();

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: data.text || "I am currently scanning our property grid. Please check your query parameters or try again.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("AI Assistant response failed:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: "bot",
          text: "My neural antennas are experiencing a connection latency. Please make sure the server is fully running and try again!",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const suggestions = [
    "Find apartments under $100k in Westlands",
    "Which properties offer the highest rental yield?",
    "Show me family-friendly homes near Yaya Centre",
    "What payment plan structures are available?",
  ];

  return (
    <>
      {/* Floating Robot Head Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative group p-1 rounded-2xl bg-gradient-to-br from-stone-300 via-stone-100 to-stone-400 hover:from-stone-200 hover:to-stone-300 text-stone-800 shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 border border-stone-200 cursor-pointer flex items-center justify-center w-14 h-14"
          id="floating-search-robot-btn"
        >
          {/* Glowing Aura Effect */}
          <span className="absolute inset-0 rounded-2xl bg-stone-300/30 blur-md group-hover:bg-stone-300/50 transition-all duration-300" />
          
          {/* Notification Alert Ring */}
          {hasNewMessageAlert && !isOpen && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500 text-[9px] font-bold text-white items-center justify-center leading-none">1</span>
            </span>
          )}

          {/* Sleek Robot Head Visual */}
          <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-stone-100 to-stone-300 flex items-center justify-center border border-white/60 shadow-inner overflow-hidden">
            <Bot className="w-7 h-7 text-stone-700 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]" />
            
            {/* Glowing Cybernetic Eyes */}
            <div className="absolute top-[18px] left-[15px] flex gap-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee] animate-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee] animate-pulse" />
            </div>
            
            {/* Holographic scanning line reflection */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent h-1/2 w-full animate-bounce" />
          </div>
        </button>

        {/* Tooltip hint */}
        <AnimatePresence>
          {hasNewMessageAlert && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 bottom-16 w-56 bg-neutral-950 text-white p-3 rounded-2xl border border-stone-800 shadow-xl text-xs space-y-1 pointer-events-none"
            >
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Search Assistant</span>
              </div>
              <p className="text-stone-300 leading-snug">Click me to search apartments with our sleek robot head!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed bottom-24 right-6 w-full max-w-[380px] xs:max-w-[400px] h-[580px] bg-white rounded-3xl border border-stone-200 shadow-2xl z-50 overflow-hidden flex flex-col"
            id="search-robot-chat-panel"
          >
            {/* Sleek Silver Metallic Header */}
            <div className="p-4 bg-gradient-to-r from-stone-200 via-stone-50 to-stone-300 border-b border-stone-300 flex items-center justify-between shadow-sm relative">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center border border-white shadow-md">
                  <Bot className="w-6 h-6 text-stone-700" />
                  <div className="absolute top-[14px] left-[12px] flex gap-[8px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee] animate-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee] animate-pulse" />
                  </div>
                </div>
                <div>
                  <strong className="text-sm font-black text-stone-900 block leading-tight flex items-center gap-1.5">
                    Daebak Search Robot
                    <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  </strong>
                  <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider block">Property Intel Core v2</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-stone-300 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
                aria-label="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Conversational Stream Panel */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.sender === "bot" && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center border border-stone-300 shrink-0 shadow-sm">
                      <Bot className="w-4 h-4 text-stone-600" />
                    </div>
                  )}
                  
                  <div
                    className={`p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed font-sans shadow-sm border ${
                      msg.sender === "user"
                        ? "bg-neutral-900 text-white border-neutral-950 rounded-tr-none"
                        : "bg-white text-stone-800 border-stone-200 rounded-tl-none"
                    }`}
                  >
                    {/* Render helper to parse markdown bold text */}
                    <p className="whitespace-pre-line">
                      {msg.text.split("**").map((part, index) => 
                        index % 2 === 1 ? <strong key={index} className="font-extrabold text-neutral-950 dark:text-white">{part}</strong> : part
                      )}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Typing State Loader */}
              {isLoading && (
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center border border-stone-300 shrink-0 animate-pulse">
                    <Bot className="w-4 h-4 text-stone-600" />
                  </div>
                  <div className="bg-white border border-stone-200 p-3.5 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
                    <Loader2 className="w-4 h-4 text-stone-500 animate-spin" />
                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest font-bold">Scanning Grid...</span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Smart Prompt Chips */}
            {messages.length <= 2 && !isLoading && (
              <div className="p-3 bg-white border-t border-stone-100 space-y-1.5 shrink-0">
                <span className="text-[9px] uppercase font-mono font-bold tracking-wider text-stone-400 block px-1">Quick Search Prompts</span>
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(s)}
                      className="text-[10px] font-medium bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 px-2.5 py-1.5 rounded-xl border border-stone-200 transition-colors cursor-pointer text-left leading-normal"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Message Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="p-3 border-t border-stone-200 bg-white flex gap-2 items-center"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask our robot to scan properties..."
                disabled={isLoading}
                className="flex-1 text-xs p-3 border border-stone-200 rounded-xl focus:border-stone-400 focus:outline-none bg-stone-50 focus:bg-white transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="p-3 bg-gradient-to-br from-stone-200 via-stone-50 to-stone-300 hover:from-stone-300 hover:to-stone-400 text-stone-800 border border-stone-300 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shrink-0 cursor-pointer"
                aria-label="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
