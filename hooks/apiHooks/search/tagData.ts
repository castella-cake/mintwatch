import { useQuery } from "@tanstack/react-query"

export function useSearchTagData(keyword: string, options: VideoSearchQuery = {}) {
    const { data: searchTagData, error, isFetching } = useQuery({
        queryKey: ["search", "tag", keyword, options],
        placeholderData: prev => prev,
        queryFn: () => {
            return getTagSearch(keyword, options)
        },
    })
    return { searchTagData, error, isFetching }
}
