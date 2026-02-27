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

    const currentRatio = activeGeneration?.settings?.aspectRatio || aspectRatio;
    let maxWidthStyle = "850px";
    if (currentRatio === "9:16") maxWidthStyle = "min(500px, calc((100vh - 180px) * 9 / 16))";
    else if (currentRatio === "1:1") maxWidthStyle = "min(700px, calc(100vh - 180px))";
    else if (currentRatio === "4:3") maxWidthStyle = "min(850px, calc((100vh - 180px) * 4 / 3))";

    return (
        <div className="w-full h-full flex items-center justify-center p-4">
            <div
                className={cn(
                    "w-full rounded-[32px] relative overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col items-center justify-center shrink-0",
                    getAspectRatioClass(currentRatio),
                    activeGeneration?.status === "completed"
                        ? "shadow-[0_40px_80px_rgba(0,0,0,0.8)] border border-white/[0.05] bg-black"
                        : "border border-white/[0.04] shadow-[0_20px_60px_rgba(0,0,0,0.6)] group bg-[#0a0a0c]/40 backdrop-blur-3xl"
                )}
                style={{ maxWidth: maxWidthStyle, maxHeight: "calc(100vh - 180px)" }}
            >
                {/* Idle Background Image Layer */}
                {activeGeneration?.status !== "completed" && (
                    <div className="absolute inset-0 z-0">
                        <div
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[40s] ease-linear group-hover:scale-110 scale-100 opacity-60 mix-blend-screen"
                            style={{ backgroundImage: `url('/studio/studio1.jpeg')` }}
                        />
                        {/* Overlays to make it clean and readable */}
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_100%)] mix-blend-overlay" />
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
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#050505]/70 backdrop-blur-[30px]">
                        <div className="relative flex items-center justify-center mb-6">
                            <div className="absolute inset-0 rounded-full blur-xl bg-indigo-500/30 animate-pulse-slow" />
                            <Loader2 className="w-8 h-8 text-white animate-spin relative z-10" />
                        </div>
                        <span className="text-[11px] font-bold tracking-[0.3em] text-white/80 uppercase animate-pulse">
                            Rendering
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
