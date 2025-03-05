import { VideoDataRootObject } from "@/types/VideoData"
import { RefObject } from "react"

export function useResumePlayback(videoRef: RefObject<HTMLVideoElement>, videoId: string, videoInfo: VideoDataRootObject, resumePlaybackType?: string) {
    // レジューム再生の処理
    useEffect(() => {
        const onUnload = () => {
            if ( !videoRef.current ) return
            const playbackPositionBody = { watchId: videoId, seconds: videoRef.current.currentTime }
            putPlaybackPosition(JSON.stringify(playbackPositionBody))
        }
        window.addEventListener("beforeunload", onUnload)
        return () => { window.removeEventListener("beforeunload", onUnload) }
    }, [])

    // fromから再生位置の指定をするか、レジューム再生で再生位置を指定する
    useEffect(() => {
        if (!videoInfo.data || !videoRef.current) return
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