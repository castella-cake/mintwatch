import { getMyLikeHistory } from "@/utils/apis/user/me/likes"
import { useInfiniteQuery } from "@tanstack/react-query"

export function useMyLikeHistory(pageSize: number) {
    const { data: myLikeHistoryData, error, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["myLikeHistoryData"],
        queryFn: ({ pageParam }) => {
            return getMyLikeHistory(pageParam, pageSize)
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, _, lastPageParam) => {
            return lastPage?.data?.summary.canGetNextPage ? lastPageParam + 1 : undefined
        },
    })
    return { myLikeHistoryData, error, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage }
}
