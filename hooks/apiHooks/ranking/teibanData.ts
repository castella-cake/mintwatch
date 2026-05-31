import { getTeibanRanking } from "@/utils/apis/ranking/teiban"
import { useQuery } from "@tanstack/react-query"

export function useRankingTeibanData(featuredKey: string) {
    const { data: rankingTeibanData, isLoading, error } = useQuery({
        queryKey: ["ranking", "teiban", featuredKey],
        queryFn: () => {
            if (!featuredKey) throw new Error("featuredKey is required")
            return getTeibanRanking(featuredKey)
        },
        enabled: !!featuredKey,
    })
    return { rankingTeibanData, isLoading, error }
}
