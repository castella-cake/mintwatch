import { IconTag } from "@tabler/icons-react"
import { HistoryAnchor } from "../../Router/HistoryAnchor"
import "./styles/RelatedTags.css"

export function RelatedTags({ tags }: { tags: string[] }) {
    if (tags.length === 0) return null
    return (
        <div className="generic-relatedtags">
            <h3>
                <IconTag />
                関連するタグで検索
            </h3>
            <div className="generic-relatedtags-items">
                {tags.map(tag => (
                    <HistoryAnchor
                        className="generic-relatedtags-tag"
                        key={tag}
                        href={`https://www.nicovideo.jp/tag/${encodeURIComponent(tag)}`}
                    >
                        {tag}
                    </HistoryAnchor>
                ))}
            </div>
        </div>
    )
}
