import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"

interface TypewriterProps {
    text: string
    className?: string
    cursorClassName?: string
    wrapperClassName?: string
    delay?: number
    speed?: number
    loop?: boolean
    deleteSpeed?: number
    cursorChar?: string
    startOnView?: boolean
}

export function Typewriter({
    text,
    className,
    cursorClassName,
    wrapperClassName,
    delay = 0,
    speed = 50,
    loop = false,
    deleteSpeed = 30,
    cursorChar = "|",
    startOnView = false,
}: TypewriterProps) {
    const [displayedText, setDisplayedText] = useState("")
    const [isDeleting, setIsDeleting] = useState(false)
    const [started, setStarted] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!startOnView) {
            const startTimeout = setTimeout(() => {
                setStarted(true)
            }, delay)
            return () => clearTimeout(startTimeout)
        }

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                const startTimeout = setTimeout(() => {
                    setStarted(true)
                }, delay)
                observer.disconnect()
            }
        }, { threshold: 0.1 })

        if (containerRef.current) {
            observer.observe(containerRef.current)
        }

        return () => observer.disconnect()
    }, [delay, startOnView])

    useEffect(() => {
        if (!started) return

        let timeout: NodeJS.Timeout

        const tick = () => {
            const currentText = displayedText
            const isComplete = currentText === text
            const isEmpty = currentText === ""

            if (!isDeleting && !isComplete) {
                // Typing
                setDisplayedText(text.substring(0, currentText.length + 1))
                timeout = setTimeout(tick, speed + Math.random() * 20) // Add slight randomness
            } else if (!isDeleting && isComplete) {
                // Finished typing
                if (loop) {
                    timeout = setTimeout(() => setIsDeleting(true), 2000) // Wait before deleting
                }
            } else if (isDeleting && !isEmpty) {
                // Deleting
                setDisplayedText(text.substring(0, currentText.length - 1))
                timeout = setTimeout(tick, deleteSpeed)
            } else if (isDeleting && isEmpty) {
                // Finished deleting
                setIsDeleting(false)
                timeout = setTimeout(tick, 500) // Wait before re-typing
            }
        }

        timeout = setTimeout(tick, speed)

        return () => clearTimeout(timeout)
    }, [displayedText, isDeleting, started, loop, speed, deleteSpeed, text])

    return (
        <div ref={containerRef} className={cn("inline-block", wrapperClassName)}>
            <span className={cn("", className)}>{displayedText}</span>
            <span
                className={cn(
                    "animate-pulse ml-0.5 inline-block h-[1em] w-[2px] bg-primary align-middle",
                    cursorClassName
                )}
            >
                {/* Or use cursorChar if preferred, but CSS line is often cleaner */}
                {/* {cursorChar} */}
            </span>
        </div>
    )
}
