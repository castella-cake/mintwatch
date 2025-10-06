export interface WatchLaterDataRootObject extends baseResponse {
    data: Data
}

interface Data {
    watchLater: WatchLater
}

interface WatchLater {
    item: Item
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
