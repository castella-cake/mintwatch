import { Activity } from "@/types/ActivitiesData"
import { Card } from "../InfoCard"

export function ActivityCard({ item, markAsLazy }: { item: Activity, markAsLazy?: boolean }) {
    return (
        <div key={`activity-${item.id}`} className="activity">
            <img src={item.actor.iconUrl} className="activity-icon" loading={markAsLazy ? "lazy" : undefined}></img>
            <div className="activity-message-actor">{item.actor.name}</div>
            <div className="activity-message">{item.message.text}</div>
            <Card
                href={item.content.url}
                title={item.content.title}
                thumbnailUrl={item.thumbnailUrl}
                thumbText={item.content.video ? secondsToTime(item.content.video.duration) : undefined}
                thumbMarkAsLazy={markAsLazy}
                subTitle={`${new Date(item.content.startedAt).toLocaleString("ja-JP")}`}
            >
                {item.content.title}
            </Card>
        </div>
    )
}
