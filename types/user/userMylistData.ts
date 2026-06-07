export interface UserMylistResponseRootObject extends baseResponse {
    data: Data
}

interface Data {
    mylist: Mylist
}

interface Mylist {
    id: number
    name: string
    description: string
    decoratedDescriptionHtml: string
    defaultSortKey: string
    defaultSortOrder: string
    items: Item[]
    totalItemCount: number
    hasNext: boolean
    isPublic: boolean
    owner: GenericOwner
    hasInvisibleItems: boolean
    followerCount: number
    isFollowing: boolean
}

interface Item {
    itemId: number
    watchId: string
    description: string
    decoratedDescriptionHtml: string
    addedAt: string
    status: string
    video: VideoItem
}
