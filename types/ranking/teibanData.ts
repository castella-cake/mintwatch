export interface RankingTeibanDataRootObject extends baseResponse, RankingTeibanData {
}

export interface RankingTeibanData {
    data: Data
}

interface Data {
    featuredKey: string
    label: string
    tag: null
    maxItemCount: number
    items: VideoItem[]
    hasNext: boolean
}
