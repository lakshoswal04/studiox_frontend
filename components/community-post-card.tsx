"use client"

import { Button } from "@/components/ui/button"
import type { Recipe } from "@/lib/types"
import { Heart, Share2, Sparkles, Zap, Play } from "lucide-react"
import Image from "next/image"
import { useState, useRef, useEffect } from "react"

interface CommunityPostCardProps {
  post: Recipe
  index: number
}

export function CommunityPostCard({ post, index }: CommunityPostCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Subtle randomized aspect ratios for a "tamed" look
  const aspectClass =
    index % 4 === 0 ? "aspect-[3/4]" :
      index % 4 === 1 ? "aspect-square" :
        index % 4 === 2 ? "aspect-[4/3]" :
          "aspect-[3/4]"; // biased towards portrait for elegance

  const handleMouseEnter = () => {
    if (post.videoUrl && videoRef.current) {
      setIsPlaying(true)
      videoRef.current.play().catch(e => console.log("Autoplay prevented", e))
    }
  }

  const handleMouseLeave = () => {
    if (post.videoUrl && videoRef.current) {
      setIsPlaying(false)
      videoRef.current.pause()
      videoRef.current.currentTime = 0;
    }
  }

  return (
    <div
      className={`group relative rounded-xl overflow-hidden bg-[#111] border border-white/5 cursor-pointer ${aspectClass} transition-transform duration-700 hover:shadow-2xl`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >

      {/* Media Layer */}
      {post.videoUrl ? (
        <>
          <video
            ref={videoRef}
            src={post.videoUrl}
            loop
            muted
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isPlaying ? "opacity-100" : "opacity-0"}`}
          />
          {/* Thumbnail Fallback */}
          <div className={`absolute inset-0 transition-opacity duration-500 ${isPlaying ? "opacity-0" : "opacity-100"}`}>
            {post.imageUrl && (
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-80 group-hover:opacity-0 transition-opacity duration-300">
                <Play className="w-4 h-4 fill-white text-white ml-0.5" />
              </div>
            </div>
          </div>
        </>
      ) : post.imageUrl ? (
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-[2s] ease-in-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      ) : (
        <div className="absolute inset-0 bg-neutral-900" />
      )}

      {/* Classy Gradient Overlay - Always present but subtle */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

      {/* Top Overlay - Creator Chip */}
      <div className="absolute top-4 left-4 z-20 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
        <div className="bg-white/10 backdrop-blur-md rounded-full px-2 py-1 pr-3 border border-white/5 flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-neutral-800 flex items-center justify-center text-[9px] font-bold text-white uppercase border border-white/10">
            {post.creatorAvatar || post.creator.substring(0, 2)}
          </div>
          <span className="text-[10px] font-medium text-white/90 tracking-wide">{post.creator}</span>
        </div>
      </div>

      {/* Center Interaction - Minimalist Remix */}
      <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
        <Button size="sm" className="bg-white text-black hover:bg-neutral-200 hover:scale-105 transition-all w-24 h-9 rounded-full font-medium text-xs tracking-wide shadow-xl shadow-black/50">
          Remix
        </Button>
      </div>


      {/* Bottom Content - Tamed Typography */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
        <div className="space-y-1.5">
          <h3 className="text-base font-medium text-white leading-snug tracking-tight">
            {post.title}
          </h3>

          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium">
              {post.appId.replace(/-/g, ' ')}
            </span>

            <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
              <button
                onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-white text-white" : ""}`} />
              </button>
              <div className="flex items-center gap-1 text-[10px] text-neutral-500">
                <Sparkles className="w-3 h-3" />
                <span>{post.creditsUsed}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
