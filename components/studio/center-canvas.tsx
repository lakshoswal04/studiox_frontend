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
}

interface StudioCenterCanvasProps {
    activeGeneration: GenerationItem | null;
    mode: "image" | "video" | "templates";
    isGenerating: boolean;
}

export function StudioCenterCanvas({ activeGeneration, mode, isGenerating }: StudioCenterCanvasProps) {
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

    return (
        <div className="w-full h-full flex items-center justify-center p-4">
            <div
                className={cn(
                    "w-full max-w-[800px] aspect-[4/3] rounded-[28px] relative overflow-hidden transition-all duration-700 ease-out flex flex-col items-center justify-center",
                    activeGeneration?.status === "completed"
                        ? "shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-white/[0.1] bg-black"
                        : "bg-white/[0.02] border border-white/[0.05] backdrop-blur-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.3)]"
                )}
            >
                {/* Inner Glow Border */}
                <div className="absolute inset-0 pointer-events-none rounded-[28px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05),inset_0_0_20px_rgba(255,255,255,0.02)]" />

                <div
                    ref={canvasRef}
                    className="absolute inset-0 transition-transform duration-200 ease-linear flex items-center justify-center"
                >
                    {!activeGeneration ? (
                        <div className="flex flex-col items-center gap-6">
                            <div className="w-20 h-20 rounded-full bg-white/[0.03] border border-white/[0.08] shadow-[0_0_30px_rgba(255,255,255,0.02)] flex items-center justify-center relative group">
                                <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/10 to-cyan-500/10 rounded-full blur-xl" />
                                <Sparkles className="w-8 h-8 text-zinc-500 relative z-10" />
                            </div>
                            <span className="text-xl font-medium text-zinc-400 tracking-wide">Start Creating</span>
                        </div>
                    ) : activeGeneration.status === 'completed' ? (
                        <Image
                            src={activeGeneration.src || "/placeholder.svg"}
                            alt={activeGeneration.prompt}
                            fill
                            className="object-cover"
                        />
                    ) : null}
                </div>

                {isGenerating && activeGeneration?.status !== 'completed' && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md">
                        <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
                        <span className="text-sm font-semibold tracking-[0.2em] text-cyan-300 uppercase animate-pulse">
                            Synthesizing...
                        </span>

                        {/* Shimmer effect */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[28px]">
                            <div className="w-[200%] h-[200%] absolute top-[-50%] left-[-50%] bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(255,255,255,0.1)_360deg)] animate-[spin_3s_linear_infinite]" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
