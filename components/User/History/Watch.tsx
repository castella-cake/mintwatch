import { VideoItemCard } from "@/components/Global/ItemCard/VideoItemCard"
import { useMyWatchHistoryData } from "@/hooks/apiHooks/user/infinityHistoryData"
import { useInView } from "react-intersection-observer"
import { LoadingFiller } from "@/components/Global/LoadingFiller"
import { EmptyNotice } from "@/components/Global/EmptyNotice"

export function WatchHistory() {
    const { myWatchHistoryData, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useMyWatchHistoryData()
    const { ref, inView } = useInView()

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage])

    const flattenedItems = myWatchHistoryData?.pages.flatMap(page => page.data.items) || []
    const splittedItems = splitWithYMD(flattenedItems, item => item.viewedAt)

    if (isLoading) {
        return (
            <div className="user-history-content user-category-content">
                <LoadingFiller />
            </div>
        )
    }

    return (
        <div className="user-history-content user-category-content">
            <div className="user-history-items">
                { flattenedItems.length === 0 && <EmptyNotice contentName="視聴履歴" /> }
                {Object.keys(splittedItems).map((key) => {
                    return (
                        <div key={`history-date-${key}`} className="user-history-date">
                            <div className="user-history-date-title">{getRelativeDate(key)}</div>
                            <div className="user-history-item-container">
                                {splittedItems[key].map((item, itemIndex) => {
                                    return <VideoItemCard key={`history-item-${key}-${itemIndex}`} video={item.video} />
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
            <div ref={ref} className="user-history-inview-anchor">
                {isFetchingNextPage && <LoadingFiller compact />}
            </div>
        </div>
    )
}
