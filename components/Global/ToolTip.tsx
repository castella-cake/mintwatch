import { createPortal } from "react-dom"
import { cloneElement, useId, type ReactElement, type ReactNode } from "react"
import { useTransitionState } from "react-transition-state"
import "./styleModules/ToolTip.css"

type ToolTipProps = {
    children: ReactElement
    label: ReactNode
    position?: "top" | "bottom"
    delay?: number
    disabled?: boolean
    gap?: number
}

export function ToolTip({ children, label, position = "bottom", delay = 500, disabled = false, gap = 8 }: ToolTipProps) {
    const wrapperRef = useRef<HTMLSpanElement>(null)
    const tooltipRef = useRef<HTMLDivElement>(null)
    const tooltipId = useId()
    const [isHovered, setIsHovered] = useState(false)
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null!)
    const updatePositionRef = useRef<() => void>(() => { })

    const [{ status, isMounted }, toggle] = useTransitionState({
        timeout: 150,
        mountOnEnter: true,
        unmountOnExit: true,
        preEnter: true,
        preExit: true,
    })

    const startHoverTimer = useCallback(() => {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => setIsHovered(true), delay)
    }, [delay])

    const showImmediately = useCallback(() => {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null!
        setIsHovered(true)
    }, [])

    const handleFocus = useCallback((event: React.FocusEvent<HTMLElement>) => {
        const target = event.target as HTMLElement | null
        if (target?.matches(":focus-visible")) showImmediately()
    }, [showImmediately])

    const cancelHover = useCallback(() => {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null!
        setIsHovered(false)
    }, [])

    useEffect(() => {
        return () => {
            clearTimeout(timeoutRef.current)
        }
    }, [])

    const updatePosition = useCallback(() => {
        const trigger = wrapperRef.current?.firstElementChild
        const tooltip = tooltipRef.current
        if (!trigger || !tooltip) return
        const rect = trigger.getBoundingClientRect()
        const viewportGap = 8
        const tooltipHeight = tooltip.offsetHeight
        const tooltipWidth = tooltip.offsetWidth

        let top: number
        if (position === "top") {
            top = rect.top - gap - tooltipHeight
            if (top < viewportGap) top = rect.bottom + gap
        } else {
            top = rect.bottom + gap
            if (top + tooltipHeight > window.innerHeight - viewportGap) top = rect.top - gap - tooltipHeight
        }
        if (top < viewportGap) top = viewportGap

        let left = rect.left + rect.width / 2
        const minLeft = tooltipWidth / 2 + viewportGap
        const maxLeft = window.innerWidth - tooltipWidth / 2 - viewportGap
        if (minLeft < maxLeft) {
            left = Math.min(Math.max(left, minLeft), maxLeft)
        }

        setTooltipPosition({ top, left })
    }, [position, gap])

    useEffect(() => {
        updatePositionRef.current = updatePosition
    }, [updatePosition])

    useEffect(() => {
        if (!isMounted) return
        updatePosition()
        let frame = 0
        const handleScrollOrResize = () => {
            if (frame) return
            frame = requestAnimationFrame(() => {
                frame = 0
                updatePositionRef.current()
            })
        }
        document.addEventListener("scroll", handleScrollOrResize, true)
        window.addEventListener("resize", handleScrollOrResize)
        return () => {
            if (frame) cancelAnimationFrame(frame)
            document.removeEventListener("scroll", handleScrollOrResize, true)
            window.removeEventListener("resize", handleScrollOrResize)
        }
    }, [isMounted, updatePosition])

    useEffect(() => {
        if (!isMounted) return
        const handleMouseMove = (event: MouseEvent) => {
            const trigger = wrapperRef.current?.firstElementChild
            if (!trigger) return
            const rect = trigger.getBoundingClientRect()
            const isInside = event.clientX >= rect.left
                && event.clientX <= rect.right
                && event.clientY >= rect.top
                && event.clientY <= rect.bottom
            if (!isInside) cancelHover()
        }
        document.addEventListener("mousemove", handleMouseMove)
        return () => {
            document.removeEventListener("mousemove", handleMouseMove)
        }
    }, [isMounted, cancelHover])

    useEffect(() => {
        toggle(isHovered && !disabled)
    }, [isHovered, disabled, toggle])

    const trigger = isMounted
        ? cloneElement<{ "aria-describedby"?: string }>(children as ReactElement<{ "aria-describedby"?: string }>, { "aria-describedby": tooltipId })
        : children

    return (
        <span
            ref={wrapperRef}
            className="tooltip-wrapper"
            onMouseEnter={startHoverTimer}
            onMouseLeave={cancelHover}
            onFocus={handleFocus}
            onBlur={cancelHover}
            onClick={cancelHover}
        >
            {trigger}
            {isMounted && createPortal(
                <div
                    ref={tooltipRef}
                    className="tooltip"
                    data-position={position}
                    data-animation={status}
                    role="tooltip"
                    id={tooltipId}
                    style={{ top: `${tooltipPosition.top}px`, left: `${tooltipPosition.left}px` }}
                >
                    {label}
                </div>,
                document.body,
            )}
        </span>
    )
}
