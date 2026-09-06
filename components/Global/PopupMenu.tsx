import { createPortal } from "react-dom"
import { useTransitionState } from "react-transition-state"
import ReactFocusLock from "react-focus-lock"

type Props = {
    children: React.ReactNode
    positionElemRef: React.RefObject<HTMLElement | null>
    isOpen: boolean
    onClose: () => void
    additionalClassNames?: string
}

export function PopupMenu({ children, positionElemRef, isOpen, onClose, additionalClassNames }: Props) {
    const [{ status, isMounted }, toggle] = useTransitionState({
        timeout: 200,
        mountOnEnter: true,
        unmountOnExit: true,
        preEnter: true,
        preExit: true,
    })
    const popupMenuRef = useRef<HTMLDivElement>(null)

    const [topPosition, setTopPosition] = useState(0)
    const [leftPosition, setLeftPosition] = useState(0)

    useEffect(() => {
        if (!isMounted) return
        if (!positionElemRef.current) return

        const positionElemRect = positionElemRef.current.getBoundingClientRect()
        const popupMenuRect = popupMenuRef.current?.getBoundingClientRect()

        const top = positionElemRect.bottom + window.scrollY
        let left = positionElemRect.left + window.scrollX

        if (popupMenuRect) {
            const viewportWidth = window.innerWidth
            const popupMenuWidth = popupMenuRect.width

            if (left + popupMenuWidth > viewportWidth) {
                left = viewportWidth - popupMenuWidth - 16
            }
        }

        setTopPosition(top)
        setLeftPosition(left)
    }, [isMounted, positionElemRef, setTopPosition, setLeftPosition])

    useEffect(() => {
        if (!isMounted) return

        const handleClickOutside = (event: MouseEvent) => {
            if (
                popupMenuRef.current
                && (!popupMenuRef.current.contains(event.target as Node) && !positionElemRef.current?.contains(event.target as Node))
            ) {
                onClose()
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isMounted, onClose, positionElemRef])

    const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Escape") {
            onClose()
            event.stopPropagation()
            event.preventDefault()
        }
    }, [onClose])

    useEffect(() => {
        toggle(isOpen)
    }, [isOpen, toggle])

    if (!isMounted) return null

    return (createPortal(
        <div className="popupmenu-wrapper">
            <ReactFocusLock>
                <div
                    ref={popupMenuRef}
                    className={`generic-contextmenu popupmenu-container ${additionalClassNames || ""}`}
                    onKeyDown={handleKeyDown}
                    data-animation={status}
                    style={{
                        top: `${topPosition}px`,
                        left: `${leftPosition}px`,
                    }}
                >
                    {children}
                </div>
            </ReactFocusLock>
        </div>,
        document.body,
    ))
}
