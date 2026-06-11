export interface UserOwnedSeriesDataRootObject extends baseResponse {
    data: Data
}

interface Data {
    totalCount: number
    items: Item[]
}

interface Item {
    id: number
    owner: Owner
    title: string
    isListed: boolean
    description: string
    thumbnailUrl: string
    itemsCount: number
}

interface Owner {
    type: string
    id: string
}
