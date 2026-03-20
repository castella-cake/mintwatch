import { getUserData } from "@/utils/apis/user/user"
import { useQuery } from "@tanstack/react-query"

export function useUserData(userId: number) {
    const { data: userData, error, isLoading } = useQuery({
        queryKey: ["userData", userId],
        queryFn: () => {
            return getUserData(userId)
        },
    })
    return { userData, error, isLoading }
}
