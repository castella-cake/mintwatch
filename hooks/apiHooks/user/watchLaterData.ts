import { useQuery } from "@tanstack/react-query"

export function useWatchLaterData(sortKey: string, sortOrder: string, pageSize: number, page: number) {
    const { data: watchLaterData, isLoading, error } = useQuery({
        queryKey: ["user", "me", "watchlater", sortKey, sortOrder, pageSize, page],
        queryFn: () => getWatchLater(sortKey, sortOrder, pageSize, page),
    })

    return { watchLaterData, isLoading, error }
}
