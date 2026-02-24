// import { useLang } from "../localizeHook";
import { useRecommendContext } from "@/components/Global/Contexts/RecommendProvider"
import { VideoItemCard } from "@/components/Global/ItemCard/VideoItemCard"
import { WatchNextVideoAction } from "./WatchNextVideoAction"
import { Card, LiveInfo, MylistInfo, VideoQueueDraggable } from "@/components/Global/InfoCard"
function Recommend({ isHorizontalCardLayout }: { isHorizontalCardLayout?: boolean }) {
    const { showExtendedRecommend, showLiveInRecommend } = useStorageVar(["showExtendedRecommend", "showLiveInRecommend"])
    const recommendData = useRecommendContext()

    if (!recommendData || !recommendData.data)
        return (
            <span>レコメンド取得中</span>
        )
    return (
        recommendData.data.items.map((elem, index) => {
            if (isContentIsVideoItem(elem)) {
                return (
                    <VideoQueueDraggable key={`recommend-${elem.id}`} id={`${elem.id.toString()}-recommend`} obj={elem.content}>
                        <VideoItemCard
                            video={elem.content}
                            markAsLazy={index >= 5}
                            showStats={showExtendedRecommend}
                            layoutType={isHorizontalCardLayout ? "vertical-simple" : "horizontal-simple"}
                            externalVideoActionChildren={(
                                <WatchNextVideoAction playlistObject={videoItemToPlaylistItem(elem.content)} />
                            )}
                        />
                    </VideoQueueDraggable>
                )
            }
            if (isContentIsMylistItem(elem)) {
                return (
                    <MylistInfo
                        key={`recommend-${elem.id}`}
                        obj={elem.content}
                    />
                )
            }
            if (isContentIsLive(elem)) {
                if (!showLiveInRecommend) return
                return (
                    <LiveInfo
                        key={`recommend-${elem.id}`}
                        obj={elem.content}
                    />
                )
            }
            return (
                <Card
                    key={`recommend-unknown-${index}`}
                    additionalClassName="genericitem-card"
                    title="不明なコンテンツ"
                    href={null}
                    thumbChildren={(
                        <>
                            <div className="videoitem-muted-overlay">
                            </div>
                        </>
                    )}
                    data-layout={isHorizontalCardLayout}
                    subTitle={(
                        <></>
                    )}
                    counts={(
                        <></>
                    )}
                >
                    不明なコンテンツ
                </Card>
            )
        })
    )
}

export default Recommend
