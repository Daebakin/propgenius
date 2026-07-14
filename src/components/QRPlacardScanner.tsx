import React, { useState, useEffect, useRef } from "react";
import { 
  Camera, 
  X, 
  Check, 
  RefreshCw, 
  AlertTriangle, 
  Scan, 
  Smartphone, 
  Info, 
  ExternalLink, 
  FileText, 
  QrCode, 
  CheckCircle2, 
  TrendingUp, 
  Tag, 
  MapPin, 
  HelpCircle,
  Zap,
  Sparkles,
  Flashlight
} from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";
import { Project } from "../types";

interface QRPlacardScannerProps {
  activeProject: Project;
  onSelectUnit: (projectId: string, unitNumber: string, logActionText?: string) => void;
  formatPrice: (price: number) => string;
}

export default function QRPlacardScanner({
  activeProject,
  onSelectUnit,
  formatPrice
}: QRPlacardScannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<"prompt" | "granted" | "denied" | "error">("prompt");
  const [scanError, setScanError] = useState<string | null>(null);
  const [scanSuccess, setScanSuccess] = useState<string | null>(null);
  const [cameras, setCameras] = useState<Array<{ id: string; label: string }>>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>("");
  const [simulationActive, setSimulationActive] = useState(false);
  const [simulatedUnitNumber, setSimulatedUnitNumber] = useState<string>("");

  // Toggle to keep camera feed active continuously (Continuous Standby) vs active only when requested (Eco Resource-Saver)
  const [keepActive, setKeepActive] = useState(false);

  // Flashlight / torch state management
  const [hasFlashlight, setHasFlashlight] = useState(false);
  const [isFlashlightOn, setIsFlashlightOn] = useState(false);

  const scannerId = "placard-qr-reader";
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  // Extract a few sample units from the current active project to build physical cards
  const sampleUnits = React.useMemo(() => {
    const list: Array<{ number: string; type: string; price: number; status: string }> = [];
    if (!activeProject || !activeProject.towers) return list;

    activeProject.towers.forEach(tower => {
      tower.floors.forEach(floor => {
        floor.units.forEach(unit => {
          if (list.length < 3) {
            list.push({
              number: unit.number,
              type: unit.type,
              price: unit.price,
              status: unit.status
            });
          }
        });
      });
    });
    return list;
  }, [activeProject]);

  // Request cameras list on click scan
  const startCameraDiscovery = async () => {
    setIsScanning(true);
    setScanError(null);
    setScanSuccess(null);
    try {
      // First request permission by querying device list
      const devices = await Html5Qrcode.getCameras();
      if (devices && devices.length > 0) {
        setCameras(devices.map(d => ({ id: d.id, label: d.label || `Camera ${devices.indexOf(d) + 1}` })));
        setSelectedCameraId(devices[0].id);
        setCameraPermission("granted");
        
        // Auto start scanning with the first camera
        startScanning(devices[0].id);
      } else {
        setCameraPermission("denied");
        setScanError("No active video cameras found on this device.");
        setIsScanning(false);
      }
    } catch (err: any) {
      console.error("Camera discovery failed:", err);
      setCameraPermission("denied");
      setScanError("Camera access denied or blocked by browser permissions.");
      setIsScanning(false);
    }
  };

  const startScanning = async (cameraId: string) => {
    try {
      if (html5QrCodeRef.current) {
        await stopScanning();
      }

      // Initialize the core library
      const scanner = new Html5Qrcode(scannerId);
      html5QrCodeRef.current = scanner;

      await scanner.start(
        cameraId,
        {
          fps: 15,
          qrbox: (width, height) => {
            const size = Math.min(width, height) * 0.7;
            return { width: size, height: size };
          }
        },
        (decodedText) => {
          // Success Callback
          handleDecodedPayload(decodedText);
        },
        () => {
          // Silent failure callback (occurs as it polls frames)
        }
      );

      // Try to query camera capabilities for torch support
      try {
        const capabilities = scanner.getRunningTrackCapabilities();
        if (capabilities && (capabilities as any).torch) {
          setHasFlashlight(true);
        } else {
          setHasFlashlight(false);
        }
      } catch (err) {
        console.log("Failed to query camera capabilities for torch support:", err);
        // Fallback to true so users can still try to toggle it in case of browser/sandbox-related detection discrepancies
        setHasFlashlight(true);
      }
    } catch (err: any) {
      console.error("Failed to start scanner:", err);
      setScanError(`Failed to bind camera input: ${err.message || err}`);
    }
  };

  const stopScanning = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        await html5QrCodeRef.current.stop();
      } catch (err) {
        console.error("Error stopping scanner instance:", err);
      }
    }
    html5QrCodeRef.current = null;
    setIsFlashlightOn(false);
    setHasFlashlight(false);
  };

  const toggleFlashlight = async () => {
    if (!html5QrCodeRef.current || !html5QrCodeRef.current.isScanning) return;
    const nextState = !isFlashlightOn;
    try {
      await html5QrCodeRef.current.applyVideoConstraints({
        advanced: [{ torch: nextState } as any]
      });
      setIsFlashlightOn(nextState);
    } catch (err: any) {
      console.error("Failed to toggle flashlight:", err);
      setScanError(`Flashlight error: ${err.message || err}`);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup scanner on unmount
      if (html5QrCodeRef.current) {
        stopScanning();
      }
    };
  }, []);

  const handleDecodedPayload = (text: string) => {
    try {
      // Support multiple formats:
      // 1. URL search params (e.g., https://.../?project=sky-gardens&unit=A-301)
      // 2. Direct JSON (e.g., {"project":"sky-gardens","unit":"A-301"})
      // 3. Simple text format (e.g., "sky-gardens:A-301" or "sky-gardens|A-301")
      
      let projectId = "";
      let unitNumber = "";

      if (text.includes("?") || text.includes("&")) {
        const urlStr = text.startsWith("http") ? text : `http://mock.com/${text}`;
        const url = new URL(urlStr);
        projectId = url.searchParams.get("project") || url.searchParams.get("projectId") || "";
        unitNumber = url.searchParams.get("unit") || url.searchParams.get("unitNumber") || "";
      } else if (text.trim().startsWith("{")) {
        const parsed = JSON.parse(text);
        projectId = parsed.project || parsed.projectId || "";
        unitNumber = parsed.unit || parsed.unitNumber || "";
      } else if (text.includes(":") || text.includes("|")) {
        const divider = text.includes(":") ? ":" : "|";
        const parts = text.split(divider);
        projectId = parts[0].trim();
        unitNumber = parts[1].trim();
      } else {
        // Fallback: assume it is a unit number in the current project
        projectId = activeProject.id;
        unitNumber = text.trim();
      }

      if (!projectId) {
        projectId = activeProject.id;
      }

      if (unitNumber) {
        triggerSuccessfulScan(projectId, unitNumber, `Camera Scanned Placard: ${text}`);
      } else {
        setScanError("QR parsed successfully, but could not identify a valid Unit Number.");
      }
    } catch (e: any) {
      console.error("Error processing QR code data:", e);
      setScanError("Invalid placard code format. Unable to deep link.");
    }
  };

  // Triggers successful scan feedback and deep links
  const triggerSuccessfulScan = (projId: string, unitNum: string, logLabel: string) => {
    setScanSuccess(`SUCCESS: Matched placard to unit ${unitNum}! Deep-linking now...`);
    setScanError(null);
    
    // If we do NOT request the camera feed to stay active, turn it off immediately to save resources
    if (!keepActive) {
      stopScanning();
      setIsScanning(false);
    }
    
    // Stagger navigation so the user sees the success state animation
    setTimeout(() => {
      onSelectUnit(projId, unitNum, logLabel);
      setScanSuccess(null);
      setIsOpen(false);
    }, 1500);
  };

  // Simulates a quick NFC or placard camera scan with custom animation
  const handleSimulateScan = (unitNum: string) => {
    setSimulationActive(true);
    setSimulatedUnitNumber(unitNum);
    setScanError(null);
    setScanSuccess(null);

    // Simulate laser scanning for 1.2s before linking
    setTimeout(() => {
      setSimulationActive(false);
      triggerSuccessfulScan(activeProject.id, unitNum, `Simulation Scan: Site Visit Placard for Unit ${unitNum}`);
    }, 1400);
  };

  // Helper to generate correct URLs for placards
  const getPlacardUrl = (unitNum: string) => {
    return `${window.location.origin}/?project=${activeProject.id}&unit=${unitNum}`;
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-6" id="qr-placard-module">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
            <QrCode className="w-5 h-5 text-amber-600 animate-pulse" />
          </div>
          <div>
            <h4 className="text-base font-black text-neutral-950 flex items-center gap-1.5">
              Site Visit QR Placard Scanner
              <span className="bg-amber-400 text-neutral-950 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">NEW</span>
            </h4>
            <p className="text-xs text-neutral-500 font-medium">Instantly inspect unit statuses from physical site markers</p>
          </div>
        </div>

        <button
          onClick={() => {
            setIsOpen(!isOpen);
            if (isOpen) {
              stopScanning();
              setIsScanning(false);
            }
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border uppercase cursor-pointer ${
            isOpen 
              ? "bg-stone-100 text-stone-700 border-stone-250" 
              : "bg-neutral-950 hover:bg-stone-850 text-white border-neutral-950 shadow-sm hover:shadow"
          }`}
        >
          {isOpen ? (
            <>
              <X className="w-4 h-4" /> Close Hub
            </>
          ) : (
            <>
              <Scan className="w-4 h-4" /> Open Scanner
            </>
          )}
        </button>
      </div>

      {/* Main Body */}
      {isOpen ? (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left: Camera scanner view */}
            <div className="md:col-span-6 bg-stone-50 border border-stone-200 rounded-2xl flex flex-col relative overflow-hidden min-h-[360px]" id="scanner-viewfinder-pane">
              
              {/* Dynamic Resource Saving Control Panel */}
              <div className="w-full bg-stone-100 border-b border-stone-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shrink-0">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setKeepActive(!keepActive);
                    }}
                    className={`w-10 h-6 rounded-full p-0.5 transition-colors relative duration-200 focus:outline-none cursor-pointer ${
                      keepActive ? "bg-amber-500" : "bg-stone-300"
                    }`}
                    title="Toggle continuous standby camera feed vs active on-demand eco-mode"
                    aria-label="Toggle Camera Standby Feed"
                  >
                    <span
                      className={`block w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${
                        keepActive ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                  <div className="text-left">
                    <span className="font-bold text-neutral-800 block">Keep Camera Active</span>
                    <span className="text-[10px] text-neutral-500 font-medium leading-tight block">
                      {keepActive ? "Continuous Standby" : "Eco Resource-Saver Active"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!isScanning ? (
                    <button
                      onClick={startCameraDiscovery}
                      className="bg-neutral-950 hover:bg-stone-850 text-white font-bold text-[11px] px-3.5 py-1.5 rounded-lg transition-all shadow flex items-center gap-1 uppercase tracking-wider cursor-pointer"
                      id="scan-start-trigger"
                    >
                      <Scan className="w-3.5 h-3.5 text-amber-400" />
                      Scan
                    </button>
                  ) : (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      Streaming
                    </span>
                  )}
                </div>
              </div>

              {/* Main Feed Container */}
              <div className="flex-grow p-5 flex flex-col items-center justify-center relative min-h-[280px]">
                {/* Scan Success Indicator Overlay */}
                {scanSuccess && (
                  <div className="absolute inset-0 bg-emerald-500/90 flex flex-col items-center justify-center p-6 text-center text-white z-20 animate-fadeIn">
                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-emerald-600 mb-3 shadow-lg scale-110 duration-500 transition-all">
                      <CheckCircle2 className="w-9 h-9 stroke-[3]" />
                    </div>
                    <strong className="text-sm font-bold uppercase tracking-wider block mb-1">Deep-Link Found!</strong>
                    <p className="text-xs text-emerald-50 font-medium max-w-xs">{scanSuccess}</p>
                  </div>
                )}

                {/* Scan Simulation Active Overlay */}
                {simulationActive && (
                  <div className="absolute inset-0 bg-neutral-950/85 flex flex-col items-center justify-center p-6 text-center text-white z-20 animate-fadeIn">
                    <div className="w-12 h-12 rounded-full border-4 border-amber-400 border-t-transparent animate-spin mb-4" />
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-mono font-bold uppercase tracking-widest">
                      <Zap className="w-4 h-4 text-amber-400 animate-bounce" /> Scanning Placard No. {simulatedUnitNumber}...
                    </div>
                    <p className="text-[10px] text-stone-400 mt-2 max-w-xs">Aligning dynamic laser matrix & reading cryptographic layout</p>
                    
                    {/* Sliding laser line */}
                    <div className="absolute left-0 right-0 h-0.5 bg-amber-400 shadow-[0_0_8px_#fbbf24] animate-laser top-1/4" />
                  </div>
                )}

                {isScanning ? (
                  <div className="w-full flex flex-col items-center space-y-4">
                    {/* Interactive camera view box */}
                    <div className="relative w-full max-w-[240px] aspect-square rounded-2xl overflow-hidden border-2 border-stone-300 bg-black flex items-center justify-center shadow-inner">
                      
                      {/* Native qr-reader container */}
                      <div id={scannerId} className="w-full h-full object-cover" />

                      {/* Viewfinder brackets */}
                      <div className="absolute inset-4 border border-dashed border-white/40 pointer-events-none rounded-xl" />
                      <div className="absolute top-2 left-2 w-6 h-6 border-t-4 border-l-4 border-amber-400 pointer-events-none" />
                      <div className="absolute top-2 right-2 w-6 h-6 border-t-4 border-r-4 border-amber-400 pointer-events-none" />
                      <div className="absolute bottom-2 left-2 w-6 h-6 border-b-4 border-l-4 border-amber-400 pointer-events-none" />
                      <div className="absolute bottom-2 right-2 w-6 h-6 border-b-4 border-r-4 border-amber-400 pointer-events-none" />

                      {/* Scanning active laser animation line */}
                      <div className="absolute left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_6px_#34d399] animate-laser" />
                    </div>

                    {/* Camera Selectors and Controls */}
                    <div className="w-full max-w-[240px] space-y-3">
                      {cameras.length > 1 && (
                        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-stone-250 text-xs">
                          <RefreshCw className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          <select
                            value={selectedCameraId}
                            onChange={(e) => {
                              setSelectedCameraId(e.target.value);
                              startScanning(e.target.value);
                            }}
                            className="w-full bg-transparent outline-none font-bold text-neutral-800 cursor-pointer"
                          >
                            {cameras.map(cam => (
                              <option key={cam.id} value={cam.id}>{cam.label}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Flashlight/Torch toggle */}
                      {hasFlashlight && (
                        <button
                          onClick={toggleFlashlight}
                          className={`w-full flex items-center justify-center gap-2 font-bold text-xs py-2 rounded-xl border transition-all uppercase tracking-wider cursor-pointer ${
                            isFlashlightOn
                              ? "bg-amber-400 hover:bg-amber-500 text-neutral-900 border-amber-500 shadow-sm"
                              : "bg-white hover:bg-stone-50 text-neutral-800 border-stone-200 shadow-sm"
                          }`}
                          title="Toggle Camera Flashlight"
                          id="flashlight-toggle-btn"
                        >
                          <Flashlight className={`w-4 h-4 ${isFlashlightOn ? "text-neutral-950 animate-pulse" : "text-stone-500"}`} />
                          Flashlight: {isFlashlightOn ? "ON" : "OFF"}
                        </button>
                      )}

                      <button
                        onClick={() => {
                          stopScanning();
                          setIsScanning(false);
                        }}
                        className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs py-2 rounded-xl border border-red-200 transition-colors uppercase tracking-wider cursor-pointer"
                      >
                        Turn Off Camera
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-500 shadow-inner">
                      <Camera className="w-8 h-8 animate-pulse" />
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-black text-neutral-900">Webcam Site Reader</h5>
                      <p className="text-xs text-neutral-500 max-w-xs mt-1 leading-relaxed">
                        To save system energy and memory, click <strong>Scan</strong> or toggle continuous camera standby to activate live webcam input.
                      </p>
                    </div>

                    <button
                      onClick={startCameraDiscovery}
                      className="bg-neutral-950 hover:bg-stone-850 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow flex items-center justify-center gap-1.5 mx-auto uppercase tracking-wider cursor-pointer"
                    >
                      <Camera className="w-4 h-4 text-amber-400" /> Start QR Scan Feed
                    </button>
                  </div>
                )}

                {/* Error log reporting */}
                {scanError && (
                  <div className="mt-4 bg-red-50 border border-red-200 p-3 rounded-xl flex items-start gap-2 max-w-xs">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-red-800 font-medium leading-normal">{scanError}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Printable placard mockups */}
            <div className="md:col-span-6 space-y-4">
              <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200/80 p-3 rounded-xl text-neutral-700 text-[11px] leading-relaxed">
                <Info className="w-4 h-4 text-stone-400 shrink-0" />
                <p>
                  <strong>Site Visit Simulation Node:</strong> In-person site tours feature printed placard boards attached to unit entryways. Point your webcam at these mockup QR placards, or click the <strong>Simulate Scan</strong> triggers to test direct routing.
                </p>
              </div>

              <span className="text-[10px] font-mono font-black text-neutral-400 uppercase tracking-wider block">
                Active Site Placards (Dynamic for {activeProject.name})
              </span>

              <div className="grid grid-cols-1 gap-4">
                {sampleUnits.length === 0 ? (
                  <div className="text-xs text-stone-400 italic py-6 text-center">
                    No active inventory units configured in this tower selection to create placards.
                  </div>
                ) : (
                  sampleUnits.map((unit) => {
                    const placardUrl = getPlacardUrl(unit.number);
                    // Use standard free reliable QR creation service
                    const qrImgSrc = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(placardUrl)}&color=0a0a0a`;

                    return (
                      <div 
                        key={unit.number} 
                        className="bg-white border border-stone-200 p-4 rounded-2xl flex items-center justify-between gap-4 transition-all hover:border-stone-400 hover:shadow-sm"
                      >
                        {/* Printable placad layout */}
                        <div className="flex-1 space-y-2 text-left">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] bg-stone-100 border border-stone-200 px-2 py-0.5 rounded font-mono font-bold text-neutral-600 block">
                              PLACARD BOARD
                            </span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              unit.status === "Available" 
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-150" 
                                : unit.status === "Reserved"
                                ? "bg-amber-50 text-amber-700 border border-amber-150"
                                : "bg-red-50 text-red-700 border border-red-150"
                            }`}>
                              {unit.status}
                            </span>
                          </div>

                          <div>
                            <strong className="text-sm font-black text-neutral-950 block">Unit No. {unit.number}</strong>
                            <span className="text-[10px] text-neutral-400 font-mono block uppercase">{activeProject.name} • {unit.type}</span>
                          </div>

                          <div className="flex items-center gap-1.5 text-xs">
                            <Tag className="w-3.5 h-3.5 text-amber-500" />
                            <strong className="text-neutral-950 font-black">{formatPrice(unit.price)}</strong>
                          </div>

                          {/* Trigger simulation */}
                          <button
                            onClick={() => handleSimulateScan(unit.number)}
                            className="bg-stone-50 hover:bg-neutral-950 hover:text-white border border-stone-250 hover:border-neutral-950 text-neutral-800 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 uppercase tracking-wider cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> Simulate Scan Tap
                          </button>
                        </div>

                        {/* Physical QR Code placard image representation */}
                        <div className="bg-stone-50 p-2 rounded-xl border border-stone-200 text-center flex flex-col items-center shrink-0">
                          <img 
                            src={qrImgSrc} 
                            alt={`QR placard for unit ${unit.number}`}
                            className="w-20 h-20 bg-white p-1 rounded-lg border border-stone-100"
                            referrerPolicy="no-referrer"
                          />
                          <span className="text-[8px] font-mono font-bold text-neutral-400 mt-1 uppercase tracking-tight">Point Camera</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>

          {/* Guidelines */}
          <div className="border-t border-stone-100 pt-4 text-[10px] text-neutral-400 font-medium leading-relaxed flex items-center gap-1.5 bg-stone-50/50 p-3 rounded-xl">
            <HelpCircle className="w-4 h-4 text-stone-300 shrink-0" />
            <p>
              Site placards use standard encoded URI query directives (`?project=...&unit=...`). Scans are parsed server-side, checked for live availability status classes, and directly focused onto the 3D twin matrix.
            </p>
          </div>

        </div>
      ) : (
        <div className="bg-stone-50/50 rounded-2xl p-4 text-center">
          <p className="text-xs text-neutral-500 flex items-center justify-center gap-2 font-medium">
            <Scan className="w-4 h-4 text-amber-500 shrink-0" />
            Ready for placards scanning. Click "Open Scanner" to point your camera or simulate active site visit taps.
          </p>
        </div>
      )}

    </div>
  );
}
