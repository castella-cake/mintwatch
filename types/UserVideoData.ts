export interface UserVideoData extends baseResponse {
    data: Data
}

interface Data {
    totalCount: number
    items: Item[]
}

interface Item {
    series: Series | null
    essential: VideoItem
}

interface Series {
    id: number
    title: string
    order: number
}
