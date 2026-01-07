import { timeCalc } from "./timeCalc"

export const handleCtrl = (
    e: KeyboardEvent,
    video: HTMLVideoElement | null,
    commentInput: HTMLTextAreaElement | null,
    onToggleFullscreen: () => void,
    setShortcutFeedback: (text: string) => void,
    onModalStateChanged: (isModalOpen: boolean, modalType: "mylist" | "share") => void,
    onCommentDisplayChanged: React.Dispatch<React.SetStateAction<boolean>>,
    rewindTime: string | undefined,
) => {
    const eachSkipTime = Number(rewindTime ?? 10)
    if (e.ctrlKey) return true
    if (e.target instanceof Element) {
        if (e.target.closest("input, textarea")) return true
    }
    if ((e.key === " " || e.key === "　") && video) {
        e.preventDefault()
        if (video.paused) {
            video.play()
            setShortcutFeedback("再生")
        } else {
            video.pause()
            setShortcutFeedback("一時停止")
        }
        return false
    }
    if (e.key === "ArrowLeft" && video) {
        e.preventDefault()
        video.currentTime = timeCalc("add", -eachSkipTime, video.currentTime, video.duration)
        setShortcutFeedback(`${eachSkipTime} 秒戻し`)
        return false
    }
    if (e.key === "ArrowRight" && video) {
        e.preventDefault()
        video.currentTime = timeCalc("add", eachSkipTime, video.currentTime, video.duration)
        setShortcutFeedback(`${eachSkipTime} 秒送り`)
        return false
    }
    if (e.shiftKey && e.key === "ArrowUp" && video) {
        e.preventDefault()
        video.volume = video.volume + 0.05
        setShortcutFeedback(`音量: ${Math.round(video.volume * 100)}%`)
        return false
    }
    if (e.shiftKey && e.key === "ArrowDown" && video) {
        e.preventDefault()
        video.volume = video.volume - 0.05
        setShortcutFeedback(`音量: ${Math.round(video.volume * 100)}%`)
        return false
    }
    if (e.key === "ArrowRight" && video) {
        e.preventDefault()
        video.currentTime = timeCalc("add", 10, video.currentTime, video.duration)
        setShortcutFeedback("+10 秒")
        return false
    }
    if (e.key === "," && video) {
        e.preventDefault()
        video.currentTime = timeCalc("add", -1 / 60, video.currentTime, video.duration)
        setShortcutFeedback("-16 ミリ秒")
        return false
    }
    if (e.key === "." && video) {
        e.preventDefault()
        video.currentTime = timeCalc("add", 1 / 60, video.currentTime, video.duration)
        setShortcutFeedback("+16 ミリ秒")
        return false
    }
    if (e.key.toLowerCase() === "r" && video) {
        e.preventDefault()
        setShortcutFeedback(`ループ再生: ${!video.loop ? "ON" : "OFF"}`)
        storage.setItem("local:isLoop", !video.loop)
        video.loop = !video.loop
        return false
    }
    if (e.key.toLowerCase() === "c" && !e.shiftKey) {
        if (!commentInput) return
        // 入力を防ぐために preventDefaultしてからフォーカス(後でreturnしたら間に合わない)
        e.preventDefault()
        commentInput.focus()
        setShortcutFeedback("コメント入力へフォーカス")
        return false
    }
    if (e.key.toLowerCase() === "c" && e.shiftKey) {
        e.preventDefault()
        onCommentDisplayChanged((state) => {
            setShortcutFeedback(`コメント表示: ${!state ? "ON" : "OFF"}`)
            return !state
        })
        return false
    }
    if (e.key.toLowerCase() === "f") {
        e.preventDefault()
        onToggleFullscreen()
        return false
    }
    if (e.key.toLowerCase() === "m" && video) {
        e.preventDefault()
        if (video.muted) {
            setShortcutFeedback("ミュート解除")
        } else setShortcutFeedback("ミュート")
        video.muted = !video.muted
        return false
    }
}
