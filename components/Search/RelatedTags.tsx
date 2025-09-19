import { IconTag } from "@tabler/icons-react"

export function AdditionalRelatedTags({ getSearchVideoData }: { getSearchVideoData: GetSearchVideoV2 }) {
    return (
        <div className="search-result-relatedtags">
            <h3>
                <IconTag />
                関連するタグで検索
            </h3>
            {getSearchVideoData.data.additionals.tags.map((tag) => {
                return (
                    <div className="search-result-relatedtags-tag" key={`${tag.type}-${tag.text}`}>
                        {tag.text}
                    </div>
                )
            })}
        </div>
    )
}
