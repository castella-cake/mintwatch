import { useVideoInfoContext } from "@/components/Global/Contexts/VideoDataProvider";
import { IconClockHour4Filled, IconCoinYenFilled, IconFolderFilled, IconMessageFilled, IconPlayerPlayFilled } from "@tabler/icons-react";
import { ReactNode } from "react";
import { readableInt } from "@/utils/readableValue";

export default function VideoTitle({ children, showStats }: { children?: ReactNode, showStats?: boolean }) {
    const { videoInfo } = useVideoInfoContext();
    if (!videoInfo) return;
    const videoInfoResponse = videoInfo.data.response;

    const isPaidVideo = Object.keys(videoInfoResponse.payment.preview).some((key) => videoInfoResponse.payment.preview[key as keyof typeof videoInfoResponse.payment.preview].isEnabled);
    const isPremiumOnlyVideo = videoInfoResponse.payment.preview.premium.isEnabled

    return (
        <div className="videotitle-container">
            <div className="videotitle">{videoInfoResponse.video.title}</div>
            {showStats && (
                <div className="videostats">
                    <span className="videostats-item">
                        <IconClockHour4Filled />
                        <span>
                            {new Date(
                                videoInfoResponse.video.registeredAt,
                            ).toLocaleString("ja-JP")}
                        </span>
                    </span>
                    <span className="videostats-item">
                        <IconPlayerPlayFilled />
                        <span>
                            {readableInt(
                                videoInfoResponse.video.count.view,
                            )}
                        </span>
                    </span>
                    <span className="videostats-item">
                        <IconMessageFilled />
                        <span>
                            {readableInt(
                                videoInfoResponse.video.count.comment,
                            )}
                        </span>
                    </span>
                    <span className="videostats-item">
                        <IconFolderFilled />
                        <span>
                            {readableInt(
                                videoInfoResponse.video.count.mylist,
                            )}
                        </span>
                    </span>
                    <span className="videostats-item">
                        <span>
                            {videoInfoResponse.genre.isNotSet
                                ? "未設定"
                                : videoInfoResponse.genre.label}
                            {videoInfoResponse.ranking.teiban
                                ? <>
                                    (<strong>{videoInfoResponse.ranking.teiban.label}</strong> 内現在順位: {videoInfoResponse.ranking.teiban.rank}位)
                                </>
                                : ""}
                        </span>
                    </span>
                    {
                        isPaidVideo && <span className="videostats-item">
                            <span className="videostats-paid-label">
                                <IconCoinYenFilled/>
                                <span>{ isPremiumOnlyVideo ? "P限" : "有料" }</span>
                            </span>
                        </span>
                    }
                </div>
            )}
            { children }
        </div>
    );
}