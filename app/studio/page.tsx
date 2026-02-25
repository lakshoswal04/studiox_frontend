"use client";

import { useState, Suspense, useEffect } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { StudioLeftPanel } from "@/components/studio/left-panel";
import { StudioCenterCanvas, type GenerationItem } from "@/components/studio/center-canvas";
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

  const [mode] = useState<"image" | "video" | "templates">(initMode);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generations, setGenerations] = useState<GenerationItem[]>([]);
  const [activeGeneration, setActiveGeneration] = useState<GenerationItem | null>(null);

  // Shared state for framing/canvas preview
  const [aspectRatio, setAspectRatio] = useState("16:9");

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
      type: settings.mode === 'video' ? 'video' : 'image',
      prompt: prompt,
      status: "queued",
      settings: settings
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
      const completedItem: GenerationItem = { ...newItem, status: "completed" as const, src: settings.mode === 'image' ? "/createcard.jpeg" : "/studiox.jpg" };
      setActiveGeneration(completedItem);
      setGenerations((prev: GenerationItem[]) => prev.map(item => item.id === newItem.id ? completedItem : item));
      setIsGenerating(false);
    }, 4500);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans relative selection:bg-cyan-500/40 overflow-hidden">
      {/* Background Lighting & Image Layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-black/80" />
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 transition-all duration-[20s] ease-linear scale-105"
          style={{ backgroundImage: `url('/studio/studio3.jpeg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1)_0%,rgba(0,0,0,0.3)_100%)] backdrop-blur-[6px]" />
      </div>

      {/* Main Layout */}
      <div className="relative z-10 flex w-full h-[calc(100vh-24px)] pt-[104px] px-6 gap-6 max-w-[2000px] mx-auto overflow-hidden">

        {/* Left Panel - Tool Control */}
        <div className="studio-panel w-[340px] shrink-0 h-[calc(100vh-130px)] flex flex-col z-20">
          <StudioLeftPanel
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            mode={mode}
            aspectRatio={aspectRatio}
            setAspectRatio={setAspectRatio}
          />
        </div>

        {/* Center Panel - Creation Canvas (Hero) */}
        <div className="studio-panel flex-1 h-full min-w-0 flex flex-col relative z-10">
          <StudioCenterCanvas
            activeGeneration={activeGeneration}
            mode={mode}
            isGenerating={isGenerating}
            aspectRatio={aspectRatio}
          />
        </div>

      </div>
    </div>
  );
}
