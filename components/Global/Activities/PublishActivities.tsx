import { Activities } from "./ActivitiesList"
import usePublishTimelineQuery from "@/hooks/apiHooks/global/activityPublish"

export function PublishActivities() {
    const publishTimeline = usePublishTimelineQuery()

    if (!publishTimeline) return <div className="publish-timeline-container">Loading...</div>

    return (
        <div className="publish-timeline-container">
            <Activities timeline={publishTimeline} />
        </div>
    )
}
