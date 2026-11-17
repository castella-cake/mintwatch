import { useInfiniteQuery } from "@tanstack/react-query"

export function useInfiniteUserFollowingsData(userId: "me" | number, pageSize = 100) {
    const { data, error, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["user", userId, "followings", "users", pageSize],
        queryFn: ({ pageParam }) => getUserFollowingsUsers(userId, pageSize, pageParam),
        initialPageParam: "",
        // グローバルデフォルトは staleTime: Infinity だが、フォロー解除直後のグレーアウト表示は
        // 「次の再表示時には消える」挙動が前提なので、マウント時には常に再取得する
        refetchOnMount: "always",
        getNextPageParam: (lastPage) => {
            return lastPage?.data?.summary.hasNext ? lastPage.data.summary.cursor : undefined
        },
    })
    return { data, error, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage }
}
