import ReactFocusLock from "react-focus-lock"
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
            <ReactFocusLock>
                {toastState.map((thisToast, index) => (
                    <ToastItem key={thisToast.key} toast={thisToast} onClose={() => closeToast(index)} />
                ))}
            </ReactFocusLock>
        </div>
    )
}

function ToastItem({ toast, onClose }: { toast: IToast, onClose: () => void }) {
    const [isHovering, setIsHovering] = useState(false)
    const [timeoutTimer, setTimeoutTimer] = useState(0)
    const [{ status, isMounted }, toggle] = useTransitionState({
        timeout: { enter: 500, exit: 300 },
        mountOnEnter: true,
        unmountOnExit: true,
        preEnter: true,
    })

    const timeoutMs = (toast.customTimeout ?? 10000)

    function handleClose() {
        toggle(false)
        setTimeout(onClose, 300)
    }

    useInterval(() => {
        if (isHovering || timeoutTimer < 0) return
        if (timeoutTimer >= timeoutMs) {
            handleClose()
            setTimeoutTimer(-1) // 一回実行したら-1にしてその後はreturnしてもらう
        } else {
            setTimeoutTimer(c => c + 50)
        }
    }, 50)

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
            <div className="toast-timer" style={{ ["--width" as any]: `${Math.min(Math.max(timeoutTimer / timeoutMs * 100, 0), 100)}%`, opacity: isHovering ? 0.5 : 1 }}></div>
        </div>
    )
}
