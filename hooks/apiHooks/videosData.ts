import { useQuery } from "@tanstack/react-query"
import { getVideosByIds } from "@/utils/apis/videos"

export function useVideosData(videoIds: string[]) {
    const normalizedIds = [...new Set(videoIds.filter(Boolean))]
    return useQuery({
        queryKey: ["videosData", normalizedIds],
        queryFn: () => getVideosByIds(normalizedIds),
        enabled: normalizedIds.length > 0,
    })
}
