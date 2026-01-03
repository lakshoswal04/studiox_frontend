"use client"

import { Suspense } from "react"
import { Footer } from "@/components/footer"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { MarketplaceSection } from "@/components/marketplace-section"
import { CommunitySection } from "@/components/community-section"
import { CTASection } from "@/components/cta-section"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

function ExplorePage() {
  return (
    <Suspense fallback={null}>
      <main className="min-h-screen bg-background font-sans selection:bg-accent/30">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <MarketplaceSection />
        <CommunitySection />
        <CTASection />
      </main>
    </Suspense>
  )
}

export default ExplorePage
