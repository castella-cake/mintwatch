export interface VideoDataLazyRootObject extends baseResponse {
    data: WatchLazyData
}

export interface WatchLazyData {
    owner: LazyOwnerUser | LazyOwnerChannel | LazyOwnerUnavailable
    ranking: LazyRanking
    series: LazySeries | null
    waku: LazyWaku
}

// 投稿者情報
export interface LazyOwnerUnavailable {
    type: "user" | "channel"
    visibility: "unavailable"
}
export interface LazyOwnerUser {
    type: "user"
    visibility: "visible"
    id: number
    nickname: string
    icon: LazyOwnerUserIcon
    /** 未ログイン時は null */
    follow: LazyOwnerUserFollow | null
    ownedChannel: null
    currentLive: null
    upcomingVideoLive: null
}

export interface LazyOwnerChannel {
    type: "channel"
    visibility: "visible"
    id: string
    name: string
    isOfficialAnime: boolean
    isDisplayAdBanner: boolean
    thumbnail: LazyOwnerChannelThumbnail
    follow: LazyOwnerChannelFollow
}

interface LazyOwnerChannelFollow {
    isSubscribed: boolean
    isBookmarked: boolean
    token: string
    tokenTimestamp: number
}

interface LazyOwnerChannelThumbnail {
    url: string
    smallUrl: string
}

interface LazyOwnerUserIcon {
    url: string
}

interface LazyOwnerUserFollow {
    isFollowed: boolean
}

// ランキング情報
export interface LazyRanking {
    teiban: Teiban | null
}

interface Teiban {
    featuredKey: string
    label: string
    rank: number
}

// シリーズ情報
export interface LazySeries {
    id: number
    title: string
    description: string
    thumbnailUrl: string
    video: LazySeriesVideos
}

interface LazySeriesVideos {
    prev?: VideoItem
    next?: VideoItem
    first?: VideoItem
}

// プロモーション
export interface LazyWaku {
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

/**
 * Lazy API リクエスト時のペイロード
 * keyToken は watch/{id} のレスポンスの `lazy.authKey` から取得する想定
 */
export interface VideoDataLazyRequestBody {
    actionTrackId: string
    keyToken: string
}
