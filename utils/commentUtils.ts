import { Thread, Comment } from "@/types/CommentData"
import { NgData } from "@/types/NgCommentsApiData"
import { VideoDataThread } from "@/types/VideoData"

// https://dic.nicovideo.jp/a/ng%E5%85%B1%E6%9C%89%E6%A9%9F%E8%83%BD より。
export const sharedNgLevelScore = {
    low: -10000,
    mid: -4800,
    high: -1000,
    none: -Infinity,
}

export function doFilterThreads(threads: Thread[], sharedNgLevel: number, viewerNg?: NgData | null) {
    const threadsAfter = threads.map((thread) => {
        if (thread.fork === "owner") return thread
        const comments = doFilterComments(thread.comments, sharedNgLevel, viewerNg)
        return { ...thread, comments }
    })
    return threadsAfter
}

export function applyOpacityToThreads(threads: Thread[], threadLabels: string[], opacitySetting: { [key: string]: number }) {
    return threads.map((thread, index) => {
        return { ...thread, comments: thread.comments.map((comment) => {
            return { ...comment, commands: [...comment.commands, `nico:opacity:${opacitySetting[threadLabels[index]] ?? 1}`] }
        }) }
    })
}

export function doFilterComments(comments: Comment[], sharedNgLevel: number, viewerNg?: NgData | null, onlyShowMyselfComments?: boolean) {
    return comments.filter((comment) => {
        if (onlyShowMyselfComments && !comment.isMyPost) return false
        if (comment.score < sharedNgLevel) return false
        if (viewerNg && viewerNg.items.findIndex((elem) => {
            if (elem.type === "command" && comment.commands.findIndex(command => elem.source === command) !== -1) return true
            if (elem.type === "id" && comment.userId === elem.source) return true
            if (elem.type === "word" && comment.body.includes(elem.source)) return true
            return false
        }) !== -1) return false
        return true
    })
}

export function returnThreadLabels(threads: VideoDataThread[]) {
    return threads.map(thread => thread.label)
}

export function borderMyComments(threads: Thread[], lastCommentId: string, borderPastMyComments: boolean): Thread[] {
    return threads.map((thread: Thread) => {
        const newComments = thread.comments.map((comment) => {
            if (comment.id === lastCommentId) {
                comment.commands = [...comment.commands, "nico:waku:#ff0"]
                return comment
            } else if (comment.isMyPost && borderPastMyComments) {
                comment.commands = [...comment.commands, "nico:waku:#fb6"]
                return comment
            } else {
                return comment
            }
        })
        return { ...thread, comments: newComments }
    })
}

const nicoScriptStringRegex = /^[@＠](.+)/
const nicoScriptDurationRegex = /^[@＠]([0-9]+)/

type nicoScriptEvent = { type: string, startVpos: number, endVpos: number }

/**
 * スレッドからニコスクリプトのイベント情報を解析して取得する
 * @param threads コメントのスレッド配列
 * @returns nicoScriptEventの配列
 */
export function parseNicoScriptEvent(threads: Thread[]): nicoScriptEvent[] {
    const eventArray: nicoScriptEvent[] = []

    // オーナースレッドを見つける
    const ownerThread = threads.find(thread => thread.fork === "owner")
    if (!ownerThread) return eventArray

    // オーナースレッドのコメントを解析してイベント情報を取得する
    for (const comment of ownerThread.comments) {
        const stringRegexResult = comment.body.match(nicoScriptStringRegex)
        if (!stringRegexResult) continue

        // 今はコメント禁止コマンドのみ対応
        switch (stringRegexResult?.[1]) {
            case "コメント禁止": {
                const durationCommand = comment.commands.find(command => nicoScriptDurationRegex.test(command))
                const durationMatch = durationCommand?.match(nicoScriptDurationRegex)
                const duration = durationMatch ? Number(durationMatch[1]) : 30
                eventArray.push({ type: "commentProhibited", startVpos: comment.vposMs, endVpos: comment.vposMs + duration * 1000 })
                break
            }
        }
    }
    return eventArray
}
