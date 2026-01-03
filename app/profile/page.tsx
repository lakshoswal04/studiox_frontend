"use client"

import { Suspense, useEffect, useRef, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { AnimatePresence, motion } from "framer-motion"
import { gsap } from "gsap"
import {
  Zap,
  TrendingUp,
  Share2,
  ExternalLink,
  ImageIcon,
  Settings,
  Grid,
  Heart,
  MoreHorizontal,
  Edit,
  Shield,
  Bell,
  Mail
} from "lucide-react"
import { cn } from "@/lib/utils"

// --- Mock Data ---
const userData = {
  username: "alexstudio",
  displayName: "Alex Creator",
  email: "alex@studioxai.com",
  avatar: "/diverse-user-avatars.png",
  credits: 450,
  bio: "Digital artist & AI enthusiast. Exploring the boundaries of generative creativity.",
  stats: {
    totalGenerations: 127,
    totalRemixes: 43,
    publicCreations: 28,
    creditsSpent: 1250,
  },
  savedRecipes: [
    { id: "1", appName: "Text to Image", previewUrl: "/ai-art.jpg", remixCount: 12, likes: 24, date: "2 days ago" },
    { id: "2", appName: "Video Upscaler", previewUrl: "/video-upscale.jpg", remixCount: 8, likes: 15, date: "5 days ago" },
    { id: "3", appName: "Voice Cloner", previewUrl: "/voice-audio.jpg", remixCount: 5, likes: 42, date: "1 week ago" },
    { id: "4", appName: "3D Model Generator", previewUrl: "/abstract-3d-model.png", remixCount: 15, likes: 9, date: "2 weeks ago" },
    { id: "5", appName: "Music Gen", previewUrl: "/placeholder.svg", remixCount: 3, likes: 11, date: "2 weeks ago" },
    { id: "6", appName: "Avatar Creator", previewUrl: "/placeholder.svg", remixCount: 22, likes: 56, date: "3 weeks ago" },
  ],
}

// --- Components ---

import { CreationsTab } from "@/components/profile/creations-tab"
import { CreationCard } from "@/components/profile/creation-card" // Import CreationCard for Overview tab

function StatCard({ icon: Icon, label, value, delay }: { icon: any, label: string, value: number, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 backdrop-blur-xl transition-all duration-500 hover:border-purple-500/30 hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.15)] hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400 group-hover:text-purple-300 transition-colors">{label}</p>
            <h3 className="mt-2 text-3xl font-bold text-white tracking-tight tabular-nums">{value.toLocaleString()}</h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-purple-400 ring-1 ring-white/10 transition-all duration-500 group-hover:scale-110 group-hover:bg-purple-500 group-hover:text-white group-hover:ring-purple-400/50">
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function SettingsField({ label, description, children, icon: Icon }: { label: string, description: string, children: React.ReactNode, icon: any }) {
  return (
    <div className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl transition-colors hover:bg-white/5 border border-transparent hover:border-white/5">
      <div className="flex gap-4">
        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-purple-400 group-hover:bg-purple-500/10 transition-colors">
          <Icon className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <Label className="text-base font-medium text-slate-200">{label}</Label>
          <p className="text-sm text-slate-500 max-w-sm leading-relaxed">{description}</p>
        </div>
      </div>
      <div className="pl-14 sm:pl-0">
        {children}
      </div>
    </div>
  )
}

function ProfileContent() {
  const [activeTab, setActiveTab] = useState<"overview" | "creations" | "settings">("overview")
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".header-element", {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power4.out"
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  const tabs = [
    { id: "overview", label: "Overview", icon: Grid },
    { id: "creations", label: "Creations", icon: ImageIcon },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <main className="min-h-screen bg-[#050505] text-slate-200 selection:bg-purple-500/30 overflow-x-hidden">
      <div ref={containerRef} className="pb-20">

        {/* Cinematic Ambient Background */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-900/10 rounded-full blur-[150px] animate-pulse-slow" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[150px] animate-pulse-slow delay-1000" />
        </div>

        {/* Hero Banner */}
        <div className="h-[300px] md:h-[350px] w-full relative group z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/50 to-[#050505] z-10" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614850523060-8da1d56ae167?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-50 grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000 transform group-hover:scale-105" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-32">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-end gap-8 mb-12 header-element">
            <div className="relative group perspective-1000">
              <div className="h-32 w-32 md:h-40 md:w-40 rounded-full p-1.5 bg-[#050505] ring-2 ring-white/10 relative z-20 overflow-hidden transition-transform duration-500 group-hover:scale-105 group-hover:rotate-y-12">
                <Avatar className="h-full w-full">
                  <AvatarImage src={userData.avatar} className="object-cover" />
                  <AvatarFallback className="bg-slate-800 text-2xl">AC</AvatarFallback>
                </Avatar>
              </div>
              {/* Glow effect behind avatar */}
              <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl scale-90 -z-10 group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute bottom-4 right-4 h-5 w-5 bg-emerald-500 rounded-full border-4 border-[#050505] z-30 ring-2 ring-emerald-500/20" />
            </div>

            <div className="flex-1 space-y-3 mb-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">{userData.displayName}</h1>
                <Badge variant="outline" className="border-purple-500/30 bg-purple-500/10 text-purple-400 px-3 py-1 text-xs tracking-wider uppercase backdrop-blur-md">
                  Pro Creator
                </Badge>
              </div>
              <p className="text-lg text-purple-200/60 font-medium">@{userData.username}</p>
              <p className="text-slate-400 max-w-xl leading-relaxed text-sm md:text-base">{userData.bio}</p>
            </div>

            <div className="flex items-center gap-3 mb-2 w-full md:w-auto">
              <Button className="flex-1 md:flex-none bg-white text-black hover:bg-purple-50 hover:scale-105 transition-all duration-300 font-medium px-6">
                Follow
              </Button>
              <Button variant="outline" className="flex-1 md:flex-none border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white backdrop-blur-md transition-all duration-300">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="outline" className="flex-1 md:flex-none border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white backdrop-blur-md transition-all duration-300">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Cinematic Floating Tabs */}
          <div className="flex justify-center mb-12 header-element">
            <div className="flex p-1.5 bg-white/5 backdrop-blur-2xl rounded-full border border-white/5 shadow-2xl shadow-black/50 overflow-hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "relative px-6 py-2.5 rounded-full text-sm font-medium transition-colors duration-300 flex items-center gap-2 z-10",
                    activeTab === tab.id ? "text-white" : "text-slate-400 hover:text-slate-200"
                  )}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTabPill"
                      className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-[0_0_20px_rgba(124,58,237,0.4)]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <tab.icon className={cn("w-4 h-4", activeTab === tab.id && "animate-pulse")} />
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Area with smooth transitions */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              transition={{ duration: 0.4, ease: "circOut" }}
              className="min-h-[500px]"
            >
              {activeTab === "overview" && (
                <div className="space-y-10">
                  {/* Stats */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <TrendingUp className="text-purple-500" /> Analytics
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <StatCard icon={TrendingUp} label="Total Generations" value={userData.stats.totalGenerations} delay={0} />
                      <StatCard icon={Share2} label="Total Remixes" value={userData.stats.totalRemixes} delay={0.1} />
                      <StatCard icon={Heart} label="Total Likes" value={1432} delay={0.2} />
                      <StatCard icon={Zap} label="Credits Available" value={userData.credits} delay={0.3} />
                    </div>
                  </div>

                  {/* Featured */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Zap className="text-yellow-500" /> Recent Highlights
                      </h3>
                      <Button variant="ghost" className="text-sm text-purple-400 hover:text-purple-300 hover:bg-purple-500/10" onClick={() => setActiveTab('creations')}>
                        View All Creations
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                      {userData.savedRecipes.slice(0, 5).map((recipe, i) => (
                        <CreationCard key={recipe.id} item={recipe} index={i} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "creations" && (
                <CreationsTab items={userData.savedRecipes} />
              )}

              {activeTab === "settings" && (
                <div className="max-w-4xl mx-auto">
                  <div className="bg-[#0A0A0A] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
                    <div className="p-8 border-b border-white/5 bg-gradient-to-r from-white/5 to-transparent">
                      <h2 className="text-2xl font-bold text-white">Account Settings</h2>
                      <p className="text-slate-400 mt-1">Manage your profile preferences and security.</p>
                    </div>

                    <div className="p-2 space-y-2">
                      <SettingsField icon={Edit} label="Profile Information" description="Update your display name, bio, and avatar.">
                        <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white">Edit Profile</Button>
                      </SettingsField>

                      <SettingsField icon={Mail} label="Email Preferences" description="Manage your email notifications and subscriptions.">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Marketing</span>
                          <Switch className="data-[state=checked]:bg-purple-600" />
                        </div>
                      </SettingsField>

                      <SettingsField icon={Bell} label="Push Notifications" description="Receive real-time alerts about your creations.">
                        <Switch className="data-[state=checked]:bg-purple-600" defaultChecked />
                      </SettingsField>

                      <SettingsField icon={Shield} label="Privacy Mode" description="Hide your creations from public listings.">
                        <Switch className="data-[state=checked]:bg-purple-600" />
                      </SettingsField>

                      <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 flex items-center justify-between mt-4 mx-2 mb-2">
                        <div className="flex gap-4 items-center">
                          <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                            <Zap className="h-5 w-5 rotate-180" />
                          </div>
                          <div>
                            <h4 className="text-red-400 font-medium">Danger Zone</h4>
                            <p className="text-red-400/60 text-xs">Delete account and data</p>
                          </div>
                        </div>
                        <Button variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-500/10">Delete Account</Button>
                      </div>
                    </div>

                    <div className="bg-white/5 p-4 flex justify-end gap-3 border-t border-white/5">
                      <Button variant="ghost" className="text-slate-400 hover:text-white">Discard</Button>
                      <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-900/20">Save Changes</Button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

        </div>
      </div>
    </main>
  )
}

export default function ProfilePage() {
  return (
    <Suspense fallback={null}>
      <ProfileContent />
    </Suspense>
  )
}
