"use client"

import { CommunityPost } from "@/lib/types"
import { communityPosts as seedPosts } from "@/lib/community-data"

const STORAGE_KEY = "studiox_user_posts"

// ---- Helpers ----
function loadUserPosts(): CommunityPost[] {
    if (typeof window === "undefined") return []
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return []
        const parsed = JSON.parse(raw) as any[]
        return parsed.map((p) => ({
            ...p,
            createdAt: new Date(p.createdAt),
        }))
    } catch {
        return []
    }
}

function saveUserPosts(posts: CommunityPost[]) {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
}

// ---- Event system for reactivity ----
type Listener = () => void
const listeners = new Set<Listener>()

export function subscribeCommunityStore(listener: Listener) {
    listeners.add(listener)
    return () => { listeners.delete(listener) }
}

function notifyListeners() {
    listeners.forEach((l) => l())
}

// ---- Public API ----

/** Get all posts: seed data + user-generated (newest first) */
export function getAllPosts(): CommunityPost[] {
    const userPosts = loadUserPosts()
    return [...userPosts, ...seedPosts]
}

/** Find a single post by ID */
export function getPostById(id: string): CommunityPost | undefined {
    return getAllPosts().find((p) => p.id === id)
}

/** Publish a new user-generated post */
export function publishPost(post: CommunityPost) {
    const userPosts = loadUserPosts()
    userPosts.unshift(post)
    saveUserPosts(userPosts)
    notifyListeners()
}

/** Create a new remix post from a generation result */
export function createRemixPost(opts: {
    prompt: string
    type: "image" | "video"
    assetUrl: string
    parentAssetId?: string
    authorName?: string
}): CommunityPost {
    const id = `user-gen-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const post: CommunityPost = {
        id,
        type: opts.type,
        title: opts.prompt.slice(0, 60) + (opts.prompt.length > 60 ? "…" : ""),
        description: "Generated in StudioX",
        prompt: opts.prompt,
        author: {
            id: "current-user",
            name: opts.authorName || "You",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CurrentUser",
        },
        assetUrl: opts.assetUrl,
        thumbnailUrl: opts.assetUrl,
        aspectRatio: "landscape",
        likes: 0,
        views: 0,
        allowRemix: true,
        createdAt: new Date(),
        parentAssetId: opts.parentAssetId || undefined,
        remixSourceId: opts.parentAssetId || undefined,
        tags: ["generated", "remix"],
        model: "StudioX",
        preset: "Custom",
        quality: "4k",
        size: "1920x1080",
    }

    publishPost(post)
    return post
}
