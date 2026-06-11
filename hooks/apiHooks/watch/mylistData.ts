import { useQuery } from "@tanstack/react-query"

export function useMylistData(mylistId: number | undefined, pageSize = 100, page = 1, sortKey?: string, sortOrder?: "asc" | "desc") {
    const { data: mylistData, isLoading, error } = useQuery({
        queryKey: ["mylist", mylistId, pageSize, page, sortKey, sortOrder],
        queryFn: () => {
            if (!mylistId) throw new Error("mylistId is required")
            return getMylist(mylistId, pageSize, page, sortKey, sortOrder)
        },
        enabled: !!mylistId,
    })

    return { mylistData, isLoading, error }
}
