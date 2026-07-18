import { Share } from "@/components/Global/Share"
import { VideoDataRootObject } from "@/types/VideoData"
import { VideoDataToShareBody } from "@/utils/videoShareUtils"

function returnMatchedKeyObject(objectArray: { [key: string]: any }[], keyName: string, value: string) {
    return objectArray.find(elem => elem[keyName] === value)
}

export function ShareAction({ videoInfo }: { videoInfo: VideoDataRootObject }) {
    if (!videoInfo.data) return <></>

    const videoInfoResponse = videoInfo.data.response
    if (!videoInfoResponse.video) return

    const shareBody = VideoDataToShareBody(videoInfoResponse)
    const shareURL = `https://www.nicovideo.jp/watch/${videoInfoResponse.video.id}`

    const metaTags = videoInfo.data.metadata.metaTags
    const ogpTitle = returnMatchedKeyObject(metaTags, "property", "og:title")
    const ogpThumbnail = returnMatchedKeyObject(metaTags, "property", "og:image")
    const ogpDescription = returnMatchedKeyObject(metaTags, "property", "og:description")
    const ogpSiteName = returnMatchedKeyObject(metaTags, "property", "og:site_name")

    return (
        <div className="shareaction-container">
            <div className="videoaction-actiontitle">
                視聴中の動画をソーシャルネットワークに共有
                <br />
                <span className="videoaction-actiontitle-subtitle">
                    インテントリンクまたは直接リンクを使用してお使いのSNSにリンクを共有できます
                </span>
            </div>
            <Share
                body={shareBody}
                plainUrl={shareURL}
                ogp={{
                    title: ogpTitle ? ogpTitle.content : null,
                    description: ogpDescription ? ogpDescription.content : null,
                    image: ogpThumbnail ? ogpThumbnail.content : null,
                    siteName: ogpSiteName ? ogpSiteName.content : null,
                }}
            />
        </div>
    )
}
