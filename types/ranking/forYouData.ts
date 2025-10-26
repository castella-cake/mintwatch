export interface ForYouRankingDataRootObject extends baseResponse {
    data: Data2
}

interface Data2 extends jsonResponseData {
    response: Response
}

interface Response {
    $getForYouRanking: GetForYouRanking
}

interface GetForYouRanking {
    data: ForYouTeibanRankingData
}

interface ForYouTeibanRankingData {
    items: ForYouTeibanRankingItem[]
}

interface ForYouTeibanRankingItem {
    featuredKey: string
    label: string
    tag: string
    items: VideoItem[]
}
