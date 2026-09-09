import { useQuery } from "@tanstack/react-query"

export function useRecommendationsData() {
    const { data: recommendationsData } = useQuery({
        queryKey: ["recommendations"],
        queryFn: () => {
            return getFastRecommendations()
        },
    })
    return recommendationsData
}
