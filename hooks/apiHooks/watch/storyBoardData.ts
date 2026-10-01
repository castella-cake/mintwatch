import { StoryBoardImageRootObject } from "@/types/StoryBoardData"
import { Media } from "@/types/watch/Base"
import APIError from "@/utils/classes/APIError"
import { useQuery } from "@tanstack/react-query"

export function useStoryBoardData(
    media: Media | null,
    smId: string | undefined,
    actionTrackId: string,
) {
    const { data: storyboardData, error } = useQuery({
        queryKey: ["storyboardData", smId, actionTrackId],
        queryFn: async () => {
            if (!smId) throw new Error("invalidVideoId")
            if (!media) throw new Error("mediaNotAvailable")
            if (!media.accessRightKey) throw new Error("accessRightKeyNotAvailable")
            if (!media.isStoryboardAvailable) throw new Error("storyboardNotAvailable")

            // storyboard は access rights API から storyboard.json を取得する従来フローを継続する。
            // (新 API では m3u8 は media.hls.url を直接使えるが、storyboard 用エンドポイントは別途)
            const hlsResponse = await getHls(smId, "{}", actionTrackId, media.accessRightKey, true)
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
        enabled: !!(media?.isStoryboardAvailable && smId && actionTrackId && media?.accessRightKey),
    })
    return { storyboardData, error }
}
