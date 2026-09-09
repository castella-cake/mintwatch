import { useRecommendationsData } from "@/hooks/apiHooks/recommendations/recommendationsData"
import { LoadingFiller } from "../Global/LoadingFiller"
import { RecommendationsTags } from "./RecommendationsTags"
import { RecommendationsVideoList } from "./RecommendationsVideoList"

export default function RecommendationsContent() {
    const recommendationsData = useRecommendationsData()

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

    const items = recommendationsData.data?.response.$getRecommend.data?.items ?? []
    const playlist = recommendationsData.data?.response.page.playlist ?? ""

    return (
        <div className="recommendations-content">
            <title>おすすめの動画 - ニコニコ動画</title>
            <RecommendationsTags items={items} playlist={playlist} />
            <RecommendationsVideoList items={items} playlist={playlist} />
        </div>
    )
}
