import { useActivitiesQuery } from "@/hooks/apiHooks/global/activities"
import { Activities } from "./ActivitiesList"
import { LoadingFiller } from "../LoadingFiller"
import { EmptyNotice } from "../EmptyNotice"

export function ActivitiesTimeline({ context, type, userId, isActorsQuery }: {
    context?: "header_timeline" | "my_timeline" | `user_timeline_${number}`
    type?: "publish" | "video" | "live" | "all"
    userId?: number
    isActorsQuery?: boolean
}) {
    const { activitiesData, isLoading } = useActivitiesQuery(context || "header_timeline", type || "publish", userId, isActorsQuery || false)

    if (isLoading) return <LoadingFiller />
    if (!activitiesData) return <div className="activities-timeline-container">データが取得できませんでした</div>
    if (activitiesData.activities.length === 0) return <div className="activities-timeline-container"><EmptyNotice contentName="最近のアクティビティ" /></div>

    return (
        <div className="activities-timeline-container">
            <Activities timeline={activitiesData} />
        </div>
    )
}
