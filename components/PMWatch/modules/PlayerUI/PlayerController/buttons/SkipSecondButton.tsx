import { useCallback } from "react"
import { IconRewindBackward10, IconRewindBackward15, IconRewindBackward30, IconRewindBackward5, IconRewindForward10, IconRewindForward15, IconRewindForward30, IconRewindForward5 } from "@tabler/icons-react"
import { useStorageVar } from "@/hooks/extensionHook"
import { useVideoRefContext } from "@/components/Global/Contexts/VideoDataProvider"
import { PlayerControllerButton } from "../Button"

type SkipSecondButtonProps = {
    direction: "backward" | "forward"
}

/**
 * ±N秒シークボタン
 * rewindTime の購読を内部に持つことで、設定変更時のみ再レンダリングされる
 */
export function SkipSecondButton({ direction }: SkipSecondButtonProps) {
    const videoRef = useVideoRefContext()
    const localStorage = useStorageVar(["rewindTime"] as const, "local")
    const rewindTime = localStorage.rewindTime ?? 10

    const onSkipSecond = useCallback(() => {
        const video = videoRef.current
        if (!video) return
        video.currentTime = timeCalc("add", Number(rewindTime) * (direction === "backward" ? -1 : 1), video.currentTime, video.duration)
    }, [videoRef, rewindTime, direction])

    return (
        <PlayerControllerButton
            className={direction === "backward" ? "playercontroller-backward" : "playercontroller-forward"}
            onClick={onSkipSecond}
            title={`${rewindTime * (direction === "backward" ? -1 : 1)}秒シーク`}
        >
            {direction === "backward"
                ? (
                        <>
                            {(localStorage.rewindTime === "10" || typeof localStorage.rewindTime !== "string") && <IconRewindBackward10 />}
                            {localStorage.rewindTime === "15" && <IconRewindBackward15 />}
                            {localStorage.rewindTime === "30" && <IconRewindBackward30 />}
                            {localStorage.rewindTime === "5" && <IconRewindBackward5 />}
                        </>
                    )
                : (
                        <>
                            {(localStorage.rewindTime === "10" || typeof localStorage.rewindTime !== "string") && <IconRewindForward10 />}
                            {localStorage.rewindTime === "15" && <IconRewindForward15 />}
                            {localStorage.rewindTime === "30" && <IconRewindForward30 />}
                            {localStorage.rewindTime === "5" && <IconRewindForward5 />}
                        </>
                    )}
        </PlayerControllerButton>
    )
}
