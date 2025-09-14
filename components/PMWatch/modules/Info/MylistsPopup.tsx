import { useTransitionState } from "react-transition-state"
import { Mylists } from "../Mylists"

export function MylistsPopup({ isOpen, onMouseEnter, onMouseLeave }: { isOpen: boolean, onMouseEnter: (e: React.MouseEvent) => void, onMouseLeave: (e: React.MouseEvent) => void }) {
    const [{ status, isMounted }, toggle] = useTransitionState({
        timeout: { enter: 500, exit: 300 },
        mountOnEnter: true,
        unmountOnExit: true,
        preEnter: true,
    })
    if (isMounted !== isOpen) toggle(isOpen)

    if (!isMounted) return

    return (
        <div className="mylistspopup-container" data-animation={status} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            <div className="mylistspopup-title">
                マイリストに追加
            </div>
            <Mylists />
        </div>
    )
}
