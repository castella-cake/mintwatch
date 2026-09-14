import { memo } from "react"
import { IconMaximize, IconMinimize } from "@tabler/icons-react"
import ShinjukuStartFullScreen from "@/assets/shinjuku/StartFullScreen.svg?react"
import ShinjukuEndFullScreen from "@/assets/shinjuku/EndFullScreen.svg?react"
import { PlayerControllerButton } from "../Button"
import { playerTypes } from "../../PlayerController"

type FullscreenButtonProps = {
    currentPlayerType: keyof typeof playerTypes
    isFullscreenUi: boolean
    toggleFullscreen: () => void
}

/**
 * フルスクリーン切替ボタン
 * isFullscreenUi が変化したときのみ再レンダリングされる
 * memo を機能させるため、親から渡される toggleFullscreen は useCallback で安定化されている必要がある
 */
export const FullscreenButton = memo(function FullscreenButton({ currentPlayerType, isFullscreenUi, toggleFullscreen }: FullscreenButtonProps) {
    return (
        <PlayerControllerButton
            className="playercontroller-fullscreen"
            onClick={toggleFullscreen}
            title={isFullscreenUi ? "フルスクリーンを終了" : "フルスクリーン"}
        >
            {currentPlayerType === playerTypes.shinjuku
                ? (isFullscreenUi ? <ShinjukuEndFullScreen /> : <ShinjukuStartFullScreen />)
                : (isFullscreenUi ? <IconMinimize /> : <IconMaximize />)}
        </PlayerControllerButton>
    )
})
