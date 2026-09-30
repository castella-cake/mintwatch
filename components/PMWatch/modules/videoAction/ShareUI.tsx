import { useState } from "react"
import { Share } from "@/components/Global/Share"
import { VideoDataToShareBody } from "@/utils/videoShareUtils"
import { useCommentContentContext } from "@/components/Global/Contexts/CommentDataProvider"
import { useVideoInfoContext } from "@/components/Global/Contexts/VideoDataProvider"
import "../../styleModules/VideoActionModal/ShareUI.css"

export function ShareAction() {
    const [includePastLog, setIncludePastLog] = useState(false)
    const { currentLogData } = useCommentContentContext()
    const { videoInfo } = useVideoInfoContext()

    if (!videoInfo?.video) return <></>

    const pastLogWhen = includePastLog && currentLogData ? currentLogData.when : undefined
    const shareBody = VideoDataToShareBody({ video: videoInfo.video, owner: videoInfo.owner ?? null }, pastLogWhen)
    const baseURL = `https://www.nicovideo.jp/watch/${videoInfo.video.id}`
    const shareURL = pastLogWhen ? `${baseURL}?past_log=${pastLogWhen}` : baseURL

    const ogp = {
        title: videoInfo.video.title,
        description: videoInfo.video.description,
        image: videoInfo.video.thumbnail.ogp || videoInfo.video.thumbnail.large || null,
        siteName: "ニコニコ動画",
    }

    return (
        <div className="shareaction-container">
            <div className="videoaction-actiontitle">
                視聴中の動画をソーシャルネットワークに共有
                <br />
                <span className="videoaction-actiontitle-subtitle">
                    インテントリンクまたは直接リンクを使用してお使いのSNSにリンクを共有できます
                </span>
            </div>
            {currentLogData && (
                <div className="shareaction-pastlogoption">
                    <label>
                        <input
                            type="checkbox"
                            checked={includePastLog}
                            onChange={e => setIncludePastLog(e.target.checked)}
                        />
                        過去ログ情報を付加する
                    </label>
                    <div className="shareaction-pastloghint">
                        リンクから過去ログをロードするためには、対応したプレイヤーが必要になります。
                    </div>
                </div>
            )}
            <Share
                body={shareBody}
                plainUrl={shareURL}
                ogp={ogp}
            />
        </div>
    )
}
