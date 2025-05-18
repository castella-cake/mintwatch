import { VideoDataRootObject } from "@/types/VideoData";
import DAnimeLinks from "./DAnimeLinks";

export function ErrorScreen({ videoInfo }: { videoInfo: VideoDataRootObject | undefined }) {
    if (!videoInfo || videoInfo.data?.response.media.domand && videoInfo.data.response.viewer) return
    const isPPV = videoInfo.data?.response.payment.preview.ppv.isEnabled
    const isAdmissionOnly = videoInfo.data?.response.payment.preview.admission.isEnabled
    const isPremiumOnly = videoInfo.data?.response.payment.preview.premium.isEnabled
    const viewer = videoInfo.data.response.viewer
    return <div className="player-errorscreen-wrapper"><div className="player-errorscreen">
        <h2 className="player-errorscreen-title">{viewer ? "視聴できません" : "ログインが必要です"}</h2>
        <div className="player-errorscreen-body">
            {!viewer && <p>MintWatch はゲストアカウントでの視聴に対応していません。<br/>続けるにはログインしてください。</p>}
            <p>
                {isPPV && <span>未レンタルのため視聴できません。</span>}
                {isAdmissionOnly && <span>チャンネルに未加入のため視聴できません。</span>}
                {isPremiumOnly && <p>この動画は現在プレミアム限定動画です。プレミアム会員に加入することで視聴できます。</p>}
            </p>
        </div>
        <DAnimeLinks/>
    </div></div>
}