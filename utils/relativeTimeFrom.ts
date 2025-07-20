export default function relativeTimeFrom(date: Date): string {
    const now = new Date()
    const diffMilliseconds = now.getTime() - date.getTime()

    // 各単位のミリ秒
    const dayMs = 86400000 // 24 * 60 * 60 * 1000
    const hourMs = 3600000 // 60 * 60 * 1000
    const minuteMs = 60000
    const secondMs = 1000

    let value: number
    let unit: string

    if (diffMilliseconds >= dayMs) {
        value = Math.floor(diffMilliseconds / dayMs)
        unit = "日前"
    }
    else if (diffMilliseconds >= hourMs) {
        value = Math.floor(diffMilliseconds / hourMs)
        unit = "時間前"
    }
    else if (diffMilliseconds >= minuteMs) {
        value = Math.floor(diffMilliseconds / minuteMs)
        unit = "分前"
    }
    else {
        return `${Math.floor(diffMilliseconds / secondMs)}秒前`
    }

    return `${value}${unit}`
}
