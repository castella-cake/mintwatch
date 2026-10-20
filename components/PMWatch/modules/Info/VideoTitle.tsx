import { useVideoInfoContext } from "@/components/Global/Contexts/VideoDataProvider"
import { IconClockHour4Filled, IconCoinYenFilled, IconFolderFilled, IconMessageFilled, IconPlayerPlayFilled } from "@tabler/icons-react"
import { ReactNode } from "react"
import { readableInt } from "@/utils/readableValue"

export default function VideoTitle({ children, showStats }: { children?: ReactNode, showStats?: boolean }) {
    const { videoInfo } = useVideoInfoContext()
    if (!videoInfo?.video) return

    const isPaidVideo = [videoInfo.payment?.ppv, videoInfo.payment?.admission, videoInfo.payment?.premium, videoInfo.payment?.continuationBenefit].some(p => p?.isEnabled)
    const isPremiumOnlyVideo = videoInfo.payment?.premium?.isEnabled ?? false

    return (
        <div className="videotitle-container">
            <div className="videotitle">{videoInfo.video.title}</div>
            {showStats && (
                <div className="videostats">
                    <span className="videostats-item">
                        <IconClockHour4Filled />
                        <span>
                            {new Date(
                                videoInfo.video.registeredAt,
                            ).toLocaleString("ja-JP")}
                        </span>
                    </span>
                    <span className="videostats-item">
                        <IconPlayerPlayFilled />
                        <span>
                            {readableInt(
                                videoInfo.video.count.view,
                            )}
                        </span>
                    </span>
                    <span className="videostats-item">
                        <IconMessageFilled />
                        <span>
                            {readableInt(
                                videoInfo.video.count.comment,
                            )}
                        </span>
                    </span>
                    <span className="videostats-item">
                        <IconFolderFilled />
                        <span>
                            {readableInt(
                                videoInfo.video.count.mylist,
                            )}
                        </span>
                    </span>
                    <span className="videostats-item">
                        <span>
                            {videoInfo.genre?.isNotSet
                                ? "未設定"
                                : videoInfo.genre?.label}
                            {videoInfo.ranking?.teiban
                                ? (
                                        <>
                                            (
                                            <strong>{videoInfo.ranking.teiban.label}</strong>
                                            {" "}
                                            内現在順位:
                                            {videoInfo.ranking.teiban.rank}
                                            位)
                                        </>
                                    )
                                : ""}
                        </span>
                    </span>
                    {
                        isPaidVideo && (
                            <span className="videostats-item">
                                <span className="videostats-paid-label">
                                    <IconCoinYenFilled />
                                    <span>{ isPremiumOnlyVideo ? "P限" : "有料" }</span>
                                </span>
                            </span>
                        )
                    }
                </div>
            )}
            { children }
        </div>
    )
}
