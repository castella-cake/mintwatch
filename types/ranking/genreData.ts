import { RankingTeibanFeaturedKeysData } from "./featuredKeys"
import { RankingTeibanData } from "./teibanData"

export interface GenreRankingDataRootObject extends baseResponse {
    data: Data4
}

interface Data4 extends jsonResponseData {
    response: Response
}

interface Response {
    $getTeibanRanking: RankingTeibanData
    $getTeibanRankingFeaturedKeyAndTrendTags: GetTeibanRankingFeaturedKeyAndTrendTags
    $getTeibanRankingFeaturedKeys: RankingTeibanFeaturedKeysData
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
