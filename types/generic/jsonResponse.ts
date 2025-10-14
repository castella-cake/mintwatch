export interface jsonResponseData {
    metadata: Metadata
    googleTagManager: GoogleTagManager
}

interface GoogleTagManager {
    user: GoogleTagManagerUser
    content?: GoogleTagManagerContent
}

interface GoogleTagManagerContent {
    player_type: string
    genre: string
    content_type: string
}

interface GoogleTagManagerUser {
    login_status: string
    user_id?: string
    member_status?: string
    ui_area?: string
    ui_lang?: string
}

interface Metadata {
    title: string
    linkTags: LinkTag[]
    metaTags: MetaTag[]
    jsonLds: JsonLd[]
}

interface JsonLd {
    "@context": string
    "@type": string
    "@id"?: string
    "name"?: string
    "description"?: string
    "caption"?: string
    "url"?: string
    "duration"?: string
    "uploadDate"?: string
    "embedUrl"?: string
    "interactionStatistic"?: InteractionStatistic[]
    "thumbnail"?: Thumbnail[]
    "thumbnailUrl"?: string[]
    "requiresSubscription"?: boolean
    "isAccessibleForFree"?: boolean
    "commentCount"?: number
    "keywords"?: string
    "genre"?: string
    "playerType"?: string
    "provider"?: Provider
    "author"?: Author
    "itemListElement"?: ItemListElement[]
}

interface ItemListElement {
    "@type": string
    "position": number
    "item": Item
}

interface Item {
    "@id": string
    "name": string
}

interface Author {
    "@type": string
    "name": string
    "description": string
    "url": string
}

interface Provider {
    "@type": string
    "name": string
}

interface Thumbnail {
    "@type": string
    "url": string
    "width"?: number
    "height"?: number
}

interface InteractionStatistic {
    "@type": string
    "interactionType": string
    "userInteractionCount": number
}

interface MetaTag {
    name?: string
    content: string
    property?: string
}

interface LinkTag {
    rel: string
    href: string
    attrs: Attr | Attrs2 | Attrs3 | any[] | Attrs5
}

interface Attrs5 {
    type: string
    sizes: string
}

interface Attrs3 {
    media: string
    class: string
}

interface Attrs2 {
    class: string
}

interface Attr {
    as: string
}
