import { useQuery, useQueryClient } from "@tanstack/react-query"

export function useOshiraseBoxData() {
    const queryClient = useQueryClient()
    const { data: oshiraseBoxData } = useQuery({
        queryKey: ["oshiraseBox"],
        queryFn: () => {
            return getOshiraseBox()
        },
        staleTime: 1000 * 60 * 5,
        refetchOnMount: true,
    })
    const reloadOshiraseBoxData = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ["oshiraseBox"] })
    }, [])
    return { oshiraseBoxData, reloadOshiraseBoxData }
}
