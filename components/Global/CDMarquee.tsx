import { useEffect, useRef, useState } from "react"

interface CDMarqueeProps {
    children: React.ReactNode
    speed?: number // pixels per second
}

export function CDMarquee({ children, speed = 50 }: CDMarqueeProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const [isOverflowing, setIsOverflowing] = useState(false)
    const animationFrameRef = useRef<number>(null)
    const scrollPositionRef = useRef(0)
    const lastTimeRef = useRef<number>(null)
    const directionRef = useRef<1 | -1>(1) // 1 for forward, -1 for backward
    const pauseUntilRef = useRef<number | null>(null)

    useEffect(() => {
        const container = containerRef.current
        const content = contentRef.current
        if (!container || !content) return

        // Check if content overflows
        const checkOverflow = () => {
            const isNowOverflowing = content.scrollWidth > container.clientWidth
            setIsOverflowing(isNowOverflowing)
            if (!isNowOverflowing) {
                scrollPositionRef.current = 0
                container.scrollLeft = 0
            }
        }

        checkOverflow()

        const resizeObserver = new ResizeObserver(checkOverflow)
        resizeObserver.observe(container)
        resizeObserver.observe(content)

        return () => {
            resizeObserver.disconnect()
        }
    }, [children])

    useEffect(() => {
        if (!isOverflowing) return

        const container = containerRef.current
        const content = contentRef.current
        if (!container || !content) return

        const maxScroll = content.scrollWidth - container.clientWidth

        const animate = (timestamp: number) => {
            if (lastTimeRef.current === null) {
                lastTimeRef.current = timestamp
            }

            // Check if we are in pause state
            if (pauseUntilRef.current !== null) {
                if (timestamp < pauseUntilRef.current) {
                    lastTimeRef.current = timestamp
                    animationFrameRef.current = requestAnimationFrame(animate)
                    return
                }
                // Pause ended, reverse direction
                pauseUntilRef.current = null
                directionRef.current *= -1 as 1 | -1
            }

            const deltaTime = (timestamp - lastTimeRef.current) / 1000 // Convert to seconds
            lastTimeRef.current = timestamp

            scrollPositionRef.current += speed * deltaTime * directionRef.current

            // Check boundaries and pause if reached
            if (scrollPositionRef.current >= maxScroll) {
                scrollPositionRef.current = maxScroll
                pauseUntilRef.current = timestamp + 2000 // Pause for 2 seconds
            } else if (scrollPositionRef.current <= 0) {
                scrollPositionRef.current = 0
                pauseUntilRef.current = timestamp + 2000 // Pause for 2 seconds
            }

            container.scrollLeft = scrollPositionRef.current

            animationFrameRef.current = requestAnimationFrame(animate)
        }

        animationFrameRef.current = requestAnimationFrame(animate)

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }
            lastTimeRef.current = null
            pauseUntilRef.current = null
            directionRef.current = 1
        }
    }, [isOverflowing, speed])

    return (
        <div className="cd-marquee-wrapper">
            <div
                className="cd-marquee"
                ref={containerRef}
                style={{
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                }}
            >
                <div className="cd-marquee-content-inner" ref={contentRef} style={{ display: "inline-block" }}>
                    {children}
                </div>
            </div>
        </div>
    )
}
