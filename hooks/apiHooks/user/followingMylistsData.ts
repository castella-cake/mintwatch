import { getUserFollowingsMylists } from "@/utils/apis/user/followings"
import { useQuery } from "@tanstack/react-query"

export function useFollowingMylistsData() {
    const { data: followingMylistsData, error, isLoading } = useQuery({
        queryKey: ["followingMylists"],
        queryFn: () => {
            return getUserFollowingsMylists()
        },
    })
    return { followingMylistsData, error, isLoading }
}
