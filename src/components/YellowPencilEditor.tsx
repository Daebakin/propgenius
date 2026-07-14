import React, { useState, useEffect, useRef } from "react";
import { 
  X, 
  Save, 
  Type, 
  Paintbrush, 
  Sparkles, 
  Check, 
  Sliders, 
  Image as ImageIcon, 
  Maximize2,
  Trash2,
  Bold,
  Italic,
  AlignLeft,
  RefreshCw
} from "lucide-react";
import { VisualCustomization } from "../types";

interface YellowPencilEditorProps {
  customizations: Record<string, VisualCustomization>;
  onSaveCustomization: (elementId: string, updates: Partial<VisualCustomization>) => Promise<void>;
  onWipeCustomization?: (elementId: string) => Promise<void>;
  currentUser: any;
}

export default function YellowPencilEditor({
  customizations,
  onSaveCustomization,
  onWipeCustomization,
  currentUser
}: YellowPencilEditorProps) {
  const [isActive, setIsActive] = useState(false);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [selectedElementTag, setSelectedElementTag] = useState<string>("");
  const [hoveredRect, setHoveredRect] = useState<DOMRect | null>(null);
  const [selectedRect, setSelectedRect] = useState<DOMRect | null>(null);
  
  // Draggable window positioning state
  const [position, setPosition] = useState({ x: window.innerWidth - 410, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Style form state
  const [textContent, setTextContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [fontFamily, setFontFamily] = useState("");
  const [fontSize, setFontSize] = useState("");
  const [textColor, setTextColor] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("");
  const [fontWeight, setFontWeight] = useState("");
  const [letterSpacing, setLetterSpacing] = useState("");
  const [lineHeight, setLineHeight] = useState("");
  const [textTransform, setTextTransform] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Check if current user is SuperAdmin to render the floating pencil trigger
  const isSuperAdmin = currentUser?.role === "SuperAdmin";

  useEffect(() => {
    if (!isActive) {
      setSelectedElementId(null);
      setSelectedRect(null);
      setHoveredRect(null);
      return;
    }

    // Helper functions for reliable CSS selectors
    const getUniqueSelector = (el: HTMLElement): string => {
      if (
        el.closest("#yellow-pencil-sidebar") || 
        el.closest("#yellow-pencil-trigger") || 
        el.id?.includes("yellow-pencil") ||
        el.tagName.toLowerCase() === "body" ||
        el.tagName.toLowerCase() === "html"
      ) {
        return "";
      }

      // 1. Prefer explicit data-pencil-id
      const pId = el.getAttribute("data-pencil-id");
      if (pId) return pId;

      // 2. Or relative to closest parent data-pencil-id
      const closestPencil = el.closest("[data-pencil-id]");
      if (closestPencil) {
        const pencilId = closestPencil.getAttribute("data-pencil-id")!;
        if (closestPencil === el) {
          return pencilId;
        } else {
          const path: string[] = [];
          let current: HTMLElement | null = el;
          while (current && current !== closestPencil) {
            let selector = current.tagName.toLowerCase();
            let sibCount = 0;
            let sibIndex = 0;
            const siblings = current.parentNode ? current.parentNode.children : [];
            for (let i = 0; i < siblings.length; i++) {
              const sib = siblings[i];
              if (sib.tagName === current.tagName) {
                sibCount++;
                if (sib === current) {
                  sibIndex = sibCount;
                }
              }
            }
            if (sibCount > 1) {
              selector += `:nth-of-type(${sibIndex})`;
            }
            path.unshift(selector);
            current = current.parentElement;
          }
          return `[data-pencil-id="${pencilId}"] ${path.join(" > ")}`;
        }
      }

      // 3. Fallback to ID
      if (el.id) {
        return `#${el.id}`;
      }

      // 4. Traverse full DOM path
      const path: string[] = [];
      let current: HTMLElement | null = el;
      while (current && current.nodeType === Node.ELEMENT_NODE) {
        if (current.id) {
          path.unshift(`#${current.id}`);
          break;
        }
        let selector = current.tagName.toLowerCase();
        if (selector === "body" || selector === "html") {
          break;
        }
        const classes = Array.from(current.classList)
          .filter(c => 
            !c.includes("outline") && 
            !c.includes("border") && 
            !c.includes("bg-") && 
            !c.includes("text-") && 
            !c.includes("hover:") && 
            !c.includes("focus:") && 
            !c.includes("animate-") && 
            !c.includes("shadow-") && 
            !c.includes("rounded-") && 
            !c.includes("p-") && 
            !c.includes("m-") && 
            !c.includes("w-") && 
            !c.includes("h-") && 
            !c.includes("flex") && 
            !c.includes("grid") && 
            !c.includes("items-") && 
            !c.includes("justify-") && 
            !c.includes("gap-") && 
            !c.includes("transition-") && 
            !c.includes("opacity-") && 
            !c.includes("translate-") && 
            !c.includes("scale-") && 
            !c.includes("active:") && 
            !c.includes("duration-")
          )
          .join(".");
        if (classes) {
          selector += `.${classes}`;
        } else {
          let sibCount = 0;
          let sibIndex = 0;
          const siblings = current.parentNode ? current.parentNode.children : [];
          for (let i = 0; i < siblings.length; i++) {
            const sib = siblings[i];
            if (sib.tagName === current.tagName) {
              sibCount++;
              if (sib === current) {
                sibIndex = sibCount;
              }
            }
          }
          if (sibCount > 1) {
            selector += `:nth-of-type(${sibIndex})`;
          }
        }
        path.unshift(selector);
        current = current.parentElement;
      }
      return path.join(" > ");
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const selector = getUniqueSelector(target);
      if (!selector) {
        setHoveredRect(null);
        return;
      }
      const rect = target.getBoundingClientRect();
      setHoveredRect(rect);
    };

    const handleMouseOut = () => {
      setHoveredRect(null);
    };

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (target.closest("#yellow-pencil-sidebar") || target.closest("#yellow-pencil-trigger")) {
        return;
      }

      const selector = getUniqueSelector(target);
      if (!selector) return;

      e.preventDefault();
      e.stopPropagation();

      setSelectedElementId(selector);
      setSelectedElementTag(target.tagName.toLowerCase());
      const rect = target.getBoundingClientRect();
      setSelectedRect(rect);

      // Extract existing customizations
      const currentCustom = (customizations[selector] || {}) as any;
      setTextContent(currentCustom.textContent !== undefined ? currentCustom.textContent : (target.innerText || ""));
      setImageUrl(currentCustom.imageUrl || (target as HTMLImageElement).src || "");

      const computed = window.getComputedStyle(target);
      const rgbToHex = (rgbStr: string) => {
        if (!rgbStr || rgbStr === "rgba(0, 0, 0, 0)" || rgbStr === "transparent") return "";
        const match = rgbStr.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
        if (!match) return "";
        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);
        const a = match[4] ? parseFloat(match[4]) : 1;
        if (a === 0) return "";
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
      };

      const style = (currentCustom.styleOverrides || {}) as any;
      setFontFamily(style.fontFamily || "");
      setFontSize(style.fontSize || "");
      
      const compColor = rgbToHex(computed.color);
      setTextColor(style.textColor || compColor || "");
      
      const compBg = rgbToHex(computed.backgroundColor);
      setBackgroundColor(style.backgroundColor || compBg || "");
      
      setFontWeight(style.fontWeight || "");
      setLetterSpacing(style.letterSpacing || "");
      setLineHeight(style.lineHeight || "");
      setTextTransform(style.textTransform || "");
    };

    const handleScrollOrResize = () => {
      if (selectedElementId) {
        try {
          const isDataId = !selectedElementId.startsWith("#") && !selectedElementId.startsWith(".") && !selectedElementId.includes(" ") && !selectedElementId.includes(">");
          const querySel = isDataId ? `[data-pencil-id="${selectedElementId}"]` : selectedElementId;
          const el = document.querySelector(querySel);
          if (el) {
            setSelectedRect(el.getBoundingClientRect());
          }
        } catch (err) {
          // ignore
        }
      }
    };

    document.addEventListener("mouseover", handleMouseOver, true);
    document.addEventListener("mouseout", handleMouseOut, true);
    document.addEventListener("click", handleGlobalClick, true);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.removeEventListener("mouseover", handleMouseOver, true);
      document.removeEventListener("mouseout", handleMouseOut, true);
      document.removeEventListener("click", handleGlobalClick, true);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isActive, selectedElementId, customizations]);

  // Clean up visual previews on unmount
  useEffect(() => {
    return () => {
      document.getElementById("yellow-pencil-preview-style")?.remove();
    };
  }, []);

  // Live visual preview on the fly as changes are made in the editor panel
  useEffect(() => {
    if (!isActive || !selectedElementId) {
      const prevStyle = document.getElementById("yellow-pencil-preview-style");
      if (prevStyle) prevStyle.remove();
      return;
    }

    let rules = "";
    if (fontFamily) rules += `font-family: ${fontFamily} !important; `;
    if (fontSize) rules += `font-size: ${fontSize} !important; `;
    if (textColor) rules += `color: ${textColor} !important; `;
    if (backgroundColor) rules += `background-color: ${backgroundColor} !important; `;
    if (fontWeight) rules += `font-weight: ${fontWeight} !important; `;
    if (letterSpacing) rules += `letter-spacing: ${letterSpacing} !important; `;
    if (lineHeight) rules += `line-height: ${lineHeight} !important; `;
    if (textTransform) rules += `text-transform: ${textTransform} !important; `;

    let styleEl = document.getElementById("yellow-pencil-preview-style");
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "yellow-pencil-preview-style";
      document.head.appendChild(styleEl);
    }

    const isDataId = !selectedElementId.startsWith("#") && !selectedElementId.startsWith(".") && !selectedElementId.includes(" ") && !selectedElementId.includes(">");
    const selector = isDataId ? `[data-pencil-id="${selectedElementId}"]` : selectedElementId;

    if (rules) {
      styleEl.innerHTML = `${selector} { ${rules} }`;
    } else {
      styleEl.innerHTML = "";
    }

    // Immediately update text or image URL in DOM for preview
    try {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        if (selectedElementTag === "img") {
          const imgEl = htmlEl as HTMLImageElement;
          if (imageUrl && imgEl.src !== imageUrl) {
            imgEl.src = imageUrl;
          }
        } else {
          if (textContent !== undefined && htmlEl.innerText !== textContent) {
            htmlEl.innerText = textContent;
          }
        }
      });
    } catch (e) {
      // ignore
    }
  }, [
    isActive,
    selectedElementId,
    selectedElementTag,
    textContent,
    imageUrl,
    fontFamily,
    fontSize,
    textColor,
    backgroundColor,
    fontWeight,
    letterSpacing,
    lineHeight,
    textTransform
  ]);

  // Window drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("input") || target.closest("select") || target.closest("textarea")) {
      return;
    }
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
    e.preventDefault();
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      let newX = e.clientX - dragStart.current.x;
      let newY = e.clientY - dragStart.current.y;

      const minX = 10;
      const maxX = window.innerWidth - 390;
      const minY = 10;
      const maxY = window.innerHeight - 150;

      if (newX < minX) newX = minX;
      if (newX > maxX) newX = maxX;
      if (newY < minY) newY = minY;
      if (newY > maxY) newY = maxY;

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    const handleResize = () => {
      setPosition(prev => {
        const maxX = window.innerWidth - 400;
        const maxY = window.innerHeight - 150;
        let newX = prev.x;
        let newY = prev.y;
        if (newX > maxX) newX = Math.max(10, maxX);
        if (newY > maxY) newY = Math.max(10, maxY);
        return { x: newX, y: newY };
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isSuperAdmin) return null;

  const handleApplyStyle = async () => {
    if (!selectedElementId) return;
    setIsSaving(true);
    try {
      const updates: Partial<VisualCustomization> = {
        elementId: selectedElementId,
        textContent: textContent,
        imageUrl: imageUrl || undefined,
        styleOverrides: {
          fontFamily: fontFamily || undefined,
          fontSize: fontSize || undefined,
          textColor: textColor || undefined,
          backgroundColor: backgroundColor || undefined,
          fontWeight: fontWeight || undefined,
          letterSpacing: letterSpacing || undefined,
          lineHeight: lineHeight || undefined,
          textTransform: textTransform || undefined
        }
      };
      await onSaveCustomization(selectedElementId, updates);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleWipeStyles = async () => {
    if (!selectedElementId || !onWipeCustomization) return;
    setIsSaving(true);
    try {
      await onWipeCustomization(selectedElementId);
      setTextContent("");
      setImageUrl("");
      setFontFamily("");
      setFontSize("");
      setTextColor("");
      setBackgroundColor("");
      setFontWeight("");
      setLetterSpacing("");
      setLineHeight("");
      setTextTransform("");
      setSelectedElementId(null);
      setSelectedRect(null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative">
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {isActive && (
          <span className="bg-amber-400 text-neutral-950 text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-md shadow border border-amber-500 animate-pulse">
            ✏️ Yellow Pencil CSS Mode Active
          </span>
        )}
        <button
          onClick={() => setIsActive(!isActive)}
          className={`flex items-center gap-2 p-3.5 rounded-full shadow-2xl transition-all border shrink-0 scale-105 active:scale-95 cursor-pointer ${
            isActive 
              ? "bg-amber-400 text-neutral-950 border-amber-500 font-bold" 
              : "bg-neutral-950 hover:bg-neutral-850 text-amber-400 border-neutral-850"
          }`}
          title="Yellow Pencil Visual Theme Editor"
          id="yellow-pencil-trigger"
        >
          <Sliders className="w-5 h-5" />
          <span className="text-xs uppercase tracking-wider font-extrabold pr-1">
            {isActive ? "Close Editor" : "Yellow Pencil Editor"}
          </span>
        </button>
      </div>

      {/* Editor Sidebar Panel */}
      {isActive && (
        <div 
          id="yellow-pencil-sidebar" 
          className="fixed w-[380px] bg-white border border-stone-200 shadow-2xl z-40 flex flex-col justify-between overflow-hidden text-neutral-800 rounded-2xl select-none"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            height: "calc(100vh - 140px)",
            maxHeight: "800px"
          }}
        >
          
          {/* Header (Drag Handle) */}
          <header 
            onMouseDown={handleMouseDown}
            style={{ cursor: isDragging ? "grabbing" : "grab" }}
            className="p-4 bg-neutral-950 text-white flex items-center justify-between select-none shrink-0"
            title="Hold and drag to move editor panel"
          >
            <div className="flex items-center gap-2">
              {/* Drag indicator dots */}
              <div className="flex flex-col gap-0.5 mr-1 text-zinc-400">
                <div className="flex gap-0.5">
                  <span className="w-1 h-1 rounded-full bg-current" />
                  <span className="w-1 h-1 rounded-full bg-current" />
                </div>
                <div className="flex gap-0.5">
                  <span className="w-1 h-1 rounded-full bg-current" />
                  <span className="w-1 h-1 rounded-full bg-current" />
                </div>
                <div className="flex gap-0.5">
                  <span className="w-1 h-1 rounded-full bg-current" />
                  <span className="w-1 h-1 rounded-full bg-current" />
                </div>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <div>
                <h4 className="text-xs font-mono uppercase font-black tracking-widest text-amber-400 leading-none">Yellow Pencil 2.0</h4>
                <p className="text-[10px] text-zinc-400 mt-1 font-semibold uppercase font-sans">Movable Customizer</p>
              </div>
            </div>
            <button 
              onClick={() => setIsActive(false)}
              className="text-stone-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </header>

          {/* Selector / Guidelines Banner */}
          <div className="bg-amber-50 border-b border-amber-100 p-3 text-[11px] text-amber-900 leading-relaxed font-medium">
            {selectedElementId ? (
              <div className="flex items-center justify-between">
                <span>Selected: <strong className="font-mono text-[10px] bg-amber-200 px-1.5 py-0.5 rounded text-amber-950">{selectedElementId}</strong> ({selectedElementTag})</span>
                <button 
                  onClick={() => setSelectedElementId(null)}
                  className="text-[10px] uppercase font-black hover:underline"
                >
                  Deselect
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Hover and click any block on the page to customize fonts, colors, and static wording!</span>
              </div>
            )}
          </div>

          {/* Form Properties Editor */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 text-left text-xs">
            {selectedElementId ? (
              <>
                {/* 1. TEXT CONTENT OR IMAGE URL */}
                {selectedElementTag === "img" ? (
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-stone-400 font-extrabold uppercase tracking-wider block">Image Source URL</label>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="flex-1 bg-stone-50 border border-stone-200 text-xs p-2 rounded-xl outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-stone-400 font-extrabold uppercase tracking-wider block">Wording / Text Content</label>
                    <textarea 
                      value={textContent}
                      onChange={(e) => setTextContent(e.target.value)}
                      rows={3}
                      placeholder="Enter custom static wording..."
                      className="w-full bg-stone-50 border border-stone-200 text-xs p-2.5 rounded-xl outline-none focus:border-amber-400 font-sans"
                    />
                  </div>
                )}

                {/* 2. FONT FAMILY CONFIGURATOR */}
                {selectedElementTag !== "img" && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-stone-400 font-extrabold uppercase tracking-wider block">Typography pairing</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          { id: "Inter, sans-serif", label: "Inter Sans" },
                          { id: "'Space Grotesk', sans-serif", label: "Space Grotesk" },
                          { id: "'Playfair Display', serif", label: "Playfair Serif" },
                          { id: "'JetBrains Mono', monospace", label: "JetBrains Mono" },
                        ].map((font) => (
                          <button
                            key={font.id}
                            type="button"
                            onClick={() => setFontFamily(font.id)}
                            className={`p-2 rounded-xl border text-[11px] text-left transition-all ${
                              fontFamily === font.id 
                                ? "bg-amber-400 text-neutral-950 border-amber-450 font-bold" 
                                : "bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-300"
                            }`}
                          >
                            {font.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 3. FONT SIZES */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-stone-400 font-extrabold uppercase tracking-wider block">Font Size</label>
                      <select 
                        value={fontSize} 
                        onChange={(e) => setFontSize(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 text-xs p-2.5 rounded-xl outline-none focus:border-amber-400"
                      >
                        <option value="">Default Size</option>
                        <option value="12px">Extra Small (12px)</option>
                        <option value="14px">Small (14px)</option>
                        <option value="16px">Medium Body (16px)</option>
                        <option value="18px">Large Body (18px)</option>
                        <option value="24px">Heading Small (24px)</option>
                        <option value="32px">Heading Medium (32px)</option>
                        <option value="48px">Display Large (48px)</option>
                        <option value="64px">Cosmic Title (64px)</option>
                      </select>
                    </div>

                    {/* 4. FONT WEIGHT & DECORATION */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-stone-400 font-extrabold uppercase tracking-wider block font-black">Weight</label>
                        <select 
                          value={fontWeight} 
                          onChange={(e) => setFontWeight(e.target.value)}
                          className="w-full bg-stone-50 border border-stone-200 text-xs p-2 rounded-xl outline-none"
                        >
                          <option value="">Default</option>
                          <option value="300">Light (300)</option>
                          <option value="400">Regular (400)</option>
                          <option value="600">Semibold (600)</option>
                          <option value="700">Bold (700)</option>
                          <option value="900">Black (900)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-stone-400 font-extrabold uppercase tracking-wider block">Transform</label>
                        <select 
                          value={textTransform} 
                          onChange={(e) => setTextTransform(e.target.value)}
                          className="w-full bg-stone-50 border border-stone-200 text-xs p-2 rounded-xl outline-none"
                        >
                          <option value="">None</option>
                          <option value="uppercase">UPPERCASE</option>
                          <option value="lowercase">lowercase</option>
                          <option value="capitalize">Capitalize</option>
                        </select>
                      </div>
                    </div>

                    {/* 5. TEXT COLOR PICKER */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-stone-400 font-extrabold uppercase tracking-wider block font-black font-semibold">Text Color Accent</label>
                      <div className="flex items-center gap-2">
                        <input 
                          type="color" 
                          value={textColor.startsWith("#") ? textColor : "#000000"} 
                          onChange={(e) => setTextColor(e.target.value)}
                          className="w-8 h-8 rounded border border-stone-300 cursor-pointer p-0 shrink-0"
                        />
                        <input 
                          type="text" 
                          placeholder="Or hex code e.g. #f59e0b"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="flex-1 bg-stone-50 border border-stone-200 text-xs p-2 rounded-xl outline-none focus:border-amber-400"
                        />
                      </div>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {["#0a0a0a", "#f59e0b", "#10b981", "#ef4444", "#3b82f6", "#ffffff"].map(c => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setTextColor(c)}
                            style={{ backgroundColor: c }}
                            className="w-5 h-5 rounded-full border border-stone-300 hover:scale-110 transition-transform cursor-pointer"
                            title={c}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* 6. BACKGROUND COLOR PICKER */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-stone-400 font-extrabold uppercase tracking-wider block">Background Color Override</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color" 
                      value={backgroundColor.startsWith("#") ? backgroundColor : "#ffffff"} 
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-8 h-8 rounded border border-stone-300 cursor-pointer p-0 shrink-0"
                    />
                    <input 
                      type="text" 
                      placeholder="Or hex code e.g. #fdf6e2"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="flex-1 bg-stone-50 border border-stone-200 text-xs p-2 rounded-xl outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {["transparent", "#fef3c7", "#ecfdf5", "#fef2f2", "#eff6ff", "#0a0a0a", "#ffffff"].map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setBackgroundColor(c)}
                        style={{ backgroundColor: c === "transparent" ? "transparent" : c }}
                        className={`w-5 h-5 rounded-full border border-stone-300 hover:scale-110 transition-transform cursor-pointer flex items-center justify-center ${
                          c === "transparent" ? "bg-stone-200 text-[8px] text-stone-500 font-mono font-bold uppercase leading-none" : ""
                        }`}
                        title={c}
                      >
                        {c === "transparent" ? "N" : ""}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 7. ADVANCED SPACING overrides */}
                {selectedElementTag !== "img" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-stone-400 font-extrabold uppercase tracking-wider block">Letter Spacing</label>
                      <select 
                        value={letterSpacing} 
                        onChange={(e) => setLetterSpacing(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 text-xs p-2 rounded-xl outline-none"
                      >
                        <option value="">Default</option>
                        <option value="-0.05em">Tight (-0.05em)</option>
                        <option value="0">Normal (0)</option>
                        <option value="0.05em">Medium (0.05em)</option>
                        <option value="0.1em">Wide (0.1em)</option>
                        <option value="0.2em">Expanded (0.2em)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-stone-400 font-extrabold uppercase tracking-wider block">Line Height</label>
                      <select 
                        value={lineHeight} 
                        onChange={(e) => setLineHeight(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 text-xs p-2 rounded-xl outline-none"
                      >
                        <option value="">Default</option>
                        <option value="1">Tight (1.0)</option>
                        <option value="1.25">Snug (1.25)</option>
                        <option value="1.5">Relaxed (1.5)</option>
                        <option value="2">Double (2.0)</option>
                      </select>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16 space-y-3">
                <Paintbrush className="w-10 h-10 text-stone-300 mx-auto animate-bounce" />
                <h4 className="text-sm font-bold text-neutral-800 uppercase font-mono">No Element Clicked</h4>
                <p className="text-xs text-neutral-400 leading-relaxed max-w-[240px] mx-auto">
                  Click any text, header, image, or section on PropSphere to custom align it and override settings.
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <footer className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-2.5">
            {selectedElementId ? (
              <>
                <button
                  onClick={handleWipeStyles}
                  disabled={isSaving}
                  className="px-3.5 py-3 border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 disabled:opacity-50 text-[11px] font-extrabold rounded-2xl flex items-center gap-1 uppercase transition-colors shrink-0 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Wipe
                </button>
                <button
                  onClick={handleApplyStyle}
                  disabled={isSaving}
                  className="flex-1 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-neutral-950 px-4 py-3 text-[11px] font-extrabold rounded-2xl flex items-center justify-center gap-1.5 uppercase transition-all shadow-md shrink-0 cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" /> Sync To Database
                    </>
                  )}
                </button>
              </>
            ) : (
              <p className="text-[10px] text-stone-400 text-center w-full font-mono font-semibold uppercase">
                Ready for click target inputs
              </p>
            )}
          </footer>

        </div>
      )}

      {/* Floating Hover Overlay */}
      {isActive && hoveredRect && (
        <div 
          className="fixed pointer-events-none border border-dashed border-amber-500 bg-amber-500/5 z-50 transition-all duration-75"
          style={{
            top: `${hoveredRect.top}px`,
            left: `${hoveredRect.left}px`,
            width: `${hoveredRect.width}px`,
            height: `${hoveredRect.height}px`,
          }}
        />
      )}

      {/* Floating Selected Overlay */}
      {isActive && selectedRect && (
        <div 
          className="fixed pointer-events-none border-2 border-solid border-amber-500 bg-amber-500/10 z-50 transition-all duration-75"
          style={{
            top: `${selectedRect.top}px`,
            left: `${selectedRect.left}px`,
            width: `${selectedRect.width}px`,
            height: `${selectedRect.height}px`,
          }}
        >
          <div className="absolute -top-6 left-0 bg-amber-500 text-neutral-950 text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded-t shadow-sm whitespace-nowrap">
            {selectedElementTag} • {selectedElementId && selectedElementId.length > 25 ? `${selectedElementId.substring(0, 25)}...` : selectedElementId}
          </div>
        </div>
      )}
    </div>
  );
}
