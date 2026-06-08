import { useQuery } from "@tanstack/react-query"

export function usePlaylistMylistData(mylistId: number | undefined, sort = "addedAt", order: "asc" | "desc" = "desc") {
    const { data: mylistData, isLoading, error } = useQuery({
        queryKey: ["mylist", mylistId],
        queryFn: () => {
            if (!mylistId) throw new Error("mylistId is required")
            return getPlaylistMylist(mylistId, sort, order)
        },
        enabled: !!mylistId,
    })

    return { mylistData, isLoading, error }
}
