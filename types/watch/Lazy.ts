export interface VideoDataLazyRootObject extends baseResponse {
    data: Data
}

interface Data {
    owner: Owner
    ranking: Ranking
    series: Series | null
    waku: Waku
}

interface Series {
    id: number
    title: string
    description: string
    thumbnailUrl: string
    video: SeriesVideos
}

interface SeriesVideos {
    prev?: VideoItem
    next?: VideoItem
    first?: VideoItem
}

interface Waku {
    information: null
    bgImages: any[]
    addContents: null
    addVideo: null
    tagRelatedBanner: TagRelatedBanner
    tagRelatedMarquee: null
    pcHeaderCustomBanner: null
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

interface Ranking {
    teiban: Teiban
}

interface Teiban {
    featuredKey: string
    label: string
    rank: number
}

interface Owner {
    type: string
    visibility: string
    id: number
    nickname: string
    icon: Icon
    follow: Follow
    ownedChannel: null
    currentLive: null
    upcomingVideoLive: null
}

interface Follow {
    isFollowed: boolean
}

interface Icon {
    url: string
}
