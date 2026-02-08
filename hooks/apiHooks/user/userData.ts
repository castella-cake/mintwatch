import { getUserData } from "@/utils/apis/user/user"
import { useQuery } from "@tanstack/react-query"

export function useUserData(userId: number) {
    const { data: userData, error, isFetching } = useQuery({
        queryKey: ["userData", userId],
        queryFn: () => {
            return getUserData(userId)
        },
    })
    return { myUserData: userData, error, isFetching }
}
