import { memo, useCallback } from "react"
import { IconLayoutSidebarRightCollapseFilled, IconLayoutSidebarRightExpand } from "@tabler/icons-react"
import { useStorageVar } from "@/hooks/extensionHook"
import ShinjukuStartTheater from "@/assets/shinjuku/StartTheater.svg?react"
import ShinjukuEndTheater from "@/assets/shinjuku/EndTheater.svg?react"
import { PlayerControllerButton } from "../Button"
import { playerTypes } from "../../PlayerController"

type TheaterViewButtonProps = {
    currentPlayerType: keyof typeof playerTypes
    isFullscreenUi: boolean
}

/**
 * シアタービュー切替ボタン（フルスクリーン時に表示）
 * enableBigView の購読を内部に持つことで、設定変更時のみ再レンダリングされる
 */
export const TheaterViewButton = memo(function TheaterViewButton({ currentPlayerType, isFullscreenUi }: TheaterViewButtonProps) {
    const localStorage = useStorageVar(["enableBigView"] as const, "local")
    const enableBigView = localStorage.enableBigView

    const onClick = useCallback(() => {
        storage.setItem("local:enableBigView", !(enableBigView ?? false))
    }, [enableBigView])

    if (!isFullscreenUi) return null

    return (
        <PlayerControllerButton
            className="playercontroller-expandsidebar"
            onClick={onClick}
            title={enableBigView ? "シアタービューを終了" : "シアタービューを開始"}
        >
            {currentPlayerType === playerTypes.shinjuku
                ? (enableBigView ? <ShinjukuEndTheater /> : <ShinjukuStartTheater />)
                : (enableBigView ? <IconLayoutSidebarRightCollapseFilled /> : <IconLayoutSidebarRightExpand />)}
        </PlayerControllerButton>
    )
})
