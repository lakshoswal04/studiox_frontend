"use client"

import { Suspense, useState, useEffect, useRef } from "react"
import { CreationCard } from "@/components/creation-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Grid3x3, List } from "lucide-react"
import { gsap } from "gsap"
import type { Creation } from "@/lib/types"

const mockCreations: Creation[] = [
  {
    id: "1",
    appId: "text-to-image",
    appName: "Cyberpunk Landscape",
    status: "completed",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "2",
    appId: "video-upscaler",
    appName: "4K Upscaled Video",
    status: "completed",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "3",
    appId: "code-generator",
    appName: "React Component",
    status: "completed",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: "4",
    appId: "remove-background",
    appName: "Product Photo",
    status: "draft",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  {
    id: "5",
    appId: "music-composer",
    appName: "Lo-Fi Beat",
    status: "generating",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
  },
  {
    id: "6",
    appId: "voice-cloner",
    appName: "Podcast Intro",
    status: "completed",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
  },
  {
    id: "7",
    appId: "face-swap",
    appName: "Comedy Video",
    status: "completed",
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
  },
  {
    id: "8",
    appId: "text-to-image",
    appName: "Fantasy Portrait",
    status: "draft",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  },
]

function CreationsContent() {
  const [layout, setLayout] = useState<"grid" | "list">("grid")
  const [search, setSearch] = useState("")
  const gridRef = useRef<HTMLDivElement>(null)

  const filteredCreations = mockCreations.filter((creation) =>
    creation.appName.toLowerCase().includes(search.toLowerCase()),
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (mediaQuery.matches) return

    const ctx = gsap.context(() => {
      gsap.from(".creation-item", {
        y: 20,
        duration: 0.4,
        stagger: 0.04,
        ease: "power2.out",
      })
    }, gridRef)

    return () => ctx.revert()
  }, [layout, search])

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">My Creations</h1>
              <p className="text-muted-foreground">Manage and view all your generated creations</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative flex-1 max-w-md w-full">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search creations..."
                  className="pl-11 h-11 bg-card border-border rounded-xl"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant={layout === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setLayout("grid")}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={layout === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setLayout("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Creations Grid/List */}
      <section ref={gridRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12 bg-background">
        {filteredCreations.length > 0 ? (
          <div className={layout === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" : "space-y-3"}>
            {filteredCreations.map((creation) => (
              <div key={creation.id} className="creation-item">
                <CreationCard creation={creation} layout={layout} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-muted-foreground mb-6">No creations found</p>
            <Button variant="outline" asChild>
              <a href="/studio">Create Something New</a>
            </Button>
          </div>
        )}
      </section>
    </main>
  )
}

export default function CreationsPage() {
  return (
    <Suspense fallback={null}>
      <CreationsContent />
    </Suspense>
  )
}
