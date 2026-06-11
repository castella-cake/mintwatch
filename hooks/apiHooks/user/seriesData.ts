import { getUserOwnedSeries } from "@/utils/apis/user/userOwnedSeries"
import { useQuery } from "@tanstack/react-query"

export function useUserOwnedSeriesData(userId: number | undefined, pageSize = 100, page = 1) {
    const { data: ownedSeriesData, isLoading, error } = useQuery({
        queryKey: ["user", userId, "series", pageSize, page],
        queryFn: () => {
            if (!userId) throw new Error("userId is required")
            return getUserOwnedSeries(userId, page, pageSize)
        },
        enabled: !!userId,
    })

    return { ownedSeriesData, isLoading, error }
}
