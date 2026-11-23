import { WatchLaterItem } from "./generic/watchLaterItem"

export interface WatchLaterActionResponseDataRootObject extends baseResponse {
    data: Data
}

interface Data {
    watchLater: WatchLater
}

interface WatchLater {
    item: WatchLaterItem
}
