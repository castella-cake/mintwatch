import { useRecommendationsData } from "@/hooks/apiHooks/recommendations/recommendationsData"
import { LoadingFiller } from "../Global/LoadingFiller"
import { ContinuousPlayButton } from "../Global/GenericPageComponents/ContinuousPlay"
import { RelatedTags } from "../Global/GenericPageComponents/RelatedTags"
import { RecommendationsVideoList } from "./RecommendationsVideoList"

export default function RecommendationsContent() {
    const recommendationsData = useRecommendationsData()

    const items = recommendationsData?.data?.response.$getRecommend.data?.items ?? []
    const recommendedTags = useMemo(
        () => Array.from(new Set(items.map(i => i.reason?.tag).filter((t): t is string => Boolean(t)))),
        [items],
    )
    const playlist = recommendationsData?.data?.response.page.playlist ?? ""
    const totalCount = items.filter(item => item.contentType === "video").length
    const firstVideoId = items.find(item => item.contentType === "video")?.id ?? ""

    if (!recommendationsData) return <LoadingFiller />

    if (recommendationsData.meta?.status && recommendationsData.meta.status !== 200) {
        return (
            <div className="recommendations-error">
                <h2>おすすめの動画を取得できませんでした</h2>
                <small className="recommendations-error-name">
                    {recommendationsData.meta.errorCode ?? ""}
                </small>
                <p className="recommendations-error-message">
                    ページの再読み込みをお試しください。
                </p>
            </div>
        )
    }

    return (
        <div className="recommendations-content">
            <title>おすすめの動画 - ニコニコ動画</title>
            <div className="recommendations-header">
                <h2 className="recommendations-title">
                    <strong>おすすめの動画</strong>
                    {totalCount > 0 && (
                        <span className="recommendations-title-totalcount">
                            {" - "}
                            <strong>{totalCount}</strong>
                            {" "}
                            件の動画が見つかりました
                        </span>
                    )}
                </h2>
                {playlist && firstVideoId && (
                    <ContinuousPlayButton
                        playlistQuery={playlist}
                        firstVideoId={firstVideoId}
                    />
                )}
            </div>
            <RelatedTags tags={recommendedTags} />
            <RecommendationsVideoList items={items} playlist={playlist} />
        </div>
    )
}
