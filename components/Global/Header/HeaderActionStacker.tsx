import {
    IconBell,
    IconCategory,
    IconX,
} from "@tabler/icons-react"
import ReactFocusLock from "react-focus-lock"
import Notifications from "./Notifications"
import MyMenu from "./MyMenu"
import { CSSTransition } from "react-transition-group"
import { useHeaderActionStateContext, useSetHeaderActionStateContext } from "../Contexts/ModalStateProvider"
import { RefObject } from "react"

export function HeaderActionStacker({ nodeRef }: { nodeRef: RefObject<HTMLDivElement | null> }) {
    const headerActionState = useHeaderActionStateContext()
    const setHeaderActionState = useSetHeaderActionStateContext()

    return (
        <CSSTransition
            nodeRef={nodeRef}
            in={
                headerActionState !== false
            }
            timeout={300}
            unmountOnExit
            classNames="headeraction-modal-transition"
        >
            <ReactFocusLock>
                <div className="headeraction-modal-container" ref={nodeRef}>
                    <div className="headeraction-modal-header global-flex">
                        <button
                            className="headeraction-select"
                            onClick={() => {
                                setHeaderActionState("notifications")
                            }}
                            data-is-active={
                                headerActionState === "notifications" ? "true" : "false"
                            }
                        >
                            <IconBell />
                            {" "}
                            お知らせ
                        </button>
                        <button
                            className="headeraction-select"
                            onClick={() => {
                                setHeaderActionState("mymenu")
                            }}
                            data-is-active={
                                headerActionState === "mymenu" ? "true" : "false"
                            }
                        >
                            <IconCategory />
                            {" "}
                            マイメニュー
                        </button>
                        <button
                            className="headeraction-modal-close"
                            onClick={() => {
                                setHeaderActionState(false)
                            }}
                        >
                            <IconX />
                        </button>
                    </div>
                    <div className="headeraction-content">
                        {headerActionState === "notifications" && (
                            <Notifications />
                        )}
                        {headerActionState === "mymenu" && (
                            <MyMenu />
                        )}
                    </div>
                </div>
            </ReactFocusLock>
        </CSSTransition>
    )
}
