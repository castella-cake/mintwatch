export interface CustomRankingDataRootObject extends baseResponse {
    data: Data3
}

interface Data3 {
    metadata: Metadata
    googleTagManager: GoogleTagManager
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

interface GoogleTagManager {
    user: User
}

interface User {
    login_status: string
    user_id: string
    member_status: string
    ui_area: string
    ui_lang: string
}

interface Metadata {
    title: string
    linkTags: LinkTag[]
    metaTags: MetaTag[]
    jsonLds: any[]
}

interface MetaTag {
    name?: string
    content: string
    property?: string
}

interface LinkTag {
    rel: string
    href: string
    attrs: Attr | any[] | Attrs3
}

interface Attrs3 {
    type: string
    sizes: string
}

interface Attr {
    as: string
}
