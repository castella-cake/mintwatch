import { getMyUserData } from "@/utils/apis/user/my"
import { useQuery } from "@tanstack/react-query"

export function useMyUserData() {
    const { data: myUserData, error, isFetching } = useQuery({
        queryKey: ["myUserData"],
        queryFn: () => {
            return getMyUserData()
        },
    })
    return { myUserData, error, isFetching }
}
