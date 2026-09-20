import { StoryBoardImageRootObject } from "@/types/StoryBoardData"
import { VideoDataRootObject } from "@/types/VideoData"
import APIError from "@/utils/classes/APIError"
import { useQuery } from "@tanstack/react-query"

export function useStoryBoardData(
    videoInfo: VideoDataRootObject | undefined,
    smId: string | undefined,
    actionTrackId: string,
) {
    const { data: storyboardData, error } = useQuery({
        queryKey: ["storyboardData", smId, actionTrackId],
        queryFn: async () => {
            if (!smId) throw new Error("invalidVideoId")
            if (!videoInfo) throw new Error("videoInfoNotAvailable")
            if (!videoInfo.data.response.media.domand) throw new Error("domandNotAvailable")
            const accessRightKey = videoInfo.data.response.media.domand.accessRightKey

            const hlsResponse = await getHls(smId, "{}", actionTrackId, accessRightKey, true)
            if (hlsResponse.meta.status != 201 || !hlsResponse.data || !hlsResponse.data.contentUrl) {
                throw new APIError("Invalid HLS Response", hlsResponse)
            }
            const imagesResult = await fetch(hlsResponse.data.contentUrl)
            if (!imagesResult.ok) throw new APIError("Failed to fetch storyboard images", imagesResult)
            const imagesResultJson: StoryBoardImageRootObject = await imagesResult.json()
            return {
                ...imagesResultJson,
                images: imagesResultJson.images.map((image) => {
                    return {
                        ...image,
                        url: hlsResponse.data.contentUrl.replace(
                            "storyboard.json",
                            image.url,
                        ),
                    }
                }),
            }
        },
        staleTime: 24 * 60 * 60 * 1000, // 24時間
        enabled: !!(
            videoInfo
            && videoInfo.data.response.media?.domand
            && videoInfo?.data.response.media.domand?.isStoryboardAvailable
            && smId
            && actionTrackId
        ),
    })
    return { storyboardData, error }
}
