import { useInfiniteQuery } from "@tanstack/react-query"

export function useMyWatchHistoryData() {
    const { data: myWatchHistoryData, error, isFetching, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["myHistoryData"],
        queryFn: ({ pageParam }) => {
            return getMyWatchHistory(6, pageParam)
        },
        initialPageParam: "",
        getNextPageParam: (lastPage) => {
            return lastPage?.data?.nextCursor || undefined
        },
    })
    return { myWatchHistoryData, error, isFetching, hasNextPage, fetchNextPage, isFetchingNextPage }
}
