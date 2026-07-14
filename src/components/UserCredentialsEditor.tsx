import React, { useState } from "react";
import { User } from "../types";
import { ShieldCheck, User as UserIcon, Mail, Phone, Lock, Building, Save, Eye, EyeOff, KeyRound, ArrowRight } from "lucide-react";

interface UserCredentialsEditorProps {
  user: User;
  onRefreshUsers: () => void;
  onImpersonate: (user: User) => void;
}

export default function UserCredentialsEditor({ user, onRefreshUsers, onImpersonate }: UserCredentialsEditorProps) {
  const [username, setUsername] = useState(user.username || "");
  const [email, setEmail] = useState(user.email || "");
  const [whatsappNumber, setWhatsappNumber] = useState(user.whatsappNumber || "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"Buyer" | "Developer" | "SuperAdmin" | "Agent">(user.role || "Buyer");
  const [companyName, setCompanyName] = useState(user.companyName || "");
  
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const resp = await fetch("/api/admin/users/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          username,
          email,
          whatsappNumber,
          password: password || undefined,
          role,
          companyName: role === "Developer" ? companyName : undefined,
        }),
      });

      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error || "Failed to update user profile.");
      }

      setSuccessMsg("Account profile updated and synchronized successfully!");
      setPassword(""); // Clear password field after reset
      onRefreshUsers();
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred during profile update.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
        <div>
          <h4 className="text-xs uppercase font-bold tracking-wider text-neutral-800 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-amber-500" /> Account Credentials & Workspace Parameters
          </h4>
          <p className="text-[10px] text-neutral-400">Directly modify system parameters, reset keys, and impersonate live routing nodes.</p>
        </div>
        {user.role !== "SuperAdmin" && (
          <button
            type="button"
            onClick={() => onImpersonate(user)}
            className="bg-neutral-900 text-amber-400 hover:bg-neutral-850 font-bold text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            🎭 Impersonate {user.username}
          </button>
        )}
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] rounded-xl font-mono">
          🎉 {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-[11px] rounded-xl font-mono">
          ⚠️ {errorMsg}
        </div>
      )}

      <form onSubmit={handleUpdate} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Username */}
          <div>
            <label className="text-[10px] font-mono text-stone-500 block mb-1 uppercase tracking-wider font-bold">Username / Name</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:ring-1 focus:ring-amber-500 transition-all font-semibold"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="text-[10px] font-mono text-stone-500 block mb-1 uppercase tracking-wider font-bold">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:ring-1 focus:ring-amber-500 transition-all font-semibold"
              />
            </div>
          </div>

          {/* WhatsApp / Phone Number */}
          <div>
            <label className="text-[10px] font-mono text-stone-500 block mb-1 uppercase tracking-wider font-bold">WhatsApp / Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="e.g. +254 712 345 678"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:ring-1 focus:ring-amber-500 transition-all font-semibold"
              />
            </div>
          </div>

          {/* Reset Password */}
          <div>
            <label className="text-[10px] font-mono text-stone-500 block mb-1 uppercase tracking-wider font-bold">Reset Password (Leave blank to keep same)</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Type new secure credential password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:ring-1 focus:ring-amber-500 transition-all font-semibold"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="text-[10px] font-mono text-stone-500 block mb-1 uppercase tracking-wider font-bold">Workspace Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:ring-1 focus:ring-amber-500 cursor-pointer transition-all font-semibold"
            >
              <option value="Buyer">Buyer / Investor Client</option>
              <option value="Developer">Developer Partner (SaaS)</option>
              <option value="Agent">Broker / Agency Partner</option>
              <option value="SuperAdmin">SuperAdmin System Officer</option>
            </select>
          </div>

          {/* Company Name */}
          {role === "Developer" && (
            <div>
              <label className="text-[10px] font-mono text-stone-500 block mb-1 uppercase tracking-wider font-bold">Developer Company Name</label>
              <div className="relative">
                <Building className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Damascus Real Estate"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:ring-1 focus:ring-amber-500 transition-all font-semibold"
                />
              </div>
            </div>
          )}

        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? "Saving Changes..." : "Save Account Parameters"}
          </button>
        </div>
      </form>
    </div>
  );
}
