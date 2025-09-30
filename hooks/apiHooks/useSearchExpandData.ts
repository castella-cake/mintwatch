import { useQuery } from "@tanstack/react-query"
import { searchExpand } from "@/utils/apis/search/expand"
import { SearchExpandRootObject } from "@/types/search/expand"

/**
 * Custom hook to fetch search expand data.
 * @param query - The search query string.
 * @returns Query result containing expand data.
 */
export function useSearchExpandData(query: string) {
    return useQuery<SearchExpandRootObject>({
        queryKey: ["searchExpand", query],
        queryFn: () => searchExpand(query),
        enabled: !!query,
    })
}
