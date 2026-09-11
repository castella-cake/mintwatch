import { IconPlayerPlayFilled, IconPlayerTrackNext } from "@tabler/icons-react"
import "./styles/ContinuousPlay.css"

function watchUrlWithPlaylist(videoId: string, playlistQuery: string) {
    return `https://www.nicovideo.jp/watch/${encodeURIComponent(videoId)}?playlist=${encodeURIComponent(playlistQuery)}`
}

/**
 * 現在のページの動画を連続再生キューにするボタン
 * @param playlistQuery プレイリストクエリ (base64)
 * @param firstVideoId 現在のページの先頭動画ID
 */
export function ContinuousPlayButton({ playlistQuery, firstVideoId }: { playlistQuery: string, firstVideoId: string }) {
    if (!playlistQuery || !firstVideoId) return null
    return (
        <a
            className="generic-continuous-play-button"
            href={watchUrlWithPlaylist(firstVideoId, playlistQuery)}
        >
            <IconPlayerPlayFilled />
            現在のページから連続再生
        </a>
    )
}

/**
 * 動画カードに表示する、その動画を先頭にした連続再生ボタン
 * @param playlistQuery プレイリストクエリ (base64)
 * @param video 対象の動画
 */
export function PlayFromVideoButton({ playlistQuery, video }: { playlistQuery: string, video: VideoItem }) {
    if (!playlistQuery) return null
    return (
        <a
            className="info-card-externalbutton"
            aria-label="この動画から連続再生"
            href={watchUrlWithPlaylist(video.id, playlistQuery)}
        >
            <IconPlayerTrackNext />
        </a>
    )
}
