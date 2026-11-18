import { VideoItemCard } from "@/components/Global/ItemCard/VideoItemCard"
import { useMyLikeHistory } from "@/hooks/apiHooks/user/infinityLikeHistoryData"
import { useInView } from "react-intersection-observer"
import { LoadingFiller } from "@/components/Global/LoadingFiller"
import { EmptyNotice } from "@/components/Global/EmptyNotice"

export function LikeHistory() {
    const { myLikeHistoryData, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useMyLikeHistory(20)
    const { ref, inView } = useInView()

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage])

    const flattenedItems = myLikeHistoryData?.pages.flatMap(page => page.data.items) || []
    const splittedItems = splitWithYMD(flattenedItems, item => item.likedAt)

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
                { flattenedItems.length === 0 && <EmptyNotice contentName="いいね！履歴" /> }
                {Object.keys(splittedItems).map((key) => {
                    return (
                        <div key={`history-date-${key}`} className="user-history-date">
                            <div className="user-history-date-title">{getRelativeDate(key)}</div>
                            <div className="user-videolist-view-videos">
                                {splittedItems[key].map((item, itemIndex) => {
                                    return (
                                        <div key={`history-item-${key}-${itemIndex}`} className="user-videolist-view-video">
                                            <VideoItemCard video={item.video} />
                                            { item.thanksMessage && (
                                                <div className="user-history-like-item-data">
                                                    <div className="user-history-like-item-data-message">
                                                        <div className="user-history-like-item-data-message-img">
                                                            <img src={item.video.owner.iconUrl} alt={`${item.video.owner.name} のアイコン`} />
                                                        </div>
                                                        <div className="user-history-like-item-data-message-text">
                                                            {item.thanksMessage}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )
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
