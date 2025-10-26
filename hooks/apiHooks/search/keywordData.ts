import { useQuery } from "@tanstack/react-query"

export function useSearchKeywordData(keyword: string, options: VideoSearchQuery = {}) {
    const { data: searchKeywordData, error, isFetching } = useQuery({
        queryKey: ["search", "keyword", keyword, options],
        placeholderData: prev => prev,
        queryFn: () => {
            return getFastKeywordSearch(keyword, options)
        },
    })
    return { searchKeywordData, error, isFetching }
}
