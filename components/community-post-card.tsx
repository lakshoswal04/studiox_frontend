"use client"

import { Button } from "@/components/ui/button"
import type { CommunityPost } from "@/lib/types"
import { Heart, Info, ChevronUp, ChevronDown, RefreshCw, Film, Download, Maximize2, Pencil } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useState, useRef, useEffect, useCallback, memo } from "react"
import { toast } from "sonner"

interface CommunityPostCardProps {
  post: CommunityPost
  index: number
}

export const CommunityPostCard = memo(function CommunityPostCard({ post, index }: CommunityPostCardProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [isLiked, setIsLiked] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Use the aspect ratio defined in the data
  const aspectClass =
    post.aspectRatio === "portrait" ? "aspect-[3/4]" :
      post.aspectRatio === "square" ? "aspect-square" :
        "aspect-[4/3]";

  // IntersectionObserver: only play videos when visible
  useEffect(() => {
    const el = cardRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { rootMargin: "100px", threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Play/pause video based on visibility
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (isVisible) {
      video.play().catch(() => { /* autoplay blocked, ignore */ })
    } else {
      video.pause()
    }
  }, [isVisible])

  const handleRemix = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    if (!user) {
      const target = `/studio?mode=${post.type}&prompt=${encodeURIComponent(post.prompt)}`
      router.push(`/login?redirect=${encodeURIComponent(target)}`)
    } else {
      router.push(`/studio?mode=${post.type}&prompt=${encodeURIComponent(post.prompt)}`)
    }
  }, [user, post.type, post.prompt, router])

  const handleLike = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLiked(prev => !prev)
  }, [])

  const navigateToStudio = useCallback((mode: string, prompt: string) => {
    const target = `/studio?mode=${mode}&prompt=${encodeURIComponent(prompt)}&previewUrl=${encodeURIComponent(post.assetUrl)}`
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(target)}`)
    } else {
      router.push(target)
    }
  }, [user, post.assetUrl, router])

  const handleDownload = useCallback(async () => {
    try {
      toast.loading("Preparing download...", { id: `dl-${post.id}` })
      const res = await fetch(post.assetUrl)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      const ext = post.assetUrl.split('.').pop() || (post.type === "video" ? "mp4" : "png")
      a.href = url
      a.download = `${post.title.replace(/\s+/g, '_')}.${ext}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success("Download started!", { id: `dl-${post.id}` })
    } catch {
      toast.error("Download failed.", { id: `dl-${post.id}` })
    }
  }, [post.assetUrl, post.title, post.type, post.id])

  return (
    <div ref={cardRef} className="rounded-xl overflow-hidden bg-[#111] border border-white/5">
      {/* Image/Video - Clickable link to detail */}
      <Link
        href={`/community/${post.id}`}
        className={`group relative block w-full overflow-hidden cursor-pointer ${aspectClass} hover:shadow-2xl transition-all duration-500 will-change-transform`}
        prefetch={false}
      >
        {/* Media Layer */}
        <div className="absolute inset-0 overflow-hidden">
          {post.type === "video" ? (
            <video
              ref={videoRef}
              src={isVisible ? post.assetUrl : undefined}
              loop
              muted
              playsInline
              poster={post.thumbnailUrl}
              preload="none"
              className="object-cover w-full h-full absolute inset-0 scale-[1.25] will-change-transform"
            />
          ) : (
            <Image
              src={post.thumbnailUrl}
              alt={post.title}
              fill
              className="object-cover scale-[1.25]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
            />
          )}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

        {/* Top Overlay - Creator Chip */}
        <div className="absolute top-4 left-4 z-20 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 ease-out will-change-[transform,opacity]">
          <div className="bg-white/10 backdrop-blur-md rounded-full px-2 py-1 pr-3 border border-white/5 flex items-center gap-2">
            <div className="relative w-5 h-5 rounded-full overflow-hidden border border-white/10">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                fill
                className="object-cover"
                loading="lazy"
                sizes="20px"
              />
            </div>
            <span className="text-[10px] font-medium text-white/90 tracking-wide">{post.author.name}</span>
          </div>
        </div>

        {/* Center Interaction - Minimalist Remix */}
        {post.allowRemix && (
          <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white text-black hover:bg-neutral-200 hover:scale-105 transition-all w-24 h-9 rounded-full font-medium text-xs tracking-wide shadow-xl shadow-black/50"
              onClick={handleRemix}
            >
              Remix
            </Button>
          </div>
        )}

        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-300 will-change-transform">
          <div className="space-y-1.5">
            <h3 className="text-base font-medium text-white leading-snug tracking-tight truncate">
              {post.title}
            </h3>

            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[50%]">
                {post.tags[0]}
              </span>

              <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-75">
                <button
                  onClick={handleLike}
                  className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-white text-white" : ""}`} />
                  <span className="text-[10px] font-medium">{post.likes + (isLiked ? 1 : 0)}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Information Panel */}
      <div className="border-t border-white/5">
        {/* Header - Always Visible */}
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="w-full flex items-center justify-between px-4 py-3 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Info className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Information</span>
          </div>
          {showInfo ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>

        {/* Expandable Content */}
        {showInfo && (
          <>
            <div className="divide-y divide-white/5 border-t border-white/5">
              {post.model && (
                <div className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-xs text-zinc-500">Model</span>
                  <span className="text-xs font-medium text-white">{post.model}</span>
                </div>
              )}
              {post.preset && (
                <div className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-xs text-zinc-500">Preset</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium text-white">{post.preset}</span>
                    <div className="relative w-5 h-5 rounded-full overflow-hidden border border-white/10">
                      <Image src={post.author.avatar} alt="" fill className="object-cover" sizes="20px" />
                    </div>
                  </div>
                </div>
              )}
              {post.quality && (
                <div className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-xs text-zinc-500">Quality</span>
                  <span className="text-xs font-medium text-white">{post.quality}</span>
                </div>
              )}
              {post.size && (
                <div className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-xs text-zinc-500">Size</span>
                  <span className="text-xs font-medium text-white">{post.size}</span>
                </div>
              )}
              <div className="flex items-center justify-between px-4 py-2.5">
                <span className="text-xs text-zinc-500">Created</span>
                <span className="text-xs font-medium text-white">
                  {post.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-3 pt-2 space-y-2 border-t border-white/5">
              <Button
                className="w-full h-9 rounded-lg bg-[#c8ff00] hover:bg-[#b8ef00] text-black font-semibold text-xs transition-all duration-200"
                onClick={() => navigateToStudio(post.type, post.prompt)}
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                Recreate
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="h-8 rounded-lg border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 text-[11px]"
                  onClick={() => navigateToStudio("video", post.prompt)}
                >
                  <Film className="h-3 w-3 mr-1.5" />
                  Video
                </Button>
                <Button
                  variant="outline"
                  className="h-8 rounded-lg border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 text-[11px]"
                  onClick={handleDownload}
                >
                  <Download className="h-3 w-3 mr-1.5" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  className="h-8 rounded-lg border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 text-[11px]"
                  onClick={() => {
                    const upscalePrompt = `${post.prompt}, ultra high resolution 8k upscale, enhanced details, maximum quality`
                    navigateToStudio(post.type, upscalePrompt)
                  }}
                >
                  <Maximize2 className="h-3 w-3 mr-1.5" />
                  Upscale
                </Button>
                <Button
                  variant="outline"
                  className="h-8 rounded-lg border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 text-[11px]"
                  onClick={() => navigateToStudio(post.type, post.prompt)}
                >
                  <Pencil className="h-3 w-3 mr-1.5" />
                  Edit
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
})
