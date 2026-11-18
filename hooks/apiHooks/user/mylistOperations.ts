import { addItemToMylist } from "@/utils/apis/mylist"
import { createMylist, getUserMylistsCompact, putUserMylistsOrder } from "@/utils/apis/user/userMylist"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export interface CreateMylistParams {
    name: string
    description: string
    defaultSortKey: string
    defaultSortOrder: "asc" | "desc"
    isPublic: boolean
    itemIds: string[]
}

export interface CreateMylistResult {
    mylistId: number
    failedItemCount: number
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
        mutationFn: async ({ name, description, defaultSortKey, defaultSortOrder, isPublic, itemIds }: CreateMylistParams): Promise<CreateMylistResult> => {
            const created = await createMylist(name, description, defaultSortKey, defaultSortOrder, isPublic)
            const mylistId = created.data.mylistId
            let failedItemCount = 0
            for (const itemId of itemIds) {
                try {
                    await addItemToMylist(mylistId, itemId, location.href)
                } catch {
                    failedItemCount += 1
                }
            }
            return { mylistId, failedItemCount }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mylists"] })
            queryClient.invalidateQueries({ queryKey: ["userMylistsCompact"] })
        },
    })
}
