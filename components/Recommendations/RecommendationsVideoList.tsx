import type { RecommendItem } from "@/types/RecommendData"
import { VideoItemCard } from "../Global/ItemCard/VideoItemCard"
import { PlayFromVideoButton } from "../Global/GenericPageComponents/ContinuousPlay"
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
            {videoItems.map((item, index) => (
                <VideoItemCard
                    key={item.id}
                    video={item.content}
                    layoutType="vertical-simple"
                    markAsLazy={index >= 5}
                    data-index={index + 1}
                    externalVideoActionChildren={playlist
                        ? <PlayFromVideoButton playlistQuery={playlist} video={item.content} />
                        : undefined}
                />
            ))}
        </div>
    )
}
