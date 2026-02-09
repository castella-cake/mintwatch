import { ActivityCard } from "./ActivityCard"
import { Activity } from "@/types/ActivitiesData"

export function Activities({ timeline }: { timeline: ActivitiesDataRootObject }) {
    const splittedActivities = splitWithYMD(timeline.activities, item => item.createdAt)
    return Object.keys(splittedActivities).map((key) => {
        return (
            <div key={`activities-date-${key}`} className="activities-date">
                <div className="activities-date-title">{getRelativeDate(key)}</div>
                <div className="activities-item-container">
                    {splittedActivities[key].map((item: Activity, index) => {
                        return <ActivityCard item={item} key={item.id} markAsLazy={index >= 5} />
                    })}
                </div>
            </div>
        )
    })
}
