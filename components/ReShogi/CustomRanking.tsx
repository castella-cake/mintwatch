import { Card } from "@/components/Global/InfoCard"
import { readableInt, secondsToTime } from "@/utils/readableValue"
import { IconFolderFilled, IconMessageFilled, IconPencil, IconPlayerPlayFilled } from "@tabler/icons-react"
import relativeTimeFrom from "@/utils/relativeTimeFrom"
import { useRankingCustomData } from "@/hooks/apiHooks/ranking/customData"

export default function CustomRankingContent() {
    const customRankingData = useRankingCustomData()
    if (!customRankingData) {
        return <div className="shogi-loading">Loading...</div>
    }
    return (
        <div className="shogi-custom-ranking">
            <title>カスタムランキング - ニコニコ動画</title>
            {customRankingData.data.response.$getCustomRankingRanking.map((item) => {
                return (
                    <div className="shogi-ranking-lane" key={item.data.laneId}>
                        <div className="shogi-ranking-lane-title">
                            {item.data.title || item.data.defaultTitle}
                            <br />
                            <button className="shogi-ranking-lane-editbutton" aria-disabled="true">
                                <IconPencil />
                                編集
                            </button>
                        </div>
                        <div className="shogi-ranking-lane-videolist">
                            {
                                item.data.videoList.map((video, index) => {
                                    return (
                                        <div className="shogi-ranking-lane-videolist-item" key={`${item.data.laneId}-${video.id}`} data-index={index + 1}>
                                            <Card
                                                href={`https://www.nicovideo.jp/watch/${encodeURIComponent(video.id)}`}
                                                additionalClassName="shogi-video"
                                                title={video.title}
                                                subTitle={(
                                                    <>
                                                        {relativeTimeFrom(new Date(video.registeredAt))}
                                                        {" "}
                                                        / by
                                                        {video.owner.name}
                                                    </>
                                                )}
                                                counts={(
                                                    <>
                                                        <span className="shogi-video-count">
                                                            <IconPlayerPlayFilled />
                                                            {readableInt(video.count.view, 1)}
                                                        </span>
                                                        <span className="shogi-video-count">
                                                            <IconMessageFilled />
                                                            {readableInt(video.count.comment, 1)}
                                                        </span>
                                                        <span className="shogi-video-count">
                                                            <IconFolderFilled />
                                                            {readableInt(video.count.mylist, 1)}
                                                        </span>
                                                    </>
                                                )}
                                                thumbnailUrl={video.thumbnail.listingUrl}
                                                thumbText={`${secondsToTime(video.duration)}`}
                                            >
                                                {video.title}
                                            </Card>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
