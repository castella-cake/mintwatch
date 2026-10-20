import { Hls, Media } from "@/types/watch/Base"
import APIError from "@/utils/classes/APIError"
import { buildHlsOutputs } from "@/utils/hlsOutputs"
import { useQuery } from "@tanstack/react-query"

export function useAccessRightsData(videoId: string | undefined, mediaInfo: Media | undefined, actionTrackId: string, isEnabled = true) {
    const { data: accessRightsData, error } = useQuery({
        queryKey: ["accessRightsData", videoId, actionTrackId],
        queryFn: async (): Promise<Hls> => {
            if (!videoId) throw new Error("invalidVideoId")
            if (!mediaInfo) throw new Error("domandNotAvailable")

            // この動画情報メディアにAccessRightsが含まれているならそのまま返す
            if (!isMediaFetchNeeded(mediaInfo)) {
                if (!mediaInfo.hls) throw new Error("hlsNotAvailable")
                return mediaInfo.hls
            }

            const outputs = buildHlsOutputs(mediaInfo.contents.videos, mediaInfo.contents.audios)

            const hlsResponse = await getHls(videoId, JSON.stringify({ outputs }), actionTrackId, mediaInfo.accessRightKey)
            if (hlsResponse.meta.status != 201 || !hlsResponse.data || !hlsResponse.data.contentUrl) {
                throw new APIError("Invalid HLS Response", hlsResponse)
            }
            return accessRightsApiHlsToNormalizedHls(hlsResponse, outputs)
        },
        staleTime: 24 * 60 * 60 * 1000, // 24時間
        enabled: !!(mediaInfo && isMediaAvailable(mediaInfo) && videoId && actionTrackId && isEnabled),
    })
    return { accessRightsData, error }
}

export function isMediaFetchNeeded(media: Media): boolean {
    return !!(!media?.hls?.url && isMediaAvailable(media))
}

export function isMediaAvailable(media: Media): boolean {
    return !!(media?.accessRightKey && media?.contents?.videos && media?.contents?.audios)
}

export function accessRightsApiHlsToNormalizedHls(hls: AccessRightsRootObject, outputs: string[][]): Hls {
    return {
        url: hls.data.contentUrl,
        createdAt: hls.data.createTime,
        expiredAt: hls.data.expireTime,
        outputs: outputs.map(output => ({ assetUnitNames: output })),
    }
}
