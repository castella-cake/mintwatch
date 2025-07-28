import { useQuery } from "@tanstack/react-query"

export default function usePublishTimelineQuery() {
    const { data: ActivityPublish } = useQuery({
        queryKey: ["publishTimeline"],
        queryFn: () => {
            return getPublishTimeline()
        },
    })

    return ActivityPublish
}
