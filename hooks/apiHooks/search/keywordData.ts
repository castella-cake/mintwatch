import { useQuery } from "@tanstack/react-query"

export function useSearchKeywordData(keyword: string, options: VideoSearchQuery = {}, isShorts = false) {
    const { data: searchKeywordData, error, isFetching } = useQuery({
        queryKey: ["search", isShorts ? "keyword_shorts" : "keyword", keyword, options],
        placeholderData: prev => prev,
        queryFn: () => {
            return getFastKeywordSearch(keyword, options, isShorts)
        },
    })
    return { searchKeywordData, error, isFetching }
}
