import { getRankingTeibanFeaturedKeys } from "@/utils/apis/ranking/featuredKeys"
import { useQuery } from "@tanstack/react-query"

export function useFeaturedKeysData() {
    const { data: featuredKeyData, isLoading, error } = useQuery({
        queryKey: ["ranking", "featuredKeys"],
        queryFn: () => {
            return getRankingTeibanFeaturedKeys()
        },
    })
    return { featuredKeyData, isLoading, error }
}
