import { expect, test } from "vitest"

test("オーナーが存在しない場合にnullが即時で返る", () => {
    expect(resolveTitleAndArtist("AnythingTitle", null)).toEqual({ title: "AnythingTitle", artist: null })
})

test("CDタグ式のタイトルとアーティストが正しく分離される", () => {
    expect(resolveTitleAndArtist("Title / Artist feat.Somebody", "Artist")).toEqual({ title: "Title", artist: "Artist feat.Somebody" })
})

test("不完全なCDタグ式のタイトルとアーティストが正しく補完される", () => {
    expect(resolveTitleAndArtist("Title / Somebody", "Artist")).toEqual({ title: "Title", artist: "Artist / Somebody" })
})

test("反転したCDタグ式のタイトルとアーティストが正しく分離される", () => {
    expect(resolveTitleAndArtist("Artist feat.Somebody - Title", "Artist")).toEqual({ title: "Title", artist: "Artist feat.Somebody" })
})

test.todo("事実上判別できない反転したタイトルは誤ったパースを返す", () => {
    expect(resolveTitleAndArtist("Somebody - Title", "Artist")).toEqual({ title: "Title", artist: "Artist / Somebody" })
})

test("括弧式の両方に名前を含むタイトル表示が正しく分離される(Artist→Somebody)", () => {
    expect(resolveTitleAndArtist("Artist『Title』Somebody", "Artist")).toEqual({ title: "Title", artist: "Artist / Somebody" })
})

test("括弧式の両方に名前を含むタイトル表示が逆でも、順序は入れ替わらない(Somebody→Artist)", () => {
    expect(resolveTitleAndArtist("Somebody『Title』Artist", "Artist")).toEqual({ title: "Title", artist: "Artist / Somebody" })
})

test("括弧式の前に名前を含むタイトル表示が正しく分離される", () => {
    expect(resolveTitleAndArtist("Somebody『Title』", "Artist")).toEqual({ title: "Title", artist: "Artist / Somebody" })
})

test("括弧式の後に名前を含むタイトル表示が正しく分離される", () => {
    expect(resolveTitleAndArtist("『Title』Somebody", "Artist")).toEqual({ title: "Title", artist: "Artist / Somebody" })
})

test("異なるホワイトスペースを正しくハンドルできる", () => {
    expect(resolveTitleAndArtist("Title　/　Somebody", "Artist")).toEqual({ title: "Title", artist: "Artist / Somebody" })
})
