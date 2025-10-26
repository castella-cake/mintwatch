import { CDMarquee } from "@/components/Global/CDMarquee"
import { useBackgroundPlayingContext, useSetBackgroundPlayingContext } from "@/components/Global/Contexts/BackgroundPlayProvider"
import { useVideoInfoContext } from "@/components/Global/Contexts/VideoDataProvider"
import { useHistoryContext } from "@/components/Router/RouterContext"
import { IconScreenShare, IconX } from "@tabler/icons-react"

export default function BackgroundController() {
    const { videoInfo } = useVideoInfoContext()
    const history = useHistoryContext()
    const isBackgroundPlaying = useBackgroundPlayingContext()
    const setBackgroundPlaying = useSetBackgroundPlayingContext()

    const returnToWatch = useCallback(() => {
        if (videoInfo && videoInfo.data.response.video) history.push(`/watch/${videoInfo.data.response.video.id}`)
        setBackgroundPlaying(false)
    }, [videoInfo])
    const closeBackgroundPlayer = useCallback(() => {
        setBackgroundPlaying(false)
    }, [])

    if (!isBackgroundPlaying) return
    return (
        <div className="player-background-controller">
            <button onClick={returnToWatch} title="フォアグラウンドに戻す"><IconScreenShare /></button>
            <div className="navbar-background-player-title-subtitle">再生中</div>
            <CDMarquee>
                <div className="navbar-background-player-title-video">{videoInfo?.data.response.video.title}</div>
            </CDMarquee>
            <button onClick={closeBackgroundPlayer} title="ミニプレイヤーを終了"><IconX /></button>
        </div>
    )
}
