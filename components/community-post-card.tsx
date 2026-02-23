"use client"

import { Button } from "@/components/ui/button"
import type { CommunityPost } from "@/lib/types"
import { Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useState, useRef, useEffect, useCallback, memo } from "react"

interface CommunityPostCardProps {
  post: CommunityPost
  index: number
}

export const CommunityPostCard = memo(function CommunityPostCard({ post, index }: CommunityPostCardProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [isLiked, setIsLiked] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
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

  return (
    <div ref={cardRef}>
      <Link
        href={`/community/${post.id}`}
        className={`group relative block w-full rounded-xl overflow-hidden bg-[#111] border border-white/5 cursor-pointer ${aspectClass} hover:shadow-2xl hover:-translate-y-1 transition-transform duration-500 will-change-transform`}
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
    </div>
  )
})
