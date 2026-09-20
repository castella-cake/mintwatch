import { expect, test } from "vitest"

test("validateVideoId: 正しい動画IDがtrueを返す", () => {
    expect(validateVideoId("sm12345678")).toBe(true)
    expect(validateVideoId("so12345678")).toBe(true)
    expect(validateVideoId("nm12345678")).toBe(true)
    expect(validateVideoId("nl12345678")).toBe(true)
})

test("validateVideoId: 不正な動画IDがfalseを返す", () => {
    expect(validateVideoId("sm012345678")).toBe(false)
    expect(validateVideoId("soabcdef")).toBe(false)
})

test("detectVideoIdFromString: 文字列から動画IDを検出する", () => {
    expect(detectVideoIdFromString("→sm12345678")).toEqual(["sm12345678"])
    expect(detectVideoIdFromString("→so12345678")).toEqual(["so12345678"])
    expect(detectVideoIdFromString("→nm12345678")).toEqual(["nm12345678"])
    expect(detectVideoIdFromString("→nl12345678")).toEqual(["nl12345678"])
    expect(detectVideoIdFromString("→ss12345678")).toEqual(["ss12345678"])
})

test("detectVideoIdFromString: 複数の動画IDを検出する", () => {
    expect(detectVideoIdFromString("→sm12345678 →so12345678 →sm01invalid")).toEqual(["sm12345678", "so12345678"])
})

test("detectVideoIdFromString: 文字列に動画IDが含まれない場合にundefinedが返る", () => {
    expect(detectVideoIdFromString("→sm012345678")).toBeUndefined()
    expect(detectVideoIdFromString("→soabcdef")).toBeUndefined()
})

test("isPathnameIsVideoPage: 正しい動画ページのパス名がtrueを返す", () => {
    expect(isPathnameIsVideoPage("/watch/sm12345678", true)).toBe(true)
    expect(isPathnameIsVideoPage("/shorts/ss12345678", true)).toBe(true)
})

test("isPathnameIsVideoPage: 不正な動画ページのパス名がfalseを返す", () => {
    expect(isPathnameIsVideoPage("/watch/invalid", true)).toBe(false)
    expect(isPathnameIsVideoPage("/shorts/invalid", true)).toBe(false)
    expect(isPathnameIsVideoPage("/user/12345678", true)).toBe(false)
})

test("isPathnameIsVideoPage: ショートページが無効な場合にfalseを返す", () => {
    expect(isPathnameIsVideoPage("/shorts/ss12345678", false)).toBe(false)
})

test("urlToVideoId: URLがnullの場合にundefinedが返る", () => {
    expect(urlToVideoId(null)).toBeUndefined()
})

test("urlToVideoId: URLがwatchの場合に正しい動画IDが返る", () => {
    expect(urlToVideoId("https://www.nicovideo.jp/watch/sm12345678")).toBe("sm12345678")
})

test("urlToVideoId: URLがshortsの場合に正しい動画IDが返る", () => {
    expect(urlToVideoId("https://www.nicovideo.jp/shorts/sm12345678")).toBe("sm12345678")
})

test("urlToVideoId: URLがwatch以外の場合にundefinedが返る", () => {
    expect(urlToVideoId("https://www.nicovideo.jp/user/12345678")).toBeUndefined()
})

test("urlToVideoId: URLがwatchでパスが空の場合にundefinedが返る", () => {
    expect(urlToVideoId("https://www.nicovideo.jp/watch/")).toBeUndefined()
})
