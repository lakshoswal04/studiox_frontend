"use client"

import { Button } from "@/components/ui/button"
import { Check, Sparkles, ArrowRight } from "lucide-react"
import type { PricingPlan } from "@/lib/types"
import { motion, useMotionTemplate, useMotionValue } from "framer-motion"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api"

interface PricingCardProps {
  plan: PricingPlan
  index?: number
  billingCycle?: "monthly" | "yearly"
}

export function PricingCard({ plan, index = 0, billingCycle = "monthly" }: PricingCardProps) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const [loading, setLoading] = useState(false)

  const effectiveMonthlyPrice =
    billingCycle === "yearly"
      ? Math.round((plan.yearlyPrice / 12) * 100) / 100
      : plan.price
  const yearlySavings = plan.price * 12 - plan.yearlyPrice

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  const handlePurchase = async () => {
    if (loading) return
    setLoading(true)
    try {
      await api.adminCredits({
        amount: plan.credits,
        plan: plan.id,
        description: `Purchase of ${plan.name} plan`
      })
      alert(`Successfully purchased ${plan.name} plan!`)
    } catch (e) {
      console.error("Purchase failed:", e)
      alert("Purchase failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: "circOut" }}
      className={cn(
        "relative group rounded-2xl overflow-hidden transition-all duration-500",
        plan.popular
          ? "border border-cyan-400/40 shadow-[0_0_40px_-12px_rgba(6,182,212,0.25)] bg-[#0a1520]/90 scale-[1.03]"
          : "border border-white/[0.08] bg-[#0d1117]/70 hover:border-white/[0.15] hover:bg-[#0d1117]/90"
      )}
      onMouseMove={handleMouseMove}
    >
      {/* Spotlight hover effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              500px circle at ${mouseX}px ${mouseY}px,
              ${plan.popular ? 'rgba(6,182,212,0.08)' : 'rgba(255,255,255,0.04)'},
              transparent 80%
            )
          `,
        }}
      />

      {/* Content */}
      <div className="relative p-8 h-full flex flex-col">
        {/* Popular badge */}
        {plan.popular && (
          <div className="absolute top-0 right-0 p-4">
            <div className="bg-cyan-500/10 backdrop-blur-md border border-cyan-400/20 text-cyan-400 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              Most Popular
            </div>
          </div>
        )}

        {/* Plan name */}
        <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-[0.2em] mb-1">
          {plan.name}
        </h3>

        {/* Best for */}
        <p className="text-xs text-zinc-500 mb-6">{plan.bestFor}</p>

        {/* Price */}
        <div className="mb-2">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-white tracking-tight">
              ${billingCycle === "yearly" ? effectiveMonthlyPrice.toFixed(0) : plan.price}
            </span>
            {billingCycle === "yearly" && (
              <span className="text-lg text-zinc-500 line-through font-medium">
                ${plan.price}
              </span>
            )}
            <span className="text-zinc-500 text-sm font-medium">/Month</span>
          </div>
        </div>

        {/* Billing info */}
        {billingCycle === "yearly" ? (
          <div className="mb-6 space-y-1">
            <p className="text-xs text-zinc-500">
              Billed annually, total <span className="text-zinc-300">${plan.yearlyPrice.toLocaleString()}</span>/year
            </p>
            {yearlySavings > 0 && (
              <p className="text-xs text-emerald-400 font-medium">
                You save ${yearlySavings}/yr
              </p>
            )}
          </div>
        ) : (
          /* Credit/Top-up Box System */
          <div className="mb-6 relative mt-4">
            {/* Overlapping Badge */}
            <div className="absolute -top-3 left-4 z-10 flex items-center gap-2">
              <span className="text-[11px] text-cyan-400 bg-[#042021] border border-cyan-500/20 px-2.5 py-1 rounded-md font-medium">
                No reset · Rollover
              </span>
            </div>

            {/* Main Box containing both Monthly Credit and Top-up info */}
            <div className="pt-6 pb-4 px-4 rounded-xl bg-[#1a1f26] border border-white/[0.08] flex flex-col gap-4 transition-colors hover:bg-[#1a1f26]/80">
              {/* Monthly Credit info */}
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-zinc-300">Monthly Credit</span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-3xl font-bold text-white tracking-tight">{plan.credits.toLocaleString()}</span>
                  <span className="text-base font-medium text-zinc-300">Credits</span>
                </div>
              </div>

              <div className="h-px w-full bg-white/[0.06]" />

              {/* Next top-up info */}
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-zinc-400">Next top-up</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-xl font-bold text-white tracking-tight">$1=100</span>
                  <span className="text-sm font-medium text-zinc-400">Credits</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <Button
          onClick={handlePurchase}
          disabled={loading}
          className={cn(
            "w-full h-12 rounded-xl text-sm font-semibold transition-all duration-300 relative overflow-hidden mb-8",
            plan.popular
              ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 hover:scale-[1.02]"
              : "bg-gradient-to-r from-cyan-500/80 to-blue-600/80 hover:from-cyan-500 hover:to-blue-600 text-white hover:scale-[1.02]"
          )}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {loading ? "Processing..." : "Subscribe"}
            {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </span>
        </Button>

        {/* Divider */}
        <div className="border-t border-white/[0.06] mb-6" />

        {/* Features */}
        <div className="space-y-3.5 flex-grow">
          {plan.features.map((feature, i) => (
            <div key={i} className="flex items-start gap-3 text-sm">
              <div className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <span className="text-zinc-300 leading-tight">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
