import { useQuery } from "@tanstack/react-query"

export function useSearchUserData(keyword: string, options: VideoSearchQuery = {}) {
    const { data: searchUserData, error, isFetching } = useQuery({
        queryKey: ["search", "user", keyword, options],
        placeholderData: prev => prev,
        queryFn: () => {
            return getFastUserSearch(keyword, options)
        },
    })
    return { searchUserData, error, isFetching }
}
