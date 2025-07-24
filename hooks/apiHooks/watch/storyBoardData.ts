import { AccessRightsRootObject } from "@/types/accessRightsApi"
import { StoryBoardImageRootObject } from "@/types/StoryBoardData"
import { VideoDataRootObject } from "@/types/VideoData"

export function useStoryBoardData(
    videoInfo: VideoDataRootObject | undefined,
    smId: string,
    actionTrackId: string,
) {
    const [storyBoardData, _setStoryBoardData]
        = useState<null | StoryBoardImageRootObject>(null)
    useEffect(() => {
        async function getData() {
            _setStoryBoardData(null)
            if (!videoInfo || !videoInfo.data.response.media.domand) return
            const rightsResult: AccessRightsRootObject = await getHls(
                smId,
                "{}",
                actionTrackId,
                videoInfo.data?.response.media.domand?.accessRightKey,
                true,
            )
            if (
                rightsResult.meta.status !== 201
                || !rightsResult.data.contentUrl
            )
                return
            const imagesResult = await fetch(rightsResult.data.contentUrl)
            if (!imagesResult.ok) return
            const imagesResultJson: StoryBoardImageRootObject
                = await imagesResult.json()
            _setStoryBoardData({
                ...imagesResultJson,
                images: imagesResultJson.images.map((image) => {
                    return {
                        ...image,
                        url: rightsResult.data.contentUrl.replace(
                            "storyboard.json",
                            image.url,
                        ),
                    }
                }),
            })
        }
        if (videoInfo?.data.response.media.domand?.isStoryboardAvailable) {
            getData()
        } else {
            _setStoryBoardData(null)
        }
    }, [smId, videoInfo])
    return storyBoardData
}
