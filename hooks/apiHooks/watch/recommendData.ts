import { useQuery } from "@tanstack/react-query"

export function useRecommendData(recipeId: "video_watch_recommendation" | "video_top_recommend" | "video_top_genre_tag_recommend", query?: string | undefined, limit = 25) {
    const { data: recommendData } = useQuery({
        queryKey: ["recommendData", recipeId, query, limit],
        queryFn: () => {
            if (!query && recipeId !== "video_top_recommend") throw new Error("no-query") // 無効時には fetch させないように工夫
            return getRecommend(recipeId, query, limit)
        },
        enabled: !!query || recipeId === "video_top_recommend", // smId が falsy（null, undefined, ''）ならフェッチしない
    })
    return recommendData
}
