import { useQuery } from "@tanstack/react-query"

export function useVideoTimelineData(context: "my_timeline" | "top_follow" = "my_timeline") {
    const { data: videoTimelineData } = useQuery({
        queryKey: ["timelineData"],
        queryFn: () => {
            return getVideoTimeline(context)
        },
    })
    return videoTimelineData
}
