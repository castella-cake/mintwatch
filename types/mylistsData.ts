export interface MylistsResponseRootObject extends baseResponse {
    data: Data
}

interface Data {
    hasNext: boolean
    mylists: Mylist[]
    totalCount: number
}

export interface Mylist {
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
    addedAt: string
    decoratedDescriptionHtml: string
    description: string
    itemId: number
    status: "public" | "private"
    video: VideoItem
    watchId: string
}
