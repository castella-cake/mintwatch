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

export function doFilterThreads(threads: Thread[], sharedNgLevel: number, viewerNg?: NgData | null, externalNgUserId?: string[]) {
    const threadsAfter = threads.map((thread) => {
        if (thread.fork === "owner") return thread
        const comments = doFilterComments(thread.comments, sharedNgLevel, viewerNg, false, externalNgUserId)
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

export function doFilterComments(comments: Comment[], sharedNgLevel: number, viewerNg?: NgData | null, onlyShowMyselfComments?: boolean, externalNgUserId: string[] = []) {
    return comments.filter((comment) => {
        if (onlyShowMyselfComments && !comment.isMyPost) return false
        if (comment.score < sharedNgLevel) return false
        if (viewerNg && viewerNg.items.findIndex((elem) => {
            if (elem.type === "command" && comment.commands.findIndex(command => elem.source === command) !== -1) return true
            if (elem.type === "id" && comment.userId === elem.source) return true
            if (elem.type === "word" && comment.body.includes(elem.source)) return true
            return false
        }) !== -1) return false
        if (externalNgUserId.length > 0 && externalNgUserId.some(id => id === comment.userId)) return false
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

export type NicoScriptEvent = {
    type: "commentProhibited" | "jump"
    startVpos: number
    endVpos: number
    id: string
    targetType?: "time" | "video"
    target?: number | string
    message?: string
}

function normalizeDigits(value: string) {
    return value.replace(/[０-９]/g, digit => String.fromCharCode(digit.charCodeAt(0) - 0xfee0))
}

function tokenizeNicoScript(value: string) {
    const tokens: string[] = []
    const tokenRegex = /"((?:\\.|[^"\\])*)"|'((?:\\.|[^'\\])*)'|(\S+)/g
    for (const match of value.matchAll(tokenRegex)) {
        tokens.push((match[1] ?? match[2] ?? match[3]).replace(/\\([\\"'])/g, "$1"))
    }
    return tokens
}

function parseDuration(commands: string[]) {
    for (const command of commands) {
        const normalized = normalizeDigits(command)
        const durationMatch = normalized.match(/^[@＠](\d+(?:\.\d+)?)$/)
        if (durationMatch) return Number(durationMatch[1])
    }
    return undefined
}

function parseJumpTarget(value: string) {
    const normalized = normalizeDigits(value)
    const timeMatch = normalized.match(/^#(\d+):(\d{2})(?:\.(\d+))?$/)
    if (timeMatch) {
        const seconds = Number(timeMatch[1]) * 60 + Number(timeMatch[2]) + Number(`0.${timeMatch[3] ?? "0"}`)
        return { targetType: "time" as const, target: seconds }
    }
    if (/^(?:sm|nm|so)\d+$/.test(normalized)) {
        return { targetType: "video" as const, target: normalized }
    }
    return undefined
}

/**
 * スレッドからニコスクリプトのイベント情報を解析して取得する
 * @param threads コメントのスレッド配列
 * @returns nicoScriptEventの配列
 */
export function parseNicoScriptEvent(threads: Thread[], videoDuration?: number): NicoScriptEvent[] {
    const eventArray: NicoScriptEvent[] = []

    // オーナースレッドを見つける
    const ownerThread = threads.find(thread => thread.fork === "owner")
    if (!ownerThread) return eventArray

    // オーナースレッドのコメントを解析してイベント情報を取得する
    for (const comment of ownerThread.comments) {
        const stringRegexResult = comment.body.match(nicoScriptStringRegex)
        if (!stringRegexResult) continue

        const scriptTokens = tokenizeNicoScript(stringRegexResult[1])
        switch (scriptTokens[0]) {
            case "コメント禁止": {
                const duration = parseDuration(comment.commands) ?? 30
                eventArray.push({ type: "commentProhibited", id: comment.id, startVpos: comment.vposMs, endVpos: comment.vposMs + duration * 1000 })
                break
            }
            case "ジャンプ": {
                const target = parseJumpTarget(scriptTokens[1] ?? "")
                if (!target) break
                const duration = parseDuration(comment.commands)
                let endVpos = Infinity
                if (duration === undefined && videoDuration !== undefined) {
                    endVpos = videoDuration * 1000 + 999
                } else if (duration !== undefined && Math.floor((comment.vposMs + duration * 1000) / 1000) === videoDuration) {
                    endVpos = comment.vposMs + duration * 1000 + 999
                } else if (duration !== undefined) {
                    endVpos = comment.vposMs + duration * 1000
                }
                eventArray.push({
                    type: "jump",
                    id: comment.id,
                    startVpos: comment.vposMs,
                    endVpos,
                    ...target,
                    message: target.targetType === "video" ? scriptTokens.slice(2).join(" ") : undefined,
                })
                break
            }
        }
    }
    return eventArray
}
