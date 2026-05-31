import { useInfiniteQuery } from "@tanstack/react-query"

export function useMyWatchHistoryData(limit = 6) {
    const { data: myWatchHistoryData, error, isLoading, isFetching, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["myHistoryData", 6],
        queryFn: ({ pageParam }) => {
            return getMyWatchHistory(limit, pageParam)
        },
        initialPageParam: "",
        getNextPageParam: (lastPage) => {
            return lastPage?.data?.nextCursor || undefined
        },
    })
    return { myWatchHistoryData, error, isLoading, isFetching, hasNextPage, fetchNextPage, isFetchingNextPage }
}
