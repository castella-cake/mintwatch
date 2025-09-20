import { distance } from "fastest-levenshtein"

/**
 * levenshteinベースで歌詞コメントを投稿していると思われるユーザーIDを返す
 * @param threads スレッドの配列
 * @param lyricData 歌詞データ
 * @param threshold 閾値(デフォルトは0.1)
 * @returns NGとしてみなされたユーザーIDの配列
 */
export function doLyricCommentNg(threads: Thread[], lyricData: LyricDataRootObject, threshold = 0.1) {
    let levenshteinBasedLyricNg: string[] = []
    if (lyricData) {
        const concatedUserComment = dothreadConcatByUser(threads)
        const concatedLyric = lyricData?.data.lyrics.reduce((prev, current) => `${prev}${normalizeStringForDistance(current.lines.join(""))}`, "")
        const ngTargetScores = Object.keys(concatedUserComment).reduce((prev: { [key: string]: number }, key) => {
            const string = concatedUserComment[key]
            const similariry = calcSimilarity(string, concatedLyric)
            return {
                ...prev,
                [key]: similariry,
            }
        }, {})
        const filteredUserId = Object.keys(concatedUserComment).filter(key => ngTargetScores[key] > threshold)
        console.log("lyricCommentNg: blocked", Object.keys(filteredUserId).length, "user(s), scores:", Object.keys(ngTargetScores).map(key => ngTargetScores[key]).sort((a, b) => b - a))
        console.log("lyricCommentNg: blockedUserStrings", filteredUserId.map(key => concatedUserComment[key]))
        levenshteinBasedLyricNg = filteredUserId
    }
    return levenshteinBasedLyricNg
}

const removePrefixRegex = /[^\p{L}\p{N}\s]/gu
const removeSpaceRegex = /\s+/g

function dothreadConcatByUser(threads: Thread[]) {
    return threads.map((thread) => {
        return thread.comments.reduce((prev: { [key: string]: string }, comment) => {
            if (typeof prev[comment.userId] === "string") {
                return { ...prev, [comment.userId]: `${prev[comment.userId]}${normalizeStringForDistance(comment.body)}` }
            }
            return { ...prev, [comment.userId]: normalizeStringForDistance(comment.body) }
        }, {})
    }).reduce((prev, stringData) => ({ ...prev, ...stringData }), {})
}

function normalizeStringForDistance(string: string): string {
    return string.replace(removePrefixRegex, "").replace(removeSpaceRegex, "").trim()
}

function calcSimilarity(a: string, b: string): number {
    const dist = distance(a, b)
    const maxLen = Math.max(a.length, b.length)
    return 1 - dist / maxLen // 0~1
}
