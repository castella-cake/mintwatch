import { VideoDataRootObject } from "@/types/VideoData"
import { RefObject } from "react"

export function useResumePlayback(videoRef: RefObject<HTMLVideoElement | null>, videoInfo: VideoDataRootObject | null, resumePlaybackType?: string) {
    // レジューム再生の処理
    useEffect(() => {
        if (!videoInfo) return
        const onUnload = () => {
            if ( !videoRef.current ) return
            const playbackPositionBody = { watchId: videoInfo.data.response.video.id, seconds: videoRef.current.currentTime }
            putPlaybackPosition(playbackPositionBody)
        }
        window.addEventListener("beforeunload", onUnload)
        return () => { window.removeEventListener("beforeunload", onUnload) }
    }, [videoInfo])

    // fromから再生位置の指定をするか、レジューム再生で再生位置を指定する
    useEffect(() => {
        if (!videoInfo || !videoRef.current) return
        const searchParams = new URLSearchParams(location.search);
        const fromSecond = Number(searchParams.get('from'))
        if (fromSecond) {
            videoRef.current.currentTime = fromSecond
            return
        }

        if (!videoInfo.data.response.player.initialPlayback || resumePlaybackType === "never" || (
            // スマートなレジューム再生(デフォルト値) が有効で、再生位置が始まりか終わりに近い(10s)場合は無視する
            (resumePlaybackType === "smart" || !resumePlaybackType) && (
                videoInfo.data.response.player.initialPlayback.positionSec <= 10 ||
                videoInfo.data.response.player.initialPlayback.positionSec >= videoInfo.data.response.video.duration - 10
            )
        )) return
        videoRef.current.currentTime = videoInfo.data.response.player.initialPlayback?.positionSec
    }, [videoInfo])
}