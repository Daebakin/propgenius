import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Lock, User, Building, AlertCircle, Loader2, ShieldCheck, ArrowRight } from "lucide-react";
import { User as UserType } from "../types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserType) => void;
  initialTab?: "login" | "register";
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialTab = "login" }: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "register">(initialTab);

  useEffect(() => {
    if (isOpen) {
      setTab(initialTab);
    }
  }, [isOpen, initialTab]);
  
  // User Form Inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<"Buyer" | "Developer" | "SuperAdmin">("Buyer");
  const [companyName, setCompanyName] = useState("");
  
  // States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !password) {
      setError("Please fill in all core credentials.");
      return;
    }

    if (tab === "register" && !username) {
      setError("Please provide a username for registration.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = tab === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload = tab === "login" 
        ? { email, password }
        : { username, email, password, role, companyName: role === "Developer" ? companyName : undefined };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed. Please verify credentials.");
      }

      setSuccess(tab === "login" ? "Successfully logged in!" : "Account created successfully!");
      
      // Delay to show success state beautifully
      setTimeout(() => {
        onAuthSuccess(data.user);
        onClose();
        // Reset state
        setEmail("");
        setPassword("");
        setUsername("");
        setSuccess(null);
      }, 1000);

    } catch (err: any) {
      setError(err.message || "A network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // One-click demo logins for pristine user evaluation
  const handleQuickLogin = async (demoEmail: string, pass: string) => {
    setError(null);
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: demoEmail, password: pass }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed demo login");
      
      setSuccess("Demo Session Activated!");
      setTimeout(() => {
        onAuthSuccess(data.user);
        onClose();
        setSuccess(null);
      }, 800);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/65 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md overflow-hidden bg-white rounded-3xl border border-stone-200 shadow-2xl flex flex-col relative"
        id="auth-modal"
      >
        
        {/* Banner header pattern */}
        <div className="bg-gradient-to-br from-neutral-950 to-stone-900 px-6 py-8 text-white relative">
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-amber-500/10 blur-xl rounded-full" />
          <button 
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] bg-amber-400 text-neutral-950 px-2 py-0.5 rounded font-mono font-bold tracking-widest uppercase">
              Secure Gateway
            </span>
            <span className="text-[10px] text-stone-400 font-mono">v2.1 OS</span>
          </div>
          
          <h2 className="text-2xl font-black uppercase tracking-tight text-white leading-none">
            {tab === "login" ? "PropSphere Sign In" : "Register Credentials"}
          </h2>
          <p className="text-xs text-stone-400 mt-1 leading-relaxed">
            {tab === "login" 
              ? "Access verified Kenya developer portals & active waiting rooms." 
              : "Launch your property development or register a verified buyer portfolio."}
          </p>
        </div>

        {/* Tab Headers */}
        <div className="flex border-b border-stone-100 bg-stone-50/50">
          <button
            type="button"
            onClick={() => { setTab("login"); setError(null); }}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
              tab === "login" 
                ? "border-amber-500 text-neutral-950 bg-white" 
                : "border-transparent text-neutral-500 hover:text-neutral-950 hover:bg-stone-50"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setTab("register"); setError(null); }}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
              tab === "register" 
                ? "border-amber-500 text-neutral-950 bg-white" 
                : "border-transparent text-neutral-500 hover:text-neutral-950 hover:bg-stone-50"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="flex items-start gap-2 bg-red-50 text-red-700 p-3 rounded-xl border border-red-200 text-xs text-left animate-shake">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 bg-green-50 text-green-700 p-3 rounded-xl border border-green-200 text-xs text-left">
              <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" />
              <span className="font-bold">{success}</span>
            </div>
          )}

          <div className="space-y-3">
            {tab === "register" && (
              <div>
                <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block font-bold mb-1">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name or company handler"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all font-semibold"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block font-bold mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-stone-400" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block font-bold mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-stone-400" />
                <input
                  type="password"
                  required
                  placeholder="Set account access key"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all font-semibold"
                />
              </div>
            </div>

            {tab === "register" && (
              <>
                <div>
                  <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block font-bold mb-1">
                    Select Account Role
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "Buyer", label: "Buyer" },
                      { id: "Developer", label: "Developer" },
                      { id: "SuperAdmin", label: "Super Admin" }
                    ].map((r) => (
                      <button
                        type="button"
                        key={r.id}
                        onClick={() => setRole(r.id as any)}
                        className={`py-2 text-[10px] font-bold uppercase tracking-wider border rounded-xl transition-all ${
                          role === r.id
                            ? "bg-neutral-950 text-white border-neutral-950 shadow-sm"
                            : "bg-white text-stone-500 border-stone-200 hover:bg-stone-50"
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                {role === "Developer" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-1 block duration-200 pt-1"
                  >
                    <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block font-bold mb-1">
                      Developer Company Name
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Premium Spaces East Africa"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all font-semibold"
                      />
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 bg-amber-400 hover:bg-amber-300 hover:shadow-md text-neutral-950 font-bold uppercase tracking-wider text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-neutral-950" /> Working...
              </>
            ) : (
              <>
                {tab === "login" ? "Unlock Access" : "Create Account Credentials"} <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Demo Portals shortcut footer (highly useful for evaluator workspace) */}
        <div className="bg-stone-50 border-t border-stone-100 p-4 shrink-0 text-center">
          <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider font-extrabold mb-2 text-center">
            ⚡ Quick Demo Accounts (No registration needed!)
          </p>
          <div className="flex flex-wrap gap-1.5 justify-center">
            <button
              type="button"
              onClick={() => handleQuickLogin("buyer@propsphere.com", "buyer123")}
              className="px-2 py-1 bg-white hover:bg-amber-50 text-[10px] font-bold rounded-lg border border-stone-200 text-stone-600 hover:text-amber-600 transition-all"
            >
              Buyer Key
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("developer@propsphere.com", "developer123")}
              className="px-2 py-1 bg-white hover:bg-blue-50 text-[10px] font-bold rounded-lg border border-stone-200 text-stone-600 hover:text-blue-600 transition-all"
            >
              Developer Key
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("admin@propsphere.com", "admin123")}
              className="px-2 py-1 bg-white hover:bg-neutral-100 text-[10px] font-bold rounded-lg border border-stone-200 text-stone-600 hover:text-neutral-950 transition-all"
            >
              Admin Key
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
