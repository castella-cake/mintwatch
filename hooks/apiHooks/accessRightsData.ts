import { useQuery } from "@tanstack/react-query"
import { Media } from "@/types/watch/Base"

/**
 * HLS 再生のための m3u8 URL を返す hook。
 *
 * v4/watch では `media.hls.url` にそのまま m3u8 の URL が入っているため、
 * 旧来の `v1/watch/{id}/access-rights/hls` 呼び出しは不要になった。
 * 既存の呼び出し側 (`useHls(videoRef, hlsResponse, ...)`) のシェイプを保つため
 * `{ data: { contentUrl } }` 形式で返す。
 *
 * actionTrackId はクエリキーに含める(動画切替時にキャッシュを破棄する)ためだけに受け取り、
 * enabled には関与しない。isEnabled は呼び出し側で明示的に指定する。
 */
export function useAccessRightsData(
    videoId: string | undefined,
    media: Media | null,
    actionTrackId: string,
    isEnabled = true,
) {
    const { data: accessRightsData, error } = useQuery({
        queryKey: ["accessRightsData", videoId, actionTrackId],
        queryFn: async () => {
            if (!videoId) throw new Error("invalidVideoId")
            const hlsUrl = media?.hls?.url
            if (!hlsUrl) throw new Error("hlsUrlNotAvailable")
            // useHls 側は `hlsResponse.data.contentUrl` を参照するシェイプなのでそれに合わせる
            return { data: { contentUrl: hlsUrl as string } }
        },
        staleTime: 24 * 60 * 60 * 1000, // 24時間
        enabled: !!(media && isMediaAvailable(media) && videoId && isEnabled),
    })
    return { accessRightsData, error }
}

function isMediaAvailable(media: Media): boolean {
    return !!(media?.hls?.url && media?.accessRightKey && media?.contents?.videos && media?.contents?.audios)
}
