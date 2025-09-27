import { errorHaiku } from "@/utils/errorHaiku"
import DAnimeLinks from "./DAnimeLinks"
import { useVideoInfoContext } from "@/components/Global/Contexts/VideoDataProvider"
import { ErrorResponse } from "@/types/VideoData"

function ReturnErrorHaiku({ errorResponse }: { errorResponse: ErrorResponse }) {
    const [haikuRandom, setHaikuRandom] = useState(Math.random())
    let haikus = errorHaiku["INVALID_PARAMETER"]
    if (errorResponse.reasonCode === "HIDDEN_VIDEO" && errorResponse.publishScheduledAt) {
        haikus = errorHaiku["SCHEDULED_VIDEO"]
    } else if (errorResponse.reasonCode in errorHaiku) {
        haikus = errorHaiku[errorResponse.reasonCode as keyof typeof errorHaiku]
    }
    return (
        <button className="player-errorscreen-haiku" onClick={() => setHaikuRandom(Math.random())}>
            {haikus[Math.floor(haikuRandom * haikus.length)]}
        </button>
    )
}

export function ErrorScreen({ hlsErrorInfo }: { hlsErrorInfo: AccessRightsRootObject }) {
    const { flagHlsErrorScreenEnable } = useStorageVar(["flagHlsErrorScreenEnable"])
    const { videoInfo, errorInfo } = useVideoInfoContext()
    if (errorInfo && errorInfo.response) {
        const errorResponse: ErrorResponse = errorInfo.response.data.response
        return (
            <div className="player-errorscreen-wrapper">
                <div className="player-errorscreen">
                    <h2 className="player-errorscreen-title">視聴できません</h2>
                    <p>
                        この動画は再生できません。
                    </p>
                    <ReturnErrorHaiku errorResponse={errorResponse} />
                </div>
            </div>
        )
    }

    if (hlsErrorInfo !== null && flagHlsErrorScreenEnable) {
        return (
            <div className="player-errorscreen-wrapper">
                <div className="player-errorscreen">
                    <h2 className="player-errorscreen-title">再生に失敗しました</h2>
                    <p>
                        HLS 再生に失敗しました。
                        <br />
                        ページの再読み込みを試すか、時間を置いて再度お試しください。
                    </p>
                    <p>
                        問題が継続していて、新視聴ページで問題なく再生できる場合は、
                        <br />
                        MintWatch の開発者へ報告をお願いします。
                    </p>
                </div>
            </div>
        )
    }

    if (!videoInfo || (videoInfo.data?.response.media.domand && videoInfo.data.response.viewer)) return
    const isPPV = videoInfo.data?.response.payment.preview.ppv.isEnabled
    const isAdmissionOnly = videoInfo.data?.response.payment.preview.admission.isEnabled
    const isPremiumOnly = videoInfo.data?.response.payment.preview.premium.isEnabled
    const viewer = videoInfo.data.response.viewer
    return (
        <div className="player-errorscreen-wrapper">
            <div className="player-errorscreen">
                <h2 className="player-errorscreen-title">{viewer ? "視聴できません" : "ログインが必要です"}</h2>
                <div className="player-errorscreen-body">
                    {!viewer && (
                        <p>
                            MintWatch はゲストアカウントでの視聴に対応していません。
                            <br />
                            続けるにはログインしてください。
                        </p>
                    )}
                    <p>
                        {isPPV && <span>未レンタルのため視聴できません。</span>}
                        {isAdmissionOnly && <span>チャンネルに未加入のため視聴できません。</span>}
                        {isPremiumOnly && <p>この動画は現在プレミアム限定動画です。プレミアム会員に加入することで視聴できます。</p>}
                    </p>
                </div>
                { videoInfo.data.response.okReason === "PAYMENT_PREVIEW_SUPPORTED" && <DAnimeLinks /> }
            </div>
        </div>
    )
}
