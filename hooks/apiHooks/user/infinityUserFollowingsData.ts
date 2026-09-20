import { useInfiniteQuery } from "@tanstack/react-query"

export function useInfiniteUserFollowingsData(userId: "me" | number, pageSize = 100) {
    const { data, error, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["user", userId, "followings", "users", pageSize],
        queryFn: ({ pageParam }) => getUserFollowingsUsers(userId, pageSize, pageParam),
        initialPageParam: "",
        getNextPageParam: (lastPage) => {
            return lastPage?.data?.summary.hasNext ? lastPage.data.summary.cursor : undefined
        },
    })
    return { data, error, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage }
}
