export interface GetSearchVideoV2 {
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
    nicoadGroups?: NicoadGroup[]
    waku: Waku | null
}

interface Tag {
    text: string
    type: string
}

interface NicoadGroup {
    requestId: number
    nicoadNicodics: any[]
}

interface Waku {
    tagRelatedBanner: TagRelatedBanner
}

interface TagRelatedBanner {
    title: string
    imageUrl: string
    description: string
    isEvent: boolean
    linkUrl: string
    linkType: string
    linkOrigin: string
    isNewWindow: boolean
}
