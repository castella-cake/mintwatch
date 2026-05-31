import { useQuery } from "@tanstack/react-query"

export function useRecommendData(recipeId: "video_watch_recommendation" | "video_top_recommend", smId?: string | null, limit = 25) {
    const { data: recommendData } = useQuery({
        queryKey: ["recommendData", recipeId, smId, limit],
        queryFn: () => {
            if (!smId && recipeId === "video_watch_recommendation") throw new Error("no-smid") // 無効時には fetch させないように工夫
            return getRecommend(recipeId, smId, limit)
        },
        enabled: !!smId || recipeId === "video_top_recommend", // smId が falsy（null, undefined, ''）ならフェッチしない
    })
    return recommendData
}
