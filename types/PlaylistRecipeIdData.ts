export interface PlaylistRecipeIdDataRootObject extends baseResponse {
    data: Data
}

interface Data {
    id: Id
    meta: Meta2
    totalCount: number
    items: Item[]
    recommendId: string
}

interface Item {
    watchId: string
    content: VideoItem
}

interface Meta2 {
    title: string
    ownerName: string
}

interface Id {
    type: string
    value: string
}
