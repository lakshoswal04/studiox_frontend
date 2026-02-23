"use client"

import { useEffect, useRef, useMemo } from "react"
import { gsap } from "gsap"
import { CommunityPostCard } from "@/components/community-post-card"
import { communityPosts } from "@/lib/community-data"
import { useSearchParams } from "next/navigation"

export function CommunityGrid() {
    const gridRef = useRef<HTMLDivElement>(null)
    const searchParams = useSearchParams()
    const hasAnimated = useRef(false)

    const tagFilter = searchParams.get("tag")

    const filteredPosts = useMemo(() => {
        if (!tagFilter) return communityPosts
        return communityPosts.filter(post =>
            post.tags.some(tag => tag.toLowerCase() === tagFilter.toLowerCase())
        )
    }, [tagFilter])

    useEffect(() => {
        if (hasAnimated.current) return
        hasAnimated.current = true

        const cards = gridRef.current?.querySelectorAll<HTMLElement>(".community-card-inner")
        if (!cards || cards.length === 0) return

        // Simple staggered fade-in using IntersectionObserver
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry, i) => {
                    if (entry.isIntersecting) {
                        const el = entry.target as HTMLElement
                        const delay = i * 0.04
                        gsap.to(el, {
                            opacity: 1,
                            y: 0,
                            duration: 0.35,
                            delay,
                            ease: "power2.out",
                        })
                        observer.unobserve(el)
                    }
                })
            },
            { rootMargin: "200px", threshold: 0.01 }
        )

        cards.forEach(card => observer.observe(card))

        return () => observer.disconnect()
    }, [filteredPosts])

    // Reset animation tracking when tag changes
    useEffect(() => {
        hasAnimated.current = false
    }, [tagFilter])

    if (filteredPosts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-xl font-medium text-white mb-2">No generations found</p>
                <p className="text-zinc-500">There are no posts with the tag &quot;#{tagFilter}&quot;.</p>
            </div>
        )
    }

    return (
        <div ref={gridRef} className="columns-1 sm:columns-2 lg:columns-3 2xl:columns-4 gap-6 space-y-6">
            {filteredPosts.map((post, index) => (
                <div
                    key={post.id}
                    className="break-inside-avoid mb-6"
                >
                    <div className="community-card-inner rounded-xl overflow-hidden block" style={{ opacity: 0, transform: 'translateY(20px)' }}>
                        <CommunityPostCard post={post} index={index} />
                    </div>
                </div>
            ))}
        </div>
    )
}
