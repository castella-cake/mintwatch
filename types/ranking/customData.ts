export interface CustomRankingDataRootObject extends baseResponse {
    data: Data3
}

interface Data3 extends jsonResponseData {
    response: Response
}

interface Response {
    $getCustomRankingSettings: GetCustomRankingSettings
    $getCustomRankingRanking: GetCustomRankingRanking[]
}

interface GetCustomRankingRanking {
    data: Data2
}

interface Data2 {
    laneId: number
    laneType: string
    title: string
    customType: string
    isAllGenre: boolean
    genres: Genre[]
    tags: string[]
    channelVideoListingStatus: string
    isDefault: boolean
    defaultTitle: string
    hasNext: boolean
    videoList: VideoItem[]
}

interface GetCustomRankingSettings {
    data: CustomTeibanRankingData
}

interface CustomTeibanRankingData {
    settings: Setting[]
    genres: Genre[]
}

interface Genre {
    key: string
    label: string
}

interface Setting {
    laneId: number
    title: string
    type: string
    isAllGenre: boolean
    genreKeys: string[]
    tags: string[]
    channelVideoListingStatus: string
    isDefault: boolean
}
