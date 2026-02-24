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
    sampleItems: SampleItem[]
    followerCount: number
    createdAt: string
    isFollowing: boolean
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
