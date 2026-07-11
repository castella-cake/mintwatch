import { VideoItemCard } from "@/components/Global/ItemCard/VideoItemCard"
import NicoruSvg from "@/components/PMWatch/modules/CommentList/nicoruSvg"
import { useMyInfiniteNicoruHistoryData } from "@/hooks/apiHooks/user/inifinityNicoruHistoryData"
import { useInView } from "react-intersection-observer"
import "../styles/Nicoru.css"
import { IconPlayerSkipForward } from "@tabler/icons-react"
import { TotalNicoruCount } from "./TotalNicoruCount"

export function NicoruHistory({ type }: { type: "send" | "receive" }) {
    const { myNicoruHistoryData, hasNextPage, fetchNextPage, isFetchingNextPage } = useMyInfiniteNicoruHistoryData(type)
    const { ref, inView } = useInView()

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage])

    const flattenedItems = myNicoruHistoryData?.pages.flatMap(page => page.data.items) || []
    const splittedItems = splitWithYMD(flattenedItems, item => item.createdAt)

    return (
        <div className="user-history-content user-category-content">
            { type === "receive" && <TotalNicoruCount /> }
            <div className="user-history-items">
                {Object.keys(splittedItems).map((key) => {
                    return (
                        <div key={`history-date-${key}`} className="user-history-date">
                            <div className="user-history-date-title">{getRelativeDate(key)}</div>
                            <div className="user-history-item-container">
                                {splittedItems[key].map((item, itemIndex) => {
                                    return (
                                        <div key={`history-item-${key}-${itemIndex}`} className="user-history-nicoru-item">
                                            <div className="user-history-nicoru-info">
                                                <div className="user-history-nicoru-comment">{item.commentBody}</div>
                                                <div className="user-history-nicoru-vpos">{secondsToTime(item.commentVpos / 1000)}</div>
                                                <div className="user-history-nicoru-total">
                                                    <NicoruSvg />
                                                    <span>{item.totalCount}</span>
                                                </div>
                                            </div>
                                            <div className="user-history-nicoru-video">
                                                <VideoItemCard
                                                    video={item.video}
                                                    layoutType="horizontal-simple"
                                                    externalVideoActionChildren={(
                                                        <a
                                                            href={`/watch/${item.video.id}?from=${item.commentVpos / 1000}`}
                                                            className="info-card-externalbutton"
                                                            title={`コメント時間から再生 (${secondsToTime(item.commentVpos / 1000)})`}
                                                        >
                                                            <IconPlayerSkipForward />
                                                        </a>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
            <div ref={ref} className="user-history-inview-anchor">
                {isFetchingNextPage && <p>Loading...</p>}
            </div>
        </div>
    )
}
