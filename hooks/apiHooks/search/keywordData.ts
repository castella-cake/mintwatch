import { getKeywordSearch } from "@/utils/apis/search/keyword"
import { useQuery } from "@tanstack/react-query"

export function useSearchKeywordData(keyword: string, options: { page?: number, sort?: string, order?: string, kind?: string, l_range?: number, f_range?: number, genre?: string } = {}) {
    const { data: searchKeywordData, error } = useQuery({
        queryKey: ["search", "keyword", keyword, options],
        queryFn: () => {
            return getKeywordSearch(keyword, options)
        },
    })
    return { searchKeywordData, error }
}
