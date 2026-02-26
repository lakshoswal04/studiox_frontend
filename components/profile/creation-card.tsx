"use client"

import { motion } from "framer-motion"
import { Share2, Heart, MoreHorizontal, Clock, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CreationCardProps {
    item: {
        id: string
        appName: string
        previewUrl: string
        remixCount: number
        likes: number
        date: string
    }
    index: number
}

export function CreationCard({ item, index }: CreationCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.05, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="group relative"
        >
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-slate-900 ring-1 ring-white/10 transition-all duration-500 hover:ring-white/20 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]">
                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-40 z-10" />

                {/* Hover Gradient for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-10" />

                {/* Image */}
                <div className="h-full w-full overflow-hidden">
                    <img
                        src={item.previewUrl}
                        alt={item.appName}
                        className="h-full w-full object-cover transition-transform duration-700 will-change-transform group-hover:scale-105"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop";
                        }}
                    />
                </div>

                {/* Top Floating Actions */}
                <div className="absolute top-3 right-3 z-20 translate-y-[-10px] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-black/40 backdrop-blur-md hover:bg-white text-white hover:text-black border border-white/10 transition-colors">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </div>

                <div className="absolute top-3 left-3 z-20 translate-y-[-10px] opacity-0 transition-all duration-300 delay-75 group-hover:translate-y-0 group-hover:opacity-100">
                    <Badge variant="secondary" className="bg-black/40 backdrop-blur-md border border-white/10 text-white/90 hover:bg-black/60 font-normal">
                        <Sparkles className="w-3 h-3 mr-1 text-purple-400" />
                        Generated
                    </Badge>
                </div>

                {/* Bottom Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 z-20 translate-y-2 opacity-90 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-medium uppercase tracking-wider text-purple-200/80 flex items-center gap-1.5">
                            <Clock className="w-3 h-3" /> {item.date}
                        </span>
                    </div>

                    <h3 className="font-semibold text-lg text-white leading-tight mb-3 group-hover:text-purple-100 transition-colors">{item.appName}</h3>

                    <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-in-out">
                        <div className="overflow-hidden">
                            <div className="flex items-center justify-between border-t border-white/10 pt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                <div className="flex gap-4 text-xs font-medium text-slate-300">
                                    <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                                        <Share2 className="h-3.5 w-3.5" /> {item.remixCount} Remixes
                                    </span>
                                    <span className="flex items-center gap-1.5 hover:text-pink-400 transition-colors cursor-pointer">
                                        <Heart className="h-3.5 w-3.5" /> {item.likes}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
