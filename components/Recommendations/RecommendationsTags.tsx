import { useMemo } from "react"
import { IconTag } from "@tabler/icons-react"
import { HistoryAnchor } from "../Router/HistoryAnchor"
import { SearchContinuousPlayButton } from "../Search/GenericComponents/ContinuousPlay"
import type { RecommendItem } from "@/types/RecommendData"

export function RecommendationsTags({ items, playlist }: { items: RecommendItem[], playlist: string }) {
    // 全件の reason.tag を収集し、Set でユニーク化
    const tags = useMemo(() => {
        const set = new Set<string>()
        for (const item of items) {
            const tag = item.reason?.tag
            if (tag) set.add(tag)
        }
        return Array.from(set)
    }, [items])

    if (tags.length === 0 && !playlist) return null

    return (
        <div className="recommendations-relatedtags">
            {tags.length > 0 && (
                <>
                    <h3>
                        <IconTag />
                        関連するタグで検索
                    </h3>
                    <div className="recommendations-relatedtags-items">
                        {tags.map(tag => (
                            <HistoryAnchor
                                className="recommendations-relatedtags-tag"
                                key={tag}
                                href={`https://www.nicovideo.jp/tag/${encodeURIComponent(tag)}`}
                            >
                                {tag}
                            </HistoryAnchor>
                        ))}
                    </div>
                </>
            )}
            {playlist && items.length > 0 && items[0].contentType === "video" && (
                <div className="recommendations-relatedtags-continuousplay">
                    <SearchContinuousPlayButton
                        playlistQuery={playlist}
                        firstVideoId={items[0].id}
                    />
                </div>
            )}
        </div>
    )
}
