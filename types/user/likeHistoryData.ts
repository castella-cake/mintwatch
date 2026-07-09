export interface MyLikeHistoryRootObject extends baseResponse {
    data: Data
}

interface Data {
    items: Item[]
    summary: Summary
}

interface Summary {
    hasNext: boolean
    canGetNextPage: boolean
    getNextPageNgReason: null
}

interface Item {
    likedAt: string
    thanksMessage: null | string
    video: VideoItem
    status: string
}
