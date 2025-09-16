import { getKeywordSearch } from "@/utils/apis/search/keyword"
import { useQuery } from "@tanstack/react-query"

export function useSearchKeywordData(keyword: string, page = 1) {
    const { data: searchKeywordData, error } = useQuery({
        queryKey: ["search", "keyword", keyword, page],
        queryFn: () => {
            return getKeywordSearch(keyword, page)
        },
    })
    return { searchKeywordData, error }
}
