import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export function useMylistsData() {
    const queryClient = useQueryClient()
    const { data: mylistsData } = useQuery({
        queryKey: ["mylists"],
        queryFn: () => {
            return getMylists()
        },
    })

    const mutateMylistsAddItem = useMutation({
        mutationFn: async (args: { mylistId: Mylist["id"], itemId: string, requestWith: string }) => {
            const { mylistId, itemId, requestWith } = args
            const response = await addItemToMylist(mylistId, itemId, requestWith)
            return { ...args, response }
        },
        onSuccess: (args: { mylistId: Mylist["id"], itemId: string, requestWith: string, response: baseResponse }) => {
            if (mylistsData) queryClient.setQueryData(["mylists"], toIncrementedMylists(mylistsData, args))
            return args
        },
    })

    return { mylistsData, mutateMylistsAddItem }
}

function toIncrementedMylists(mylistsData: MylistsResponseRootObject, args: { mylistId: Mylist["id"], itemId: string }): MylistsResponseRootObject {
    const clonedMylistsData = structuredClone(mylistsData)
    for (const index in clonedMylistsData.data.mylists) {
        if (clonedMylistsData.data.mylists[index].id === args.mylistId) {
            clonedMylistsData.data.mylists[index].itemsCount = clonedMylistsData.data.mylists[index].itemsCount + 1
        }
    }
    return clonedMylistsData
}
