import { expect, test } from "vitest"
import { decodePlaylistString, encodePlaylistQuery, rotatePlaylistToStart } from "./playlistUtils"
import { playlistVideoItem } from "@/components/PMWatch/modules/Playlist"
import { playlistQueryData } from "@/types/playlistQuery"

function makeItems(ids: string[]): playlistVideoItem[] {
    return ids.map(id => ({
        title: `title-${id}`,
        id,
        itemId: `item-${id}`,
        ownerName: null,
        duration: 100,
        thumbnailUrl: "",
    }))
}

test("rotatePlaylistToStart: 指定動画を先頭に据え、以降を元の順序で巡回させる", () => {
    const items = makeItems(["a", "b", "c", "d", "e"])
    expect(rotatePlaylistToStart(items, "c").map(item => item.id)).toEqual(["c", "d", "e", "a", "b"])
})

test("rotatePlaylistToStart: 先頭を指定した場合はそのままの順序", () => {
    const items = makeItems(["a", "b", "c"])
    expect(rotatePlaylistToStart(items, "a").map(item => item.id)).toEqual(["a", "b", "c"])
})

test("rotatePlaylistToStart: 対象の動画が存在しない場合は元の順序を維持する", () => {
    const items = makeItems(["a", "b", "c"])
    expect(rotatePlaylistToStart(items, "x").map(item => item.id)).toEqual(["a", "b", "c"])
    expect(rotatePlaylistToStart(items, undefined).map(item => item.id)).toEqual(["a", "b", "c"])
})

test("rotatePlaylistToStart: 要素が1つの場合はそのまま", () => {
    const items = makeItems(["a"])
    expect(rotatePlaylistToStart(items, "a").map(item => item.id)).toEqual(["a"])
})

test("decodePlaylistString: パディングなしのURLセーフbase64をデコードできる", () => {
    const playlistQuery: playlistQueryData = {
        type: "search",
        context: {
            tag: "VOCALOID",
            sortKey: "hot",
            sortOrder: "none",
            page: 1,
            pageSize: 32,
            channelVideoListingStatus: "included",
            selectContentType: "long",
        },
    }
    const encoded = Buffer.from(JSON.stringify(playlistQuery)).toString("base64")
        .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
    expect(decodePlaylistString(encoded)).toEqual(playlistQuery)
})

test("decodePlaylistString: パディング付きの標準base64もデコードできる", () => {
    const playlistQuery: playlistQueryData = { type: "series", context: { seriesId: 1234 } }
    const encoded = Buffer.from(JSON.stringify(playlistQuery)).toString("base64")
    expect(decodePlaylistString(encoded)).toEqual(playlistQuery)
})

test("encodePlaylistQuery: 日本語を含むクエリをエンコードでき、デコードで元に戻る", () => {
    const playlistQuery: playlistQueryData = {
        type: "search",
        context: {
            tag: "テスト",
            sortKey: "hot",
            sortOrder: "none",
            page: 1,
            pageSize: 32,
            channelVideoListingStatus: "included",
            selectContentType: "long",
        },
    }
    const encoded = encodePlaylistQuery(playlistQuery)
    expect(decodePlaylistString(encoded)).toEqual(playlistQuery)
})
