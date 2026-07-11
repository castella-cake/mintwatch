export interface MyNicoruHistoryDataRootObject extends baseResponse {
    data: Data
}

interface Data {
    items: Item[]
    next: string
    prev: null
}

interface Item {
    id: string
    count: number
    createdAt: string
    commentBody: string
    commentCreatedAt: string
    totalCount: number
    video: VideoItem
    commentVpos: number
    isVideoOwnerNicoru: boolean
    isDeletedComment: boolean
    isFeatured?: boolean
}
