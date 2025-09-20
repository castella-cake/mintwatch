import { IconTag } from "@tabler/icons-react"
import { HistoryAnchor } from "../Router/HistoryAnchor"

export function AdditionalRelatedTags({ getSearchVideoData }: { getSearchVideoData: GetSearchVideoV2 }) {
    return (
        <div className="search-result-relatedtags">
            <h3>
                <IconTag />
                関連するタグで検索
            </h3>
            <div className="search-result-relatedtags-items">
                {getSearchVideoData.data.additionals.tags.map((tag) => {
                    return (
                        <HistoryAnchor className="search-result-relatedtags-tag" key={`${tag.type}-${tag.text}`} href={`https://www.nicovideo.jp/tag/${tag.text}`}>
                            {tag.text}
                        </HistoryAnchor>
                    )
                })}
            </div>
        </div>
    )
}
