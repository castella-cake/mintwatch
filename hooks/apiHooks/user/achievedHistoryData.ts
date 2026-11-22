import { getUserAchievedHistories, getUserPinnedAchievedHistory, pinUserAchievedHistory } from "@/utils/apis/user/achievedHistory"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export function useAchievedHistoryData(userId: number | undefined, order: "honor_class" | "achieved_at", limit = 100, page = 1) {
    const { data: achievedHistoryData, isLoading, error } = useQuery({
        queryKey: ["user", userId, "achievedHistories", order, limit, page],
        queryFn: () => {
            if (!userId) throw new Error("userId is required")
            return getUserAchievedHistories(userId, order, limit, page)
        },
        enabled: !!userId,
    })

    return { achievedHistoryData, isLoading, error }
}

export function usePinnedAchievedHistoryData(userId: number | undefined) {
    const { data: pinnedAchievedHistoryData, isLoading, error } = useQuery({
        queryKey: ["user", userId, "pinnedAchievedHistory"],
        queryFn: () => {
            if (!userId) throw new Error("userId is required")
            return getUserPinnedAchievedHistory(userId)
        },
        enabled: !!userId,
    })

    return { pinnedAchievedHistoryData, isLoading, error }
}

export function usePinAchievedHistoryMutation(userId: number) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (achievedHistoryId: number) => pinUserAchievedHistory(achievedHistoryId),
        onSuccess: (pinnedAchievedHistoryData) => {
            queryClient.setQueryData(["user", userId, "pinnedAchievedHistory"], pinnedAchievedHistoryData)
        },
    })
}
