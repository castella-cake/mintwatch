import { useVideoTimelineData } from "@/hooks/apiHooks/watch/videoTimelineData"
import { Activities } from "./ActivitiesList"

export function VideoActivities() {
    const videoTimeline = useVideoTimelineData()

    if (!videoTimeline) return <div className="video-timeline-container">Loading...</div>

    return (
        <div className="video-timeline-container">
            <Activities timeline={videoTimeline} />
        </div>
    )
}
