import APIError from "@/utils/classes/APIError"
import { useQuery } from "@tanstack/react-query"

// AudioQualityItemとVideoQualityItemの型を定義
type QualityItem = {
    isAvailable: boolean
    id: string // 必要に応じて他のプロパティを追加
}

// クオリティ配列から、利用可能な中で最も良いクオリティのオブジェクトを返す。
function returnGreatestQuality<T extends QualityItem>(array: T[]): T | false {
    for (const elem of array) {
        if (elem.isAvailable) return elem
    }
    return false
}

export function useAccessRightsData(videoId: string | null, videoInfo: VideoDataRootObject | undefined, actionTrackId: string, isEnabled = true) {
    const { data: accessRightsData, error } = useQuery({
        queryKey: ["accessRightsData", videoId, actionTrackId],
        queryFn: async () => {
            if (!videoId) throw new Error("invalidVideoId")
            if (!videoInfo) throw new Error("videoInfoNotAvailable")
            if (!videoInfo.data.response.media.domand) throw new Error("domandNotAvailable")
            const accessRightKey = videoInfo.data.response.media.domand.accessRightKey
            const availableVideoQuality = videoInfo.data.response.media.domand.videos
            const availableAudioQuality = videoInfo.data.response.media.domand.audios

            const greatestAudioQuality = returnGreatestQuality(availableAudioQuality)
            if (!greatestAudioQuality) throw new Error("audioQualityIsNotAvailable")
            const hlsRequestBody = {
                outputs: availableVideoQuality.map((elem) => {
                    if (!elem.isAvailable) return null
                    return [elem.id, greatestAudioQuality.id]
                }).filter(elem => elem !== null),
            }

            const hlsResponse = await getHls(videoId, JSON.stringify(hlsRequestBody), actionTrackId, accessRightKey)
            if (hlsResponse.meta.status != 201 || !hlsResponse.data || !hlsResponse.data.contentUrl) {
                throw new APIError("Invalid HLS Response", hlsResponse)
            }
            return hlsResponse
        },
        staleTime: 24 * 60 * 60 * 1000, // 24時間
        enabled: !!(videoInfo && isMediaAvailable(videoInfo) && videoId && actionTrackId && isEnabled),
    })
    return { accessRightsData, error }
}

function isMediaAvailable(videoInfo: VideoDataRootObject): boolean {
    return !!(
        videoInfo?.data?.response?.media?.domand
        && videoInfo?.data?.response?.media?.domand?.accessRightKey
        && videoInfo?.data?.response?.media?.domand?.videos
        && videoInfo?.data?.response?.media?.domand?.audios
    )
}
