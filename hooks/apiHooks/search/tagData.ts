import { useQuery } from "@tanstack/react-query"

export function useSearchTagData(keyword: string, options: VideoSearchQuery = {}) {
    const { data: searchTagData, error } = useQuery({
        queryKey: ["search", "tag", keyword, options],
        queryFn: () => {
            return getTagSearch(keyword, options)
        },
    })
    return { searchTagData, error }
}
