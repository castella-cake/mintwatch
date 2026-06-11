import { useQuery } from "@tanstack/react-query"

export function useSeriesInfo(seriesId: number | undefined, pageSize?: number, page?: number) {
    const { data: seriesData, isLoading, error } = useQuery({
        queryKey: ["series", seriesId, pageSize, page],
        queryFn: () => {
            if (!seriesId) throw new Error("seriesId is required")
            return getSeriesInfo(seriesId, pageSize, page)
        },
        enabled: !!seriesId,
    })

    return { seriesData, isLoading, error }
}
