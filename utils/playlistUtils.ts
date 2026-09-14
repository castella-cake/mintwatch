import { playlistVideoItem } from "@/components/PMWatch/modules/Playlist"
import { playlistQueryData } from "@/types/playlistQuery"
import { RecommendItem } from "@/types/RecommendData"

export function decodePlaylistString(playlistString: string): playlistQueryData {
    const base64 = playlistString.replace(/-/g, "+").replace(/_/g, "/")
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4)
    const binary = atob(padded)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i)
    }
    return JSON.parse(new TextDecoder().decode(bytes)) as playlistQueryData
}

/**
 * プレイリストクエリをbase64にエンコードする
 * JSONに日本語などの非Latin1文字が含まれても正しくエンコードできる
 */
export function encodePlaylistQuery(playlistQuery: unknown) {
    const json = JSON.stringify(playlistQuery)
    const bytes = new TextEncoder().encode(json)
    let binary = ""
    for (const byte of bytes) {
        binary += String.fromCharCode(byte)
    }
    return btoa(binary)
}

/**
 * 指定した動画を先頭に据え、以降を元の並び順のまま巡回させる
 * @param items プレイリストのアイテム
 * @param videoId 先頭に据えたい動画ID
 */
export function rotatePlaylistToStart(items: playlistVideoItem[], videoId: string | undefined) {
    if (items.length < 2 || !videoId) return items
    const startIndex = items.findIndex(item => item.id === videoId)
    if (startIndex === -1) return items
    return items.toSpliced(0, items.length, ...items.slice(startIndex), ...items.slice(0, startIndex))
}

export function isValidRecommendItem(value: unknown): value is RecommendItem {
    return (
        typeof value === "object"
        && Object.prototype.hasOwnProperty.call(value, "id")
        && Object.prototype.hasOwnProperty.call(value, "contentType")
        && Object.prototype.hasOwnProperty.call(value, "recommendType")
        && Object.prototype.hasOwnProperty.call(value, "content")
    )
}

export function isValidVideoItem(value: unknown): value is VideoItem {
    return (
        typeof value === "object"
        && Object.prototype.hasOwnProperty.call(value, "type")
        && Object.prototype.hasOwnProperty.call(value, "id")
        && Object.prototype.hasOwnProperty.call(value, "title")
        && Object.prototype.hasOwnProperty.call(value, "registeredAt")
        && Object.prototype.hasOwnProperty.call(value, "count")
        && Object.prototype.hasOwnProperty.call(value, "thumbnail")
        && Object.prototype.hasOwnProperty.call(value, "duration")
        && Object.prototype.hasOwnProperty.call(value, "shortDescription")
        && Object.prototype.hasOwnProperty.call(value, "latestCommentSummary")
        && Object.prototype.hasOwnProperty.call(value, "isChannelVideo")
        && Object.prototype.hasOwnProperty.call(value, "isPaymentRequired")
        && Object.prototype.hasOwnProperty.call(value, "playbackPosition")
        && Object.prototype.hasOwnProperty.call(value, "owner")
        && Object.prototype.hasOwnProperty.call(
            value,
            "requireSensitiveMasking",
        )
        && Object.prototype.hasOwnProperty.call(value, "videoLive")
        && Object.prototype.hasOwnProperty.call(value, "isMuted")
    )
}

export function recommendItemToPlaylistItem(data: RecommendItem) {
    if (isContentIsVideoItem(data)) {
        return videoItemToPlaylistItem(data.content)
    }
    return
}

export function videoItemToPlaylistItem(data: VideoItem) {
    if (
        !data.title
        || !data.duration
        || !data.id
    )
        return
    return {
        title: data.title,
        id: data.id.toString(),
        itemId: crypto.randomUUID(),
        ownerName: data.owner.name,
        duration: data.duration,
        thumbnailUrl: data.thumbnail
            ? data.thumbnail.listingUrl
            : "",
    } as playlistVideoItem
}

export function seriesItemToPlaylistItem(data: VideoItem) {
    if (!data.title || !data.duration || !data.id) return
    return {
        title: data.title,
        id: data.id.toString(),
        itemId: crypto.randomUUID(),
        ownerName: data.owner.name,
        duration: data.duration,
        thumbnailUrl: data.thumbnail ? data.thumbnail.listingUrl : "",
    } as playlistVideoItem
}
