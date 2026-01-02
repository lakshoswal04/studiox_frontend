"use client"

import { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AppCard } from "@/components/app-card"
import { TypewriterText } from "@/components/typewriter-text"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"
import type { App } from "@/lib/types"

gsap.registerPlugin(ScrollTrigger)

const apps: App[] = [
    {
        id: "1",
        name: "Text to Image",
        description: "Generate stunning images from text descriptions",
        image: "/marketplace/bg1.mp4",
        tags: ["Image", "AI"],
        creditCost: 5,
        isNew: true,
    },
    {
        id: "2",
        name: "Video Upscaler",
        description: "Enhance your videos with AI-powered upscaling",
        image: "/marketplace/bg2.mp4",
        tags: ["Video", "Enhancement"],
        creditCost: 10,
        isPro: true,
    },
    {
        id: "3",
        name: "Voice Cloner",
        description: "Clone any voice with stunning accuracy",
        image: "/marketplace/bg3.mp4",
        tags: ["Audio", "Voice"],
        creditCost: 8,
    },
    {
        id: "4",
        name: "Remove Background",
        description: "Instantly remove backgrounds from images",
        image: "/marketplace/bg4.mp4",
        tags: ["Image", "Editing"],
        creditCost: 3,
    },
    {
        id: "5",
        name: "Code Generator",
        description: "Generate code from natural language descriptions",
        image: "/marketplace/bg5.mp4",
        tags: ["Development", "AI"],
        creditCost: 2,
    },
    {
        id: "6",
        name: "Music Composer",
        description: "Create original music compositions in any style",
        image: "/marketplace/bg6.mp4",
        tags: ["Audio", "Music"],
        creditCost: 12,
    },
    {
        id: "7",
        name: "Face Swap",
        description: "Seamlessly swap faces in images and videos",
        image: "/marketplace/bg7.mp4",
        tags: ["Video", "Face"],
        creditCost: 7,
        isNew: true,
    },
    {
        id: "8",
        name: "3D Model Generator",
        description: "Generate 3D models from text or images",
        image: "/marketplace/bg8.mp4",
        tags: ["3D", "AI"],
        creditCost: 15,
        isPro: true,
    },
]

export function MarketplaceSection() {
    const sectionRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const isMobile = window.innerWidth < 768

        const ctx = gsap.context(() => {
            if (!isMobile && sectionRef.current && contentRef.current) {
                ScrollTrigger.create({
                    trigger: sectionRef.current,
                    start: "bottom bottom",
                    end: "+=100%",
                    pin: true,
                    pinSpacing: false,
                    scrub: true,
                })

                gsap.to(contentRef.current, {
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "bottom bottom",
                        end: "bottom top",
                        scrub: true,
                    },
                    scale: 0.95,
                    filter: "blur(5px)",
                    opacity: 0.5,
                    ease: "power1.inOut",
                })

                gsap.to(".app-card-wrapper > div", {
                    y: i => (i % 2 === 0 ? -80 : 40),
                    ease: "none",
                    scrollTrigger: {
                        trigger: contentRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1.5,
                    },
                })
            }

            gsap.from(".app-card-wrapper", {
                scrollTrigger: {
                    trigger: contentRef.current,
                    start: isMobile ? "top 80%" : "top 60%",
                },
                y: isMobile ? 30 : 100,
                opacity: 0,
                duration: isMobile ? 0.6 : 1.2,
                stagger: isMobile ? 0.05 : 0.1,
                ease: "power3.out",
            })
        }, sectionRef)

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill())
            ctx.revert()
        }
    }, [])

    return (
        <section
            ref={sectionRef}
            className="py-24 bg-zinc-950 relative z-40 min-h-screen flex flex-col justify-center overflow-hidden"
        >
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] opacity-30 mix-blend-screen" />
                <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[100px] opacity-30 mix-blend-screen" />
            </div>

            <div
                ref={contentRef}
                className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col justify-center"
            >
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-20">
                    <div>
                        <TypewriterText
                            text="App Marketplace"
                            className="text-4xl md:text-6xl font-bold font-sans text-white tracking-tighter"
                            cursor={false}
                        />
                        <TypewriterText
                            text="Curated tools for professional workflows"
                            className="text-zinc-400 text-lg font-sans tracking-wide mt-2"
                            delay={0.5}
                            stagger={0.02}
                        />
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
                        <Button className="rounded-full px-6 h-9 bg-white text-black hover:bg-white/90">
                            All Tools
                        </Button>
                        <Button variant="ghost" className="rounded-full px-6 h-9 text-zinc-400 hover:text-white hover:bg-white/10">
                            Image
                        </Button>
                        <Button variant="ghost" className="rounded-full px-6 h-9 text-zinc-400 hover:text-white hover:bg-white/10">
                            Video
                        </Button>
                        <Button variant="ghost" className="rounded-full px-6 h-9 text-zinc-400 hover:text-white hover:bg-white/10">
                            Audio
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {apps.map(app => (
                        <div key={app.id} className="app-card-wrapper h-[420px]">
                            <AppCard app={app} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}