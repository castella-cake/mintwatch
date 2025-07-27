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
    const [{ status, isMounted }, toggle] = useTransitionState({
        timeout: { enter: 500, exit: 300 },
        mountOnEnter: true,
        unmountOnExit: true,
        preEnter: true,
    })
    if (!isMounted) toggle(true)
    function handleClose() {
        toggle(false)
        setTimeout(onClose, 300)
    }
    return (
        <div className="toast-container" key={toast.key} data-animation={status}>
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
        </div>
    )
}
