import { getKeywordSearch } from "@/utils/apis/search/keyword"
import { useQuery } from "@tanstack/react-query"

export function useSearchKeywordData(keyword: string, options: VideoSearchQuery = {}) {
    const { data: searchKeywordData, error } = useQuery({
        queryKey: ["search", "keyword", keyword, options],
        queryFn: () => {
            return getKeywordSearch(keyword, options)
        },
    })
    return { searchKeywordData, error }
}
