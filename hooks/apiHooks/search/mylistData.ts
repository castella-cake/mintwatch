import { useQuery } from "@tanstack/react-query"

export function useSearchMylistData(keyword: string, options: VideoSearchQuery = {}) {
    const { data: searchMylistData, error, isFetching } = useQuery({
        queryKey: ["search", "mylist", keyword, options],
        placeholderData: prev => prev,
        queryFn: () => {
            return getFastMylistSearch(keyword, options)
        },
    })
    return { searchMylistData, error, isFetching }
}
