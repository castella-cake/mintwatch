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
    // key がY-M-Dなのでローカルでパースする
    const [year, month, day] = dateStr.split("-").map(Number)
    const date = new Date(year, month - 1, day)
    const today = new Date()
    // 今日の0時基準に揃えて引く
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const diffDays = (todayDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)

    if (diffDays === 0) {
        return "今日"
    } else if (diffDays === 1) {
        return "昨日"
    } else if (diffDays < 7) {
        return `${diffDays}日前`
    } else if (diffDays === -1) {
        return `明日`
    } else if (diffDays === -2) {
        return `明後日`
    } else if (diffDays < 0 && diffDays > -7) {
        return `${-diffDays}日後`
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
                    {splittedActivities[key].map((item: Activity, index) => {
                        return <ActivityCard item={item} key={item.id} markAsLazy={index >= 5} />
                    })}
                </div>
            </div>
        )
    })
}
