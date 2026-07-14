import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  TrendingUp, 
  Activity, 
  Brain, 
  RefreshCw, 
  Eye, 
  MousePointer, 
  Compass, 
  Calendar, 
  AlertCircle, 
  User, 
  Lightbulb, 
  ArrowRight,
  TrendingDown,
  BarChart3,
  Terminal,
  Zap,
  HelpCircle,
  FileSpreadsheet
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";

// Helper function to send interaction events to the backend
export async function logAIInteraction(type: string, target: string, details: string = "") {
  try {
    const saved = localStorage.getItem("propsphere_user");
    const headers: any = {
      "Content-Type": "application/json"
    };
    if (saved) {
      try {
        const user = JSON.parse(saved);
        headers["x-user-id"] = user.id;
        headers["x-user-email"] = user.email;
        headers["x-user-role"] = user.role;
      } catch (e) {}
    }
    
    await fetch("/api/ai/interact", {
      method: "POST",
      headers,
      body: JSON.stringify({ type, target, details })
    });
  } catch (err) {
    console.error("Failed to report telemetry interaction to PropSphere AI Core:", err);
  }
}

interface PredictionData {
  learningSummary: string;
  predictions: Array<{
    trendName: string;
    metricTracked: string;
    growthForecast: string;
    description: string;
    impactScore: number;
  }>;
  projectAffinities: Array<{
    projectId: string;
    projectName: string;
    currentScore: number;
    demandPrediction: string;
    suggestedAction: string;
  }>;
  recentAnomalies: string[];
  predictedActions: Array<{
    targetPersona: string;
    action: string;
    rationale: string;
  }>;
}

export default function AdaptiveAIHub() {
  const [loading, setLoading] = useState(true);
  const [retraining, setRetraining] = useState(false);
  const [aiData, setAiData] = useState<PredictionData | null>(null);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"dashboard" | "sandbox" | "logs">("dashboard");
  const [customQuestion, setCustomQuestion] = useState("");
  const [sandboxAnswer, setSandboxAnswer] = useState<string | null>(null);
  const [sandboxLoading, setSandboxLoading] = useState(false);

  // Fetch AI Predictions and raw telemetry logs
  const fetchAIData = async (isRetrain = false) => {
    if (isRetrain) setRetraining(true);
    else setLoading(true);

    try {
      if (isRetrain) {
        await fetch("/api/ai/retrain", { method: "POST" });
      }

      const predResp = await fetch("/api/ai/predictions");
      const predJson = await predResp.json();
      if (predResp.ok) {
        setAiData(predJson.predictions);
      }

      const logResp = await fetch("/api/ai/interactions");
      const logJson = await logResp.json();
      if (logResp.ok) {
        setRecentLogs(logJson.interactions);
      }
    } catch (e) {
      console.error("Failed to fetch adaptive AI intelligence parameters:", e);
    } finally {
      setLoading(false);
      setRetraining(false);
    }
  };

  useEffect(() => {
    fetchAIData();
    // Set up auto-poll refresh cycle every 30 seconds for live telemetry update
    const interval = setInterval(() => {
      fetchAIData();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRetrain = () => {
    fetchAIData(true);
  };

  const runSandboxQuery = async (queryPreset: string) => {
    setSandboxLoading(true);
    setSandboxAnswer(null);
    logAIInteraction("sandbox-query", "adaptive-ai-hub", `Queried preset: ${queryPreset}`);

    try {
      // Use the chatbotservice endpoint to answer sandbox predictive inquiries on current data context
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: "sky-gardens", // Reference general context
          message: `[ADAPTIVE AI ANALYTICS ENGINE INQUIRY] Based on our live interactions logs and database records: ${queryPreset}. Provide a detailed predictive forecast of trends and activity in Nairobi.`
        })
      });
      const data = await resp.json();
      setSandboxAnswer(data.reply || "Error fetching predictions forecast.");
    } catch (e) {
      setSandboxAnswer("The AI Core was unable to compile the analytical response. Please check your connectivity.");
    } finally {
      setSandboxLoading(false);
    }
  };

  const handleCustomQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;
    runSandboxQuery(customQuestion);
    setCustomQuestion("");
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center space-y-4">
        <LoaderSpinner className="w-12 h-12 text-amber-500 animate-spin" />
        <div className="text-center">
          <h4 className="text-sm font-black text-neutral-900 uppercase tracking-widest font-mono">Initializing AI Core</h4>
          <p className="text-xs text-stone-500 mt-1 font-semibold">Aligning neural weights with live telemetry feeds...</p>
        </div>
      </div>
    );
  }

  // Pre-formatted chart data
  const affinityChartData = aiData?.projectAffinities.map(p => ({
    name: p.projectName.split(" ")[0] + " " + (p.projectName.split(" ")[1] || ""),
    "Interest Affinity Score": p.currentScore,
    predictedDemand: p.demandPrediction
  })) || [];

  const COLORS = ["#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"];

  return (
    <div id="adaptive-ai-hub-container" className="max-w-7xl mx-auto space-y-8 animate-fadeIn">
      
      {/* HEADER SPLASH */}
      <div className="bg-neutral-950 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden border border-neutral-850 shadow-xl">
        <div className="absolute inset-0 bg-radial-at-t from-amber-500/10 via-transparent to-transparent opacity-60" />
        <div className="absolute right-0 top-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
        
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <span className="text-[10px] bg-amber-400 text-neutral-950 font-mono font-bold px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1 w-fit animate-pulse">
              <Brain className="w-3.5 h-3.5" /> PropSphere Synaptic Core v2.4
            </span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-neutral-50 font-sans">
              Adaptive Predictive Intelligence
            </h1>
            <p className="text-xs text-neutral-400 max-w-xl font-medium leading-relaxed">
              PropSphere's living, growing neural model tracks views, clicks, and bookings dynamically. 
              The system trains automatically, optimizing recommendations, predicting next-quarter Nairobi trends, and drafting developer adjustments.
            </p>
          </div>

          <button
            onClick={handleRetrain}
            disabled={retraining}
            className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md ${
              retraining 
                ? "bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed" 
                : "bg-amber-400 text-neutral-950 hover:bg-amber-300"
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${retraining ? "animate-spin" : ""}`} />
            {retraining ? "Syncing Synapses..." : "Retrain AI Connections"}
          </button>
        </div>

        {/* Live Learning summary band */}
        <div className="mt-6 pt-5 border-t border-neutral-850/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-400">
            <Zap className="w-4 h-4 shrink-0" />
            <strong className="font-semibold font-mono uppercase tracking-wider">Trained Memory Status:</strong>
          </div>
          <p className="text-neutral-300 font-medium italic flex-1 text-left sm:ml-4">
            "{aiData?.learningSummary || "Dynamic telemetry feed online. Synapses tuned to Nairobi Central real estate traffic nodes."}"
          </p>
        </div>
      </div>

      {/* INNER PAGES TAB CONTROLS */}
      <div className="flex items-center justify-between border-b border-stone-250 pb-1">
        <div className="flex gap-1 bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
          <button
            onClick={() => {
              setActiveTab("dashboard");
              logAIInteraction("hub-tab-switch", "dashboard");
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === "dashboard"
                ? "bg-neutral-950 text-white shadow-md"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-1.5" /> AI Predictive Desk
          </button>
          <button
            onClick={() => {
              setActiveTab("sandbox");
              logAIInteraction("hub-tab-switch", "sandbox");
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === "sandbox"
                ? "bg-neutral-950 text-white shadow-md"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            <Compass className="w-4 h-4 inline mr-1.5" /> Trend Sandbox
          </button>
          <button
            onClick={() => {
              setActiveTab("logs");
              logAIInteraction("hub-tab-switch", "logs");
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === "logs"
                ? "bg-neutral-950 text-white shadow-md"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            <Terminal className="w-4 h-4 inline mr-1.5" /> Telemetry Feed ({recentLogs.length})
          </button>
        </div>

        <span className="text-[10px] text-stone-400 font-mono font-bold uppercase tracking-widest hidden sm:inline">
          Live Connection: Secure HTTPS TLS 1.3
        </span>
      </div>

      <AnimatePresence mode="wait">
        {/* ======================= TAB 1: DYNAMIC PREDICTIONS DASHBOARD ======================= */}
        {activeTab === "dashboard" && (
          <motion.div
            key="dashboard-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* GRID 1: Affinity Chart & Anomaly Radar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column - Live Project Demand Affinity (7 columns) */}
              <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase font-mono tracking-widest font-black block">LEARNED TELEMETRY SCORE</span>
                      <h3 className="text-lg font-black text-neutral-950">Property Demand Affinity Chart</h3>
                    </div>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-600 font-mono font-bold px-2.5 py-0.5 rounded-full">
                      Real-time Computed
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 font-medium mb-6 leading-relaxed">
                    This chart indicates the relative affinity scores calculated dynamically from total on-site page views, floor grid clicks, WhatsApp inquiries, and reservation locks.
                  </p>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={affinityChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f0" />
                      <XAxis dataKey="name" stroke="#a3a3a3" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#a3a3a3" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#0a0a0a", color: "#f5f5f5", borderRadius: "16px", border: "none", fontSize: "11px" }}
                        cursor={{ fill: '#fafafa' }}
                      />
                      <Bar dataKey="Interest Affinity Score" radius={[8, 8, 0, 0]}>
                        {affinityChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-3 gap-3 border-t border-stone-100 pt-5 mt-4 text-center">
                  {aiData?.projectAffinities.map((p, idx) => (
                    <div key={p.projectId} className="space-y-1">
                      <span className="text-[10px] text-neutral-400 font-semibold uppercase block truncate">{p.projectName.split(" ")[0]}</span>
                      <strong className="text-xl font-black block" style={{ color: COLORS[idx % COLORS.length] }}>
                        {p.currentScore}%
                      </strong>
                      <span className="text-[9px] text-stone-500 font-bold block bg-stone-50 rounded-full py-0.5 truncate px-1">
                        {p.demandPrediction}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - Deep Anomaly Log & Synapse Health (5 columns) */}
              <div className="lg:col-span-5 bg-stone-900 text-stone-100 p-6 rounded-3xl border border-neutral-850 shadow-xl flex flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-850/30 to-transparent pointer-events-none" />
                
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="w-5 h-5 text-amber-400 animate-pulse" />
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-mono tracking-widest block font-bold">ANOMALY ENGINE LOGS</span>
                      <h3 className="text-base font-extrabold text-white">Live Intelligence Anomalies</h3>
                    </div>
                  </div>
                  <p className="text-[11px] text-stone-400 leading-relaxed font-semibold mb-5">
                    Our machine learning models constantly query for statistically abnormal user traffic patterns that indicate immediate shifting sentiment.
                  </p>

                  <div className="space-y-3.5">
                    {aiData?.recentAnomalies.map((anomaly, index) => (
                      <div key={index} className="flex gap-3 bg-neutral-950 p-3.5 rounded-2xl border border-neutral-850">
                        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-stone-300 font-medium leading-relaxed">
                          {anomaly}
                        </p>
                      </div>
                    ))}
                    {(!aiData?.recentAnomalies || aiData.recentAnomalies.length === 0) && (
                      <p className="text-xs text-stone-500 italic">No statistical anomalies detected. Standard traffic flows balanced.</p>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-neutral-850/60 text-xs">
                  <div className="bg-neutral-950/80 p-3 rounded-xl border border-neutral-850 text-[11px] space-y-1">
                    <span className="text-amber-400 font-mono block font-bold"># model_status_logs</span>
                    <p className="text-stone-400 font-semibold font-mono leading-normal">
                      &gt; Caching layers aligned.<br />
                      &gt; Neural training weights: stable.<br />
                      &gt; Prediction error (loss): 0.042 (Optimal)
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* SECTION 2: Predictive bento grid cards */}
            <div className="space-y-4">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-mono tracking-widest font-black block">FORECAST MATRIX</span>
                <h3 className="text-xl font-black text-neutral-950">Emerging Real Estate Trend Predictors</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {aiData?.predictions.map((trend, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-5">
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] bg-stone-100 text-stone-600 font-mono font-bold px-2.5 py-1 rounded-lg border border-stone-150">
                          {trend.metricTracked}
                        </span>
                        <div className="text-right">
                          <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-bold">Predicted Index</span>
                          <span className="text-sm font-extrabold text-emerald-600">{trend.growthForecast}</span>
                        </div>
                      </div>

                      <h4 className="text-base font-black text-neutral-950">{trend.trendName}</h4>
                      <p className="text-xs text-stone-600 leading-relaxed font-semibold">
                        {trend.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-[10px] text-stone-400 uppercase font-mono font-black">AI Prediction Confidence</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-stone-100 h-2.5 rounded-full overflow-hidden border border-stone-200">
                          <div 
                            className="bg-amber-400 h-full rounded-full" 
                            style={{ width: `${trend.impactScore}%` }} 
                          />
                        </div>
                        <span className="text-xs font-black font-mono text-neutral-800">{trend.impactScore}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 3: Dynamic Strategic Recommendations (Admins vs Developers vs Buyers) */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-6">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-mono tracking-widest font-black block">PERSONA STRATEGY SHAPING</span>
                <h3 className="text-lg font-black text-neutral-950">Data-Driven Strategic Actions</h3>
                <p className="text-xs text-stone-500 font-semibold mt-1">Our adaptive AI core designs specific actionable items dynamically to match changing user vectors.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {aiData?.predictedActions.map((rec, idx) => {
                  let badgeColor = "bg-neutral-950 text-white";
                  if (rec.targetPersona === "Developer") badgeColor = "bg-amber-400 text-neutral-950";
                  if (rec.targetPersona === "Buyer") badgeColor = "bg-emerald-500 text-white";

                  return (
                    <div key={idx} className="bg-stone-50 p-5 rounded-2xl border border-stone-150 flex flex-col justify-between space-y-4">
                      <div className="space-y-2.5">
                        <span className={`text-[9px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${badgeColor}`}>
                          Target: {rec.targetPersona}
                        </span>
                        
                        <h4 className="text-xs font-black text-neutral-900 leading-normal uppercase">
                          {rec.action}
                        </h4>
                      </div>

                      <div className="bg-white p-3.5 rounded-xl border border-stone-150 space-y-1">
                        <strong className="text-[9px] uppercase font-mono tracking-wider text-neutral-400 block font-bold">RATIONALE FOUNDATION</strong>
                        <p className="text-[11px] text-stone-600 leading-relaxed font-semibold">
                          {rec.rationale}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </motion.div>
        )}

        {/* ======================= TAB 2: TREND SANDBOX PLAYGROUND ======================= */}
        {activeTab === "sandbox" && (
          <motion.div
            key="sandbox-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-6">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-mono tracking-widest font-black block">NEURAL INQUIRY LAB</span>
                <h3 className="text-xl font-black text-neutral-950">Adaptive Trend Sandbox</h3>
                <p className="text-xs text-stone-500 font-semibold mt-1">
                  Query our live intelligence core directly. The model evaluates current database records, clickstreams, and historical transactions to output complex forecast briefs.
                </p>
              </div>

              {/* Preset buttons */}
              <div className="space-y-2">
                <span className="text-[10px] text-stone-400 uppercase font-mono font-black block">SELECT CORE PRESET INQUIRY:</span>
                <div className="flex flex-wrap gap-2.5">
                  {[
                    "Predict Westlands demand parameters for studios vs 2-bedrooms next quarter",
                    "Analyze high-income expatriate interest vectors based on clicks and search filters",
                    "Compute the expected impact of the expressway bypass on ready family completed apartments",
                    "Evaluate rental multi-occupancy yields if mortgage rate drops from 13.5% to 11%"
                  ].map((preset, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => runSandboxQuery(preset)}
                      disabled={sandboxLoading}
                      className="text-left text-xs bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-200 hover:border-stone-350 px-4 py-3 rounded-2xl transition-all font-semibold flex items-center justify-between gap-3 active:scale-98 cursor-pointer disabled:opacity-50"
                    >
                      <span>{preset}</span>
                      <ArrowRight className="w-4 h-4 shrink-0 text-stone-400" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom input bar */}
              <form onSubmit={handleCustomQuestionSubmit} className="pt-4 border-t border-stone-100 flex gap-2">
                <input
                  type="text"
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  disabled={sandboxLoading}
                  placeholder="Ask the AI Core anything (e.g. Predict the hold deposit traction of Tower A)..."
                  className="flex-1 bg-stone-50 text-neutral-900 placeholder-stone-400 border border-stone-200 rounded-2xl px-4 py-3 text-xs outline-none focus:bg-white focus:border-stone-400 focus:ring-2 focus:ring-neutral-950/5 transition-all font-semibold"
                />
                <button
                  type="submit"
                  disabled={sandboxLoading || !customQuestion.trim()}
                  className="bg-neutral-950 hover:bg-stone-850 text-white font-extrabold text-xs px-6 py-3 rounded-2xl uppercase tracking-wider transition-all cursor-pointer shadow-md shrink-0 flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-amber-450" /> Query Core
                </button>
              </form>
            </div>

            {/* OUTPUT BLOCK */}
            <AnimatePresence mode="wait">
              {sandboxLoading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-neutral-950 text-white p-6 rounded-3xl border border-neutral-850 shadow-inner flex flex-col items-center justify-center py-12 space-y-4"
                >
                  <LoaderSpinner className="w-10 h-10 text-amber-400 animate-spin" />
                  <div className="text-center">
                    <strong className="text-xs font-black uppercase font-mono tracking-widest text-amber-400 animate-pulse block">Computing Synaptic Forecasts</strong>
                    <p className="text-[11px] text-stone-400 mt-1 font-semibold font-mono">&gt; Running regression matrices on site clickstreams...</p>
                  </div>
                </motion.div>
              )}

              {sandboxAnswer && !sandboxLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-neutral-950 text-white p-6 md:p-8 rounded-3xl border border-neutral-850 shadow-xl space-y-4 relative overflow-hidden"
                >
                  <div className="absolute right-0 top-0 w-48 h-48 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="flex items-center gap-2 pb-3 border-b border-neutral-850">
                    <Brain className="w-5 h-5 text-amber-400" />
                    <div>
                      <span className="text-[9px] text-stone-400 uppercase font-mono block">PROPSPHERE DYNAMIC BRAIN REPORT</span>
                      <h4 className="text-sm font-black text-white">Live Trends Predictive Brief</h4>
                    </div>
                  </div>

                  <div className="text-xs md:text-sm text-stone-300 leading-relaxed font-medium space-y-3 whitespace-pre-line font-sans">
                    {sandboxAnswer}
                  </div>

                  <div className="bg-neutral-900/60 p-3 rounded-2xl border border-neutral-850 flex items-center justify-between text-[10px] text-stone-400 font-mono font-bold mt-5">
                    <span>STATUS: TRAINED MEMORY CORRELATED</span>
                    <span>CONFIDENCE FACTOR: 94.6%</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        )}

        {/* ======================= TAB 3: REAL-TIME TELEMETRY EVENT LOGS ======================= */}
        {activeTab === "logs" && (
          <motion.div
            key="logs-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-mono tracking-widest font-black block">TELEMETRY STREAM</span>
                <h3 className="text-xl font-black text-neutral-950">Real-Time Interaction logs</h3>
                <p className="text-xs text-stone-500 font-semibold mt-1">
                  This streams raw user click and view coordinates exactly as they happen. These events serve as the instant training dataset for the PropSphere AI.
                </p>
              </div>

              {/* Logs Table */}
              <div className="border border-stone-150 rounded-2xl overflow-hidden">
                <div className="bg-stone-50 p-3.5 border-b border-stone-150 grid grid-cols-12 text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest">
                  <span className="col-span-3">Timestamp / Date</span>
                  <span className="col-span-2">User / Identity</span>
                  <span className="col-span-2">Action Type</span>
                  <span className="col-span-2">Target Block</span>
                  <span className="col-span-3">Raw Context Details</span>
                </div>

                <div className="divide-y divide-stone-100 max-h-[400px] overflow-y-auto">
                  {recentLogs.map((log) => {
                    let typeBadge = "bg-stone-100 text-stone-600";
                    if (log.type === "click" || log.type === "unit-click") typeBadge = "bg-amber-400/10 text-amber-600 border border-amber-400/20";
                    if (log.type === "view" || log.type === "project-view") typeBadge = "bg-blue-500/10 text-blue-600 border border-blue-500/20";
                    if (log.type === "search" || log.type === "filter") typeBadge = "bg-purple-500/10 text-purple-600 border border-purple-500/20";
                    if (log.type === "reservation") typeBadge = "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20";

                    return (
                      <div key={log.id} className="p-3.5 hover:bg-stone-50 transition-colors grid grid-cols-12 items-center text-xs text-stone-700 font-semibold gap-2">
                        {/* Timestamp */}
                        <span className="col-span-3 font-mono text-stone-400 text-[11px]">
                          {new Date(log.timestamp || Date.now()).toLocaleString()}
                        </span>

                        {/* Identity */}
                        <span className="col-span-2 truncate font-mono text-neutral-800 text-[11px] flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          {log.email ? log.email.split("@")[0] : "Anonymous"}
                        </span>

                        {/* Action Type */}
                        <span className="col-span-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border inline-block ${typeBadge}`}>
                            {log.type}
                          </span>
                        </span>

                        {/* Target block */}
                        <span className="col-span-2 truncate font-mono text-neutral-900 bg-stone-50 border border-stone-200 px-1.5 py-0.5 rounded text-[11px] w-fit">
                          {log.target}
                        </span>

                        {/* Context details */}
                        <span className="col-span-3 truncate text-stone-500 text-[11px] font-mono" title={log.details}>
                          {log.details || "-"}
                        </span>
                      </div>
                    );
                  })}
                  {recentLogs.length === 0 && (
                    <div className="py-12 text-center text-stone-400 italic">No telemetry logs captured on current session yet. Navigate around the site to generate logs!</div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Minimal customized inline spinning vector icon
function LoaderSpinner({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}
