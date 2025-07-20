import { playlistVideoItem } from "@/components/PMWatch/modules/Playlist"
import { RecommendItem } from "@/types/RecommendData"
import { SeriesVideoItem } from "@/types/VideoData"

export function isValidRecommendItem(value: unknown): value is RecommendItem {
    return (
        typeof value === "object"
        && Object.prototype.hasOwnProperty.call(value, "id")
        && Object.prototype.hasOwnProperty.call(value, "contentType")
        && Object.prototype.hasOwnProperty.call(value, "recommendType")
        && Object.prototype.hasOwnProperty.call(value, "content")
    )
}

export function isValidSeriesVideoItem(value: unknown): value is SeriesVideoItem {
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
    if (
        !data.content
        || !data.content.title
        || !data.content.duration
        || !data.content.id
    )
        return
    return {
        title: data.content.title,
        id: data.content.id.toString(),
        itemId: crypto.randomUUID(),
        ownerName: data.content.owner.name,
        duration: data.content.duration,
        thumbnailUrl: data.content.thumbnail
            ? data.content.thumbnail.listingUrl
            : "",
    } as playlistVideoItem
}

export function seriesItemToPlaylistItem(data: SeriesVideoItem) {
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
