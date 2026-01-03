"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function Footer() {
  const footerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(
        footerRef.current,
        {
          y: 32,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        }
      )
    }, footerRef)

    return () => ctx.revert()
  }, [])

  return (
    <footer
      ref={footerRef}
      className="relative bg-background border-t border-white/5 py-5 md:py-6 overflow-hidden z-40"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/footer.jpg)" }}
      />
      <div className="absolute inset-0 bg-background/85" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-accent/4 via-background to-background pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {/* Brand */}
          <div className="md:col-span-2 space-y-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 bg-foreground text-background rounded-md flex items-center justify-center font-bold text-sm transition-transform duration-300 group-hover:scale-105">
                S
              </div>
              <span className="text-lg font-bold font-serif tracking-tight">
                StudioX
              </span>
            </Link>

            <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
              AI tools for modern creators. Build, remix, and inspire.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="mb-3 text-[10px] uppercase tracking-widest text-foreground/50 font-semibold">
              Platform
            </h3>
            <ul className="space-y-1.5">
              {["Features", "Marketplace", "Community", "Pricing"].map(item => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="text-xs text-muted-foreground hover:text-accent transition-all duration-200 hover:translate-x-0.5 inline-block"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="mb-3 text-[10px] uppercase tracking-widest text-foreground/50 font-semibold">
              Connect
            </h3>
            <ul className="space-y-1.5">
              {["Twitter", "GitHub", "Discord", "Instagram"].map(item => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-xs text-muted-foreground hover:text-accent transition-all duration-200 hover:translate-x-0.5 inline-block"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-muted-foreground/60">
          <p>© {new Date().getFullYear()} StudioX Inc.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}