import { useQuery } from "@tanstack/react-query"

export function useRankingCustomData() {
    const { data: rankingCustomData } = useQuery({
        queryKey: ["ranking", "custom"],
        queryFn: () => {
            return getCustomRanking()
        },
    })
    return rankingCustomData
}
