import { useActivitiesQuery } from "@/hooks/apiHooks/global/activities"
import { Activities } from "./ActivitiesList"

export function ActivitiesTimeline({ context, type, userId, isActorsQuery }: {
    context?: "header_timeline" | "my_timeline" | `user_timeline_${number}`
    type?: "publish" | "video" | "live" | "all"
    userId?: number
    isActorsQuery?: boolean
}) {
    const { activitiesData, isLoading } = useActivitiesQuery(context || "header_timeline", type || "publish", userId, isActorsQuery || false)

    if (isLoading) return <div className="activities-timeline-container">Loading...</div>
    if (!activitiesData) return <div className="activities-timeline-container">データが取得できませんでした</div>

    return (
        <div className="activities-timeline-container">
            <Activities timeline={activitiesData} />
        </div>
    )
}
