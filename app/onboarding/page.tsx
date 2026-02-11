"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, Check, Sparkles } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// --- Configuration ---

const NEON_LIME = "#ccff00";

const onboardingSteps = [
    {
        id: "usage",
        question: "How do you plan to use StudioX?",
        subtitle: "We'll tailor your workspace to your goals.",
        options: [
            { id: "marketing", label: "Marketing & Ads", icon: "📢" },
            { id: "filmmaking", label: "Filmmaking & Art", icon: "🎬" },
            { id: "social", label: "Social Media Growth", icon: "📈" },
            { id: "personal", label: "Personal Projects", icon: "🎨" },
        ],
        media: {
            type: "video",
            src: "/gallerysignup/video.mp4",
            overlayPoints: ["Viral Content", "High Engagement", "Brand Storytelling"]
        },
    },
    {
        id: "experience",
        question: "What's your experience level with AI?",
        subtitle: "We'll adapt the interface complexity for you.",
        options: [
            { id: "beginner", label: "Beginner", desc: "I need simple templates." },
            { id: "intermediate", label: "Intermediate", desc: "I know the basics." },
            { id: "advanced", label: "Advanced", desc: "I want full control." },
            { id: "expert", label: "Expert", desc: "I'm a pro prompter." },
        ],
        media: {
            type: "video",
            src: "/gallerysignup/edit.mp4",
            overlayPoints: ["Smart Tools", "Precision Control", "Workflow Automation"]
        },
    },
    {
        id: "creation",
        question: "What do you want to create first?",
        subtitle: "Choose as many as you like.",
        multiSelect: true,
        options: [
            { id: "commercials", label: "Commercial Videos" },
            { id: "cinematic", label: "Cinematic Visuals" },
            { id: "avatars", label: "AI Avatars & Characters" },
            { id: "social_clips", label: "Viral Social Clips" },
        ],
        media: {
            type: "video",
            src: "/gallerysignup/character.mp4",
            overlayPoints: ["Character Consistency", "Lip Sync", "Emotion Control"]
        },
    },
    {
        id: "frustration",
        question: "What holds you back currently?",
        subtitle: "We've solved these pain points for you.",
        options: [
            { id: "consistency", label: "Inconsistent Results" },
            { id: "complexity", label: "Tools are too complex" },
            { id: "cost", label: "High production costs" },
            { id: "speed", label: "Rendering takes too long" },
        ],
        media: {
            type: "image",
            src: "/gallerysignup/image.png",
            overlayPoints: ["Perfect Consistency", "One-Click Magic", "Instant Preview"]
        },
    },
];

export default function OnboardingPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
    const [direction, setDirection] = useState(1);

    const stepData = onboardingSteps[currentStep];
    const isLastStep = currentStep === onboardingSteps.length - 1;

    // Auto-advance progress bar
    const progress = ((currentStep + 1) / onboardingSteps.length) * 100;

    const handleOptionSelect = (optionId: string) => {
        if (stepData.multiSelect) {
            const current = (answers[stepData.id] as string[]) || [];
            const updated = current.includes(optionId)
                ? current.filter((id) => id !== optionId)
                : [...current, optionId];
            setAnswers({ ...answers, [stepData.id]: updated });
        } else {
            setAnswers({ ...answers, [stepData.id]: optionId });
        }
    };

    const handleContinue = () => {
        if (isLastStep) {
            // Here we would typically save to backend
            console.log("Onboarding complete:", answers);
            router.push("/studio");
        } else {
            setDirection(1);
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setDirection(-1);
            setCurrentStep((prev) => prev - 1);
        }
    };

    const canContinue = !!answers[stepData.id] && (Array.isArray(answers[stepData.id]) ? answers[stepData.id].length > 0 : true);

    return (
        <div className="flex h-screen w-full bg-[#050505] text-white overflow-hidden font-sans selection:bg-[#ccff00]/30 selection:text-[#ccff00]">
            {/* Left Panel - Interaction */}
            <div className="w-full lg:w-[45%] flex flex-col justify-between p-8 md:p-12 lg:p-20 relative z-20">

                {/* Header / Nav */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {currentStep > 0 ? (
                            <button
                                onClick={handleBack}
                                className="group flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-white transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                Back
                            </button>
                        ) : (
                            <div className="w-16" /> // spacer
                        )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-600">
                            Step {currentStep + 1} / {onboardingSteps.length}
                        </div>
                        <div className="w-24 h-1 bg-zinc-900 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-[#ccff00]"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5, ease: "circOut" }}
                            />
                        </div>
                    </div>
                </div>

                {/* Question Area */}
                <div className="flex-1 flex flex-col justify-center py-10">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={currentStep}
                            custom={direction}
                            initial={{ opacity: 0, x: direction * 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: direction * -50 }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            className="space-y-8"
                        >
                            <div className="space-y-3">
                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1, duration: 0.5 }}
                                    className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]"
                                >
                                    {stepData.question}
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                    className="text-lg text-zinc-400 font-light"
                                >
                                    {stepData.subtitle}
                                </motion.p>
                            </div>

                            <div className={cn(
                                "grid gap-4",
                                stepData.options.length > 4 ? "grid-cols-2" : "grid-cols-1"
                            )}>
                                {stepData.options.map((option, idx) => {
                                    const isSelected = stepData.multiSelect
                                        ? (answers[stepData.id] as string[])?.includes(option.id)
                                        : answers[stepData.id] === option.id;

                                    return (
                                        <motion.button
                                            key={option.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 + (idx * 0.1), duration: 0.4 }}
                                            onClick={() => handleOptionSelect(option.id)}
                                            className={cn(
                                                "group relative w-full text-left p-5 rounded-2xl border transition-all duration-300",
                                                isSelected
                                                    ? "bg-[#ccff00]/5 border-[#ccff00] shadow-[0_0_30px_-5px_rgba(204,255,0,0.15)]"
                                                    : "bg-white/[0.03] border-white/5 hover:border-white/10 hover:bg-white/[0.05]"
                                            )}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    {'icon' in option && <span className="text-xl">{option.icon}</span>}
                                                    <div>
                                                        <div className={cn("font-medium text-lg transition-colors", isSelected ? "text-white" : "text-zinc-300 group-hover:text-white")}>
                                                            {option.label}
                                                        </div>
                                                        {'desc' in option && (
                                                            <div className="text-sm text-zinc-500 mt-0.5 group-hover:text-zinc-400 transition-colors">
                                                                {option.desc}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className={cn(
                                                    "w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300",
                                                    isSelected
                                                        ? "bg-[#ccff00] border-[#ccff00] scale-110"
                                                        : "border-white/10 group-hover:border-white/30"
                                                )}>
                                                    {isSelected && <Check className="w-3.5 h-3.5 text-black stroke-[3px]" />}
                                                </div>
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer / Continue */}
                <div className="pt-6">
                    <motion.button
                        onClick={handleContinue}
                        disabled={!canContinue}
                        className={cn(
                            "group relative w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold tracking-wide transition-all duration-300 overflow-hidden",
                            canContinue
                                ? "bg-[#ccff00] text-black shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:shadow-[0_0_30px_rgba(204,255,0,0.5)] hover:bg-[#d9ff33]"
                                : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                        )}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span className="relative z-10">{isLastStep ? "Launch Studio" : "Continue"}</span>
                        <div className={cn(
                            "absolute inset-0 bg-white/20 translate-y-full transition-transform duration-300",
                            canContinue && "group-hover:translate-y-0"
                        )} />
                        <ArrowRight className={cn(
                            "w-5 h-5 transition-transform duration-300",
                            canContinue && "group-hover:translate-x-1"
                        )} />
                    </motion.button>
                </div>

            </div>

            {/* Right Panel - Visual Gallery */}
            <div className="hidden lg:block relative w-[55%] h-full p-4 pl-0">
                <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden bg-zinc-900 border border-white/5 ring-1 ring-white/5">
                    <AnimatePresence mode="popLayout" custom={direction}>
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, scale: 1.1, filter: "blur(5px)" }} // Scale down slightly on exit maybe? No, scale up looks like moving in/out depth
                            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                            className="absolute inset-0 w-full h-full"
                        >
                            {stepData.media.type === 'video' ? (
                                <video
                                    src={stepData.media.src}
                                    muted
                                    autoPlay
                                    loop
                                    playsInline
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="relative w-full h-full">
                                    <Image
                                        src={stepData.media.src}
                                        alt="Visual"
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                            )}

                            {/* Cinematic Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                            {/* Dynamic Floating Labels */}
                            <div className="absolute bottom-12 left-12 flex flex-wrap gap-3">
                                {stepData.media.overlayPoints?.map((point, idx) => (
                                    <motion.div
                                        key={point}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 + (idx * 0.2), duration: 0.5 }}
                                        className="px-4 py-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-md text-xs font-medium text-white/90 flex items-center gap-2"
                                    >
                                        <Sparkles className="w-3 h-3 text-[#ccff00]" />
                                        {point}
                                    </motion.div>
                                ))}
                            </div>

                        </motion.div>
                    </AnimatePresence>

                    {/* Persistent Noise/Grain Overlay */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('/noise.svg')]" />
                </div>
            </div>
        </div>
    );
}
