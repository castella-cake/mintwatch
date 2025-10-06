import { useTransitionState } from "react-transition-state"
import { Mylists } from "../Mylists"
import { useSmIdContext } from "@/components/Global/Contexts/WatchDataContext"

export function MylistsPopup({ isOpen, onMouseEnter, onMouseLeave, onMoreButtonClick }: { isOpen: boolean, onMouseEnter: (e: React.MouseEvent) => void, onMouseLeave: (e: React.MouseEvent) => void, onMoreButtonClick: (e: React.MouseEvent) => void }) {
    const { smId } = useSmIdContext()
    const {
        mylistsPopupLimit,
    } = useStorageVar(["mylistsPopupLimit"])
    const [{ status, isMounted }, toggle] = useTransitionState({
        timeout: { enter: 300, exit: 300 },
        mountOnEnter: true,
        unmountOnExit: true,
        preEnter: true,
    })
    if (isMounted !== isOpen) toggle(isOpen)

    if (!isMounted) return

    return (
        <div className="mylistspopup-container" data-animation={status} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            <div className="mylistspopup-title">
                マイリストに追加 (最初の
                {" "}
                {mylistsPopupLimit ?? 8}
                {" "}
                件を表示中)
            </div>
            { smId && (
                <Mylists
                    smId={smId}
                    compact={true}
                    limit={mylistsPopupLimit ?? 8}
                    showMoreButton={true}
                    onMoreButtonClick={onMoreButtonClick}
                />
            ) }
        </div>
    )
}
