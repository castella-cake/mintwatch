import { getUserFollowingsUsers } from "@/utils/apis/user/followings"
import { useQuery } from "@tanstack/react-query"

export function useUserFollowingsData(userId: "me" | number, pageSize = 20) {
    const { data, error, isLoading } = useQuery({
        queryKey: ["user", userId, "followings", "users", pageSize],
        queryFn: () => getUserFollowingsUsers(userId, pageSize),
    })
    return { data, error, isLoading }
}
