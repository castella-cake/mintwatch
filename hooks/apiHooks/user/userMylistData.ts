import { getUserMylistData } from "@/utils/apis/user/userMylist"
import { useQuery } from "@tanstack/react-query"

export function useUserMylistData(userId: "me", mylistId: number | undefined, pageSize = 100, page = 1, sortKey?: string, sortOrder?: "asc" | "desc") {
    const { data: mylistData, isLoading, error } = useQuery({
        queryKey: ["user", userId, "mylist", mylistId, pageSize, page, sortKey, sortOrder],
        queryFn: () => {
            if (!mylistId) throw new Error("mylistId is required")
            return getUserMylistData(userId, mylistId, pageSize, page, sortKey, sortOrder)
        },
        enabled: !!mylistId,
    })

    return { mylistData, isLoading, error }
}
