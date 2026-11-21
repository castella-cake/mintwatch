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

test.fails("事実上判別できない反転したタイトルは誤ったパースを返す", () => {
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

test("オーナー表記を含む括弧式の後にセパレータが含まれていても取り除く", () => {
    expect(resolveTitleAndArtist("『Title』 / Artist feat.Somebody", "Artist")).toEqual({ title: "Title", artist: "Artist feat.Somebody" })
    expect(resolveTitleAndArtist("Artist feat.Somebody / 『Title』", "Artist")).toEqual({ title: "Title", artist: "Artist feat.Somebody" })
})

test("オーナー表記を含まない括弧式の後にセパレータが含まれていても取り除く", () => {
    expect(resolveTitleAndArtist("『Title』 / Somebody", "Artist")).toEqual({ title: "Title", artist: "Artist / Somebody" })
    expect(resolveTitleAndArtist("Somebody / 『Title』", "Artist")).toEqual({ title: "Title", artist: "Artist / Somebody" })
})

test("異なるホワイトスペースを正しくハンドルできる", () => {
    expect(resolveTitleAndArtist("Title　/　Somebody", "Artist")).toEqual({ title: "Title", artist: "Artist / Somebody" })
})

test("括弧式はCDタグ式よりも優先される", () => {
    expect(resolveTitleAndArtist("『Title』Somebody / Artist", "Artist")).toEqual({ title: "Title", artist: "Artist / Somebody" })
})

test.todo("連なったCDタグ式を正しく分離できる", () => {
    expect(resolveTitleAndArtist("Title / Artist Somebody - TITLE / ARTIST SOMEBODY", "Artist")).toEqual({ title: "Title", artist: "Artist Somebody" })
})

test("CDタグ式の分離で、スペースがある方を優先する", () => {
    expect(resolveTitleAndArtist("Ti-tle - A-B feat.Somebody", "A-B")).toEqual({ title: "Ti-tle", artist: "A-B feat.Somebody" })
})

test("CDタグ式の分離で、-より/を優先する", () => {
    expect(resolveTitleAndArtist("Ti-tle/A-B feat.Somebody", "A-B")).toEqual({ title: "Ti-tle", artist: "A-B feat.Somebody" })
})

test("三連分離を正しく解釈する", () => {
    expect(resolveTitleAndArtist("Artist - Title - feat.Somebody", "Artist")).toEqual({ title: "Title", artist: "Artist / feat.Somebody" })
})

test("三連分離で/より-を優先する", () => {
    expect(resolveTitleAndArtist("Artist/Participant - Title - feat.Somebody/Somebody", "Artist")).toEqual({ title: "Title", artist: "Artist/Participant / feat.Somebody/Somebody" })
})

test("jpOg式の「〜が歌ってくれたよ」タイトルが正しく分離される", () => {
    expect(resolveTitleAndArtist("初音ミクがオリジナル曲を歌ってくれました「Packaged」Full ver.", "kz")).toEqual({ title: "Packaged", artist: "kz / 初音ミク" })
})

test("jpOg式で敬称付きの歌唱者が正しく分離される", () => {
    expect(resolveTitleAndArtist("Singerさんが「Title」を歌ってくれたよ", "Artist")).toEqual({ title: "Title", artist: "Artist / Singer" })
    expect(resolveTitleAndArtist("Singerちゃんが「Title」を歌ってくれたよ", "Artist")).toEqual({ title: "Title", artist: "Artist / Singer" })
    expect(resolveTitleAndArtist("Singerくんが「Title」を歌ってくれたよ", "Artist")).toEqual({ title: "Title", artist: "Artist / Singer" })
})

test("jpOg式で2文字の日本語名の歌唱者も分離される", () => {
    expect(resolveTitleAndArtist("星界が歌ってくれたよ「Title」", "Artist")).toEqual({ title: "Title", artist: "Artist / 星界" })
})

test("jpOg式で歌唱者と「が」の間に複数の空白があっても分離される", () => {
    expect(resolveTitleAndArtist("初音ミク　が　 オリジナル曲を歌ってくれたよ「LEGENDS」", "Artist")).toEqual({ title: "LEGENDS", artist: "Artist / 初音ミク" })
})

test("jpOg式で「うちの」前置きが歌唱者に含まれない", () => {
    expect(resolveTitleAndArtist("うちのSingerが歌ってくれたよ「Title」", "Artist")).toEqual({ title: "Title", artist: "Artist / Singer" })
})

test("jpOg式で名前に「の」を含む歌唱者が誤分割されない", () => {
    expect(resolveTitleAndArtist("唯世かのんが「Title」を歌ってくれたよ", "Artist")).toEqual({ title: "Title", artist: "Artist / 唯世かのん" })
})
