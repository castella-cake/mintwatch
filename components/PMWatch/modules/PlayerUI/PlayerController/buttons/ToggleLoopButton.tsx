import { useCallback, useEffect } from "react"
import { IconRepeat, IconRepeatOff } from "@tabler/icons-react"
import { useStorageVar } from "@/hooks/extensionHook"
import { useVideoRefContext } from "@/components/Global/Contexts/VideoDataProvider"
import ShinjukuLoopOn from "@/assets/shinjuku/LoopOn.svg?react"
import ShinjukuLoopOff from "@/assets/shinjuku/LoopOff.svg?react"
import { PlayerControllerButton } from "../Button"
import { playerTypes } from "../../PlayerController"

type ToggleLoopButtonProps = {
    currentPlayerType: keyof typeof playerTypes
}

/**
 * ループ再生ボタン
 * isLoop の購読を内部に持つことで、ループ設定の変更時のみ再レンダリングされる
 */
export function ToggleLoopButton({ currentPlayerType }: ToggleLoopButtonProps) {
    const videoRef = useVideoRefContext()
    const localStorage = useStorageVar(["isLoop"] as const, "local")
    const isLoop = localStorage.isLoop

    // 保存されたループ設定を video 要素へ反映する
    useEffect(() => {
        if (videoRef.current) videoRef.current.loop = isLoop ?? false
    }, [isLoop, videoRef])

    const toggleLoopState = useCallback(() => {
        const video = videoRef.current
        if (video) {
            storage.setItem("local:isLoop", !video.loop)
            video.loop = !video.loop
        }
    }, [videoRef])

    return (
        <PlayerControllerButton
            className="playercontroller-toggleloop"
            onClick={toggleLoopState}
            title={isLoop ? "ループ再生を解除" : "ループ再生を有効化"}
        >
            {currentPlayerType === playerTypes.shinjuku
                ? (isLoop ? <ShinjukuLoopOn /> : <ShinjukuLoopOff />)
                : (isLoop ? <IconRepeat /> : <IconRepeatOff />)}
        </PlayerControllerButton>
    )
}
