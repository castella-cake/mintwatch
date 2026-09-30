import { VideoData, Player } from "@/types/watch/Base"
import { parseFromQuery } from "@/utils/fromQuery"
import { RefObject } from "react"

export function useResumePlayback(videoRef: RefObject<HTMLVideoElement | null>, video: VideoData | null | undefined, player: Player | null | undefined, resumePlaybackType?: string) {
    const appliedVideoIdRef = useRef<string | null>(null)

    // レジューム再生の処理
    useEffect(() => {
        if (!video) return
        const onUnload = () => {
            if (!videoRef.current) return
            const playbackPositionBody = { videoId: video.id, seconds: videoRef.current.currentTime }
            putPlaybackPosition(playbackPositionBody, new Date())
        }
        window.addEventListener("beforeunload", onUnload)
        return () => {
            window.removeEventListener("beforeunload", onUnload)
        }
    }, [video])

    // fromから再生位置の指定をするか、レジューム再生で再生位置を指定する
    useEffect(() => {
        if (!video || !videoRef.current) return
        const videoId = video.id
        // 同じ動画への再適用(設定変更やキャッシュ更新による再実行)を抑止し、レジューム設定は次の動画から適用する
        if (appliedVideoIdRef.current === videoId) return
        appliedVideoIdRef.current = videoId
        // from は動画情報の到着時に一度だけ評価する。ナビゲーションは必ずfetch前に完了しているため、
        // その時点の location を直接読み取る。noLocationChange の動画切替で別動画のURLに付いた from が
        // 適用されないよう、path がこの動画自身のものかを検証する
        const watchPath = `/watch/${videoId}`
        if (location.pathname === watchPath || location.pathname.startsWith(`${watchPath}/`)) {
            const fromSecond = parseFromQuery(location.search)
            if (fromSecond !== null) {
                videoRef.current.currentTime = fromSecond
                return
            }
        }

        const initialPlayback = player?.initialPlayback
        if (!initialPlayback || resumePlaybackType === "never" || (
            // スマートなレジューム再生(デフォルト値) が有効で、再生位置が始まりか終わりに近い(10s)場合は無視する
            (resumePlaybackType === "smart" || !resumePlaybackType) && (
                initialPlayback.positionSec <= 10
                || initialPlayback.positionSec >= video.duration - 10
            )
        )) return
        videoRef.current.currentTime = initialPlayback.positionSec
    }, [video, player, resumePlaybackType])
}
