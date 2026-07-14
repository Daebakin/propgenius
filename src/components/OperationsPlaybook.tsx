import React, { useState } from "react";
import { 
  BookOpen, 
  HelpCircle, 
  ChevronRight, 
  CheckCircle2, 
  LayoutDashboard, 
  Scale, 
  Briefcase, 
  UserPlus, 
  PlusCircle, 
  Check, 
  MessageSquare, 
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from "lucide-react";

interface PlaybookSection {
  title: string;
  role: "Developer" | "Service Provider" | "Agent";
  icon: any;
  steps: {
    title: string;
    desc: string;
    details: string[];
  }[];
}

export default function OperationsPlaybook() {
  const [activeRoleFilter, setActiveRoleFilter] = useState<"All" | "Developer" | "Service Provider" | "Agent">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [isSimulatorActive, setIsSimulatorActive] = useState(false);
  const [simulatedRole, setSimulatedRole] = useState<"Developer" | "Service Provider" | "Agent">("Developer");
  const [simStep, setSimStep] = useState(0);

  // Simulated setup flows
  const simulatorFlows = {
    Developer: [
      { q: "Create Broker Account", hint: "Authenticate via Email / Phone and select Developer profile state." },
      { q: "Register Organization", hint: "Fill out developer organization tax registration & office headquarters." },
      { q: "Launch Off-Plan Event", hint: "Navigate to SaaS Command Center, select 'Create Launch', input price parameters." },
      { q: "Configure WhatsApp API Integration", hint: "Add a valid phone number inside developer profile parameters for real-time lead sync." }
    ],
    "Service Provider": [
      { q: "Professional Registration", hint: "Navigate to Professional Services Market tab and register your firm." },
      { q: "Upload Valid Licensing Nodes", hint: "Complete the regulatory compliance credentials verification process." },
      { q: "Configure coverage and payouts", hint: "Set up hourly consultancy rates, currency schedules, and active region specs." }
    ],
    Agent: [
      { q: "Acquire Broker accreditation", hint: "Link account with an active developer organization license key." },
      { q: "Configure Tower Grids", hint: "Use grid builder to set custom price indices and room configurations." },
      { q: "Embed Live 3D Spaces", hint: "Save Matteport Walkthrough URL nodes inside active property portals." }
    ]
  };

  const playbooks: PlaybookSection[] = [
    {
      title: "Real Estate Developers Operator Playbook",
      role: "Developer",
      icon: LayoutDashboard,
      steps: [
        {
          title: "Account Creation & Trust Badging",
          desc: "How developers sign up and secure the validated high-yield publisher badge.",
          details: [
            "Select the 'SaaS Command Center' or toggle your persona to 'Developer' in the sidebar terminal list.",
            "Complete authentication with your email address or business mobile phone contact line.",
            "Fill out corporate credentials, including active East Africa portfolio details.",
            "Account undergoes SuperAdmin audit to receive the premium green-certified developer trust mark."
          ]
        },
        {
          title: "Deploying Off-Plan Friday Drop Events",
          desc: "Configure luxury high-volume real estate flash sales with live interactive clock timers.",
          details: [
            "Under the Developer Workspace, select 'Create Drop Launch Event' to open the specifications drawer.",
            "Identify the target property database node (e.g. Westlands Heights, Sky Gardens).",
            "State total available inventory blocks, discount rate coefficients, and minimum reservation deposit.",
            "Save parameters to instantaneously schedule real-time countdown feeds globally on the Friday Drops tab."
          ]
        },
        {
          title: "SaaS CRM WhatsApp Lead Operations",
          desc: "Synchronize incoming tenant inquiries from mobile landing portals with live WhatsApp links.",
          details: [
            "Maintain a valid 'Developer WhatsApp Phone' within your organization profile settings.",
            "Any click on property detail maps by interested leads triggers custom deep-linked conversation tags.",
            "Monitor incoming lead flows directly inside the SaaS CRM analytics table.",
            "Trigger personalized brochures, off-plan layout sheets, or virtual appointments with potential buyers."
          ]
        }
      ]
    },
    {
      title: "Certified Service Providers Handbook",
      role: "Service Provider",
      icon: Scale,
      steps: [
        {
          title: "Regulatory Licensing & Registration",
          desc: "Onboard conveyancing lawyers, certified surveyors, and luxury staging agencies into the ecosystem.",
          details: [
            "Open the 'Professional Services Market' tab from the PropSphere terminal menu.",
            "Click 'Register as Certified Provider' in the market overview viewport.",
            "Select your legal category: Legal & Conveyancing, Valuation Services, or Virtual & Physical Staging.",
            "Add certified state regulatory licensing license identifiers for validation check pipelines."
          ]
        },
        {
          title: "Setting Live Coverage & Consultation Metrics",
          desc: "Define coverage regions, schedule online office hours, and set payouts.",
          details: [
            "Access your Service Provider Dashboard to toggle on/off availability calendars.",
            "Setup location milestones (e.g., 'Westlands', 'Kilimani', 'Eldoret', 'Mombasa Coastal Nodes').",
            "Add consultation hourly parameters (e.g., USD 150/hr or equivalent KES amounts).",
            "Connect valid banking lines or local mobile wallets (M-Pesa numbers) to handle automatic buyer payouts."
          ]
        },
        {
          title: "Managing Customer Bookings & Escrows",
          desc: "Authorize, analyze, and lock contract bookings safely via audited digital ledgers.",
          details: [
            "Receive instant notifications of client requests seeking official legal conveyancy or staging works.",
            "Approve schedules via provider settings panel instantly.",
            "Release physical report documents or high-quality stager renders into the client escrow vault folder.",
            "Check digital twin verification logs corresponding to certified properties."
          ]
        }
      ]
    },
    {
      title: "Accredited Sales Agents Operator Guide",
      role: "Agent",
      icon: Briefcase,
      steps: [
        {
          title: "Affiliation Setup & Tower Block Mappings",
          desc: "Bridge account profiles to verified developers and load initial architectural grids.",
          details: [
            "Ensure agent persona profile matches accredited developer licenses.",
            "Go to 'Agent Dashboard' from your personal navigation matrix.",
            "Access specific developer blueprints and map unique tower building assets.",
            "Define custom layout parameters (e.g. Deluxe Suite, Rooftop Terrace Studio, Corner Unit)."
          ]
        },
        {
          title: "Uploading Dynamic Floor grids and Custom Metrics",
          desc: "Configure inventory states, rating benchmarks, and live occupancy schedules.",
          details: [
            "Use the 'Grid Matrix Planner' to set exact coordinates of individual suites.",
            "Assign detailed custom size limits (sqm/sqft), bedroom volumes, and verified state indices.",
            "Toggle specific statuses live: Available, Reserved, Sold, or Coming Soon.",
            "Submit updates to replicate changes immediately on the public interactive 3D portfolio twin."
          ]
        },
        {
          title: "Configuring Matterport or 3D VR Tour Nodes",
          desc: "Specify premium digital tour integrations for remote high-yield investors.",
          details: [
            "Collect a valid Matterport, Unsplash panoramic, or interactive 3D rendering iframe link.",
            "Input the address path inside the Agent property configuration console drawer.",
            "Buyers can then view live interactive virtual tours inline inside our SEO-optimized Property listings page.",
            "Update tags dynamically upon physical structural progress milestones."
          ]
        }
      ]
    }
  ];

  const filteredPlaybooks = playbooks.filter(p => {
    const matchesRole = activeRoleFilter === "All" || p.role === activeRoleFilter;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.steps.some(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.desc.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-8 bg-stone-50/50 p-6 rounded-3xl border border-stone-200 shadow-sm text-neutral-900" id="ops-playbook-control">
      
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-neutral-900 px-3.5 py-1.5 rounded-xl border border-neutral-850 text-white font-semibold text-xs uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-amber-400" /> Platform Knowledge Base
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-neutral-950 tracking-tight">PropSphere Operations Playbook</h2>
          <p className="text-sm text-neutral-600 leading-relaxed max-w-2xl">
            A comprehensive, high-contrast operational manual and interactive setup guide designed specifically for **Certified Developers**, **SaaS Service Providers**, and **Authorized Brokers** to configure assets, establish trust milestones, and operate domains seamlessly.
          </p>
        </div>
        
        {/* Toggle Interactive Simulator */}
        <button
          onClick={() => {
            setIsSimulatorActive(!isSimulatorActive);
            setSimStep(0);
          }}
          className={`px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
            isSimulatorActive 
              ? "bg-amber-400 text-neutral-950 shadow-md hover:bg-amber-500" 
              : "bg-neutral-950 text-white hover:bg-stone-850"
          }`}
        >
          {isSimulatorActive ? "📖 View Written Playbook" : "⚡ Launch Setup Simulator"}
        </button>
      </div>

      {isSimulatorActive ? (
        /* Setup Simulator Hub */
        <div className="bg-white p-6 rounded-3xl border-2 border-dashed border-stone-300 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-250">
              <HelpCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-black text-neutral-950">Self-Guided Account Setup Simulator</h3>
              <p className="text-xs text-neutral-500 font-medium">Practice the onboarding steps inside virtual domains prior to submitting physical regulatory nodes.</p>
            </div>
          </div>

          {/* Select Simulated Role */}
          <div className="flex bg-stone-100 p-1 rounded-2xl border border-stone-200 w-fit">
            {(["Developer", "Service Provider", "Agent"] as const).map(role => (
              <button
                key={role}
                onClick={() => {
                  setSimulatedRole(role);
                  setSimStep(0);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  simulatedRole === role
                    ? "bg-white text-neutral-950 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-950"
                }`}
              >
                {role} Setup
              </button>
            ))}
          </div>

          {/* Active Sim Step Progress */}
          <div className="bg-stone-50 border border-stone-150 p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-black">
                STEP {simStep + 1} OF {simulatorFlows[simulatedRole].length}
              </span>
              <span className="bg-emerald-50 border border-emerald-250 text-emerald-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                Interactive Node
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="text-base font-black text-neutral-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                {simulatorFlows[simulatedRole][simStep].q}
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed font-medium bg-white p-4 rounded-xl border border-stone-150">
                💡 {simulatorFlows[simulatedRole][simStep].hint}
              </p>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-stone-100">
              <button
                disabled={simStep === 0}
                onClick={() => setSimStep(prev => prev - 1)}
                className="text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-lg border border-stone-250 bg-white text-neutral-600 disabled:opacity-40"
              >
                Back
              </button>

              {simStep < simulatorFlows[simulatedRole].length - 1 ? (
                <button
                  onClick={() => setSimStep(prev => prev + 1)}
                  className="bg-neutral-950 text-white hover:bg-stone-850 text-xs font-bold uppercase tracking-wider px-5 py-2 rounded-lg flex items-center gap-1.5"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
                  <Check className="w-4.5 h-4.5 text-emerald-600 stroke-[3]" /> Setup Complete! You are ready to configure live parameters.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Written Guides Manual */
        <div className="space-y-6">
          {/* Controls bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            
            {/* Role Filter Selector */}
            <div className="flex gap-1.5 bg-stone-150 p-1 rounded-xl border border-stone-200 w-fit">
              {(["All", "Developer", "Service Provider", "Agent"] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setActiveRoleFilter(role)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeRoleFilter === role
                      ? "bg-neutral-950 text-white shadow-sm"
                      : "text-neutral-600 hover:text-neutral-950 hover:bg-stone-100"
                  }`}
                >
                  {role} Filters
                </button>
              ))}
            </div>

            {/* Keyword search input */}
            <input
              type="text"
              placeholder="Search guides, keywords (e.g. escrow, drops, layouts)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border text-black border-stone-250 text-xs px-4 py-2.5 rounded-xl outline-none focus:border-neutral-950 transition-all max-w-sm"
            />
          </div>

          {/* Big Accordions grid */}
          <div className="grid grid-cols-1 gap-6">
            {filteredPlaybooks.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-stone-200 space-y-3">
                <AlertCircle className="w-10 h-10 text-stone-400 mx-auto" />
                <p className="text-sm text-stone-500 font-semibold font-mono">No matching guides found for your query.</p>
              </div>
            ) : (
              filteredPlaybooks.map((book, idx) => {
                const RoleIcon = book.icon;
                return (
                  <div key={idx} className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
                    {/* Section Header */}
                    <div className="bg-neutral-950 text-white p-5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-amber-400 text-neutral-950 rounded-2xl shadow-sm">
                          <RoleIcon className="w-5 h-5 fill-current" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-black">
                            ROLE: {book.role}
                          </span>
                          <h3 className="text-base md:text-lg font-black tracking-tight">{book.title}</h3>
                        </div>
                      </div>
                      
                      <span className="bg-white/10 text-stone-200 border border-white/10 text-[10px] uppercase font-mono px-3 py-1 rounded-xl font-bold">
                        Accredited Guides
                      </span>
                    </div>

                    {/* Section Steps rendering list */}
                    <div className="p-6 divide-y divide-stone-100">
                      {book.steps.map((step, sIdx) => {
                        const uniqueId = `${idx}-${sIdx}`;
                        const isExpanded = selectedStep === uniqueId;

                        return (
                          <div key={sIdx} className="py-4 first:pt-0 last:pb-0">
                            <button
                              onClick={() => setSelectedStep(isExpanded ? null : uniqueId)}
                              className="w-full flex items-center justify-between gap-4 text-left group"
                            >
                              <div className="space-y-1">
                                <h4 className="text-sm font-bold text-neutral-900 group-hover:text-amber-600 transition-colors">
                                  {sIdx + 1}. {step.title}
                                </h4>
                                <p className="text-xs text-neutral-500 font-medium">{step.desc}</p>
                              </div>
                              <div className={`p-1.5 rounded-full border border-stone-200 bg-stone-50 transition-transform ${isExpanded ? "rotate-90 bg-amber-50 border-amber-350 text-amber-700" : "text-neutral-500"}`}>
                                <ChevronRight className="w-4 h-4" />
                              </div>
                            </button>

                            {/* Expanded checklist detail block */}
                            {isExpanded && (
                              <div className="mt-4 bg-stone-50/70 rounded-2xl p-4 md:p-5 border border-stone-150 space-y-3 animate-fadeIn duration-200">
                                <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider font-bold block">
                                  REQUIRED OPERATIONAL CHECKLIST & WORKFLOW STEPS
                                </span>
                                <ul className="space-y-2 text-xs text-neutral-700 font-semibold">
                                  {step.details.map((detail, dIdx) => (
                                    <li key={dIdx} className="flex items-start gap-2.5">
                                      <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-250 flex items-center justify-center shrink-0 mt-0.5">
                                        <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3.5]" />
                                      </div>
                                      <span className="leading-relaxed text-[12.5px]">{detail}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Trust Badge Alert Section */}
      <div className="bg-amber-50/50 border border-amber-205 rounded-3xl p-5 flex flex-col sm:flex-row items-start gap-4">
        <ShieldCheck className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-xs font-black text-neutral-950 uppercase tracking-wide block">PropSphere Verification Regulatory Audit Note</strong>
          <p className="text-xs text-neutral-600 leading-relaxed font-semibold">
            By publishing listings, offplan tower grids, or professional consultancies, you agree to submit original verified documentation for the safety of our regional buyer escrow ledgers. Misrepresentation will flag associated nodes globally.
          </p>
        </div>
      </div>
    </div>
  );
}
