import { Activity } from "@/types/ActivitiesData"
import { Card } from "../InfoCard"

export function ActivityCard({ item }: { item: Activity }) {
    return (
        <div key={`activity-${item.id}`} className="activity">
            <img src={item.actor.iconUrl} className="activity-icon"></img>
            <div className="activity-message-actor">{item.actor.name}</div>
            <div className="activity-message">{item.message.text}</div>
            <Card href={item.content.url} title={item.content.title} thumbnailUrl={item.thumbnailUrl} thumbText={item.content.video ? secondsToTime(item.content.video.duration) : undefined} subTitle={`${new Date(item.content.startedAt).toLocaleString("ja-JP")}`}>
                {item.content.title}
            </Card>
        </div>
    )
}
