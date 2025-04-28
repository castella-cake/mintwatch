import { VideoDataRootObject } from "@/types/VideoData";
import { IconArrowBackUp, IconDots, IconPlus, IconRepeat } from "@tabler/icons-react";

function returnMatchedKeyObject(objectArray: { [key: string]: any }[], keyName: string, value: string) {
    return objectArray.find( elem => elem[keyName] === value )
}

export function Share({ videoInfo }: { videoInfo: VideoDataRootObject } ) {
    if (!videoInfo.data) return <></>

    const videoInfoResponse = videoInfo.data.response
    const shareURL = `https://www.nicovideo.jp/watch/${videoInfoResponse.video.id}`
    const hashtags = [videoInfoResponse.video.id, "ニコニコ動画", "PepperMintShare"]
    const ownerName = videoInfoResponse.owner ? videoInfoResponse.owner.nickname : (videoInfoResponse.channel ? videoInfoResponse.channel.name : "非公開または退会済みユーザー")

    const shareBody = `${videoInfoResponse.video.title} - by ${ownerName}\n${shareURL}\n#${hashtags.join(" #")}`
    // Twitterとか各項目で改行してくれないので、全部bodyに押し込むことにした
    const shareIntents = {
        "twitter": `https://x.com/intent/tweet?text=${encodeURIComponent(shareBody)}`,
        "misskeyHub": `https://misskey-hub.net/share/?text=${encodeURIComponent(shareBody)}&visibility=public&localOnly=0`,
        "bluesky": `https://bsky.app/intent/compose?text=${encodeURIComponent(shareBody)}`,
    }

    const metaTags = videoInfo.data.metadata.metaTags
    const ogpTitle = returnMatchedKeyObject(metaTags, "property", "og:title")
    const ogpThumbnail = returnMatchedKeyObject(metaTags, "property", "og:image")
    const ogpDescription = returnMatchedKeyObject(metaTags, "property", "og:description")
    const ogpSiteName = returnMatchedKeyObject(metaTags, "property", "og:site_name")

    return <div className="share-container">
        <div className="videoaction-actiontitle">
            現在の動画をソーシャルネットワークに共有<br/>
            <span className="videoaction-actiontitle-subtitle">
                インテントリンクを使用してお使いのSNSにリンクを共有できます
            </span>
        </div>
        <div className="share-preview">
            <div className="share-dummy-icon"></div>
            <div className="share-dummy-name">投稿のプレビュー</div>
            <div className="share-dummy-handle">@example.com@social.example.com</div>
            <div className="share-body">
                {shareBody}
            </div>
            { ogpTitle && ogpThumbnail && ogpDescription && ogpSiteName && <div className="share-ogp">
                <img src={ogpThumbnail.content} alt="ダミーのOGP サムネイル" className="share-ogp-thumbnail"/>
                <div className="share-ogp-title">{ogpTitle.content}</div>
                <div className="share-ogp-description">{ogpDescription.content}</div>
                <div className="share-ogp-site-name">{ogpSiteName.content}</div>
            </div>}
            <div className="share-dummy-actions">
                <IconArrowBackUp/>
                <IconRepeat/>
                <IconPlus/>
                <IconDots/>
            </div>
        </div>
        <div className="share-buttons">
            <a className="share-button share-button-x" href={shareIntents["twitter"]} target="_blank">
                Xに共有
            </a>
            <a className="share-button share-button-misskey" href={shareIntents["misskeyHub"]} target="_blank">
                Misskeyに共有
            </a>
            <a className="share-button share-button-bluesky" href={shareIntents["bluesky"]} target="_blank">
                Blueskyに共有
            </a>
        </div>
    </div>
}