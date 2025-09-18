export interface SearchTagDataRootObject extends baseResponse {
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
    common: SearchPageCommon
    nicodic: Nicodic
    nicoadGroupsRequestIdMap: NicoadGroupsRequestIdMap
    playlist: string
}

interface NicoadGroupsRequestIdMap {
    nicodic: number
}

interface Nicodic {
    url: string
    title: string
    summary: string
    advertisable: boolean
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
