import { createMylist, getUserMylistsCompact, putUserMylistsOrder } from "@/utils/apis/user/userMylist"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export interface CreateMylistParams {
    name: string
    description: string
    defaultSortKey: string
    defaultSortOrder: "asc" | "desc"
    isPublic: boolean
}

export function useUserMylistsCompactData(enabled: boolean) {
    const { data: userMylistsCompactData, error, isLoading } = useQuery({
        queryKey: ["userMylistsCompact"],
        queryFn: () => {
            return getUserMylistsCompact()
        },
        enabled,
    })
    return { userMylistsCompactData, error, isLoading }
}

export function useMylistOrderMutation() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (mylistIds: number[]) => putUserMylistsOrder(mylistIds),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mylists"] })
            queryClient.invalidateQueries({ queryKey: ["userMylistsCompact"] })
        },
    })
}

export function useCreateMylistMutation() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ name, description, defaultSortKey, defaultSortOrder, isPublic }: CreateMylistParams) => {
            return createMylist(name, description, defaultSortKey, defaultSortOrder, isPublic)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mylists"] })
            queryClient.invalidateQueries({ queryKey: ["userMylistsCompact"] })
        },
    })
}
