export interface HistoryDataRootObject extends baseResponse {
    data: Data
}

interface Data {
    items: Item[]
    nextCursor: string
}

interface Item {
    itemId: string
    viewedAt: string
    isMaybeLikeUserItem: boolean
    video: VideoItem
}
