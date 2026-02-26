"use client"

import { useRef, useLayoutEffect, useEffect, useState, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight, Play, Plus, Layers, Grid3X3, Type, Pen, Image, Wand2 } from "lucide-react"
import { Typewriter } from "@/components/ui/typewriter"
import { gsap } from "gsap"

interface HeroStateProps {
    register: (cb: (progress: number, index: number) => void) => () => void
}

const FLOAT_COUNT = 14

const IMAGE_TINTS = [
    'from-indigo-500/30 to-transparent', 'from-pink-500/25 to-transparent',
    'from-cyan-500/30 to-transparent', 'from-amber-400/25 to-transparent',
    'from-emerald-500/25 to-transparent', 'from-rose-500/25 to-transparent',
    'from-violet-500/30 to-transparent', 'from-sky-500/25 to-transparent',
    'from-fuchsia-500/25 to-transparent', 'from-orange-400/25 to-transparent',
    'from-teal-500/25 to-transparent', 'from-purple-500/30 to-transparent',
    'from-blue-500/25 to-transparent', 'from-lime-500/20 to-transparent',
]

const BORDER_COLORS = [
    'border-indigo-300/40', 'border-pink-300/40', 'border-cyan-300/40',
    'border-amber-300/40', 'border-emerald-300/40', 'border-rose-300/40',
    'border-violet-300/40', 'border-sky-300/40', 'border-fuchsia-300/40',
    'border-orange-300/40', 'border-teal-300/40', 'border-purple-300/40',
    'border-blue-300/40', 'border-lime-300/40',
]

interface FloatConfig {
    id: number; src: string; width: number; height: number
    left: string; top: string; depth: number; floatDuration: number; floatDelay: number
}

// Wireframe connections: [fromCard, toCard, color, label]
const CONNECTIONS: [string, string, string, string][] = [
    ['prompt', 'imageGen', '#3b82f6', 'Generate'],
    ['reference', 'imageGen', '#06b6d4', 'Style'],
    ['imageGen', 'videoGen', '#a855f7', 'Animate'],
    ['prompt', 'reference', '#f43f5e', 'Guide'],
]

export function HeroState({ register }: HeroStateProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const headingRef = useRef<HTMLHeadingElement>(null)
    const subRef = useRef<HTMLDivElement>(null)
    const descRef = useRef<HTMLParagraphElement>(null)
    const buttonsRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLDivElement>(null)
    const canvasInnerRef = useRef<HTMLDivElement>(null)
    const floatsRef = useRef<(HTMLDivElement | null)[]>([])
    const cursorRef = useRef({ x: 0, y: 0 })
    const requestIdRef = useRef<number | null>(null)

    // Card refs for pixel-accurate wire tracking
    const cardRefs = useRef<Record<string, HTMLDivElement | null>>({
        prompt: null, reference: null, imageGen: null, videoGen: null,
    })

    const [mounted, setMounted] = useState(false)
    const [dragging, setDragging] = useState<string | null>(null)
    const [wireUpdate, setWireUpdate] = useState(0) // trigger re-render for wires
    const dragStart = useRef({ mx: 0, my: 0, ox: 0, oy: 0 })

    // Initial positions (percentage of canvas inner)
    const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({
        prompt: { x: 68, y: 5 },
        reference: { x: 3, y: 15 },
        imageGen: { x: 28, y: 15 },
        videoGen: { x: 62, y: 55 },
    })

    const floats = useMemo<FloatConfig[]>(() => {
        if (typeof window === 'undefined') return []
        const items: FloatConfig[] = []
        for (let i = 0; i < FLOAT_COUNT; i++) {
            let x: number, y: number, valid = false
            while (!valid) {
                x = Math.random() * 90 + 5; y = Math.random() * 85 + 5
                if (!(x > 15 && x < 85 && y > 25 && y < 75)) valid = true
            }
            items.push({
                id: i, src: `/seamless-animate/bg${(i % 25) + 1}.jpg`,
                width: 100 + Math.random() * 100, height: 100 + Math.random() * 100,
                left: `${x!}%`, top: `${y!}%`, depth: 0.3 + Math.random() * 0.7,
                floatDuration: 8 + Math.random() * 6, floatDelay: Math.random() * -6,
            })
        }
        return items
    }, [])

    useEffect(() => setMounted(true), [])

    // ---- Drag logic ----
    const handlePointerDown = useCallback((cardId: string, e: React.PointerEvent) => {
        e.preventDefault(); e.stopPropagation()
        const el = cardRefs.current[cardId]
        if (!el) return
        setDragging(cardId)
        dragStart.current = { mx: e.clientX, my: e.clientY, ox: el.offsetLeft, oy: el.offsetTop }
    }, [])

    useEffect(() => {
        if (!dragging) return
        const canvas = canvasInnerRef.current
        if (!canvas) return
        const handleMove = (e: PointerEvent) => {
            const el = cardRefs.current[dragging]
            if (!el) return
            const dx = e.clientX - dragStart.current.mx
            const dy = e.clientY - dragStart.current.my
            const newX = dragStart.current.ox + dx
            const newY = dragStart.current.oy + dy
            // Clamp within canvas
            const maxX = canvas.clientWidth - el.clientWidth
            const maxY = canvas.clientHeight - el.clientHeight
            el.style.left = `${Math.max(0, Math.min(maxX, newX))}px`
            el.style.top = `${Math.max(0, Math.min(maxY, newY))}px`
            el.style.position = 'absolute'
            // Force wire update
            setWireUpdate(v => v + 1)
        }
        const handleUp = () => setDragging(null)
        window.addEventListener('pointermove', handleMove)
        window.addEventListener('pointerup', handleUp)
        return () => { window.removeEventListener('pointermove', handleMove); window.removeEventListener('pointerup', handleUp) }
    }, [dragging])

    // --- Get card edge center for wires ---
    const getCardEdge = useCallback((fromId: string, toId: string): { x1: number; y1: number; x2: number; y2: number } | null => {
        const canvas = canvasInnerRef.current
        const fromEl = cardRefs.current[fromId]
        const toEl = cardRefs.current[toId]
        if (!canvas || !fromEl || !toEl) return null
        const cr = canvas.getBoundingClientRect()
        const fr = fromEl.getBoundingClientRect()
        const tr = toEl.getBoundingClientRect()
        // Centers relative to canvas
        const fcx = (fr.left + fr.width / 2) - cr.left
        const fcy = (fr.top + fr.height / 2) - cr.top
        const tcx = (tr.left + tr.width / 2) - cr.left
        const tcy = (tr.top + tr.height / 2) - cr.top
        // Find edge intersection points
        const angle = Math.atan2(tcy - fcy, tcx - fcx)
        const fromEdge = edgePoint(fcx, fcy, fr.width / 2, fr.height / 2, angle)
        const backAngle = Math.atan2(fcy - tcy, fcx - tcx)
        const toEdge = edgePoint(tcx, tcy, tr.width / 2, tr.height / 2, backAngle)
        return { x1: fromEdge.x, y1: fromEdge.y, x2: toEdge.x, y2: toEdge.y }
    }, [])

    // Cursor parallax
    useEffect(() => {
        if (!mounted) return
        const handleMouseMove = (e: MouseEvent) => { cursorRef.current = { x: (e.clientX / window.innerWidth) * 2 - 1, y: (e.clientY / window.innerHeight) * 2 - 1 } }
        window.addEventListener("mousemove", handleMouseMove)
        const update = () => {
            floatsRef.current.forEach((el, i) => {
                if (!el || !floats[i]) return
                const d = floats[i].depth
                const tx = cursorRef.current.x * 12 * d, ty = cursorRef.current.y * 12 * d
                const cx = (gsap.getProperty(el, "x") as number) || 0, cy = (gsap.getProperty(el, "y") as number) || 0
                gsap.set(el, { x: cx + (tx - cx) * 0.06, y: cy + (ty - cy) * 0.06 })
            })
            requestIdRef.current = requestAnimationFrame(update)
        }
        update()
        return () => { window.removeEventListener("mousemove", handleMouseMove); if (requestIdRef.current) cancelAnimationFrame(requestIdRef.current) }
    }, [mounted, floats])

    // Float & canvas animations
    useEffect(() => {
        if (!mounted) return
        const ctx = gsap.context(() => {
            gsap.fromTo(floatsRef.current.filter(Boolean), { opacity: 0, scale: 0.8 }, { opacity: 0.7, scale: 1, duration: 1.6, stagger: 0.12, ease: "power2.out" })
            floatsRef.current.forEach((el, i) => {
                if (!el || !floats[i]) return
                gsap.to(el, { yPercent: Math.random() > 0.5 ? 20 : -20, xPercent: Math.random() > 0.5 ? 8 : -8, rotation: (Math.random() - 0.5) * 6, duration: floats[i].floatDuration, delay: floats[i].floatDelay, ease: "sine.inOut", repeat: -1, yoyo: true })
            })
            if (canvasRef.current) {
                gsap.fromTo(canvasRef.current, { opacity: 0, y: 60, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 1.4, delay: 0.6, ease: "power3.out" })
            }
        }, containerRef)
        // Initial wire positions after cards mount
        setTimeout(() => setWireUpdate(v => v + 1), 100)
        return () => ctx.revert()
    }, [mounted, floats])

    // Text entry
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
            gsap.set([subRef.current, headingRef.current, descRef.current, buttonsRef.current], { opacity: 0, y: 30 })
            tl.to(subRef.current, { opacity: 1, y: 0, duration: 0.6 })
                .to(headingRef.current, { opacity: 1, y: 0, duration: 0.8 }, "-=0.3")
                .to(descRef.current, { opacity: 1, y: 0, duration: 0.7 }, "-=0.4")
                .to(buttonsRef.current, { opacity: 1, y: 0, duration: 0.7 }, "-=0.4")
        }, containerRef)
        return () => ctx.revert()
    }, [])

    // Scroll exit
    useEffect(() => {
        const unregister = register((globalProgress) => {
            if (!contentRef.current) return
            const slice = 1 / 7
            if (globalProgress < slice) gsap.set(contentRef.current, { y: globalProgress * 500 })
            const exitStart = slice * 0.6
            if (globalProgress > exitStart) {
                const p = Math.min(1, (globalProgress - exitStart) / (slice - exitStart))
                gsap.set(contentRef.current, { opacity: 1 - p, scale: 1 - 0.05 * p, filter: `blur(${p * 10}px)` })
            } else {
                gsap.set(contentRef.current, { opacity: 1, scale: 1, filter: "blur(0px)" })
            }
        })
        return () => unregister?.()
    }, [register])

    const toolbarIcons = [
        { icon: Plus, label: "Add" }, { icon: Layers, label: "Layers" },
        { icon: Grid3X3, label: "Grid" }, { icon: Type, label: "Text" },
        { icon: Pen, label: "Draw" }, { icon: Image, label: "Media" },
        { icon: Wand2, label: "AI" },
    ]

    // Compute wire paths for current card positions
    const wirePaths = useMemo(() => {
        if (!mounted) return []
        return CONNECTIONS.map(([from, to, color, label]) => {
            const edge = getCardEdge(from, to)
            if (!edge) return null
            const { x1, y1, x2, y2 } = edge
            const dx = x2 - x1, dy = y2 - y1
            const len = Math.sqrt(dx * dx + dy * dy)
            // Control points for Bezier curve (curvy wire)
            const cp1x = x1 + dx * 0.35 + dy * 0.15
            const cp1y = y1 + dy * 0.35 - dx * 0.15
            const cp2x = x1 + dx * 0.65 - dy * 0.15
            const cp2y = y1 + dy * 0.65 + dx * 0.15
            // Arrow endpoint (slightly before the end so arrowhead sits at edge)
            const arrowLen = 10
            const ux = dx / len, uy = dy / len
            const ax = x2 - ux * arrowLen, ay = y2 - uy * arrowLen
            // Mid point for label
            const mx = (x1 + x2) / 2 + dy * 0.08
            const my = (y1 + y2) / 2 - dx * 0.08
            return { x1, y1, x2, y2, cp1x, cp1y, cp2x, cp2y, ax, ay, ux, uy, mx, my, color, label, len }
        }).filter(Boolean) as any[]
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mounted, wireUpdate, getCardEdge])

    return (
        <section
            ref={containerRef}
            className="md:absolute md:inset-0 relative w-full h-auto min-h-[100svh] flex items-center justify-center overflow-hidden pointer-events-none bg-white"
        >
            {/* Ambient glows */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-[150px] -left-[150px] w-[600px] h-[600px] rounded-full opacity-[0.15] blur-[100px]" style={{ background: 'radial-gradient(circle, #818cf8 0%, transparent 70%)' }} />
                <div className="absolute -bottom-[150px] -right-[150px] w-[550px] h-[550px] rounded-full opacity-[0.12] blur-[100px]" style={{ background: 'radial-gradient(circle, #c084fc 0%, transparent 70%)' }} />
                <div className="absolute top-[15%] right-[10%] w-[350px] h-[350px] rounded-full opacity-[0.10] blur-[90px]" style={{ background: 'radial-gradient(circle, #22d3ee 0%, transparent 70%)' }} />
                <div className="absolute bottom-[30%] left-[20%] w-[300px] h-[300px] rounded-full opacity-[0.08] blur-[90px]" style={{ background: 'radial-gradient(circle, #fb923c 0%, transparent 70%)' }} />
            </div>

            {/* === GLOWING AURORA ORBS / PARTICLES === */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ filter: 'blur(60px)' }}>
                {/* We'll place 20 bright, soft orbs floating around the edges and background */}

                {/* Top Left Cluster */}
                <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-indigo-500/40 mix-blend-multiply animate-pulse" />
                <div className="absolute top-[5%] left-[5%] w-[350px] h-[350px] rounded-full bg-cyan-400/30 mix-blend-multiply animation-delay-2000" style={{ animation: 'pulse 8s infinite' }} />
                <div className="absolute top-[15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/25 mix-blend-multiply animation-delay-4000" style={{ animation: 'pulse 10s infinite' }} />

                {/* Top Right Cluster */}
                <div className="absolute top-[-15%] right-[-10%] w-[550px] h-[550px] rounded-full bg-purple-500/35 mix-blend-multiply" style={{ animation: 'pulse 9s infinite' }} />
                <div className="absolute top-[10%] right-[10%] w-[300px] h-[300px] rounded-full bg-pink-500/30 mix-blend-multiply animation-delay-3000" style={{ animation: 'pulse 7s infinite' }} />
                <div className="absolute top-[5%] right-[-5%] w-[400px] h-[400px] rounded-full bg-fuchsia-500/25 mix-blend-multiply animation-delay-1000" style={{ animation: 'pulse 11s infinite' }} />

                {/* Bottom Left Cluster */}
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-500/25 mix-blend-multiply" style={{ animation: 'pulse 12s infinite' }} />
                <div className="absolute bottom-[10%] left-[5%] w-[350px] h-[350px] rounded-full bg-teal-400/30 mix-blend-multiply animation-delay-5000" style={{ animation: 'pulse 8s infinite' }} />
                <div className="absolute bottom-[-5%] left-[15%] w-[450px] h-[450px] rounded-full bg-cyan-500/20 mix-blend-multiply animation-delay-2000" style={{ animation: 'pulse 9s infinite' }} />

                {/* Bottom Right Cluster */}
                <div className="absolute bottom-[-15%] right-[-5%] w-[500px] h-[500px] rounded-full bg-rose-500/30 mix-blend-multiply" style={{ animation: 'pulse 10s infinite' }} />
                <div className="absolute bottom-[5%] right-[10%] w-[400px] h-[400px] rounded-full bg-orange-400/25 mix-blend-multiply animation-delay-4000" style={{ animation: 'pulse 8s infinite' }} />
                <div className="absolute bottom-[15%] right-[-10%] w-[350px] h-[350px] rounded-full bg-amber-500/20 mix-blend-multiply animation-delay-1000" style={{ animation: 'pulse 11s infinite' }} />

                {/* Center / Midground scattered orbs */}
                <div className="absolute top-[40%] left-[30%] w-[250px] h-[250px] rounded-full bg-indigo-400/20 mix-blend-multiply" style={{ animation: 'pulse 6s infinite' }} />
                <div className="absolute top-[60%] right-[30%] w-[300px] h-[300px] rounded-full bg-purple-400/20 mix-blend-multiply animation-delay-3000" style={{ animation: 'pulse 9s infinite' }} />
                <div className="absolute top-[30%] right-[40%] w-[200px] h-[200px] rounded-full bg-sky-400/20 mix-blend-multiply animation-delay-5000" style={{ animation: 'pulse 7s infinite' }} />
                <div className="absolute top-[70%] left-[40%] w-[280px] h-[280px] rounded-full bg-pink-400/20 mix-blend-multiply" style={{ animation: 'pulse 10s infinite' }} />

                {/* Extra bright core spots */}
                <div className="absolute top-[20%] left-[20%] w-[150px] h-[150px] rounded-full bg-white/40 mix-blend-overlay" style={{ animation: 'pulse 4s infinite' }} />
                <div className="absolute bottom-[20%] right-[20%] w-[150px] h-[150px] rounded-full bg-white/40 mix-blend-overlay animation-delay-2000" style={{ animation: 'pulse 5s infinite' }} />
                <div className="absolute top-[30%] right-[15%] w-[100px] h-[100px] rounded-full bg-white/30 mix-blend-overlay" style={{ animation: 'pulse 3s infinite' }} />
                <div className="absolute bottom-[30%] left-[15%] w-[100px] h-[100px] rounded-full bg-white/30 mix-blend-overlay animation-delay-1000" style={{ animation: 'pulse 6s infinite' }} />
            </div>

            {/* Content */}
            <div ref={contentRef} className="relative z-20 w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 will-change-transform">
                <div className="mb-12 md:mb-16">
                    <div ref={subRef} className="opacity-0 mb-6 pointer-events-auto inline-flex">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-black/[0.08] bg-black/[0.03] backdrop-blur-sm shadow-sm">
                            <Sparkles className="h-3.5 w-3.5 text-indigo-500 animate-pulse" />
                            <span className="text-[11px] md:text-xs tracking-[0.2em] uppercase text-zinc-500 font-medium">
                                <Typewriter text="The Future Of Creation" delay={800} speed={70} cursorClassName="bg-zinc-400" />
                            </span>
                        </div>
                    </div>
                    <h1 ref={headingRef} className="opacity-0 text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-medium tracking-tight leading-[1.1] text-zinc-900 mb-6">
                        Your AI-Native<br />Creative Studio
                    </h1>
                    <p ref={descRef} className="opacity-0 text-base md:text-lg text-zinc-600 max-w-xl leading-relaxed font-medium">
                        Craft high-quality video and content in a seamless AI studio
                        built for precision, speed, and full creative control.
                    </p>
                    <div ref={buttonsRef} className="opacity-0 flex flex-wrap items-center gap-4 mt-8 pointer-events-auto">
                        <Button size="lg" className="h-12 px-8 rounded-lg text-sm bg-zinc-900 text-white hover:bg-zinc-800 hover:scale-[1.02] transition-all duration-300 font-semibold group shadow-lg" asChild>
                            <a href="/studio">Start Creating<ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" /></a>
                        </Button>
                        <Button size="lg" variant="outline" className="h-12 px-8 rounded-lg text-sm bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300 transition-all duration-300 font-medium group shadow-sm" asChild>
                            <a href="#collective"><Play className="mr-2 h-4 w-4 fill-zinc-300 group-hover:fill-zinc-500 transition-all" />Watch Demo</a>
                        </Button>
                    </div>
                </div>

                {/* ========= GLASS CANVAS ========= */}
                <div ref={canvasRef} className="relative rounded-2xl overflow-hidden pointer-events-auto"
                    style={{
                        opacity: 0,
                        background: 'rgba(255,255,255,0.22)',
                        backdropFilter: 'blur(28px) saturate(1.5)',
                        WebkitBackdropFilter: 'blur(28px) saturate(1.5)',
                        border: '1px solid rgba(255,255,255,0.5)',
                        boxShadow: '0 20px 80px -15px rgba(99,102,241,0.12), 0 8px 30px -10px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.7)',
                    }}>

                    {/* Glass grain */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
                        style={{ backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.5) 1px, transparent 1px)', backgroundSize: '18px 18px' }} />

                    {/* Toolbar */}
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-1.5">
                        {toolbarIcons.map(({ icon: Icon, label }, i) => (
                            <div key={i} title={label}
                                className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-700 transition-all cursor-pointer group"
                                style={{ background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(12px)', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                                <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            </div>
                        ))}
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 mt-1 shadow-md cursor-pointer hover:scale-105 transition-transform" />
                    </div>

                    {/* Canvas area */}
                    <div ref={canvasInnerRef} className="relative py-8 px-16 min-h-[380px] md:min-h-[440px]" style={{ cursor: dragging ? 'grabbing' : 'default' }}>

                        {/* SVG WIRES with arrows */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ overflow: 'visible' }}>
                            <defs>
                                {CONNECTIONS.map(([, , color], i) => (
                                    <marker key={`arrow-${i}`} id={`arrowhead-${i}`} markerWidth="14" markerHeight="10" refX="12" refY="5" orient="auto" markerUnits="userSpaceOnUse">
                                        <polygon points="0 0, 14 5, 0 10" fill={color} opacity="0.9" />
                                    </marker>
                                ))}
                                {CONNECTIONS.map(([, , color], i) => (
                                    <filter key={`glow-${i}`} id={`wire-glow-${i}`} x="-50%" y="-50%" width="200%" height="200%">
                                        <feGaussianBlur stdDeviation="4" result="blur" />
                                        <feFlood floodColor={color} floodOpacity="0.6" result="color" />
                                        <feComposite in="color" in2="blur" operator="in" result="glow" />
                                        <feMerge>
                                            <feMergeNode in="glow" />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                ))}
                            </defs>
                            {wirePaths.map((w, i) => {
                                const pathD = `M ${w.x1} ${w.y1} C ${w.cp1x} ${w.cp1y}, ${w.cp2x} ${w.cp2y}, ${w.x2} ${w.y2}`
                                return (
                                    <g key={i}>
                                        {/* Wide soft glow */}
                                        <path d={pathD} stroke={w.color} strokeWidth="12" fill="none" opacity="0.06" strokeLinecap="round" />
                                        {/* Medium glow */}
                                        <path d={pathD} stroke={w.color} strokeWidth="5" fill="none" opacity="0.15" strokeLinecap="round" />
                                        {/* Main animated wire */}
                                        <path d={pathD} stroke={w.color} strokeWidth="2" fill="none" opacity="0.7"
                                            strokeDasharray="10 6" strokeLinecap="round"
                                            markerEnd={`url(#arrowhead-${i})`}
                                            filter={`url(#wire-glow-${i})`}
                                        >
                                            <animate attributeName="stroke-dashoffset" from="0" to="-32" dur="1s" repeatCount="indefinite" />
                                        </path>
                                        {/* Traveling particle */}
                                        <circle r="3" fill={w.color} opacity="0.9" filter={`url(#wire-glow-${i})`}>
                                            <animateMotion dur="2.5s" repeatCount="indefinite">
                                                <mpath href={`#motion-path-${i}`} />
                                            </animateMotion>
                                        </circle>
                                        <path id={`motion-path-${i}`} d={pathD} fill="none" stroke="none" />
                                        {/* Start dot */}
                                        <circle cx={w.x1} cy={w.y1} r="4" fill={w.color} opacity="0.7">
                                            <animate attributeName="r" values="3;6;3" dur="1.5s" repeatCount="indefinite" />
                                            <animate attributeName="opacity" values="0.7;1;0.7" dur="1.5s" repeatCount="indefinite" />
                                        </circle>
                                        {/* End dot */}
                                        <circle cx={w.x2} cy={w.y2} r="4" fill={w.color} opacity="0.7">
                                            <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
                                            <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2s" repeatCount="indefinite" />
                                        </circle>
                                        {/* Label on wire */}
                                        {w.len > 80 && (
                                            <g>
                                                <rect x={w.mx - 24} y={w.my - 10} width="48" height="20" rx="10" fill="white" fillOpacity="0.9" stroke={w.color} strokeWidth="1" strokeOpacity="0.4" />
                                                <text x={w.mx} y={w.my + 4} textAnchor="middle" fill={w.color} fontSize="9" fontWeight="700" fontFamily="system-ui">{w.label}</text>
                                            </g>
                                        )}
                                    </g>
                                )
                            })}
                        </svg>

                        {/* === DRAGGABLE CARDS === */}

                        {/* Prompt Card */}
                        <div
                            ref={el => { cardRefs.current.prompt = el }}
                            className="absolute z-20 select-none group"
                            style={{ left: `${positions.prompt.x}%`, top: `${positions.prompt.y}%`, cursor: dragging === 'prompt' ? 'grabbing' : 'grab' }}
                            onPointerDown={e => handlePointerDown('prompt', e)}
                        >
                            <div className="px-4 py-3 rounded-xl max-w-[200px] transition-all duration-200 group-hover:shadow-xl group-active:scale-[0.97]"
                                style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', border: '1.5px solid rgba(129,140,248,0.25)', boxShadow: '0 4px 20px rgba(129,140,248,0.1)' }}>
                                <div className="text-[10px] text-indigo-500 uppercase tracking-wider mb-1.5 font-bold flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_6px_rgba(129,140,248,0.5)]" /> Prompt
                                </div>
                                <p className="text-[11px] text-zinc-600 leading-relaxed">
                                    A cinematic scene with flowing golden fabric, ethereal lighting…
                                </p>
                            </div>
                        </div>

                        {/* Reference Card */}
                        <div
                            ref={el => { cardRefs.current.reference = el }}
                            className="absolute z-20 select-none group"
                            style={{ left: `${positions.reference.x}%`, top: `${positions.reference.y}%`, cursor: dragging === 'reference' ? 'grabbing' : 'grab' }}
                            onPointerDown={e => handlePointerDown('reference', e)}
                        >
                            <div className="text-[10px] text-sky-500 uppercase tracking-wider mb-1.5 font-bold flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.5)]" /> Reference
                            </div>
                            <div className="w-[180px] h-[140px] rounded-xl overflow-hidden transition-all duration-200 group-hover:shadow-xl group-active:scale-[0.97]"
                                style={{ border: '1.5px solid rgba(56,189,248,0.2)', boxShadow: '0 4px 20px rgba(56,189,248,0.08)' }}>
                                <img src="/seamless-animate/bg3.jpg" alt="" className="w-full h-full object-cover" />
                            </div>
                        </div>

                        {/* Image Generation Card */}
                        <div
                            ref={el => { cardRefs.current.imageGen = el }}
                            className="absolute z-20 select-none group"
                            style={{ left: `${positions.imageGen.x}%`, top: `${positions.imageGen.y}%`, cursor: dragging === 'imageGen' ? 'grabbing' : 'grab' }}
                            onPointerDown={e => handlePointerDown('imageGen', e)}
                        >
                            <div className="text-[10px] text-purple-500 uppercase tracking-wider mb-1.5 font-bold flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_6px_rgba(192,132,252,0.5)]" /> Image Generation
                            </div>
                            <div className="w-[260px] md:w-[300px] h-[190px] md:h-[220px] rounded-xl overflow-hidden transition-all duration-200 group-hover:shadow-2xl group-active:scale-[0.97]"
                                style={{ border: '1.5px solid rgba(192,132,252,0.2)', boxShadow: '0 8px 30px rgba(192,132,252,0.1)' }}>
                                <img src="/seamless-animate/bg1.jpg" alt="" className="w-full h-full object-cover" />
                            </div>
                        </div>

                        {/* Video Generation Card */}
                        <div
                            ref={el => { cardRefs.current.videoGen = el }}
                            className="absolute z-20 select-none group"
                            style={{ left: `${positions.videoGen.x}%`, top: `${positions.videoGen.y}%`, cursor: dragging === 'videoGen' ? 'grabbing' : 'grab' }}
                            onPointerDown={e => handlePointerDown('videoGen', e)}
                        >
                            <div className="text-[10px] text-pink-500 uppercase tracking-wider mb-1.5 font-bold flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-pink-400 shadow-[0_0_6px_rgba(244,114,182,0.5)]" /> Video Generation
                            </div>
                            <div className="w-[200px] h-[150px] rounded-xl overflow-hidden transition-all duration-200 group-hover:shadow-xl group-active:scale-[0.97]"
                                style={{ border: '1.5px solid rgba(244,114,182,0.2)', boxShadow: '0 4px 20px rgba(244,114,182,0.08)' }}>
                                <img src="/seamless-animate/bg5.jpg" alt="" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="relative z-10 flex items-center justify-between px-6 py-3"
                        style={{ borderTop: '1px solid rgba(0,0,0,0.04)', background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(12px)' }}>
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.06)' }}>
                                <span className="text-[8px] text-zinc-400">◎</span>
                            </div>
                            <span className="text-[11px] text-zinc-400">Canvas • 1920 × 1080</span>
                            <span className="text-[10px] text-zinc-300 ml-2 italic">⟵ Drag any card</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-zinc-400 px-2 py-1 rounded" style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.06)' }}>Auto</span>
                            <span className="text-[10px] text-zinc-400 px-2 py-1 rounded" style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.06)' }}>HD</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll hint */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-20 animate-bounce">
                <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-zinc-400 to-transparent rounded-full" />
            </div>
        </section>
    )
}

// Helper: find the point on a rectangle edge closest to a given angle
function edgePoint(cx: number, cy: number, hw: number, hh: number, angle: number) {
    const cos = Math.cos(angle), sin = Math.sin(angle)
    const absCos = Math.abs(cos), absSin = Math.abs(sin)
    let x: number, y: number
    if (absCos * hh > absSin * hw) {
        // Intersects left/right edge
        const sign = cos > 0 ? 1 : -1
        x = cx + sign * hw
        y = cy + sign * hw * (sin / cos)
    } else {
        // Intersects top/bottom edge
        const sign = sin > 0 ? 1 : -1
        x = cx + sign * hh * (cos / sin)
        y = cy + sign * hh
    }
    return { x, y }
}
