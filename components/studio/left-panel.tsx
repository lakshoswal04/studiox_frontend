"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    ChevronDown,
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

    const [selectedModel, setSelectedModel] = useState(AI_IMAGE_MODELS[0]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleModeSwitch = (mode: string) => {
        const newMode = mode.toLowerCase();
        setCreationMode(newMode);
        if (newMode === 'video') {
            setSelectedModel(AI_VIDEO_MODELS[0]);
        } else if (newMode === 'image') {
            setSelectedModel(AI_IMAGE_MODELS[0]);
        }
    };

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
            <div className="flex-1 relative z-10 w-full min-h-0">
                {/* Inner Wrapper for proper layout spacing with absolute inset to secure scroll boundaries */}
                <div className="absolute inset-0 overflow-y-auto overflow-x-hidden custom-scrollbar">
                    <div className="p-6 pb-12 flex flex-col gap-6 w-full">

                        {/* 1. CREATION MODE SWITCH */}
                        <div className="flex p-1 bg-black/40 backdrop-blur-md rounded-[16px] border border-white/[0.04] shadow-inner relative shrink-0">
                            {/* Smooth Animated Highlight Pill */}
                            <div
                                className="absolute top-1 bottom-1 bg-white rounded-[12px] shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0"
                                style={{
                                    width: `calc((100% - 8px) / 4)`,
                                    transform: `translateX(calc(${['image', 'video', 'remix', 'templates'].indexOf(creationMode)} * 100%))`
                                }}
                            />
                            {['Image', 'Video', 'Remix', 'Templates'].map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => handleModeSwitch(mode)}
                                    className={cn(
                                        "flex-1 min-w-0 flex items-center justify-center py-2 text-[11px] font-semibold transition-colors duration-300 relative z-10",
                                        creationMode === mode.toLowerCase() ? "text-black drop-shadow-sm" : "text-zinc-400 hover:text-white"
                                    )}
                                >
                                    {mode}
                                </button>
                            ))}
                        </div>

                        {/* 2. MODEL SELECTION */}
                        {(creationMode === 'image' || creationMode === 'video') && (
                            <div className="space-y-3 shrink-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <label className="text-[10px] font-bold text-zinc-300 tracking-[0.15em] uppercase flex items-center gap-2">
                                    <Settings2 className="w-3.5 h-3.5" /> Model Engine
                                </label>
                                <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                                    <DropdownMenuTrigger asChild>
                                        <div className="w-full h-12 px-4 bg-white/[0.02] rounded-[14px] border border-white/[0.06] hover:border-white/[0.15] hover:bg-white/[0.04] transition-all duration-300 cursor-pointer flex items-center justify-between group">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border border-white/10 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
                                                    {creationMode === 'video' ? <Video className="w-3 h-3 text-indigo-300" /> : <Sparkles className="w-3 h-3 text-indigo-300" />}
                                                </div>
                                                <span className="text-[13px] font-semibold text-zinc-200 tracking-wide group-hover:text-white transition-colors">{selectedModel.name}</span>
                                            </div>
                                            <ChevronDown className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start" sideOffset={8} className="z-50 w-[340px] bg-[#121217]/95 border border-white/[0.08] shadow-[0_30px_60px_rgba(0,0,0,0.9)] rounded-[20px] p-0 overflow-hidden backdrop-blur-3xl">
                                        <div className="max-h-[280px] overflow-y-auto p-2 custom-scrollbar space-y-0.5">
                                            {(creationMode === "video" ? AI_VIDEO_MODELS : AI_IMAGE_MODELS).map((model) => (
                                                <DropdownMenuItem
                                                    key={model.id}
                                                    onClick={() => setSelectedModel(model)}
                                                    className="hover:bg-white/[0.05] focus:bg-white/[0.05] cursor-pointer flex items-center justify-between p-3 rounded-xl transition-all group"
                                                >
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-700 group-hover:bg-indigo-400 transition-colors shadow-[0_0_8px_transparent] group-hover:shadow-indigo-500/50" />
                                                        <span className={cn("text-[13px] font-medium text-zinc-400 group-hover:text-zinc-100 transition-colors")}>{model.name}</span>
                                                    </div>
                                                    {model.isNew && <span className="bg-indigo-500/10 text-indigo-400 text-[9px] font-bold uppercase px-2 py-0.5 rounded-md border border-indigo-500/20">New</span>}
                                                </DropdownMenuItem>
                                            ))}
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )}

                        {/* TEMPLATES (If mode is templates) */}
                        {creationMode === 'templates' && (
                            <div className="space-y-3 shrink-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <label className="text-[10px] font-bold text-zinc-300 tracking-[0.15em] uppercase flex items-center gap-2">
                                    <Wand2 className="w-3.5 h-3.5" /> Select Template
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['Cyberpunk', 'Anime', 'Realistic', '3D Render', 'Cinematic', 'Cartoon', 'Neon', 'Vintage'].map(tpl => (
                                        <button key={tpl} onClick={(e) => {
                                            e.preventDefault();
                                            setPrompt(prev => prev ? `${prev}, ${tpl} style` : `${tpl} style, `);
                                        }} className="py-2.5 px-3 bg-white/[0.02] border border-white/[0.06] rounded-xl text-[11px] font-medium text-zinc-400 hover:text-white hover:border-white/[0.15] hover:bg-white/[0.04] transition-all text-left">
                                            {tpl}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 3. SOURCE MEDIA */}
                        {creationMode !== 'templates' && (
                            <div className="space-y-3 shrink-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <label className="text-[10px] font-bold text-zinc-300 tracking-[0.15em] uppercase flex items-center justify-between">
                                    <div className="flex items-center gap-2"><ImageIcon className="w-3.5 h-3.5" /> Source Media</div>
                                </label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full h-32 bg-white/[0.02] border border-dashed border-white/[0.08] hover:border-white/[0.2] rounded-2xl hover:bg-white/5 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center group relative overflow-hidden"
                                >
                                    {previewUrl ? (
                                        <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                                    ) : (
                                        <>
                                            <div className="w-10 h-10 rounded-full bg-white/[0.05] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-500">
                                                <Upload className="w-4 h-4 text-zinc-300 group-hover:text-white transition-colors" />
                                            </div>
                                            <span className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors">Drag & drop an image</span>
                                            <span className="text-[10px] text-zinc-400 mt-1">or click to browse from device</span>
                                        </>
                                    )}
                                    <input ref={fileInputRef} type="file" className="hidden" accept="image/*,video/*" onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setPreviewUrl(URL.createObjectURL(e.target.files[0]));
                                        }
                                    }} />
                                </div>
                            </div>
                        )}

                        {/* 4. PROMPT / DIRECTIVES */}
                        <div className="space-y-3 shrink-0">
                            <label className="text-[10px] font-bold text-zinc-300 tracking-[0.15em] uppercase flex items-center justify-between">
                                <div className="flex items-center gap-2"><Wand2 className="w-3.5 h-3.5" /> Directives</div>
                            </label>
                            <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] focus-within:border-white/[0.15] focus-within:bg-white/[0.05] transition-all duration-300 overflow-hidden shadow-inner flex flex-col group">
                                <Textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Describe your vision in detail..."
                                    className="resize-none min-h-[100px] bg-transparent border-none text-white placeholder:text-zinc-500 focus-visible:ring-0 px-4 py-4 text-[13px] font-light leading-relaxed"
                                />
                            </div>
                        </div>

                        {/* REMIX SETTINGS (If mode is remix) */}
                        {creationMode === 'remix' && (
                            <div className="space-y-4 shrink-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <label className="text-[10px] font-bold text-zinc-300 tracking-[0.15em] uppercase flex items-center gap-2">
                                    <Settings2 className="w-3.5 h-3.5" /> Remix Settings
                                </label>
                                <div className="space-y-2 px-1">
                                    <div className="flex justify-between text-[10px] text-zinc-500 font-medium"><label>Remix Strength</label><span>75%</span></div>
                                    <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden relative cursor-pointer"><div className="absolute top-0 left-0 h-full w-[75%] bg-gradient-to-r from-purple-600 to-indigo-400 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" /></div>
                                </div>
                            </div>
                        )}

                        {/* 5. FRAMING */}
                        {(creationMode === 'image' || creationMode === 'video') && (
                            <div className="space-y-3 shrink-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <label className="text-[10px] font-bold text-zinc-300 tracking-[0.15em] uppercase flex items-center gap-2">
                                    <Frame className="w-3.5 h-3.5" /> Framing
                                </label>
                                <div className="grid grid-cols-4 gap-1.5">
                                    {["1:1", "4:3", "16:9", "9:16"].map((ratio) => (
                                        <button
                                            key={ratio}
                                            onClick={() => setAspectRatio(ratio)}
                                            className={cn(
                                                "py-2 rounded-[10px] text-[11px] font-bold transition-all duration-300 border",
                                                aspectRatio === ratio
                                                    ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                                                    : "bg-white/[0.04] text-zinc-400 border-white/[0.08] hover:bg-white/[0.08] hover:text-white"
                                            )}
                                        >
                                            {ratio}
                                        </button>
                                    ))}
                                </div>
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
                            ? "bg-white/[0.06] text-zinc-400 cursor-not-allowed shadow-none border border-white/[0.1]"
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

