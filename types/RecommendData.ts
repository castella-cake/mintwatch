// JSON to TS で生成したものを手直ししたものです
// mylistの扱いとかもうちょっと修正したいですが、とりあえず名前の書き直しだけしています
export interface RecommendDataRootObject extends baseResponse {
    data?: Data
}

interface Data {
    recipe: Recipe
    recommendId: string
    items: RecommendItem[]
}

export interface RecommendItem {
    id: string
    contentType: string
    recommendType: string
    content: Content
}

interface Content {
    type?: string
    id: number | string
    title?: string
    registeredAt?: string
    count?: GenericCount
    thumbnail?: GenericThumbnail
    duration?: number
    shortDescription?: string
    latestCommentSummary?: string
    isChannelVideo?: boolean
    isPaymentRequired?: boolean
    playbackPosition?: null | number
    owner: GenericOwner
    requireSensitiveMasking?: boolean
    videoLive?: null
    isMuted?: boolean
    isPublic?: boolean
    name?: string
    description?: string
    decoratedDescriptionHtml?: string
    defaultSortKey?: string
    defaultSortOrder?: string
    itemsCount?: number
    sampleItems?: SampleItem[]
    followerCount?: number
    createdAt?: string
    isFollowing?: boolean
}

interface SampleItem {
    itemId: number
    watchId: string
    description: string
    decoratedDescriptionHtml: string
    addedAt: string
    status: string
    video: VideoItem
}

interface Recipe {
    id: string
    meta: null
}
