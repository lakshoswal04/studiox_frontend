"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    ChevronDown,
    Sparkles,
    Upload,
    Wand2,
    Settings2,
    SlidersHorizontal,
    Image as ImageIcon,
    Video
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
}

export function StudioLeftPanel({ onGenerate, isGenerating, mode }: StudioLeftPanelProps) {
    const [subMode, setSubMode] = useState<"create" | "variations">("create");
    const [prompt, setPrompt] = useState("");
    const [previewUrl, setPreviewUrl] = useState("");
    const [showAdvanced, setShowAdvanced] = useState(false);

    const [selectedModel, setSelectedModel] = useState<"Nano" | "Sora" | "Templates">("Nano");
    const [aspectRatio, setAspectRatio] = useState("16:9");

    const modelDisplay = {
        Nano: { name: "Nano Banana", sub: "Fast Image", icon: "N", color: "bg-gradient-to-tr from-yellow-400 to-orange-500 text-white" },
        Sora: { name: "Sora", sub: "Premium Video", icon: "S", color: "bg-gradient-to-tr from-cyan-400 to-blue-600 text-white" },
        Templates: { name: "Workflows", sub: "Custom Pipes", icon: "W", color: "bg-gradient-to-tr from-fuchsia-500 to-purple-600 text-white" }
    };

    const currentModel = modelDisplay[selectedModel];
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleGenerate = () => {
        onGenerate(prompt, {
            mode,
            model: selectedModel,
            aspectRatio
        });
    };

    return (
        <div className="w-full h-[calc(100vh-140px)] flex flex-col bg-white/[0.05] backdrop-blur-[20px] border border-white/[0.08] shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-[20px] relative z-20 flex-shrink-0 text-zinc-100 overflow-hidden transition-all duration-300">

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col gap-5">

                {/* Mode Selector */}
                <div className="bg-black/30 p-1 rounded-[14px] border border-white/[0.05] flex relative shadow-inner">
                    <div
                        className={cn(
                            "absolute inset-y-1 w-[calc(50%-4px)] bg-white/[0.08] rounded-[10px] shadow-sm border border-white/[0.1] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                            subMode === 'variations' ? "left-[calc(50%+2px)]" : "left-1"
                        )}
                    />
                    <button
                        onClick={() => setSubMode('create')}
                        className={cn("flex-1 py-2 text-xs font-semibold relative z-10 transition-colors duration-300", subMode === 'create' ? "text-white" : "text-zinc-500 hover:text-zinc-300")}
                    >
                        Create
                    </button>
                    <button
                        onClick={() => setSubMode('variations')}
                        className={cn("flex-1 py-2 text-xs font-semibold relative z-10 transition-colors duration-300", subMode === 'variations' ? "text-white" : "text-zinc-500 hover:text-zinc-300")}
                    >
                        Variations
                    </button>
                </div>

                {/* Upload Area */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-400 tracking-wide px-1 uppercase">Source Media</label>
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full p-4 rounded-[16px] bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.2] transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-3 group"
                    >
                        {previewUrl ? (
                            <div className="w-full h-24 relative rounded-lg overflow-hidden border border-white/[0.1]">
                                <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-[10px] uppercase font-bold text-white tracking-widest bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md">Change</span>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/[0.1] flex items-center justify-center group-hover:scale-110 group-hover:bg-white/[0.1] transition-all duration-300 shadow-sm">
                                    <Upload className="w-4 h-4 text-cyan-400" />
                                </div>
                                <div className="text-center">
                                    <div className="text-xs font-semibold text-zinc-300">Drag & Drop</div>
                                    <div className="text-[10px] text-zinc-500 mt-1">or click to browse local files</div>
                                </div>
                            </>
                        )}
                        <input ref={fileInputRef} type="file" className="hidden" accept="image/*,video/*" />
                    </div>
                </div>

                {/* Prompt Input */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-400 tracking-wide px-1 uppercase">Prompt</label>
                    <div className="bg-black/20 rounded-[16px] border border-white/[0.08] focus-within:border-cyan-500/50 focus-within:bg-black/40 transition-all duration-300 overflow-hidden shadow-inner flex flex-col">
                        <Textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Describe your vision in detail..."
                            className="resize-none min-h-[120px] bg-transparent border-none text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-0 px-4 py-4 text-sm leading-relaxed"
                        />
                        <div className="flex items-center justify-between p-2 border-t border-white/[0.05] bg-white/[0.02]">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white rounded-lg hover:bg-white/[0.1] transition-colors">
                                <Wand2 className="w-4 h-4" />
                            </Button>
                            <div className="flex items-center gap-2 bg-white/[0.05] px-3 py-1 rounded-full border border-white/[0.05]">
                                <span className="text-[10px] font-bold tracking-wider text-zinc-300 uppercase">Enhance</span>
                                <Switch className="scale-[0.6] data-[state=checked]:bg-cyan-500" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Model Selection */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-400 tracking-wide px-1 uppercase">Compute Model</label>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="w-full p-3 bg-white/[0.03] rounded-[16px] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.2] transition-all duration-300 cursor-pointer flex items-center justify-between group shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className={cn("w-8 h-8 rounded-[10px] flex items-center justify-center text-[11px] font-extrabold shadow-md", currentModel.color)}>
                                        {currentModel.icon}
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="text-sm font-bold text-zinc-100">{currentModel.name}</span>
                                        <span className="text-[10px] text-zinc-500 font-medium">{currentModel.sub}</span>
                                    </div>
                                </div>
                                <ChevronDown className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-[280px] bg-[#0A0A0A]/95 backdrop-blur-3xl border border-white/[0.1] text-white shadow-[0_20px_60px_rgba(0,0,0,0.8)] rounded-[16px] p-2">
                            <DropdownMenuItem onClick={() => setSelectedModel("Nano")} className="hover:bg-white/[0.08] focus:bg-white/[0.08] cursor-pointer flex gap-3 p-3 rounded-[12px] transition-colors">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center shadow-md">
                                    <ImageIcon className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex flex-col justify-center">
                                    <span className="text-[13px] font-bold text-white">Nano Banana</span>
                                    <span className="text-[10px] font-medium text-yellow-500 flex items-center gap-1">⚡ Fast Image • 10 Credits</span>
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSelectedModel("Sora")} className="hover:bg-white/[0.08] focus:bg-white/[0.08] cursor-pointer flex gap-3 p-3 rounded-[12px] transition-colors mt-1">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center shadow-md">
                                    <Video className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex flex-col justify-center">
                                    <span className="text-[13px] font-bold text-white">Sora</span>
                                    <span className="text-[10px] font-medium text-cyan-400 flex items-center gap-1">✨ Premium Video • 80 Credits</span>
                                </div>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Advanced Settings */}
                <div className="space-y-3 pt-2">
                    <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors px-1"
                    >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        Advanced Options
                    </button>

                    {showAdvanced && (
                        <div className="p-4 bg-black/20 rounded-[16px] border border-white/[0.05] shadow-inner space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Aspect Ratio</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {["1:1", "4:3", "3:2", "16:9"].map((ratio) => (
                                        <button
                                            key={ratio}
                                            onClick={() => setAspectRatio(ratio)}
                                            className={cn(
                                                "py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 border",
                                                aspectRatio === ratio
                                                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                                                    : "bg-white/[0.02] text-zinc-500 border-white/[0.05] hover:bg-white/[0.08] hover:text-zinc-300"
                                            )}
                                        >
                                            {ratio}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {/* Dummy sliders for visual effect */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                                    <span>Guidance Scale</span>
                                    <span className="text-zinc-300">7.5</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/[0.1] rounded-full overflow-hidden">
                                    <div className="h-full w-[75%] bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="flex-shrink-0 p-4 border-t border-white/[0.08] bg-white/[0.02] backdrop-blur-md z-30">
                <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt}
                    className={cn(
                        "w-full h-12 rounded-[14px] text-sm font-extrabold tracking-wide transition-all duration-300 overflow-hidden relative group",
                        isGenerating || !prompt
                            ? "bg-white/[0.05] text-zinc-500 border border-white/[0.05] shadow-none cursor-not-allowed"
                            : "bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] border border-white/20 active:scale-[0.98]"
                    )}
                >
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />

                    {isGenerating ? (
                        <span className="flex items-center gap-2 relative z-10 animate-pulse text-cyan-100">
                            Synthesizing...
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-2 relative z-10">
                            <Sparkles className="w-4 h-4" />
                            {subMode === 'create' ? 'Generate' : 'Variate'}
                        </span>
                    )}
                </Button>
            </div>

        </div>
    );
}

