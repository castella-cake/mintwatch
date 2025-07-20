import { useQuery } from "@tanstack/react-query"

export function useVideoTimelineData() {
    const { data: videoTimelineData } = useQuery({
        queryKey: ["timelineData"],
        queryFn: () => {
            return getVideoTimeline()
        },
    })
    return videoTimelineData
}
