export interface WatchLaterDataRootObject extends baseResponse {
    data: Data
}

interface Data {
    watchLater: WatchLater
}

interface WatchLater {
    items: Item[]
    hasInvisibleItems: boolean
    totalCount: number
    hasNext: boolean
}

interface Item {
    itemId: number
    watchId: string
    memo: string
    decoratedMemoHtml: string
    addedAt: string
    status: string
    video: VideoItem
}
