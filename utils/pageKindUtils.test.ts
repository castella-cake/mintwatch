import { describe, expect, test } from "vitest"
import { pageKindOf } from "./pageKindUtils"

describe("pageKindOf", () => {
    test("ユーザーページはユーザーID込みで同一性を持つ", () => {
        expect(pageKindOf("/user/123")).toBe("user:123")
        expect(pageKindOf("/user/123/video")).toBe("user:123")
        expect(pageKindOf("/user/123/mylist/456")).toBe("user:123")
        expect(pageKindOf("/user/456")).not.toBe(pageKindOf("/user/123"))
    })

    test("マイページは別種別として扱う", () => {
        expect(pageKindOf("/my")).toBe("my")
        expect(pageKindOf("/my/follow")).toBe("my")
        expect(pageKindOf("/my/history/video")).toBe("my")
        expect(pageKindOf("/my")).not.toBe(pageKindOf("/user/123"))
    })

    test("ランキングは全体を1グループにする", () => {
        expect(pageKindOf("/ranking")).toBe("ranking")
        expect(pageKindOf("/ranking/custom")).toBe("ranking")
        expect(pageKindOf("/ranking/genre")).toBe("ranking")
        expect(pageKindOf("/ranking/genre/hotopic")).toBe("ranking")
    })

    test("検索は種類+ワードで同一性を持つ", () => {
        expect(pageKindOf("/search/%E6%A4%9C%E7%B4%A2")).toBe("search:search:検索")
        expect(pageKindOf("/search/%E6%A4%9C%E7%B4%A2")).toBe(pageKindOf("/search/%E6%A4%9C%E7%B4%A2"))
        // 動画/ショートの切替は同一グループ
        expect(pageKindOf("/search_shorts/%E6%A4%9C%E7%B4%A2")).toBe(pageKindOf("/search/%E6%A4%9C%E7%B4%A2"))
        expect(pageKindOf("/tag/%E3%82%BF%E3%82%B0")).toBe("search:tag:タグ")
        expect(pageKindOf("/tag_shorts/%E3%82%BF%E3%82%B0")).toBe(pageKindOf("/tag/%E3%82%BF%E3%82%B0"))
        expect(pageKindOf("/mylist_search/xyz")).toBe("search:mylist:xyz")
        expect(pageKindOf("/series_search/xyz")).toBe("search:series:xyz")
        expect(pageKindOf("/user_search/xyz")).toBe("search:user:xyz")
        // ワードが変われば別ページ
        expect(pageKindOf("/search/other")).not.toBe(pageKindOf("/search/%E6%A4%9C%E7%B4%A2"))
        // 種類が変われば別ページ
        expect(pageKindOf("/tag/%E6%A4%9C%E7%B4%A2")).not.toBe(pageKindOf("/search/%E6%A4%9C%E7%B4%A2"))
    })

    test("おすすめページは単一グループ", () => {
        expect(pageKindOf("/recommendations")).toBe("recommendations")
    })

    test("対象外のパスはnullを返す", () => {
        expect(pageKindOf("/watch/sm9")).toBeNull()
        expect(pageKindOf("/")).toBeNull()
        expect(pageKindOf("/ranking_invalid")).toBeNull()
    })

    test("/mylist_searchは/myと誤マッチしない", () => {
        expect(pageKindOf("/mylist_search/xyz")).not.toBe("my")
    })
})
