import { IconPlayerPlayFilled, IconPlayerTrackNext } from "@tabler/icons-react"
import "./styles/ContinuousPlay.css"

function watchUrlWithPlaylist(videoId: string, playlistQuery: string) {
    return `https://www.nicovideo.jp/watch/${encodeURIComponent(videoId)}?playlist=${encodeURIComponent(playlistQuery)}`
}

/**
 * 検索ページの動画をすべて再生キューにする「現在のページから連続再生」ボタン
 * @param playlistQuery 検索APIの応答に含まれるplaylistクエリ(base64)
 * @param firstVideoId 現在のページの先頭動画ID
 */
export function SearchContinuousPlayButton({ playlistQuery, firstVideoId }: { playlistQuery: string, firstVideoId: string }) {
    if (!playlistQuery || !firstVideoId) return <></>
    return (
        <a
            className="search-continuous-play-button"
            href={watchUrlWithPlaylist(firstVideoId, playlistQuery)}
        >
            <IconPlayerPlayFilled />
            現在のページから連続再生
        </a>
    )
}

/**
 * 検索結果の動画カードに表示する、その動画を先頭にした連続再生ボタン
 * @param playlistQuery 検索APIの応答に含まれるplaylistクエリ(base64)
 * @param video 対象の動画
 */
export function SearchPlayFromVideoButton({ playlistQuery, video }: { playlistQuery: string, video: VideoItem }) {
    if (!playlistQuery) return <></>
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
