import { useCallback, useEffect, useState } from "react"
import { IconPlayerPauseFilled, IconPlayerPlayFilled } from "@tabler/icons-react"
import { useVideoRefContext } from "@/components/Global/Contexts/VideoDataProvider"
import ShinjukuPlay from "@/assets/shinjuku/Play.svg?react"
import ShinjukuPaused from "@/assets/shinjuku/Paused.svg?react"
import { PlayerControllerButton } from "../Button"
import { playerTypes } from "../../PlayerController"

type TogglePauseButtonProps = {
    currentPlayerType: keyof typeof playerTypes
}

/**
 * 再生/一時停止ボタン
 * 再生状態の購読とトグル処理を内部に持つことで、再生/一時停止のたびに再レンダリングされるのはこのコンポーネントのみになる
 */
export function TogglePauseButton({ currentPlayerType }: TogglePauseButtonProps) {
    const videoRef = useVideoRefContext()
    const [isIconPlay, setIsIconPlay] = useState(false)

    useEffect(() => {
        const video = videoRef.current
        if (!video) return
        const setIconToPause = () => setIsIconPlay(false)
        const setIconToPlay = () => setIsIconPlay(true)

        setIsIconPlay(video.paused)
        video.addEventListener("play", setIconToPause)
        video.addEventListener("pause", setIconToPlay)
        return () => {
            video.removeEventListener("play", setIconToPause)
            video.removeEventListener("pause", setIconToPlay)
        }
    }, [videoRef])

    const toggleStopState = useCallback(() => {
        const video = videoRef.current
        if (!video) return
        if (video.paused) {
            video.play()
        } else {
            video.pause()
        }
        setIsIconPlay(video.paused)
    }, [videoRef])

    return (
        <PlayerControllerButton
            className="playercontroller-togglepause"
            onClick={toggleStopState}
            title={isIconPlay ? "再生" : "一時停止"}
        >
            {currentPlayerType === playerTypes.shinjuku
                ? (isIconPlay ? <ShinjukuPlay /> : <ShinjukuPaused />)
                : (isIconPlay ? <IconPlayerPlayFilled /> : <IconPlayerPauseFilled />)}
        </PlayerControllerButton>
    )
}
