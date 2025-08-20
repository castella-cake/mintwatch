export interface ForYouRankingDataRootObject extends baseResponse {
    data: Data2
}

interface Data2 {
    metadata: Metadata
    googleTagManager: GoogleTagManager
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
    items: Item[]
}

interface Item {
    type: string
    id: string
    title: string
    registeredAt: string
    count: Count
    thumbnail: Thumbnail
    duration: number
    shortDescription: string
    latestCommentSummary: string
    isChannelVideo: boolean
    isPaymentRequired: boolean
    playbackPosition: null
    owner: Owner
    requireSensitiveMasking: boolean
    videoLive: null
    isMuted: boolean
}

interface Owner {
    ownerType: string
    type: string
    visibility: string
    id: string
    name: string
    iconUrl: string
}

interface Thumbnail {
    url: string
    middleUrl: null | string | string
    largeUrl: null | string | string
    listingUrl: string
    nHdUrl: string
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
