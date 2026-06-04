import { useVideoTimelineData } from "@/hooks/apiHooks/watch/videoTimelineData"
import { Activities } from "./ActivitiesList"

export function VideoActivities({ context }: { context?: "my_timeline" | "top_follow" }) {
    const videoTimeline = useVideoTimelineData(context)

    if (!videoTimeline) return <div className="video-timeline-container">Loading...</div>

    return (
        <div className="video-timeline-container">
            <Activities timeline={videoTimeline} />
        </div>
    )
}
