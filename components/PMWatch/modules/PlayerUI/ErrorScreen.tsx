import { VideoDataRootObject } from "@/types/VideoData";
import DAnimeLinks from "./DAnimeLinks";

export function ErrorScreen({ videoInfo }: { videoInfo: VideoDataRootObject | null}) {
    if (!videoInfo || videoInfo.data?.response.media.domand && videoInfo.data.response.viewer) return
    const isPPV = videoInfo.data?.response.payment.preview.ppv.isEnabled
    const isPremiumOnly = videoInfo.data?.response.payment.preview.premium.isEnabled
    const viewer = videoInfo.data.response.viewer
    return <div className="player-errorscreen-wrapper"><div className="player-errorscreen">
        <h2 className="player-errorscreen-title">{viewer ? "有料動画" : "ログインが必要です"}</h2>
        <div className="player-errorscreen-body">
            {!viewer && <p>MintWatch はゲストアカウントでの視聴に対応していません。<br/>続けるにはログインしてください。</p>}
            {isPPV && "未レンタル/未加入のため視聴できません。"}
            {isPremiumOnly && "この動画は現在プレミアム限定動画です。プレミアム会員に加入することでも視聴できます。"}
        </div>
        <DAnimeLinks/>
    </div></div>
}