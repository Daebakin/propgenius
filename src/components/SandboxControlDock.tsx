import React, { useState } from "react";
import { Database, Trash2, RotateCcw, AlertTriangle, Loader2, Sliders, Check, HelpCircle, X, CheckCircle } from "lucide-react";

interface SandboxControlDockProps {
  onRefreshData: () => void;
}

export default function SandboxControlDock({ onRefreshData }: SandboxControlDockProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isWiping, setIsWiping] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleWipeDatabase = async () => {
    if (!window.confirm("CRITICAL SANDBOX WARNING:\n\nThis will permanently delete all mock listings, buyer bookings, developer leads, support tickets, and system activity logs from both the local cache AND the active Firestore database.\n\nAre you sure you want to clear all mock data?")) {
      return;
    }

    setIsWiping(true);
    setFeedback(null);

    try {
      const resp = await fetch("/api/admin/database/clear", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await resp.json();
      if (data.success) {
        setFeedback({
          type: "success",
          text: "Wiped successfully! All mock listings, bookings, leads, chats, and logs have been cleared. Ready for fresh production data."
        });
        onRefreshData();
      } else {
        setFeedback({ type: "error", text: data.error || "Wipe operation failed." });
      }
    } catch (err) {
      console.error(err);
      setFeedback({ type: "error", text: "Connection failed." });
    } finally {
      setIsWiping(false);
    }
  };

  const handleResetDatabase = async () => {
    if (!window.confirm("RESET CONFIRMATION:\n\nThis will restore the database to its pristine pre-seeded state with the 3 premium developments (Sky Gardens, Westlands Heights, Kilimani Elite Living) and their full interactive digital twin floor maps.\n\nProceed?")) {
      return;
    }

    setIsResetting(true);
    setFeedback(null);

    try {
      const resp = await fetch("/api/admin/database/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await resp.json();
      if (data.success) {
        setFeedback({
          type: "success",
          text: "Reset successfully! Clean, premium mock listings have been restored across both Firestore and memory caches."
        });
        onRefreshData();
      } else {
        setFeedback({ type: "error", text: data.error || "Reset failed." });
      }
    } catch (err) {
      console.error(err);
      setFeedback({ type: "error", text: "Connection failed." });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans" id="sandbox-dev-control-dock">
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-neutral-950 hover:bg-neutral-900 text-white rounded-full p-4 shadow-2xl border border-neutral-800 hover:border-neutral-700 cursor-pointer flex items-center justify-center gap-2 transition-all group scale-100 hover:scale-105 active:scale-95"
        title="Developer Sandbox Tools"
      >
        <Database className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-wider hidden md:inline">Sandbox Options</span>
      </button>

      {/* Control Panel Drawer */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 bg-neutral-950 border border-neutral-800 rounded-3xl p-5 shadow-2xl space-y-4 text-left animate-fadeIn">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <strong className="text-xs font-black text-white uppercase tracking-widest">Developer Controls</strong>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-neutral-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[10px] text-neutral-400 leading-normal">
            Control the sandbox data state live. Clear all mock listings for a clean production setup or restore default seeded data instantly.
          </p>

          {/* Feedback alerts */}
          {feedback && (
            <div className={`p-3 rounded-xl text-[10px] font-medium border leading-relaxed ${
              feedback.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}>
              {feedback.text}
            </div>
          )}

          {/* Core Actions list */}
          <div className="space-y-2.5">
            
            {/* WIPE SANDBOX DATA ACTION */}
            <button
              onClick={handleWipeDatabase}
              disabled={isWiping || isResetting}
              className="w-full bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 hover:border-red-500/40 text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isWiping ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                  Wiping All Listings...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Wipe All Sandbox Data
                </>
              )}
            </button>

            {/* RESET / SEED FRESH DATA ACTION */}
            <button
              onClick={handleResetDatabase}
              disabled={isWiping || isResetting}
              className="w-full bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 border border-amber-500/20 hover:border-amber-500/40 text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isResetting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  Seeding Clean Models...
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4" />
                  Reset to Default Mock Data
                </>
              )}
            </button>

          </div>

          {/* System Environment Footer */}
          <div className="border-t border-neutral-800 pt-3 flex items-center justify-between text-[9px] text-neutral-500 font-mono">
            <span>DATABASE SYNC: ACTIVE</span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-500" /> ONLINE
            </span>
          </div>

        </div>
      )}
    </div>
  );
}
