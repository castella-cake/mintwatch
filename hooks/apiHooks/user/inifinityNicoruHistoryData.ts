import { getNicoruHistory } from "@/utils/apis/user/me/nicoru"
import { useInfiniteQuery } from "@tanstack/react-query"

export function useMyInfiniteNicoruHistoryData(type: "send" | "receive") {
    const { data: myNicoruHistoryData, error, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["myNicoruHistoryData", type],
        queryFn: ({ pageParam }) => {
            return getNicoruHistory(type, 100, pageParam)
        },
        initialPageParam: "",
        getNextPageParam: (lastPage) => {
            return lastPage.data.next || undefined
        },
    })
    return { myNicoruHistoryData, error, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage }
}
