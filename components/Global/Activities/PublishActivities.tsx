import { Activities } from "./ActivitiesList"
import usePublishTimelineQuery from "@/hooks/apiHooks/global/activityPublish"

export function PublishActivities({ context }: { context?: "header_timeline" | "my_timeline" }) {
    const publishTimeline = usePublishTimelineQuery(context || "header_timeline")

    if (!publishTimeline) return <div className="publish-timeline-container">Loading...</div>

    return (
        <div className="publish-timeline-container">
            <Activities timeline={publishTimeline} />
        </div>
    )
}
