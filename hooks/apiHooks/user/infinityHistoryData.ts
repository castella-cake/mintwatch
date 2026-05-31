import { useInfiniteQuery } from "@tanstack/react-query"

export function useMyWatchHistoryData(limit = 6) {
    const { data: myWatchHistoryData, error, isFetching, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["myHistoryData"],
        queryFn: ({ pageParam }) => {
            return getMyWatchHistory(limit, pageParam)
        },
        initialPageParam: "",
        getNextPageParam: (lastPage) => {
            return lastPage?.data?.nextCursor || undefined
        },
    })
    return { myWatchHistoryData, error, isFetching, hasNextPage, fetchNextPage, isFetchingNextPage }
}
