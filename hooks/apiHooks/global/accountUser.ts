import { getAccountUserData } from "@/utils/apis/accounts/user"
import { useQuery } from "@tanstack/react-query"

export function useAccountUserQuery(disabled = false) {
    const { data: accountUserData, error } = useQuery({
        queryKey: ["accountUser"],
        queryFn: () => {
            return getAccountUserData()
        },
        enabled: !disabled,
    })
    return { accountUserData, error }
}
