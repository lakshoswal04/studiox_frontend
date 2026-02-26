"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface GenerationItem {
    id: string;
    type: "image" | "video";
    src?: string;
    prompt: string;
    status: "queued" | "generating" | "completed";
    settings?: any;
}

interface StudioCenterCanvasProps {
    activeGeneration: GenerationItem | null;
    mode: "image" | "video" | "templates";
    isGenerating: boolean;
    aspectRatio: string;
}

export function StudioCenterCanvas({ activeGeneration, mode, isGenerating, aspectRatio }: StudioCenterCanvasProps) {
    const canvasRef = useRef<HTMLDivElement>(null);

    // Subtle parallax effect
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!canvasRef.current || isGenerating) return;
            const { clientX, clientY } = e;
            const x = (clientX / window.innerWidth - 0.5) * 20;
            const y = (clientY / window.innerHeight - 0.5) * 20;

            canvasRef.current.style.transform = `translate(${x}px, ${y}px)`;
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [isGenerating]);

    const getAspectRatioClass = (ratio: string) => {
        switch (ratio) {
            case "1:1": return "aspect-square";
            case "4:3": return "aspect-[4/3]";
            case "16:9": return "aspect-video";
            case "9:16": return "aspect-[9/16]";
            default: return "aspect-video";
        }
    };

    return (
        <div className="w-full h-full flex items-center justify-center p-4">
            <div
                className={cn(
                    "w-full max-w-[min(100%,850px)] max-h-[calc(100vh-180px)] rounded-[32px] relative overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col items-center justify-center shrink-0",
                    getAspectRatioClass(activeGeneration?.settings?.aspectRatio || aspectRatio),
                    activeGeneration?.status === "completed"
                        ? "shadow-[0_40px_80px_rgba(0,0,0,0.8)] border border-white/[0.1] bg-black/40 backdrop-blur-3xl"
                        : "border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.6)] group bg-white/[0.02] backdrop-blur-3xl"
                )}
            >
                {/* Idle Background Image Layer */}
                {activeGeneration?.status !== "completed" && (
                    <div className="absolute inset-0 z-0">
                        {/* Removed fixed static bg, using pure glassmorphism logic for modern feel */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-black/60" />
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05)_0%,transparent_100%)] mix-blend-overlay" />
                    </div>
                )}

                {/* Subtle Inner Glow Border */}
                <div className="absolute inset-0 z-10 pointer-events-none rounded-[32px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05),inset_0_0_40px_rgba(255,255,255,0.02)]" />

                <div
                    ref={canvasRef}
                    className="absolute inset-0 z-10 transition-transform duration-300 ease-out flex items-center justify-center"
                >
                    {!activeGeneration ? (
                        <div className="flex flex-col items-center gap-5 transition-transform duration-500 hover:scale-105">
                            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)] flex items-center justify-center relative overflow-hidden backdrop-blur-xl">
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20" />
                                <Sparkles className="w-8 h-8 text-white/80 relative z-10" />
                            </div>
                            <span className="text-sm font-bold text-white/70 tracking-widest uppercase drop-shadow-md">Direct Your Vision</span>
                        </div>
                    ) : activeGeneration.status === 'completed' ? (
                        <Image
                            src={activeGeneration.src || "/studiox.jpg"}
                            alt={activeGeneration.prompt}
                            fill
                            className="object-cover transition-opacity duration-1000"
                        />
                    ) : null}
                </div>

                {isGenerating && activeGeneration?.status !== 'completed' && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#050505]/60 backdrop-blur-[40px]">
                        <div className="relative flex items-center justify-center mb-6">
                            <div className="absolute inset-0 rounded-full blur-2xl bg-indigo-500/30 animate-pulse-slow" />
                            <div className="absolute inset-0 rounded-full blur-xl bg-purple-500/20 animate-pulse" />
                            <Loader2 className="w-10 h-10 text-white animate-spin relative z-10" />
                        </div>
                        <span className="text-[11px] font-bold tracking-[0.4em] text-white/80 uppercase animate-pulse drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                            Rendering
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
