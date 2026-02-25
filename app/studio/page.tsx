"use client";

import { useState, Suspense, useEffect } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { StudioTopNav } from "@/components/studio/top-nav";
import { StudioLeftPanel } from "@/components/studio/left-panel";
import { StudioCenterCanvas, type GenerationItem } from "@/components/studio/center-canvas";
import { StudioRightPanel } from "@/components/studio/right-panel";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import gsap from "gsap";

export default function StudioPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div className="min-h-screen bg-[#050508] flex items-center justify-center"><Loader2 className="w-6 h-6 text-violet-500 animate-spin" /></div>}>
        <StudioLayout />
      </Suspense>
    </ProtectedRoute>
  )
}

function StudioLayout() {
  const searchParams = useSearchParams();
  const initMode = (searchParams.get("mode") as "image" | "video" | "templates") || "image";

  const [mode, setMode] = useState<"image" | "video" | "templates">(initMode);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generations, setGenerations] = useState<GenerationItem[]>([]);
  const [activeGeneration, setActiveGeneration] = useState<GenerationItem | null>(null);

  // GSAP Entrance Animations
  useEffect(() => {
    gsap.fromTo(
      ".studio-panel",
      { y: 30, opacity: 0, filter: "blur(10px)" },
      { y: 0, opacity: 1, filter: "blur(0px)", duration: 1, stagger: 0.1, ease: "power3.out" }
    );
  }, []);

  const handleGenerate = async (prompt: string, settings: any) => {
    setIsGenerating(true);

    // Simulate generation queue
    const newItem: GenerationItem = {
      id: crypto.randomUUID(),
      type: mode === 'video' ? 'video' : 'image',
      prompt: prompt,
      status: "queued"
    };

    setActiveGeneration(newItem);
    setGenerations((prev: GenerationItem[]) => [newItem, ...prev]);

    // Simulate generating state
    setTimeout(() => {
      setActiveGeneration((prev: GenerationItem | null) => prev ? { ...prev, status: "generating" } : null);
      setGenerations((prev: GenerationItem[]) => prev.map(item => item.id === newItem.id ? { ...item, status: "generating" } : item));
    }, 1500);

    // Simulate completion
    setTimeout(() => {
      const completedItem: GenerationItem = { ...newItem, status: "completed" as const, src: mode === 'image' ? "/createcard.jpeg" : "/studiox.jpg" };
      setActiveGeneration(completedItem);
      setGenerations((prev: GenerationItem[]) => prev.map(item => item.id === newItem.id ? completedItem : item));
      setIsGenerating(false);
    }, 4500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050508] via-[#0B0B12] to-[#07070A] text-zinc-100 font-sans relative selection:bg-cyan-500/40 overflow-hidden">

      {/* Background Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(139,92,246,0.06)_0%,rgba(34,211,238,0.02)_50%,transparent_100%)] blur-[100px]" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* Floating Top Nav */}
      <StudioTopNav mode={mode} setMode={setMode} />

      {/* Main 3-Panel Layout */}
      <div className="relative z-10 flex w-full max-w-[1920px] mx-auto pt-[104px] px-6 gap-6 h-screen pb-6">

        {/* Left Panel - Tool Control */}
        <div className="studio-panel w-[320px] shrink-0 h-full flex flex-col">
          <StudioLeftPanel
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            mode={mode}
          />
        </div>

        {/* Center Panel - Creation Canvas (Hero) */}
        <div className="studio-panel flex-1 h-full min-w-0 flex flex-col relative group/canvas">
          <StudioCenterCanvas
            activeGeneration={activeGeneration}
            mode={mode}
            isGenerating={isGenerating}
          />
        </div>

        {/* Right Panel - History + Assets */}
        <div className="studio-panel w-[320px] shrink-0 h-full flex flex-col">
          <StudioRightPanel generations={generations} />
        </div>

      </div>
    </div>
  );
}
