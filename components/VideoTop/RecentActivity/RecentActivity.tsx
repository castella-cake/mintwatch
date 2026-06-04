import { Card } from "@/components/Global/InfoCard"
import { useVideoTimelineData } from "@/hooks/apiHooks/watch/videoTimelineData"
import "../styles/RecentActivity.css"
import { IconChevronDown, IconChevronUp, IconDeviceTv } from "@tabler/icons-react"

type WhatsNewActivity = { items: Activity[], lastUpdate: Date, actor: Activity["actor"] }

function splitWithUser(activity: Activity[]) {
    const result: Record<string, WhatsNewActivity> = {}
    activity.forEach((item) => {
        const userId = item.actor.id
        const createdAt = new Date(item.createdAt)

        if (result[userId]) {
            result[userId].items.push(item)
            if (createdAt > result[userId].lastUpdate) {
                result[userId].lastUpdate = createdAt
            }
        } else {
            result[userId] = { items: [item], lastUpdate: createdAt, actor: item.actor }
        }
    })
    return result
}

function RecentActivityItem({ item, markAsLazy }: { item: WhatsNewActivity, markAsLazy: boolean }) {
    const [isOpen, setIsOpen] = useState(false)
    const { items, actor } = item
    return (
        <div className="recent-activity-user">
            <div className="recent-activity-user-summary">
                <a className="recent-activity-actoranchor" href={`https://www.nicovideo.jp/user/${actor.id}`} title={`${actor.name} のユーザーページを見る`}>
                    <img src={actor.iconUrl} className="recent-activity-actoricon" loading={markAsLazy ? "lazy" : undefined}></img>
                    <span className="recent-activity-actor">{actor.name}</span>
                    <span className="recent-activity-postcount">
                        <IconDeviceTv />
                        {" "}
                        {items.length}
                    </span>
                </a>
                {items.length > 1 && (
                    <button className="recent-activity-open" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <IconChevronUp /> : <IconChevronDown />}
                    </button>
                )}
            </div>
            <div className="recent-activity-items">
                {
                    items.slice(0, isOpen ? undefined : 1).map(item => (
                        <Card
                            key={item.id}
                            href={item.content.url}
                            title={item.content.title}
                            thumbnailUrl={item.thumbnailUrl}
                            thumbText={item.content.video ? secondsToTime(item.content.video.duration) : undefined}
                            thumbMarkAsLazy={markAsLazy}
                            subTitle={`${relativeTimeFrom(new Date(item.content.startedAt))}`}
                        >
                            {item.content.title}
                        </Card>
                    ))
                }
            </div>
        </div>
    )
}

export function RecentActivity() {
    const videoTimeline = useVideoTimelineData("top_follow")

    if (!videoTimeline) return <div className="recent-activity-container">Loading...</div>

    return (
        <div className="recent-activity-container">
            {Object.entries(splitWithUser(videoTimeline.activities)).sort((a, b) => b[1].lastUpdate.getTime() - a[1].lastUpdate.getTime()).map(([userId, { items, actor }], index) => {
                const markAsLazy = index >= 3
                return <RecentActivityItem key={userId} item={{ items, lastUpdate: new Date(items[0].createdAt), actor }} markAsLazy={markAsLazy} />
            })}
        </div>
    )
}
