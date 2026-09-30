import { errorHaiku } from "@/utils/errorHaiku"
import DAnimeLinks from "./DAnimeLinks"
import { useVideoInfoContext } from "@/components/Global/Contexts/VideoDataProvider"
import { ErrorResponse } from "@/types/watch/Base"
import { isRedirectResponse } from "@/utils/responseUtils"

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

export function ErrorScreen({ hlsErrorInfo }: { hlsErrorInfo: unknown }) {
    const { flagHlsErrorScreenEnable } = useStorageVar(["flagHlsErrorScreenEnable"])
    const { videoInfo, errorInfo } = useVideoInfoContext()
    if (errorInfo && errorInfo.response) {
        if (isRedirectResponse(errorInfo.response)) {
            return (
                <div className="player-errorscreen-wrapper">
                    <div className="player-errorscreen">
                        <h2 className="player-errorscreen-title">リダイレクトが発生しました</h2>
                        <p>
                            この動画URLは別のページへのリダイレクトです。
                            <br />
                            <a href={errorInfo.response.data.location}>
                                再度移動する
                            </a>
                        </p>
                    </div>
                </div>
            )
        }
        const errorResponse: ErrorResponse = errorInfo.response.data.response
        if (!errorResponse) return
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

    if (!videoInfo?.media || (videoInfo?.media?.contents && videoInfo?.viewer)) return
    const isPPV = videoInfo?.payment?.ppv.isEnabled
    const isAdmissionOnly = videoInfo?.payment?.admission.isEnabled
    const isPremiumOnly = videoInfo?.payment?.premium.isEnabled
    return (
        <div className="player-errorscreen-wrapper">
            <div className="player-errorscreen">
                <h2 className="player-errorscreen-title">{videoInfo?.viewer ? "視聴できません" : "ログインが必要です"}</h2>
                <div className="player-errorscreen-body">
                    {!videoInfo?.viewer && (
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
                {videoInfo?.okReason === "PAYMENT_PREVIEW_SUPPORTED" && <DAnimeLinks />}
            </div>
        </div>
    )
}
