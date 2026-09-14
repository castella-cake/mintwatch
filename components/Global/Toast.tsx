import { IToast, useSetMessageContext, useToastContext } from "./Contexts/MessageProvider"
import { IconInfoCircle, IconX } from "@tabler/icons-react"
import { useTransitionState } from "react-transition-state"

export default function Toast() {
    const { ISetToastState } = useSetMessageContext()
    const toastState = useToastContext()
    const closeToast = (index: number) => {
        ISetToastState(current => [
            ...current.slice(0, index),
            ...current.slice(index + 1),
        ])
    }

    if (toastState.length < 1) return

    return (
        <div className="toast-wrapper">
            {toastState.map((thisToast, index) => (
                <ToastItem key={thisToast.key} toast={thisToast} onClose={() => closeToast(index)} />
            ))}
        </div>
    )
}

function ToastItem({ toast, onClose }: { toast: IToast, onClose: () => void }) {
    const [isHovering, setIsHovering] = useState(false)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
    const animationFrameIdRef = useRef<number>(null!)
    const timeoutDateRef = useRef(0)
    const [{ status, isMounted }, toggle] = useTransitionState({
        timeout: { enter: 500, exit: 300 },
        mountOnEnter: true,
        unmountOnExit: true,
        preEnter: true,
    })

    const timeoutMs = (toast.customTimeout ?? 8000)

    function handleClose() {
        toggle(false)
        setTimeout(onClose, 300)
    }

    useInterval(() => {
        if (isHovering || timeoutDateRef.current < 0) return
        const now = Date.now()
        if (now >= timeoutDateRef.current) {
            handleClose()
            timeoutDateRef.current = -1 // 一回実行したら-1にしてその後はreturnしてもらう
        }
    }, 50)

    const drawWithAnimationFrame = useCallback(() => {
        animationFrameIdRef.current = requestAnimationFrame(drawWithAnimationFrame)
        const now = Date.now()
        const canvas = canvasRef.current
        if (canvas) {
            if (!ctxRef.current) {
                const ctx = canvas.getContext("2d")
                if (ctx) {
                    ctx.fillStyle = getComputedStyle(canvas).getPropertyValue("color") || "rgba(255, 255, 255, 0.5)"
                    ctxRef.current = ctx
                }
            }
            if (ctxRef.current && timeoutDateRef.current > 0) {
                const ctx = ctxRef.current
                const width = canvas.width = canvas.offsetWidth
                const height = canvas.height = canvas.offsetHeight
                ctx.clearRect(0, 0, width, height)
                ctx.fillRect(0, 0, width * (1 - Math.min(Math.max((timeoutDateRef.current - now) / timeoutMs, 0), 1)), height)
            }
        }
    }, [])

    useEffect(() => {
        const now = Date.now()
        if (timeoutDateRef.current === 0) {
            timeoutDateRef.current = now + timeoutMs
        }

        drawWithAnimationFrame()

        return () => {
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current)
            }
        }
    }, [drawWithAnimationFrame])
    if (!isMounted) toggle(true)

    return (
        <div
            className="toast-container"
            key={toast.key}
            data-animation={status}
            onMouseEnter={() => { setIsHovering(true) }}
            onMouseLeave={() => { setIsHovering(false) }}
            role="status"
            aria-live="polite"
        >
            <div className="toast-icon">{toast.icon ?? <IconInfoCircle />}</div>
            <div className="toast-title">{toast.title}</div>
            { toast.body && <div className="toast-body">{toast.body}</div> }
            <div className="toast-buttons">
                <button
                    className="toast-button"
                    onClick={handleClose}
                    data-isprimary="true"
                >
                    <IconX />
                </button>
            </div>
            <canvas className="toast-timer-canvas" ref={canvasRef} style={{ opacity: isHovering ? 0.5 : 1 }}></canvas>
        </div>
    )
}
