import { useQuery } from "@tanstack/react-query"

export function useSearchSeriesData(keyword: string, options: VideoSearchQuery = {}) {
    const { data: searchMylistData, error, isFetching } = useQuery({
        queryKey: ["search", "series", keyword, options],
        placeholderData: prev => prev,
        queryFn: () => {
            return getFastSeriesSearch(keyword, options)
        },
    })
    return { searchMylistData, error, isFetching }
}
