import ReactFocusLock from "react-focus-lock"
import { useAlertContext, useSetMessageContext } from "./Contexts/MessageProvider"
import { IconInfoCircle } from "@tabler/icons-react"
import useTransitionState from "react-transition-state"

export default function Alert() {
    const [{ status, isMounted }, toggle] = useTransitionState({
        timeout: { enter: 1500, exit: 300 },
        mountOnEnter: true,
        unmountOnExit: true,
        preEnter: true,
    })
    const alertState = useAlertContext()
    const { ISetAlertState } = useSetMessageContext()

    const closeAlert = () => {
        ISetAlertState(current => current.slice(1))
        toggle(false)
    }

    const thisAlert = alertState[0]
    if (!isMounted && alertState.length > 0) toggle(true)
    if (!isMounted) return
    return (
        <div className="alert-wrapper" data-animation={status}>
            <ReactFocusLock>
                {thisAlert && (
                    <div className="alert-container">
                        <div className="alert-icon">{thisAlert.icon ?? <IconInfoCircle />}</div>
                        <div className="alert-title">{thisAlert.title}</div>
                        { thisAlert.body && <div className="alert-body">{thisAlert.body}</div> }
                        <div className="alert-buttons">
                            {
                                thisAlert.customCloseButton
                                    ? (
                                            <>
                                                {thisAlert.customCloseButton.map((b) => {
                                                    return (
                                                        <button
                                                            className="alert-button"
                                                            key={b.key}
                                                            onClick={() => {
                                                                closeAlert()
                                                                if (thisAlert.onClose !== undefined) thisAlert.onClose(b.key)
                                                            }}
                                                            aria-disabled={!!b.disabled}
                                                        >
                                                            {b.text}
                                                        </button>
                                                    )
                                                })}
                                            </>
                                        )
                                    : (
                                            <button
                                                className="alert-button"
                                                onClick={() => {
                                                    closeAlert()
                                                    if (thisAlert.onClose !== undefined) thisAlert.onClose(null)
                                                }}
                                                data-isprimary="true"
                                            >
                                                OK
                                            </button>
                                        )
                            }
                        </div>
                    </div>
                )}
            </ReactFocusLock>
        </div>
    )
}
