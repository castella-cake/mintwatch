import { useRecommendData } from "@/hooks/apiHooks/watch/recommendData"
import { VideoItemCard } from "../Global/ItemCard/VideoItemCard"
// import { useActivitiesQuery } from "@/hooks/apiHooks/global/activities"
import { useMyWatchHistoryData } from "@/hooks/apiHooks/user/infinityHistoryData"
import { useGenresQuery } from "@/hooks/apiHooks/global/genres"
import { HistoryAnchor } from "../Router/HistoryAnchor"

import "./styles/VideoTopContent.css"
import { RecentActivity } from "./RecentActivity/RecentActivity"
import { useLocationContext } from "../Router/RouterContext"
import { FeedRanking } from "./FeedRanking/FeedRanking"

export function VideoTopContent() {
    const location = useLocationContext()

    const recommendData = useRecommendData("video_top_recommend")

    // const { activitiesData } = useActivitiesQuery("top_follow", "video")

    const { myWatchHistoryData } = useMyWatchHistoryData(10)

    const { genresData } = useGenresQuery()

    return (
        <div className="videotop-content">
            {genresData?.data?.genres && genresData.data.genres.length > 0 && (
                <div className="videotop-genres">
                    <HistoryAnchor
                        className="videotop-genre"
                        href="/video_top"
                        data-is-active={location.pathname === `/video_top`}
                    >
                        TOP
                    </HistoryAnchor>
                    {genresData.data.genres.map(genre => (
                        <HistoryAnchor
                            key={genre.key}
                            className="videotop-genre"
                            href={`/video_top/genre/${encodeURIComponent(genre.key)}`}
                            data-is-active={location.pathname === `/video_top/genre/${encodeURIComponent(genre.key)}`}
                        >
                            {genre.label}
                        </HistoryAnchor>
                    ))}
                </div>
            )}
            <div className="videotop-left videotop-follow">
                <div className="videotop-left-title">What&apos;s New</div>
                <RecentActivity />
            </div>
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
