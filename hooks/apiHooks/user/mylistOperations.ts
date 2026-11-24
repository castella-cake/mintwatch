import { addItemToMylist } from "@/utils/apis/mylist"
import { createMylist, deleteMylist, getUserMylistsCompact, putUserMylistsOrder, updateMylist } from "@/utils/apis/user/userMylist"
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

export interface UpdateMylistParams {
    mylistId: number
    name: string
    description: string
    defaultSortKey: string
    defaultSortOrder: "asc" | "desc"
    isPublic: boolean
}

export function useUpdateMylistMutation() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ mylistId, name, description, defaultSortKey, defaultSortOrder, isPublic }: UpdateMylistParams) =>
            updateMylist(mylistId, name, description, defaultSortKey, defaultSortOrder, isPublic),
        onSuccess: (_data, { mylistId }) => {
            queryClient.invalidateQueries({ queryKey: ["user", "me", "mylist", mylistId] })
            queryClient.invalidateQueries({ queryKey: ["mylists"] })
            queryClient.invalidateQueries({ queryKey: ["userMylistsCompact"] })
        },
    })
}

export function useDeleteMylistMutation() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (mylistId: number) => deleteMylist(mylistId),
        onSuccess: (_data, mylistId) => {
            queryClient.removeQueries({ queryKey: ["user", "me", "mylist", mylistId] })
            queryClient.invalidateQueries({ queryKey: ["mylists"] })
            queryClient.invalidateQueries({ queryKey: ["userMylistsCompact"] })
        },
    })
}
