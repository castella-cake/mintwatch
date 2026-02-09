export function splitWithYMD<T>(items: T[], getDate: (item: T) => string): { [key: string]: T[] } {
    const result: { [key: string]: T[] } = {}

    items.forEach((item) => {
        // createdAt を日付文字列に変換(YYYY-MM-DD)
        const thisDate = new Date(getDate(item))
        const dateStr = `${thisDate.getFullYear()}-${thisDate.getMonth() + 1}-${thisDate.getDate()}`

        if (result[dateStr]) {
            result[dateStr].push(item)
        } else {
            result[dateStr] = [item]
        }
    })

    return result
}

export function getRelativeDate(dateStr: string) {
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
