import type { VideoDataRootObject } from "#imports"
import { useVideoInfoContext } from "@/components/Global/Contexts/VideoDataProvider"
import { getArticle } from "@/utils/apis/dictionaly/articles"
import { IconArrowRight, IconBook2, IconDeviceTv, IconLock, IconLockOpen, IconSearch } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"

export function TagInfo() {
    const { videoInfo } = useVideoInfoContext()
    const tags = videoInfo?.data.response.tag?.items || []
    return (
        <div className="taginfo-container">
            <div className="videoaction-actiontitle">
                この動画のタグ情報
                <br />
                <span className="videoaction-actiontitle-subtitle">
                    動画に付与されているタグの一覧を表示します
                </span>
            </div>
            <div className="taginfo-items">
                {tags.map((tag) => {
                    return (
                        <TagItem key={tag.name} tag={tag} />
                    )
                })}
            </div>
        </div>
    )
}

export function TagItem({ tag }: { tag: typeof VideoDataRootObject["data"]["response"]["tag"]["items"][0] }) {
    const { data: dictInfo, isError } = useQuery({
        queryKey: ["persistent", "dictionaly", "articles", "article", tag.name],
        queryFn: () => {
            return getArticle("article", tag.name)
        },
    })
    const detectedVideoIds = detectVideoIdFromString(tag.name)
    return (
        <div className="taginfo-tag">
            <div className="taginfo-tag-title">
                <div className="taginfo-tag-title-left">
                    {tag.isLocked ? <IconLock /> : <IconLockOpen />}
                    <span className="taginfo-tag-name">{tag.name}</span>
                </div>
                <div className="taginfo-tag-title-right">
                    <a
                        href={`/tag/${tag.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="taginfo-tag-link"
                        title={`${tag.name} の動画を検索`}
                    >
                        <IconSearch />
                    </a>
                    <a
                        href={`https://dic.nicovideo.jp/a/${tag.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="taginfo-tag-link"
                        title={`${tag.name} の大百科記事を開く`}
                    >
                        <IconBook2 />
                    </a>
                </div>
            </div>
            <div className="taginfo-tag-dict-summary">
                {isError ? <span style={{ opacity: 0.7 }}>このタグの大百科記事はありません。</span> : dictInfo?.summary || <span style={{ opacity: 0.7 }}>読み込み中...</span>}
            </div>
            {detectedVideoIds && (
                <div className="taginfo-tag-videolinks">
                    <span title="このタグに含まれている動画ID">
                        <IconDeviceTv />
                        <IconArrowRight />
                    </span>
                    {detectedVideoIds.map(videoId => (
                        <a
                            key={videoId}
                            href={`https://www.nicovideo.jp/watch/${encodeURIComponent(videoId)}`}
                        >
                            {videoId}
                        </a>
                    ))}
                </div>
            )}
        </div>
    )
}
