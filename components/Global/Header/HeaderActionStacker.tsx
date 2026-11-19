import {
    IconBell,
    IconCategory,
    IconStar,
    IconX,
} from "@tabler/icons-react"
import ReactFocusLock from "react-focus-lock"
import Notifications from "./Notifications"
import MyMenu from "./MyMenu"
import { useTransitionState } from "react-transition-state"
import { useHeaderActionStateContext, useSetHeaderActionStateContext } from "../Contexts/ModalStateProvider"
import { RefObject } from "react"
import HeaderActivities from "./Activities"
import { useOutsideClose } from "@/hooks/useOutsideClose"

export function HeaderActionStacker({ nodeRef }: { nodeRef: RefObject<HTMLDivElement | null> }) {
    const headerActionState = useHeaderActionStateContext()
    const setHeaderActionState = useSetHeaderActionStateContext()
    const isOpen = headerActionState !== false
    const [{ status, isMounted }, toggle] = useTransitionState({
        timeout: 300,
        mountOnEnter: true,
        unmountOnExit: true,
        preEnter: true,
    })
    useEffect(() => {
        toggle(isOpen)
    }, [isOpen])
    useOutsideClose(nodeRef, isOpen, () => setHeaderActionState(false))
    if (!isMounted) return null

    return (
        <ReactFocusLock>
            <div className="headeraction-modal-container" ref={nodeRef} data-animation={status}>
                <div className="headeraction-modal-header global-flex">
                    <button
                        className="headeraction-select"
                        onClick={() => {
                            setHeaderActionState("activities")
                        }}
                        data-is-active={
                            headerActionState === "activities" ? "true" : "false"
                        }
                    >
                        <IconStar />
                        {" "}
                        新着
                    </button>
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
                        メニュー
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
                    {headerActionState === "activities" && (
                        <HeaderActivities />
                    )}
                </div>
            </div>
        </ReactFocusLock>
    )
}
