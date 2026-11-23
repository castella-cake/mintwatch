export interface MylistItem {
    id: number
    isPublic: boolean
    name: string
    description: string
    decoratedDescriptionHtml: string
    defaultSortKey: string
    defaultSortOrder: string
    itemsCount: number
    owner: GenericOwner
    sampleItems: MylistVideoItem[]
    followerCount: number
    createdAt: string
    isFollowing: boolean
}

export interface MylistVideoItem {
    itemId: number
    watchId: string
    description: string
    decoratedDescriptionHtml: string
    addedAt: string
    status: "public" | "private"
    video: VideoItem
}
