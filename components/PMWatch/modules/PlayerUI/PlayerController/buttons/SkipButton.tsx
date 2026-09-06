import { useCallback } from "react"
import { IconPlayerSkipBack, IconPlayerSkipBackFilled, IconPlayerSkipForward, IconPlayerSkipForwardFilled } from "@tabler/icons-react"
import { useStorageVar } from "@/hooks/extensionHook"
import { useVideoRefContext } from "@/components/Global/Contexts/VideoDataProvider"
import ShinjukuSkipBack from "@/assets/shinjuku/SkipBack.svg?react"
import { PlayerControllerButton } from "../Button"
import { playerTypes } from "../../PlayerController"

type SkipButtonProps = {
    currentPlayerType: keyof typeof playerTypes
    direction: "back" | "forward"
    playlistIndexControl: (index: number, isShuffle?: boolean, isAutoPlayTrigger?: boolean) => void
}

// [開始地点へのスキップ時に前の動画へ, 終了地点へのスキップ時に次の動画へ] のプレイリスト遷移を有効にするかどうか
// 現状は常に無効
const isIndexControl: boolean[] = [false, false]

/**
 * 開始地点/終了地点へのシークボタン
 * enableShufflePlay の購読を内部に持つことで、設定変更時のみ再レンダリングされる
 */
export function SkipButton({ currentPlayerType, direction, playlistIndexControl }: SkipButtonProps) {
    const videoRef = useVideoRefContext()
    const localStorage = useStorageVar(["enableShufflePlay"] as const, "local")

    const onSkipBack = useCallback(() => {
        const video = videoRef.current
        if (!video) return
        video.currentTime = timeCalc("set", 0, video.currentTime, video.duration)
        if (isIndexControl[0] === true) playlistIndexControl(-1, localStorage.enableShufflePlay)
    }, [videoRef, playlistIndexControl, localStorage.enableShufflePlay])

    const onSkipForward = useCallback(() => {
        const video = videoRef.current
        if (!video) return
        video.currentTime = timeCalc("set", video.duration, video.currentTime, video.duration)
        if (isIndexControl[1] === true) playlistIndexControl(1, localStorage.enableShufflePlay)
    }, [videoRef, playlistIndexControl, localStorage.enableShufflePlay])

    return (
        <PlayerControllerButton
            className={direction === "back" ? "playercontroller-skipback" : "playercontroller-skipforward"}
            onClick={direction === "back" ? onSkipBack : onSkipForward}
            title={direction === "back" ? "開始地点にシーク" : "終了地点にシーク"}
        >
            {direction === "back"
                ? (currentPlayerType === playerTypes.shinjuku
                        ? <ShinjukuSkipBack />
                        : (isIndexControl[0] ? <IconPlayerSkipBackFilled /> : <IconPlayerSkipBack />))
                : (isIndexControl[1] ? <IconPlayerSkipForwardFilled /> : <IconPlayerSkipForward />)}
        </PlayerControllerButton>
    )
}
