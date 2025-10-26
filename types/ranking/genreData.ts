export interface GenreRankingDataRootObject extends baseResponse {
    data: Data4
}

interface Data4 extends jsonResponseData {
    response: Response
}

interface Response {
    $getTeibanRanking: GetTeibanRanking
    $getTeibanRankingFeaturedKeyAndTrendTags: GetTeibanRankingFeaturedKeyAndTrendTags
    $getTeibanRankingFeaturedKeys: GetTeibanRankingFeaturedKeys
    page: Page
}

interface Page {
    pagination: GenericPagination
    currentTag: null
    currentTerm: string
    availableTerms: AvailableTerm[]
    niconewsRanking: NiconewsRanking[]
    foryouRanking: ForyouRanking
}

interface ForyouRanking {
    featuredKey: string
    label: string
    tag: string
    items: VideoItem[]
}

interface NiconewsRanking {
    rank: number
    id: string
    title: string
    link: string
    thumbnailUrl: string
    commentCount: number
}

interface AvailableTerm {
    label: string
    value: string
}

interface GetTeibanRankingFeaturedKeys {
    data: Data3
}

interface Data3 {
    items: ForYouTeibanRankingItem[]
    definition: Definition
}

interface Definition {
    maxItemCount: MaxItemCount
}

interface MaxItemCount {
    teiban: number
    trendTag: number
    forYou: number
}

interface ForYouTeibanRankingItem {
    featuredKey: string
    label: string
    isEnabledTrendTag: boolean
    isMajorFeatured: boolean
    isTopLevel: boolean
    isImmoral: boolean
    isEnabled: boolean
}

interface GetTeibanRankingFeaturedKeyAndTrendTags {
    data: Data2
}

interface Data2 {
    featuredKey: string
    label: string
    isTopLevel: boolean
    isImmoral: boolean
    trendTags: string[]
}

interface GetTeibanRanking {
    data: GenreTeibanRankingData
}

interface GenreTeibanRankingData {
    featuredKey: string
    label: string
    tag: null | string
    maxItemCount: number
    items: VideoItem[]
    hasNext: boolean
}
