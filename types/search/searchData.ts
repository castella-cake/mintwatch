export interface SearchDataRootObject extends baseResponse {
    data: Data2
}

interface Data2 {
    metadata: Metadata
    googleTagManager: GoogleTagManager
    response: Response
}

interface Response {
    $getSearchVideoV2: GetSearchVideoV2
    page: Page
}

interface Page {
    common: Common
    playlist: string
}

interface Common {
    searchWord: string
    searchWords: string[]
    searchType: string
    option: SearchOption
    pagination: GenericPagination
    isImmoralSearch: boolean
}

interface GetSearchVideoV2 {
    data: Data
}

interface Data {
    searchId: string
    totalCount: number
    hasNext: boolean
    keyword: string
    tag: null
    lockTag: null
    genres: any[]
    items: VideoItem[]
    additionals: Additionals
}

interface Additionals {
    tags: Tag[]
    waku: unknown
}

interface Tag {
    text: string
    type: string
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
    attrs: Attr | any[] | Attrs3 | Attrs4
}

interface Attrs4 {
    type: string
    sizes: string
}

interface Attrs3 {
    media: string
}

interface Attr {
    as: string
}
