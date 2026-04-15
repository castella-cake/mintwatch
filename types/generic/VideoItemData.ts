export interface VideoItem {
    type: string
    id: string
    contentType: "long" | "short"
    title: string
    registeredAt: string
    count: GenericCount
    thumbnail: GenericThumbnail
    duration: number
    shortDescription: string
    latestCommentSummary: string
    isChannelVideo: boolean
    isPaymentRequired: boolean
    playbackPosition: null | number
    owner: GenericOwner
    requireSensitiveMasking: boolean
    videoLive: null
    isMuted: boolean
}
