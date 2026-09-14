import { describe, expect, test } from "vitest"
import { parseNicoScriptEvent } from "./commentUtils"
import type { Thread } from "@/types/CommentData"

function makeThread(fork: string, comments: Partial<Thread["comments"][number]>[]): Thread {
    return {
        id: "thread",
        fork,
        commentCount: comments.length,
        comments: comments.map((comment, index) => ({
            id: `${fork}-${index}`,
            no: index,
            vposMs: 1000,
            body: "",
            commands: [],
            userId: "user",
            isPremium: false,
            score: 0,
            postedAt: "",
            nicoruCount: 0,
            nicoruId: null,
            source: "",
            isMyPost: false,
            ...comment,
        })),
    }
}

describe("parseNicoScriptEvent", () => {
    test("only parses the owner thread", () => {
        const events = parseNicoScriptEvent([
            makeThread("main", [{ body: "@ジャンプ sm9" }]),
            makeThread("owner", [{ body: "@コメント禁止", commands: ["@10"] }]),
        ])
        expect(events).toHaveLength(1)
        expect(events[0].type).toBe("commentProhibited")
    })

    test("parses half-width and full-width jump commands", () => {
        const events = parseNicoScriptEvent([makeThread("owner", [
            { body: "@ジャンプ #3:00", commands: ["@1.5"] },
            { body: "＠ジャンプ sm9 \"説明 メッセージ\"", commands: ["＠２"] },
        ])], 600)
        expect(events[0]).toMatchObject({ targetType: "time", target: 180, endVpos: 2500 })
        expect(events[1]).toMatchObject({ targetType: "video", target: "sm9", message: "説明 メッセージ" })
        expect(events[1].endVpos).toBe(3000)
    })

    test("parses milliseconds and leaves an unspecified duration active to the end", () => {
        const events = parseNicoScriptEvent([makeThread("owner", [
            { body: "@ジャンプ #1:02.500" },
            { body: "@ジャンプ sm9", commands: ["＠0.5"] },
        ])], 90)
        expect(events[0]).toMatchObject({ target: 62.5, endVpos: 90999 })
        expect(events[1].endVpos).toBe(1500)
    })

    test("ignores invalid targets and keeps comment prohibition", () => {
        const events = parseNicoScriptEvent([makeThread("owner", [
            { body: "@ジャンプ #1:2" },
            { body: "@ジャンプ https://example.com" },
            { body: "@コメント禁止", commands: ["＠３"] },
        ])])
        expect(events).toHaveLength(1)
        expect(events[0]).toMatchObject({ type: "commentProhibited", endVpos: 4000 })
    })

    test("does not treat anonymous posting as a duration command", () => {
        const events = parseNicoScriptEvent([makeThread("owner", [
            { body: "@コメント禁止", commands: ["184"] },
        ])])
        expect(events[0].endVpos).toBe(31000)
    })

    test("test with actual data", () => {
        const events = parseNicoScriptEvent([makeThread("owner", [
            { body: "＠ジャンプ #0:05.50", commands: [] },
        ])], 90)
        expect(events[0]).toMatchObject({ targetType: "time", target: 5.5, endVpos: 90999 })
    })
})
