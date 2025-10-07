import { IconPencil } from "@tabler/icons-react"
import { useRankingCustomData } from "@/hooks/apiHooks/ranking/customData"
import { VideoItemCard } from "../Global/ItemCard/VideoItemCard"

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
                                        <VideoItemCard video={video} isVerticalLayout={true} markAsLazy={index >= 5} key={`${item.data.laneId}-${video.id}`} data-index={index + 1} />
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
