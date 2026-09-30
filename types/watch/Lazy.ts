export interface VideoDataLazyRootObject extends baseResponse {
    data: LazyData
}

interface LazyData {
    owner: LazyOwner
    ranking: LazyRanking
    series: LazySeries | null
    waku: LazyWaku
}

// 投稿者情報
export interface LazyOwner {
    type: string
    visibility: string
    id: number
    nickname: string
    icon: LazyIcon
    follow: LazyFollow
    ownedChannel: null
    currentLive: null
    upcomingVideoLive: null
}

interface LazyIcon {
    url: string
}

interface LazyFollow {
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
 * Lazy API (`v4/watch/lazy/{id}`) のレスポンス data の全フィールドを含む型。
 * コンテキスト露出用には `Nullable<WatchLazyData>` を使う。
 */
export type WatchLazyData = LazyData

/**
 * Lazy API リクエスト時のペイロード
 * keyToken は watch/{id} のレスポンスの `lazy.authKey` から取得する想定
 */
export interface VideoDataLazyRequestBody {
    actionTrackId: string
    keyToken: string
}
