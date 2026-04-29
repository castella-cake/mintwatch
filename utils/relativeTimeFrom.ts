export default function relativeTimeFrom(date: Date): string {
    const now = new Date()
    const diffMilliseconds = now.getTime() - date.getTime()
    const diffMillisecondsAbs = Math.abs(diffMilliseconds)

    // 各単位のミリ秒
    const secondMs = 1000
    const minuteMs = secondMs * 60
    const hourMs = minuteMs * 60
    const dayMs = hourMs * 24
    const monthMs = dayMs * 31
    const yearMs = dayMs * 365

    let value: number
    let unit: string
    const prefix = diffMilliseconds < 0 ? "後" : "前"

    if (diffMillisecondsAbs >= yearMs) {
        value = Math.floor(diffMillisecondsAbs / yearMs)
        unit = "年"
    } else if (diffMillisecondsAbs >= monthMs) {
        value = Math.floor(diffMillisecondsAbs / monthMs)
        unit = "ヶ月"
    } else if (diffMillisecondsAbs >= dayMs) {
        value = Math.floor(diffMillisecondsAbs / dayMs)
        unit = "日"
    } else if (diffMillisecondsAbs >= hourMs) {
        value = Math.floor(diffMillisecondsAbs / hourMs)
        unit = "時間"
    } else if (diffMillisecondsAbs >= minuteMs) {
        value = Math.floor(diffMillisecondsAbs / minuteMs)
        unit = "分"
    } else {
        return `${Math.floor(diffMillisecondsAbs / secondMs)}秒${prefix}`
    }

    return `${value}${unit}${prefix}`
}
