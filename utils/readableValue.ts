/**
 * 秒 から HH:MM:SS に変換する関数
 * @param seconds 秒数
 * @returns HH:MM:SS でフォーマットされたstring (Hourは省略される場合がある)
 */
export function secondsToTime(seconds: number) {
    if (Number.isNaN(seconds)) return `00:00`

    const second = Math.floor(seconds % 60)
    const minute = Math.floor((seconds / 60) % 60)
    const hour = Math.floor((seconds / 60) / 60)

    let ss = `${second}`
    let mm = `${minute}`
    let hh = `${hour}`

    if (second < 10) ss = `0${ss}`
    if (minute < 10) mm = `0${mm}`

    if (hour < 1) return `${mm}:${ss}`

    if (hour < 10) hh = `0${hh}`
    return `${hh}:${mm}:${ss}`
}

/**
 * 大きな数値に読みやすい単位を入れる関数
 * @param number 元の数値
 * @param maxLength カットオフを行う単位 (デフォルトはカットオフなし)
 * @returns 単位付きのstring
 */
export function readableInt(number: number, maxLength = Infinity) {
    const units = ["万", "億", "兆", "京", "垓", "秭", "穣", "溝", "潤", "正", "載", "極", "恒河沙", "阿僧祇", "那由他", "不可思議", "無量大数"]
    if (number.toString().indexOf("e") == -1) {
        const stringArray = number.toString().split("").reverse()
        const length = Math.ceil(stringArray.length / 4)
        const splitArray = new Array(length).fill("").map((_, index) => stringArray.slice(index * 4, (index + 1) * 4))
        const afterStringArray = splitArray.map((chars, index) => {
            if (splitArray[index - 1] && units[index - 1] && splitArray[index - 1].length === 4) {
                return [units[index - 1], ...chars]
            } else {
                return chars
            }
        })
        /* const afterStringArray = stringArray.map((char, index) => {
            if ((index) % 4 !== 0) return char
            return `${char}${units[((index) / 4) - 1] || ""}`
        }) */
        return afterStringArray.reverse().slice(0, maxLength).reduce((prev, current) => current.concat(prev), []).reverse().join("")
    } else {
        return number
    }
}
