"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    ChevronDown,
    ChevronUp,
    Sparkles,
    Upload,
    Wand2,
    Settings2,
    Image as ImageIcon,
    Video,
    Frame
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface StudioLeftPanelProps {
    onGenerate: (prompt: string, settings: any) => void;
    isGenerating: boolean;
    mode: "image" | "video" | "templates";
    aspectRatio: string;
    setAspectRatio: (val: string) => void;
}

const AI_IMAGE_MODELS = [
    { id: "gpt-1.5", name: "GPT Image 1.5 API", isNew: true },
    { id: "grok", name: "Grok Imagine API", isNew: true },
    { id: "nano-pro", name: "Nano Banana Pro API" },
    { id: "seedream", name: "Seedream 4.5 API" },
    { id: "flux", name: "FLUX.2 API" },
    { id: "4o", name: "4o Image API" },
    { id: "z-image", name: "Z-Image API" },
    { id: "nano", name: "Nano Banana API" },
];

const AI_VIDEO_MODELS = [
    { id: "kling-3", name: "Kling 3.0 API", isNew: true },
    { id: "seedance-1.5", name: "Seedance 1.5 Pro API", isNew: true },
    { id: "wan-2.6", name: "Wan 2.6 API", isNew: true },
    { id: "hailuo", name: "Hailuo 02 API" },
    { id: "sora-2", name: "Sora-2 API" },
    { id: "sora-2-pro", name: "Sora-2-Pro API" },
    { id: "seedance-1", name: "Seedance 1.0 Pro API" },
    { id: "kling-2.6", name: "Kling 2.6 API" },
    { id: "veo", name: "Veo3.1-fast API" },
    { id: "wan-animate", name: "Wan Animate API" },
];

export function StudioLeftPanel({ onGenerate, isGenerating, mode: initialMode, aspectRatio, setAspectRatio }: StudioLeftPanelProps) {
    const [creationMode, setCreationMode] = useState<string>("image");
    const [prompt, setPrompt] = useState("");
    const [previewUrl, setPreviewUrl] = useState("");
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

    const [modelTab, setModelTab] = useState<"image" | "video">("image");
    const [selectedModel, setSelectedModel] = useState(AI_IMAGE_MODELS[0]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [sourceTab, setSourceTab] = useState('upload');
    const [qualityOption, setQualityOption] = useState('Balanced');

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleGenerate = () => {
        onGenerate(prompt, {
            mode: creationMode,
            model: selectedModel.name,
            aspectRatio
        });
    };

    return (
        <div className="w-full h-full flex flex-col bg-white/[0.04] backdrop-blur-[24px] border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.7)] rounded-[28px] relative z-20 text-zinc-100 overflow-hidden transition-all duration-500 before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/[0.05] before:to-transparent before:pointer-events-none">

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 w-full" style={{ height: 0 }}>
                {/* Inner Wrapper for proper layout spacing */}
                <div className="p-6 flex flex-col gap-8 pb-10 w-full min-h-max">

                    {/* 1. CREATION MODE SWITCH */}
                    <div className="flex p-1 bg-black/40 backdrop-blur-md rounded-[16px] border border-white/[0.04] shadow-inner overflow-x-auto no-scrollbar shrink-0">
                        {['Image', 'Video', 'Remix', 'Variations', 'Templates'].map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setCreationMode(mode.toLowerCase())}
                                className={cn(
                                    "flex-1 min-w-[70px] flex items-center justify-center py-2 rounded-[12px] text-[11px] font-semibold transition-all duration-300 relative",
                                    creationMode === mode.toLowerCase() ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.2)]" : "text-zinc-500 hover:text-white"
                                )}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>

                    {/* 2. MODEL SELECTION */}
                    <div className="space-y-3 shrink-0">
                        <label className="text-[10px] font-bold text-zinc-400 tracking-[0.15em] uppercase flex items-center gap-2">
                            <Settings2 className="w-3.5 h-3.5" /> Model
                        </label>
                        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                            <DropdownMenuTrigger asChild>
                                <div className="w-full p-3.5 bg-white/[0.03] rounded-2xl border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.1] transition-all duration-300 cursor-pointer flex items-center justify-between group shadow-inner">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
                                            <Sparkles className="w-4 h-4 text-blue-400" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-white tracking-wide">{selectedModel.name}</span>
                                            <span className="text-[10px] text-zinc-500">Premium Quality • Moderate Speed</span>
                                        </div>
                                    </div>
                                    <ChevronDown className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="z-50 w-[340px] bg-[#0c0c0e] border border-white/[0.08] shadow-[0_40px_80px_rgba(0,0,0,0.8)] rounded-3xl p-0 overflow-hidden backdrop-blur-3xl">
                                <div className="flex items-center gap-6 border-b border-white/[0.06] px-5 pt-4 pb-0 bg-white/[0.02]">
                                    <button
                                        onClick={(e) => { e.preventDefault(); setModelTab("image"); }}
                                        className={cn("font-bold text-sm pb-3 flex items-center gap-1.5 transition-colors relative", modelTab === 'image' ? "text-purple-400" : "text-zinc-400 hover:text-white")}
                                    >
                                        Image Models
                                        {modelTab === 'image' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-400 rounded-t-full shadow-[0_-2px_8px_rgba(168,85,247,0.4)]" />}
                                    </button>
                                    <button
                                        onClick={(e) => { e.preventDefault(); setModelTab("video"); }}
                                        className={cn("font-bold text-sm pb-3 flex items-center gap-1.5 transition-colors relative", modelTab === 'video' ? "text-purple-400" : "text-zinc-400 hover:text-white")}
                                    >
                                        Video Models
                                        {modelTab === 'video' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-400 rounded-t-full shadow-[0_-2px_8px_rgba(168,85,247,0.4)]" />}
                                    </button>
                                </div>
                                <div className="max-h-[320px] overflow-y-auto p-2 custom-scrollbar">
                                    {(modelTab === "image" ? AI_IMAGE_MODELS : AI_VIDEO_MODELS).map((model) => (
                                        <DropdownMenuItem
                                            key={model.id}
                                            onClick={() => setSelectedModel(model)}
                                            className="hover:bg-white/[0.06] cursor-pointer flex items-center justify-between p-3.5 rounded-2xl transition-all group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-zinc-700 group-hover:bg-purple-400 transition-colors" />
                                                <span className={cn("text-sm font-semibold tracking-wide text-zinc-300 group-hover:text-white")}>{model.name}</span>
                                            </div>
                                            {model.isNew && <span className="bg-purple-500/10 text-purple-400 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border border-purple-500/20">NEW</span>}
                                        </DropdownMenuItem>
                                    ))}
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* 3. SOURCE MEDIA */}
                    <div className="space-y-3 shrink-0">
                        <label className="text-[10px] font-bold text-zinc-400 tracking-[0.15em] uppercase flex items-center justify-between">
                            <div className="flex items-center gap-2"><ImageIcon className="w-3.5 h-3.5" /> Source / References</div>
                        </label>
                        <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl overflow-hidden">
                            <div className="flex border-b border-white/[0.04]">
                                {['Upload', 'Reference', 'URL'].map(tab => (
                                    <button key={tab} onClick={() => setSourceTab(tab.toLowerCase())} className={cn("flex-1 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-colors", sourceTab === tab.toLowerCase() ? "text-white bg-white/[0.04]" : "text-zinc-600 hover:text-zinc-400")}>{tab}</button>
                                ))}
                            </div>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full h-28 hover:bg-white/5 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center group"
                            >
                                <Upload className="w-5 h-5 mb-2 text-zinc-600 group-hover:text-zinc-300 group-hover:-translate-y-1 transition-all" />
                                <span className="text-xs font-medium text-zinc-500 group-hover:text-zinc-300">Drag & Drop or Browser</span>
                                <span className="text-[10px] text-zinc-700 mt-1">Image, Video, Style, Mask</span>
                                <input ref={fileInputRef} type="file" className="hidden" accept="image/*,video/*" />
                            </div>
                        </div>
                    </div>

                    {/* 4. PROMPT / DIRECTIVES */}
                    <div className="space-y-3 shrink-0">
                        <label className="text-[10px] font-bold text-zinc-400 tracking-[0.15em] uppercase flex items-center justify-between">
                            <div className="flex items-center gap-2"><Wand2 className="w-3.5 h-3.5" /> Directives</div>
                            <button className="text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                                <Sparkles className="w-3 h-3" /> <span className="text-[9px] uppercase font-bold tracking-wider">Assist</span>
                            </button>
                        </label>
                        <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] focus-within:border-white/[0.15] focus-within:bg-white/[0.05] transition-all duration-300 overflow-hidden shadow-inner flex flex-col group">
                            <Textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Describe your vision in detail..."
                                className="resize-none min-h-[100px] bg-transparent border-none text-white placeholder:text-zinc-600 focus-visible:ring-0 px-4 py-4 text-[13px] font-light leading-relaxed"
                            />
                            <div className="bg-black/20 p-3 flex flex-col gap-3 border-t border-white/[0.04]">
                                <input type="text" placeholder="Negative Prompt (Optional)" className="w-full bg-transparent border-none text-[11px] text-zinc-400 placeholder:text-zinc-700 focus:outline-none focus:ring-0" />
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-zinc-500 cursor-pointer hover:text-zinc-300 transition-colors">Style Preset: None ▼</span>
                                    <span className="text-[10px] font-mono text-zinc-600 border border-white/[0.06] rounded px-1.5 py-0.5">⌘ ↵</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 5. STYLE & ENHANCEMENT */}
                    <div className="space-y-4 shrink-0">
                        <label className="text-[10px] font-bold text-zinc-400 tracking-[0.15em] uppercase flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5" /> Style Adjustments
                        </label>
                        <div className="space-y-4 px-1">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] text-zinc-400 font-medium">Auto-Enhance Prompt</span>
                                <Switch className="scale-75 data-[state=checked]:bg-purple-500" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] text-zinc-500 font-medium"><label>Creativity</label><span>65%</span></div>
                                <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden relative"><div className="absolute top-0 left-0 h-full w-[65%] bg-gradient-to-r from-purple-600 to-blue-400 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" /></div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] text-zinc-500 font-medium"><label>Stylization</label><span>40%</span></div>
                                <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden relative"><div className="absolute top-0 left-0 h-full w-[40%] bg-gradient-to-r from-purple-600 to-blue-400 rounded-full" /></div>
                            </div>
                        </div>
                    </div>

                    {/* 6. FRAMING */}
                    <div className="space-y-3 shrink-0">
                        <label className="text-[10px] font-bold text-zinc-400 tracking-[0.15em] uppercase flex items-center gap-2">
                            <Frame className="w-3.5 h-3.5" /> Framing
                        </label>
                        <div className="grid grid-cols-5 gap-1.5">
                            {["1:1", "4:3", "3:2", "16:9", "9:16"].map((ratio) => (
                                <button
                                    key={ratio}
                                    onClick={() => setAspectRatio(ratio)}
                                    className={cn(
                                        "py-2 rounded-[10px] text-[11px] font-bold transition-all duration-300 border",
                                        aspectRatio === ratio
                                            ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                                            : "bg-white/[0.02] text-zinc-500 border-white/[0.04] hover:bg-white/[0.08] hover:text-white"
                                    )}
                                >
                                    {ratio}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <button className="flex-1 py-1.5 bg-white/[0.02] border border-white/[0.04] rounded-lg text-[10px] text-zinc-400 hover:text-white transition-colors">Standard</button>
                            <button className="flex-1 py-1.5 bg-white/[0.05] border border-white/[0.1] rounded-lg text-[10px] text-white shadow-inner transition-colors">HD Quality</button>
                        </div>
                    </div>

                    {/* 7. COMPUTE ENGINE */}
                    <div className="space-y-3 shrink-0">
                        <label className="text-[10px] font-bold text-zinc-400 tracking-[0.15em] uppercase flex items-center justify-between">
                            <div className="flex items-center gap-2"><Settings2 className="w-3.5 h-3.5" /> Compute Output</div>
                            <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">~4 Tokens</span>
                        </label>
                        <div className="flex gap-2 bg-black/40 p-1 rounded-[14px] border border-white/[0.04]">
                            {['Fast', 'Balanced', 'Quality'].map(opt => (
                                <button key={opt} onClick={() => setQualityOption(opt)} className={cn("flex-1 py-1.5 text-[11px] font-semibold rounded-[10px] transition-all", qualityOption === opt ? "bg-white/[0.1] text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300")}>{opt}</button>
                            ))}
                        </div>
                    </div>

                    {/* 8. ADVANCED CONTROLS */}
                    <div className="pt-2 border-t border-white/[0.04] shrink-0">
                        <button onClick={() => setIsAdvancedOpen(!isAdvancedOpen)} className="w-full flex items-center justify-between text-[11px] font-bold text-zinc-500 uppercase tracking-widest hover:text-zinc-300 transition-colors">
                            Advanced Controls {isAdvancedOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                        {isAdvancedOpen && (
                            <div className="mt-4 grid grid-cols-2 gap-4">
                                <div className="space-y-1.5"><label className="text-[9px] text-zinc-500 uppercase">Seed</label><input type="text" placeholder="Random" className="w-full bg-black/40 border border-white/[0.04] rounded-lg py-1.5 px-3 text-[11px] text-white focus:outline-none focus:border-white/20" /></div>
                                <div className="space-y-1.5"><label className="text-[9px] text-zinc-500 uppercase">Steps</label><input type="number" placeholder="20" className="w-full bg-black/40 border border-white/[0.04] rounded-lg py-1.5 px-3 text-[11px] text-white focus:outline-none focus:border-white/20" /></div>
                                <div className="space-y-1.5"><label className="text-[9px] text-zinc-500 uppercase">CFG Scale</label><input type="number" placeholder="7.0" className="w-full bg-black/40 border border-white/[0.04] rounded-lg py-1.5 px-3 text-[11px] text-white focus:outline-none focus:border-white/20" /></div>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="flex-none p-5 bg-[#0a0a0c]/80 backdrop-blur-xl border-t border-white/[0.06] z-30 shadow-[0_-15px_40px_rgba(0,0,0,0.6)]">
                <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt}
                    className={cn(
                        "w-full h-[52px] rounded-xl text-[14px] font-bold tracking-[0.1em] uppercase transition-all duration-500 group relative overflow-hidden",
                        isGenerating || !prompt
                            ? "bg-white/[0.03] text-zinc-500 cursor-not-allowed shadow-none border border-white/[0.05]"
                            : "text-white hover:scale-[1.02] active:scale-[0.98] border-none shadow-[0_0_30px_rgba(139,92,246,0.3)]"
                    )}
                    style={(!isGenerating && prompt) ? { background: 'linear-gradient(135deg, #8B5CF6, #22D3EE)' } : undefined}
                >
                    {(!isGenerating && prompt) && <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />}
                    {isGenerating ? (
                        <span className="flex items-center gap-2 animate-pulse text-zinc-400">
                            <span className="text-[10px] uppercase font-bold tracking-widest text-[#8B5CF6] bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full">Processing</span>
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-2 relative z-10 drop-shadow-md">
                            <Sparkles className="w-4 h-4 transition-transform group-hover:rotate-12" />
                            Render Creation
                        </span>
                    )}
                </Button>
            </div>
        </div>
    );
}

