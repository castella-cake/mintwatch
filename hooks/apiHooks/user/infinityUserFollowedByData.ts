import { useInfiniteQuery } from "@tanstack/react-query"

export function useInfiniteUserFollowedByData(userId: "me" | number, pageSize = 100) {
    const { data, error, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["user", userId, "followedBy", "users", pageSize],
        queryFn: ({ pageParam }) => getUserFollowedBy(userId, pageSize, pageParam),
        initialPageParam: "",
        // グローバルデフォルトは staleTime: Infinity だが、フォロー状態の変化は
        // 再表示時にはじめて反映したいので、マウント時には常に再取得する
        refetchOnMount: "always",
        getNextPageParam: lastPage => lastPage?.data?.summary.hasNext ? lastPage.data.summary.cursor : undefined,
    })
    return { data, error, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage }
}
