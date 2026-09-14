import { CDMarquee } from "@/components/Global/CDMarquee"
import { MWButton } from "@/components/Global/MWButton"
import { useBackgroundPlayingContext, useSetBackgroundPlayingContext } from "@/components/Global/Contexts/BackgroundPlayProvider"
import { useVideoInfoContext } from "@/components/Global/Contexts/VideoDataProvider"
import { useHistoryContext } from "@/components/Router/RouterContext"
import { IconScreenShare, IconX } from "@tabler/icons-react"
import { useQueryClient } from "@tanstack/react-query"

export default function BackgroundController() {
    const queryClient = useQueryClient()
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
        const smId = videoInfo?.data.response.video.id
        if (smId) {
            // この動画IDのキャッシュをあらかじめ破棄する
            queryClient.invalidateQueries({ queryKey: ["commentData", smId, { logData: undefined }] })
            queryClient.invalidateQueries({ queryKey: ["videoData", smId] })
        }
    }, [videoInfo])

    if (!isBackgroundPlaying) return
    return (
        <div className="player-background-controller">
            <MWButton label="フォアグラウンドに戻す" onClick={returnToWatch}><IconScreenShare /></MWButton>
            <div className="navbar-background-player-title-subtitle">再生中</div>
            <CDMarquee>
                <div className="navbar-background-player-title-video">{videoInfo?.data.response.video.title}</div>
            </CDMarquee>
            <MWButton label="ミニプレイヤーを終了" onClick={closeBackgroundPlayer}><IconX /></MWButton>
        </div>
    )
}
