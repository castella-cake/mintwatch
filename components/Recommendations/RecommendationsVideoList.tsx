import { VList } from "virtua"
import type { RecommendItem } from "@/types/RecommendData"
import { VideoItemCard } from "../Global/ItemCard/VideoItemCard"
import { SearchPlayFromVideoButton } from "../Search/GenericComponents/ContinuousPlay"
import { isContentIsVideoItem } from "@/utils/recommendUtils"

export function RecommendationsVideoList({ items, playlist }: { items: RecommendItem[], playlist: string }) {
    const videoItems = items.filter(isContentIsVideoItem)

    if (videoItems.length === 0) {
        return (
            <div className="recommendations-videolist-empty">
                表示できるおすすめの動画がありません。
            </div>
        )
    }

    return (
        <div className="recommendations-videolist">
            <VList data={videoItems}>
                {videoItems.map((item, index) => (
                    <VideoItemCard
                        key={item.id}
                        video={item.content}
                        layoutType="vertical-simple"
                        markAsLazy={index >= 5}
                        data-index={index + 1}
                        externalVideoActionChildren={playlist
                            ? <SearchPlayFromVideoButton playlistQuery={playlist} video={item.content} />
                            : undefined}
                    />
                ))}
            </VList>
        </div>
    )
}
