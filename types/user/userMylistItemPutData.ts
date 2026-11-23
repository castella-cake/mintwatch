import { MylistVideoItem } from "../generic/MylistItemData"

export interface UserMylistItemPutResponseDataRootObject extends baseResponse {
    data: Data
}

interface Data {
    item: MylistVideoItem
}
