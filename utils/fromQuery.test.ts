import { describe, expect, test } from "vitest"
import { parseFromQuery } from "@/utils/fromQuery"

describe("parseFromQuery", () => {
    test("有効な秒数を数値として返す", () => {
        expect(parseFromQuery("?from=30")).toBe(30)
        // `?` がなくても解釈する
        expect(parseFromQuery("from=30")).toBe(30)
        // 他のクエリパラメータと混在しても解釈する
        expect(parseFromQuery("?from=30&past_log=1700000000")).toBe(30)
    })

    test("0は「最初から再生」を示す有効な値として返す", () => {
        expect(parseFromQuery("?from=0")).toBe(0)
    })

    test("from が存在しない場合は null を返す", () => {
        expect(parseFromQuery("")).toBeNull()
        expect(parseFromQuery("?past_log=1700000000")).toBeNull()
    })

    test("非数値の場合は null を返す", () => {
        expect(parseFromQuery("?from=abc")).toBeNull()
        expect(parseFromQuery("?from=")).toBeNull()
        expect(parseFromQuery("?from=30abc")).toBeNull()
    })

    test("0未満・非整数の場合は null を返す", () => {
        expect(parseFromQuery("?from=-1")).toBeNull()
        expect(parseFromQuery("?from=1.5")).toBeNull()
    })

    test("複数指定された場合は先頭の値を採用する", () => {
        expect(parseFromQuery("?from=10&from=30")).toBe(10)
    })
})
