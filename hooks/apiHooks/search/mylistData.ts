import { getMylistSearch } from "@/utils/apis/search/mylist"
import { useQuery } from "@tanstack/react-query"

export function useSearchMylistData(keyword: string, options: VideoSearchQuery = {}) {
    const { data: searchMylistData, error, isFetching } = useQuery({
        queryKey: ["search", "mylist", keyword, options],
        placeholderData: prev => prev,
        queryFn: () => {
            return getMylistSearch(keyword, options)
        },
    })
    return { searchMylistData, error, isFetching }
}
