import { VideoItemCard } from "@/components/Global/ItemCard/VideoItemCard"
import { useFeaturedKeysData } from "@/hooks/apiHooks/ranking/featuredKeysData"
import { useRankingTeibanData } from "@/hooks/apiHooks/ranking/teibanData"
import { IconArrowRight, IconCrown } from "@tabler/icons-react"
import "../styles/FeedRanking.css"

export function FeedRanking() {
    const { featuredKeyData } = useFeaturedKeysData()
    const topLevelFeaturedKey = featuredKeyData?.data.items.find(i => i.isTopLevel)
    const { rankingTeibanData } = useRankingTeibanData(topLevelFeaturedKey?.featuredKey)

    if (!featuredKeyData || !rankingTeibanData) return null

    return (
        <div className="feed-ranking">
            <h3 className="feed-ranking-title">
                <div className="feed-ranking-title-text">
                    {topLevelFeaturedKey?.label}
                    {" "}
                    のランキング
                </div>
                <a href="https://www.nicovideo.jp/ranking/custom" className="feed-ranking-moreactions-anchor">
                    カスタムランキングを見る
                    <IconArrowRight />
                </a>
            </h3>
            <div className="feed-ranking-videos">
                <div className="feed-ranking-videos-podium">
                    {rankingTeibanData && rankingTeibanData.data.items.slice(0, 3).map((item, index) => (
                        <div className="feed-ranking-videos-podium-item" key={item.id}>
                            <div className="feed-ranking-videos-podium-rank">
                                <IconCrown />
                                {index + 1}
                            </div>
                            <VideoItemCard video={item} layoutType="vertical-simple" />
                        </div>
                    ))}
                </div>
                <div className="feed-ranking-videos-rest">
                    <div className="feed-ranking-videos-list">
                        {rankingTeibanData && rankingTeibanData.data.items.slice(3, 5).map((item, index) => (
                            <VideoItemCard key={item.id} video={item} layoutType="horizontal-simple" data-rank={index + 4} />
                        ))}
                    </div>
                    <a href="https://www.nicovideo.jp/ranking/genre" className="feed-ranking-moreactions-anchor">
                        このジャンルランキングを見る
                        <IconArrowRight />
                    </a>
                </div>
            </div>
        </div>
    )
}
