"use client"

import { useParams } from "next/navigation"
import { ArrowLeft, MoreHorizontal, Heart, Share2, Sparkles, Link as LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { communityPosts } from "@/lib/community-data"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useState, useCallback } from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

export default function PostDetailPage() {
    const params = useParams()
    const postId = params.postId as string
    const post = communityPosts.find(p => p.id === postId)
    const [isLiked, setIsLiked] = useState(false)
    const { user } = useAuth()
    const router = useRouter()

    const handleShare = useCallback((platform: string) => {
        const url = encodeURIComponent(window.location.href)
        const title = encodeURIComponent(post?.title || "Check this out on StudioX")

        let shareUrl = ""

        switch (platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`
                break
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
                break
            case 'reddit':
                shareUrl = `https://www.reddit.com/submit?url=${url}&title=${title}`
                break
            case 'copy':
                navigator.clipboard.writeText(window.location.href)
                toast.success("Link copied to clipboard!")
                return
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400')
        }
    }, [post?.title])

    // Fallback if not found
    if (!post) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#020202] text-white">
                <div className="text-center">
                    <h2 className="text-2xl font-bold">Post not found</h2>
                    <Button asChild className="mt-4" variant="outline">
                        <Link href="/community">Return to Community</Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-[#020202] text-white selection:bg-purple-500/30">

            {/* Navbar Overlay */}
            <nav className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-between p-4 md:p-6 pointer-events-none">
                <a
                    href="/community"
                    className="pointer-events-auto inline-flex items-center justify-center h-11 w-11 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 backdrop-blur-md text-white shadow-xl transition-colors duration-200 z-[9999]"
                >
                    <ArrowLeft className="h-5 w-5" />
                </a>
                <div className="pointer-events-auto z-[9999]">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full bg-black/60 hover:bg-black/80 border border-white/20 backdrop-blur-md h-11 w-11 text-white">
                                <MoreHorizontal className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#111] border-white/10 text-white">
                            <DropdownMenuItem onClick={() => alert('Reported')}>Report Post</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </nav>

            <div className="flex flex-col lg:flex-row h-full">
                {/* Left/Top: Image Content */}
                <div className="relative w-full lg:h-screen bg-[#0b0b0b] flex items-center justify-center overflow-hidden">
                    {/* Blurry Background */}
                    <div className="absolute inset-0 opacity-30 scale-110 pointer-events-none">
                        {post.thumbnailUrl.endsWith('.mp4') ? (
                            <video
                                src={post.thumbnailUrl}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover blur-2xl"
                            />
                        ) : (
                            <Image
                                src={post.thumbnailUrl}
                                alt=""
                                fill
                                className="object-cover blur-2xl"
                                loading="lazy"
                                sizes="100vw"
                            />
                        )}
                    </div>

                    {/* Main Content */}
                    <div className="relative w-full h-[60vh] lg:h-[85vh] max-w-[90%] lg:max-w-4xl shadow-2xl overflow-hidden rounded-xl">
                        {post.type === "video" ? (
                            <video
                                src={post.assetUrl}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover drop-shadow-2xl scale-[1.25]"
                            />
                        ) : (
                            <Image
                                src={post.assetUrl}
                                alt={post.title}
                                fill
                                className="object-cover drop-shadow-2xl scale-[1.25]"
                                priority
                            />
                        )}
                    </div>
                </div>

                {/* Right/Bottom: Sidebar */}
                <div className="w-full lg:w-[450px] bg-[#09090b] border-l border-white/5 overflow-y-auto lg:h-screen p-6 lg:p-8 flex flex-col pt-20 lg:pt-8 z-10 shadow-2xl lg:shadow-none">

                    {/* Author */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10">
                            <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" sizes="40px" />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-white">{post.author.name}</h3>
                            <p className="text-xs text-zinc-500">Creator</p>
                        </div>
                        <div className="ml-auto">
                            <Button
                                size="sm"
                                variant="outline"
                                className="rounded-full h-8 text-xs border-white/10 bg-white/5 hover:bg-white/10"
                            >
                                Follow
                            </Button>
                        </div>
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-4 mb-8">
                        <h1 className="text-3xl font-light text-white leading-tight">{post.title}</h1>
                        <p className="text-zinc-400 font-light leading-relaxed">
                            {post.description}
                        </p>
                    </div>

                    {/* Actions Bar */}
                    <div className="flex items-center gap-3 mb-8">
                        <Button
                            variant="outline"
                            className={`flex-1 h-12 rounded-xl border-white/10 text-base transition-colors duration-200 ${isLiked ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-white/5 hover:bg-white/10'}`}
                            onClick={() => setIsLiked(!isLiked)}
                        >
                            <Heart className={`h-5 w-5 mr-2 ${isLiked ? "fill-current" : ""}`} />
                            {post.likes + (isLiked ? 1 : 0)}
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="flex-1 h-12 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-base">
                                    <Share2 className="h-5 w-5 mr-2" />
                                    Share
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="p-2 w-56 bg-[#111] border-white/10 rounded-xl" align="center">
                                <DropdownMenuItem onClick={() => handleShare('twitter')} className="cursor-pointer text-zinc-300 hover:text-white focus:bg-white/10 rounded-lg py-2.5 flex items-center gap-3">
                                    <div className="relative w-4 h-4">
                                        <Image src="/assets/twitter.svg" alt="X" fill className="object-contain invert" />
                                    </div>
                                    Twitter / X
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleShare('facebook')} className="cursor-pointer text-zinc-300 hover:text-white focus:bg-white/10 rounded-lg py-2.5 flex items-center gap-3">
                                    <div className="relative w-4 h-4">
                                        <Image src="/assets/facebook.svg" alt="Facebook" fill className="object-contain" />
                                    </div>
                                    Facebook
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleShare('reddit')} className="cursor-pointer text-zinc-300 hover:text-white focus:bg-white/10 rounded-lg py-2.5 flex items-center gap-3">
                                    <div className="relative w-4 h-4 scale-125">
                                        <Image src="/assets/reddit.svg" alt="Reddit" fill className="object-contain" />
                                    </div>
                                    Reddit
                                </DropdownMenuItem>
                                <div className="h-[1px] bg-white/5 my-1" />
                                <DropdownMenuItem onClick={() => handleShare('copy')} className="cursor-pointer text-zinc-300 hover:text-white focus:bg-white/10 rounded-lg py-2.5 flex items-center gap-3">
                                    <LinkIcon className="h-4 w-4" /> Copy Link
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Remix CTA */}
                    {post.allowRemix && (
                        <div className="mb-8 p-1 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                            <div className="bg-[#0f0f11] rounded-[14px] p-5 text-center">
                                <div className="mb-3 flex justify-center text-purple-400">
                                    <Sparkles className="h-8 w-8" />
                                </div>
                                <h3 className="text-lg font-medium text-white mb-1">Remix this style</h3>
                                <p className="text-zinc-400 text-sm mb-4">
                                    Use this generation as a starting point for your own creation.
                                </p>
                                <Button
                                    className="w-full bg-white text-black hover:bg-zinc-200 rounded-xl h-12 text-base font-medium font-sans"
                                    onClick={() => {
                                        if (!user) {
                                            const target = `/studio?mode=${post.type}&prompt=${encodeURIComponent(post.prompt)}`
                                            router.push(`/login?redirect=${encodeURIComponent(target)}`)
                                        } else {
                                            router.push(`/studio?mode=${post.type}&prompt=${encodeURIComponent(post.prompt)}`)
                                        }
                                    }}
                                >
                                    Start Remixing
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Tags */}
                    <div className="mt-auto">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-3">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => router.push(`/community?tag=${tag}`)}
                                    className="px-3 py-1.5 rounded-md bg-white/5 border border-white/5 text-xs text-zinc-400 hover:bg-white/10 hover:text-zinc-200 transition-colors duration-200 cursor-pointer"
                                >
                                    #{tag}
                                </button>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </main>
    )
}
