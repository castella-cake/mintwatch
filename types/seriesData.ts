export interface SeriesResponseRootObject extends baseResponse {
    data: Data
}

interface Data {
    detail: Detail
    totalCount: number
    items: Item[]
}

interface Item {
    meta: Meta2
    video: VideoItem
}

interface Meta2 {
    id: string
    order: number
    createdAt: string
    updatedAt: string
}

interface Detail {
    id: number
    owner: Owner
    title: string
    description: string
    decoratedDescriptionHtml: string
    thumbnailUrl: string
    isListed: boolean
    createdAt: string
    updatedAt: string
}

interface Owner {
    type: string
    id: string
    channel: Channel
}

interface Channel {
    id: string
    name: string
    description: string
    thumbnailUrl: string
    thumbnailSmallUrl: string
}
