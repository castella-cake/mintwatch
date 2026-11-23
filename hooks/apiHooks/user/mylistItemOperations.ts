import { copyMylistItems, moveMylistItems } from "@/utils/apis/user/mylistItemOperations"
import { deleteWatchLaterItems } from "@/utils/apis/watchLater"
import { deleteMylistItems, putMylistItemDescription } from "@/utils/apis/user/userMylist"
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

export interface PutMylistItemDescriptionParams {
    mylistId: number
    itemId: number
    description: string
}

export function usePutMylistItemDescription() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ mylistId, itemId, description }: PutMylistItemDescriptionParams) => putMylistItemDescription(mylistId, itemId, description),
        onSuccess: (data, { mylistId }) => {
            queryClient.setQueriesData<UserMylistResponseRootObject>({ queryKey: ["user", "me", "mylist", mylistId] }, (mylistData) => {
                if (!mylistData) return mylistData
                return {
                    ...mylistData,
                    data: {
                        ...mylistData.data,
                        mylist: {
                            ...mylistData.data.mylist,
                            items: mylistData.data.mylist.items.map(item => item.itemId === data.data.item.itemId ? data.data.item : item),
                        },
                    },
                }
            })
        },
    })
}
