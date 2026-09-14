import { describe, expect, test } from "vitest"
import { parsePastLogQuery } from "@/utils/pastLogQuery"

describe("parsePastLogQuery", () => {
    const pastEpoch = Math.floor(Date.now() / 1000) - 100000

    test("有効な unixepoch を数値として返す", () => {
        expect(parsePastLogQuery(`?past_log=${pastEpoch}`)).toBe(pastEpoch)
        // `?` がなくても解釈する
        expect(parsePastLogQuery(`past_log=${pastEpoch}`)).toBe(pastEpoch)
        // 他のクエリパラメータと混在しても解釈する
        expect(parsePastLogQuery(`?from=30&past_log=${pastEpoch}`)).toBe(pastEpoch)
    })

    test("past_log が存在しない場合は null を返す", () => {
        expect(parsePastLogQuery("")).toBeNull()
        expect(parsePastLogQuery("?from=30")).toBeNull()
    })

    test("非数値の場合は null を返す", () => {
        expect(parsePastLogQuery("?past_log=abc")).toBeNull()
        expect(parsePastLogQuery("?past_log=")).toBeNull()
        expect(parsePastLogQuery("?past_log=1700000000abc")).toBeNull()
    })

    test("非整数・0以下の場合は null を返す", () => {
        expect(parsePastLogQuery("?past_log=1700000000.5")).toBeNull()
        expect(parsePastLogQuery("?past_log=0")).toBeNull()
        expect(parsePastLogQuery("?past_log=-100")).toBeNull()
    })

    test("未来日時の場合は null を返す", () => {
        const futureEpoch = Math.floor(Date.now() / 1000) + 100000
        expect(parsePastLogQuery(`?past_log=${futureEpoch}`)).toBeNull()
    })

    test("複数指定された場合は先頭の値を採用する", () => {
        expect(parsePastLogQuery(`?past_log=1&past_log=${pastEpoch}`)).toBe(1)
    })
})
