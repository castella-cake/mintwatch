import { WatchLaterItem } from "./generic/watchLaterItem"

export interface WatchLaterDataRootObject extends baseResponse {
    data: Data
}

interface Data {
    watchLater: WatchLater
}

interface WatchLater {
    items: WatchLaterItem[]
    hasInvisibleItems: boolean
    totalCount: number
    hasNext: boolean
}
