import { copyMylistItems, moveMylistItems } from "@/utils/apis/user/mylistItemOperations"
import { deleteWatchLaterItems } from "@/utils/apis/watchLater"
import { deleteMylistItems } from "@/utils/apis/user/userMylist"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export interface CopyMylistParams {
    from: number | "deflist"
    to: number
    itemIds: string[]
}

export interface MoveMylistParams {
    from: number | "deflist"
    to: number
    itemIds: string[]
}

export interface DeleteWatchLaterParams {
    itemIds: string[]
}

export interface DeleteMylistParams {
    mylistId: number
    itemIds: string[]
}

export function useCopyMylistItems() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ from, to, itemIds }: CopyMylistParams) => copyMylistItems(from, to, itemIds),
        onSuccess: (_data, { from, to }) => {
            queryClient.invalidateQueries({ queryKey: ["user", "me", "mylist", to] })
            if (from === "deflist") queryClient.invalidateQueries({ queryKey: ["user", "me", "watchlater"] })
        },
    })
}

export function useMoveMylistItems() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ from, to, itemIds }: MoveMylistParams) => moveMylistItems(from, to, itemIds),
        onSuccess: (_data, { from, to }) => {
            queryClient.invalidateQueries({ queryKey: ["user", "me", "mylist", from] })
            queryClient.invalidateQueries({ queryKey: ["user", "me", "mylist", to] })
            if (from === "deflist") queryClient.invalidateQueries({ queryKey: ["user", "me", "watchlater"] })
        },
    })
}

export function useDeleteWatchLaterItems() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ itemIds }: DeleteWatchLaterParams) => deleteWatchLaterItems(itemIds),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user", "me", "watchlater"] })
        },
    })
}

export function useDeleteMylistItems() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ mylistId, itemIds }: DeleteMylistParams) => deleteMylistItems(mylistId, itemIds),
        onSuccess: (_data, { mylistId }) => {
            queryClient.invalidateQueries({ queryKey: ["user", "me", "mylist", mylistId] })
        },
    })
}
