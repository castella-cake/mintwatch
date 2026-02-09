import { VideoItemCard } from "@/components/Global/ItemCard/VideoItemCard"
import { useMyWatchHistoryData } from "@/hooks/apiHooks/user/infinityHistoryData"
import { useInView } from "react-intersection-observer"

export function WatchHistory() {
    const { myWatchHistoryData, hasNextPage, fetchNextPage, isFetchingNextPage } = useMyWatchHistoryData()
    const { ref, inView } = useInView()

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage])

    const flattenedItems = myWatchHistoryData?.pages.flatMap(page => page.data.items) || []
    const splittedItems = splitWithYMD(flattenedItems, item => item.viewedAt)

    return (
        <div className="watch-history-content user-category-content">
            <div className="watch-history-items">
                {Object.keys(splittedItems).map((key) => {
                    return (
                        <div key={`history-date-${key}`} className="watch-history-date">
                            <div className="watch-history-date-title">{getRelativeDate(key)}</div>
                            <div className="watch-history-item-container">
                                {splittedItems[key].map((item, itemIndex) => {
                                    return <VideoItemCard key={`history-item-${key}-${itemIndex}`} video={item.video} />
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
            <div ref={ref} className="watch-history-inview-anchor">
                {isFetchingNextPage && <p>Loading...</p>}
            </div>
        </div>
    )
}
