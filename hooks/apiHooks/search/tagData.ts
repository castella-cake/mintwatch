import { useQuery } from "@tanstack/react-query"

export function useSearchTagData(keyword: string, options: VideoSearchQuery = {}, isShorts = false) {
    const { data: searchTagData, error, isFetching } = useQuery({
        queryKey: ["search", isShorts ? "tag_shorts" : "tag", keyword, options],
        placeholderData: prev => prev,
        queryFn: () => {
            return getFastTagSearch(keyword, options, isShorts)
        },
    })
    return { searchTagData, error, isFetching }
}
