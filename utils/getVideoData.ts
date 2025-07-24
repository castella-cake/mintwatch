import { VideoDataRootObject } from "@/types/VideoData"

export default async function getFastVideoData(smId: string) {
    // metaタグからのレスポンスを入れる。ないかもしれないので最初はnull。
    let initialResponse: VideoDataRootObject | null = null
    let fetchedVideoInfo: VideoDataRootObject | null = null
    if (
        document.getElementsByName("server-response").length > 0
        && typeof document
            .getElementsByName("server-response")[0]
            .getAttribute("content") === "string"
    ) {
        initialResponse = JSON.parse(
            document
                .getElementsByName("server-response")[0]
                .getAttribute("content")!,
        ) as VideoDataRootObject
        // console.log("using initialResponse", initialResponse)
    } else {
        // console.log("not using initialResponse")
    }
    // HTMlのレスポンスが今フェッチしようとしているvideoのidと同じならこっちを使う
    if (
        initialResponse
        && initialResponse.meta?.status === 200
        && initialResponse.data?.response.video
        && initialResponse.data?.response.video.id === smId
    ) {
        fetchedVideoInfo = initialResponse
        document.getElementsByName("server-response")[0].remove() // 使いまわすべきではないので削除。Reactの思想(一貫性)に反するがこうするしかない。
        // console.log("using initialResponse")
    } else {
        // getVideoInfoが200以外だったらuseQuery側でハンドルしてもらう
        fetchedVideoInfo = await getVideoInfo(smId)
    }
    if (!fetchedVideoInfo || !fetchedVideoInfo.data) throw new Error("failed to fetch video data")
    return fetchedVideoInfo
}
