import { useRecommendData } from "@/hooks/apiHooks/watch/recommendData"
import { VideoItemCard } from "../Global/ItemCard/VideoItemCard"
import { useMyWatchHistoryData } from "@/hooks/apiHooks/user/infinityHistoryData"
import { FeedRanking } from "./FeedRanking/FeedRanking"

export function VideoTopIndex() {
    const recommendData = useRecommendData("video_top_recommend")
    const { myWatchHistoryData } = useMyWatchHistoryData(10)

    return (
        <div className="videotop-feed">
            <div className="videotop-row videotop-ranking">
                <div className="videotop-row-title">ランキング</div>
                <FeedRanking />
            </div>
            <div className="videotop-row videotop-recommend">
                <div className="videotop-row-title">おすすめ動画</div>
                <div className="videotop-row-items">
                    {
                        recommendData?.data?.items.map((item) => {
                            if (!isValidVideoItem(item.content)) return null
                            return (
                                <VideoItemCard key={item.id} video={item.content as VideoItem} layoutType="vertical-simple" />
                            )
                        })
                    }
                </div>
            </div>
            <div className="videotop-row videotop-history">
                <div className="videotop-row-title">最近見た動画</div>
                <div className="videotop-row-items">
                    {
                        myWatchHistoryData?.pages.flatMap(page => page.data.items).map((item) => {
                            return (
                                <VideoItemCard key={item.itemId} video={item.video} layoutType="vertical-simple" />
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}
