import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export function useMylistsData(userId: "me" | number | undefined, sampleItemCount?: number) {
    const queryClient = useQueryClient()
    const { data: mylistsData } = useQuery({
        queryKey: ["mylists", userId, sampleItemCount],
        queryFn: () => {
            if (!userId) throw new Error("userId is required")
            return getMylists(userId, sampleItemCount)
        },
        enabled: !!userId,
    })

    const mutateMylistsAddItem = useMutation({
        mutationFn: async (args: { mylistId: MylistItem["id"], itemId: string, requestWith: string }) => {
            const { mylistId, itemId, requestWith } = args
            const response = await addItemToMylist(mylistId, itemId, requestWith)
            return { ...args, response }
        },
        onSuccess: (args: { mylistId: MylistItem["id"], itemId: string, requestWith: string, response: baseResponse }) => {
            // マイリスト一覧の件数表示と、追加対象マイリストの詳細ページのキャッシュを破棄する
            queryClient.invalidateQueries({ queryKey: ["mylists"] })
            queryClient.invalidateQueries({ queryKey: ["user", "me", "mylist", args.mylistId] })
            return args
        },
    })

    return { mylistsData, mutateMylistsAddItem }
}
