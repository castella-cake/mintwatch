import { VideoItemCard } from "@/components/Global/ItemCard/VideoItemCard"
import { useWatchLaterData } from "@/hooks/apiHooks/user/watchLaterData"

export function WatchLater() {
    const { watchLaterData } = useWatchLaterData("addedAt", "desc", 20, 1)
    return (
        <div className="watch-later-content user-category-content">
            <div className="user-videos-title">
                あとで見る (
                {watchLaterData?.data.watchLater.totalCount ?? 0}
                )
            </div>
            <div className="user-videos-items">
                {watchLaterData && watchLaterData.data.watchLater.items.map((item) => {
                    return (
                        <VideoItemCard
                            key={`watchLater-${item.itemId}`}
                            video={item.video}
                        />
                    )
                })}
            </div>
        </div>
    )
}
