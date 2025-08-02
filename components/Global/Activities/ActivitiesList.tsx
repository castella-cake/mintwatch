import { ActivityCard } from "./ActivityCard"
import { Activity } from "@/types/ActivitiesData"

const splitWithYMD = (items: Activity[]) => {
    const result: { [key: string]: Activity[] } = {}

    items.forEach((item) => {
        // createdAt を日付文字列に変換(YYYY-MM-DD)
        const thisDate = new Date(item.createdAt)
        const dateStr = `${thisDate.getFullYear()}-${thisDate.getMonth() + 1}-${thisDate.getDate()}`

        if (result[dateStr]) {
            result[dateStr].push(item)
        } else {
            result[dateStr] = [item]
        }
    })

    return result
}

const getRelativeDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const diffTime = today.getTime() - date.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
        return "今日"
    } else if (diffDays === 1) {
        return "昨日"
    } else if (diffDays < 7) {
        return `${diffDays}日前`
    } else {
        return dateStr.replace(/-/g, "/")
    }
}

export function Activities({ timeline }: { timeline: ActivitiesDataRootObject }) {
    const splittedActivities = splitWithYMD(timeline.activities)
    return Object.keys(splittedActivities).map((key) => {
        return (
            <div key={`activities-date-${key}`} className="activities-date">
                <div className="activities-date-title">{getRelativeDate(key)}</div>
                <div className="activities-item-container">
                    {splittedActivities[key].map((item: Activity) => {
                        return <ActivityCard item={item} key={item.id} />
                    })}
                </div>
            </div>
        )
    })
}
