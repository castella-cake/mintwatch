export interface SearchListDataRootObject extends baseResponse {
    data: Data
}

interface Data {
    metadata: Metadata
    googleTagManager: GoogleTagManager
    response: Response
}

interface Response {
    $getSearchList: GetSearchList
    page: Page
}

interface Page {
    common: SearchPageCommon
}

interface GetSearchList {
    data: Data2
}

interface Data2 {
    searchId: string
    totalCount: number
    hasNext: boolean
    items: GenericListItem[]
}

export interface GenericListItem {
    id: number
    type: "mylist" | "series"
    title: string
    description: string
    thumbnailUrl: string
    videoCount: number
    owner: GenericOwner
    isMuted: boolean
    isFollowing: boolean
    followerCount: number
    lastVideoAddedAt: string
    sampleItems: SampleItem[]
}

interface SampleItem {
    videoId: string
    status: string
    video: VideoItem
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
