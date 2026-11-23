import { MylistVideoItem } from "../generic/MylistItemData"

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
    items: MylistVideoItem[]
    totalItemCount: number
    hasNext: boolean
    isPublic: boolean
    owner: GenericOwner
    hasInvisibleItems: boolean
    followerCount: number
    isFollowing: boolean
}
