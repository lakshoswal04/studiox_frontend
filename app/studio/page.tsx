"use client"

import { useState, useRef, useEffect } from "react"
import { JobStatusCard } from "@/components/job-status-card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Upload, Wand2,
  Image as ImageIcon, Video, Mic, Layers, Code,
  ChevronRight, Sparkles
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import type { Job } from "@/lib/types"
import Image from "next/image"

const TOOLS = [
  { id: "1", name: "Text to Image", icon: ImageIcon, description: "Generate visuals" },
  { id: "2", name: "Video Upscaler", icon: Video, description: "Enhance quality" },
  { id: "3", name: "Voice Cloner", icon: Mic, description: "Replica voices" },
  { id: "4", name: "Remove BG", icon: Layers, description: "Isolate subjects" },
  { id: "5", name: "Code Gen", icon: Code, description: "Build workflows" },
]

export default function StudioPage() {
  const [selectedTool, setSelectedTool] = useState(TOOLS[0].id)
  const [prompt, setPrompt] = useState("")
  const [consent, setConsent] = useState(false)
  const [jobStatus, setJobStatus] = useState<Job | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)

  // GSAP Animations - Simplifed Entrance
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    // Refresh ScrollTrigger to ensure footer visibility
    // The delay ensures DOM and layout are fully settled potentially after hydration
    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 500)

    const ctx = gsap.context(() => {
      gsap.from(".fade-in-up", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.2
      })
    }, containerRef)

    return () => {
      ctx.revert()
      clearTimeout(timer)
    }
  }, [])

  const mockJob: Job = {
    id: "job-" + Math.random().toString(36).substr(2, 9),
    status: "processing",
    progress: 0,
    createdAt: new Date(),
  }

  const handleGenerate = () => {
    if (!consent || !prompt.trim()) return
    const newJob = { ...mockJob }
    setJobStatus(newJob)

    // Simulate progress
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setJobStatus(prev => prev ? { ...prev, status: "completed", progress: 100 } : null)
      } else {
        setJobStatus(prev => prev ? { ...prev, progress } : null)
      }
    }, 250)
  }

  const isGenerateDisabled = !consent || !prompt.trim()

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050505] text-neutral-200 font-sans selection:bg-purple-500/30 overflow-x-hidden">

      {/* Refined Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/studiox.jpg"
          alt="Studio Background"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-[#050505]/50 to-[#050505]" />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 pt-12 pb-20">

        {/* Simplified Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6 fade-in-up">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-medium tracking-widest uppercase text-neutral-500">Creation Studio</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-2">
              Imagine & Create
            </h1>
            <p className="text-neutral-400 max-w-lg text-sm md:text-base">
              Select a tool and start generating professional-grade assets in seconds.
            </p>
          </div>

          <div className="hidden md:block">
            <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-white">
              View History <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

          {/* Left Column: Controls (Simplified) */}
          <div className="lg:col-span-4 space-y-6 fade-in-up">

            {/* Tool Selector - High Visibility List */}
            <div className="bg-neutral-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-2">
              <div className="space-y-1">
                {TOOLS.map((tool) => {
                  const Icon = tool.icon
                  const isSelected = selectedTool === tool.id
                  return (
                    <motion.button
                      key={tool.id}
                      onClick={() => setSelectedTool(tool.id)}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${isSelected
                        ? "bg-white/10 shadow-[0_0_20px_rgba(168,85,247,0.15)] border-l-4 border-l-purple-500"
                        : "hover:bg-white/5 border-l-4 border-l-transparent"
                        }`}
                    >
                      {isSelected && (
                        <motion.div
                          layoutId="active-bg"
                          className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        />
                      )}

                      <div className={`p-2.5 rounded-lg transition-all duration-300 relative z-10 ${isSelected
                        ? "bg-purple-500 text-white shadow-lg shadow-purple-500/30"
                        : "bg-neutral-800 text-neutral-400 group-hover:bg-neutral-700 group-hover:text-white group-hover:shadow-lg"
                        }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="text-left flex-1 relative z-10">
                        <h4 className={`text-sm font-semibold transition-colors duration-300 ${isSelected ? "text-white" : "text-neutral-300 group-hover:text-white"}`}>
                          {tool.name}
                        </h4>
                        <p className="text-[11px] text-neutral-500 group-hover:text-neutral-400 truncate transition-colors duration-300">
                          {tool.description}
                        </p>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* Input Panel */}
            <div className="bg-neutral-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 space-y-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="space-y-1.5 relative z-10">
                <Label className="text-xs uppercase tracking-wider text-neutral-500 font-semibold pl-1">Prompt</Label>
                <Textarea
                  placeholder="Describe your creative vision..."
                  className="bg-black/30 border-white/10 focus:border-purple-500/50 min-h-[140px] resize-none text-neutral-200 placeholder:text-neutral-600 rounded-xl p-4 text-base transition-all focus:bg-black/50 shadow-inner focus:shadow-[0_0_20px_rgba(168,85,247,0.1)]"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              <div className="space-y-1.5 relative z-10">
                <Label className="text-xs uppercase tracking-wider text-neutral-500 font-semibold pl-1">Reference</Label>
                <div className="border border-dashed border-white/10 rounded-xl p-4 text-center hover:bg-white/5 hover:border-purple-500/30 transition-all duration-300 cursor-pointer group bg-black/20">
                  <div className="flex items-center justify-center gap-2 text-neutral-500 group-hover:text-purple-400 transition-colors">
                    <Upload className="w-4 h-4" />
                    <span className="text-sm">Upload File</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 relative z-10">
                <div className="flex items-start gap-3 mb-6 px-1">
                  <Checkbox
                    id="consent"
                    checked={consent}
                    onCheckedChange={(c) => setConsent(c === true)}
                    className="border-white/20 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500 mt-0.5"
                  />
                  <Label htmlFor="consent" className="text-xs text-neutral-500 leading-snug cursor-pointer hover:text-neutral-400 transition-colors">
                    I have rights to use this content.
                  </Label>
                </div>

                <Button
                  size="lg"
                  className={`w-full h-12 text-sm uppercase tracking-wide font-bold shadow-lg transition-all duration-300 rounded-xl relative overflow-hidden ${isGenerateDisabled
                    ? "bg-neutral-800 text-neutral-600 cursor-not-allowed"
                    : "bg-white text-black hover:bg-neutral-200 hover:shadow-purple-500/20 hover:scale-[1.02] active:scale-[0.98]"
                    }`}
                  disabled={isGenerateDisabled}
                  onClick={handleGenerate}
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate
                </Button>
              </div>

            </div>
          </div>

          {/* Right Column: Stage (Maximized) */}
          <div className="lg:col-span-8 fade-in-up">
            <div className="min-h-[600px] h-[calc(100vh-200px)] rounded-[2rem] overflow-hidden border border-white/5 bg-[#080808] relative shadow-2xl group">

              {/* Subtle Grid with Pulse */}
              <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

              {/* Content Area */}
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <AnimatePresence mode="wait">
                  {jobStatus ? (
                    <motion.div
                      key="active-job"
                      initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }}
                      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }} // smooth ease
                      className="w-full max-w-2xl"
                    >
                      <JobStatusCard job={jobStatus} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty-state"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: 1,
                        y: [0, -10, 0],
                      }}
                      transition={{
                        y: {
                          repeat: Infinity,
                          duration: 4,
                          ease: "easeInOut"
                        },
                        opacity: { duration: 0.5 }
                      }}
                      className="text-center relative"
                    >
                      <div className="relative">
                        {/* Glass Card Behind Glow */}
                        <div className="absolute inset-0 bg-purple-500/20 blur-[60px] rounded-full transform -translate-y-4" />

                        <div className="w-40 h-40 rounded-[2rem] bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/10 flex items-center justify-center mx-auto mb-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] relative z-10 group-hover:scale-105 transition-transform duration-500">
                          <Sparkles className="w-16 h-16 text-white/80 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
                        </div>
                      </div>

                      <div className="space-y-3 relative z-10 bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-white/5 inline-block">
                        <h3 className="text-2xl font-semibold text-white tracking-tight">Ready to Create</h3>
                        <p className="text-neutral-400 font-medium">Configure parameters to ignite the engine.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

