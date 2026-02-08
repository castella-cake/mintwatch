import { useQuery } from "@tanstack/react-query"

export default function usePublishTimelineQuery(context: "header_timeline" | "my_timeline" = "header_timeline") {
    const { data: ActivityPublish } = useQuery({
        queryKey: ["publishTimeline"],
        queryFn: () => {
            return getPublishTimeline(context)
        },
    })

    return ActivityPublish
}
