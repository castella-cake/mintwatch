import { ReactNode } from "react"
import { CSSTransition } from "react-transition-group"

export const PlayerControllerButton = ({ onClick, title, className, children }: { onClick: any, title: string, className: string, children: ReactNode }) => {
    const [isHovered, setIsHovered] = useState(false)
    const spanRef = useRef(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null!)
    const toHoverState = useCallback(() => {
        setIsHovered(false)
        timeoutRef.current = setTimeout(() => setIsHovered(true), 500)
    }, [])
    const cancelHoverState = useCallback(() => {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null!
        setIsHovered(false)
    }, [])
    useEffect(() => {
        return () => {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null!
        }
    }, [])
    return (
        <button ref={buttonRef} className={className} onClick={onClick} aria-label={title} onMouseEnter={toHoverState} onMouseLeave={cancelHoverState}>
            {children}
            <CSSTransition nodeRef={spanRef} in={isHovered} timeout={300} unmountOnExit classNames="playercontroller-tooltip-transition">
                <span ref={spanRef} className="playercontroller-tooltip">{title}</span>
            </CSSTransition>
        </button>
    )
}
