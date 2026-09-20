import { useInfiniteQuery } from "@tanstack/react-query"

export function useInfiniteUserFollowedByData(userId: "me" | number, pageSize = 100) {
    const { data, error, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["user", userId, "followedBy", "users", pageSize],
        queryFn: ({ pageParam }) => getUserFollowedBy(userId, pageSize, pageParam),
        initialPageParam: "",
        getNextPageParam: lastPage => lastPage?.data?.summary.hasNext ? lastPage.data.summary.cursor : undefined,
    })
    return { data, error, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage }
}
