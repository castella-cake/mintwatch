export interface VideoDataRootObject extends baseResponse {
    data: Data
}

interface Data extends jsonResponseData {
    response: Response
}

/**
 * `meta.status !== 200` のときの動画情報レスポンス。
 * 成功時と異なり `data.response` に `$watchV4` は入らず、エラー情報が入る。
 */
export interface VideoDataErrorRootObject extends baseResponse {
    data: DataOnError
}

interface DataOnError extends jsonResponseData {
    response: ErrorResponse
    treatAs: boolean
}

interface Response {
    $watchV4: WatchV4
    pcweb: Pcweb
}

interface Pcweb {
    prebidAdSlotName: string
}

interface WatchV4 {
    data: WatchV4Data
}

export interface WatchV4Data {
    responseType: string
    client: Client
    comment: VideoDataComment
    media: Media | null
    player: Player
    video: VideoData
    genre: Genre
    tags: Tags
    lazy: Lazy
    system: System
    /** 未ログイン時は null */
    viewer: Viewer | null
    videoAds: VideoAds
    videoLive: null
    payment: Payment
    baseVideo: BaseVideo
    metadata: Metadata
    okReason: string
}

export interface Metadata {
    jsonLd: JsonLd
    gtm: Gtm
}

interface Gtm {
    channel: GtmChannel | null
}

/** チャンネル動画のときのみ存在する */
interface GtmChannel {
    id: string
    isMember: boolean
}

interface JsonLd {
    owner: Owner
    videoObject: VideoObject
}

interface VideoObject {
    regionsAllowed: string | null
    expiresAt: string | null
}

interface Owner {
    id: string
    type: string
    name: string
    description: string
    iconUrl: string
}

interface BaseVideo {
    baseVideoId: null
    contentType: null
    title: null
    thumbnail: null
}

export interface Payment {
    ppv: Ppv
    admission: Ppv
    continuationBenefit: Ppv
    premium: Ppv
    watchableUserType: string
    commentableUserType: string
    billingType: string
}

interface Ppv {
    isEnabled: boolean
    showPromotion: boolean
}

export interface VideoAds {
    additionalParams: AdditionalParams
    items: any[]
    reason: string | null
}

interface AdditionalParams {
    videoId: string
    videoDuration: number
    isAdultRatingNG: boolean
    isAuthenticationRequired: boolean
    isR18: boolean
    nicosid: string
    lang: string
    watchTrackId: string
    /** チャンネル動画のときのみ存在する */
    channelId?: string
    /** チャンネル動画のときのみ存在する */
    genre?: string
}

export interface Viewer {
    id: number
    nickname: string
    isPremium: boolean
    allowSensitiveContents: boolean
}

export interface System {
    serverTime: string
    isStellaAlive: boolean
    channelGtmContainerId: string
}

interface Lazy {
    authKey: string
}

export interface Tags {
    items: TagItem[]
    hasR18Tag: boolean
    isPublishedNicoscript: boolean
    edit: Edit
}

interface Edit {
    isEditable: boolean
    /** 未ログインなら "NEED_LOGIN"、自分の作品でない場合は "USER_FORBIDDEN" が入る */
    uneditableReason: string | null
    editKey: string | null
}

interface TagItem {
    name: string
    isLocked: boolean
}

export interface Genre {
    key: string
    label: string
    isImmoral: boolean
    isDisabled: boolean
    isNotSet: boolean
}

export interface VideoData {
    id: string
    contentType: string
    title: string
    description: string
    supplements: any[]
    count: GenericCount
    duration: number
    thumbnail: Thumbnail2
    registeredAt: string
    permission: Permission
    hasLyrics: boolean
    isHighRiskVideo: boolean
    isChannelVideo: boolean
    isOwnedByViewer: boolean
    showOwnerMenu: boolean
    isLikedByViewer: boolean
}

interface Permission {
    isPrivate: boolean
    isDeleted: boolean
    isAuthenticationRequired: boolean
    isEmbedPlayerAllowed: boolean
    isGiftAllowed: boolean
    isNgForVocacolleApp: boolean
    rating: Rating
}

interface Rating {
    isAdult: boolean
}

export interface Thumbnail2 {
    normal: string
    middle: string | null
    large: string | null
    player: string
    ogp: string
    short: null
}

export interface Player {
    comment: Comment2
    initialPlayback: InitialPlayback | null
    layerMode: number
}

interface InitialPlayback {
    type: string
    positionSec: number
}

interface Comment2 {
    isDefaultInvisible: boolean
}

export interface Media {
    contents: Contents
    isStoryboardAvailable: boolean
    accessRightKey: string
    hls: Hls | null
    lowDataMode: LowDataMode
}

interface LowDataMode {
    videoUpperLimit: number
    audioUpperLimit: number
}

/**
 * 再生可能な HLS の情報。
 * `?responseType=json&withAccessRight=1` で取得したレスポンスでは `Media.hls` に、
 * access-rights API から取得した場合は `accessRightsApiHlsToNormalizedHls` によってこの形になる。
 */
export interface Hls {
    url: string
    outputs: Output[]
    createdAt: string
    expiredAt: string
}

interface Output {
    assetUnitNames: string[]
}

export interface Contents {
    videos: Video[]
    audios: Audio[]
}

export interface Audio {
    id: string
    isAvailable: boolean
    qualityLevel: number
    bitRate: number
    samplingRate: number
    integratedLoudness: number
    truePeak: number
    loudnessCollection: LoudnessCollection[]
    label: Label
}

interface Label {
    quality: string
    bitrate: string
}

interface LoudnessCollection {
    type: string
    value: number
}

export interface Video {
    id: string
    isAvailable: boolean
    qualityLevel: number
    label: string
    bitRate: number
    width: number
    height: number
}

export interface VideoDataComment {
    threads: VideoDataThread[]
    layers: Layer[]
    ng: Ng
    isAttentionRequired: boolean
    nvComment: NvComment
    assist: Assist
}

interface Assist {
    sectionDurationSec: number
    minMatchCharacters: number
    ignorePostElapsedTimeSec: number
    ignoreCommentNgScoreThreshold: number
    commentCountThresholdList: number[][]
    buttonDisplayDurationSec: number
    buttonDisplayOffsetSec: number
}

export interface NvComment {
    threadKey: string
    server: string
    params: Params
}

interface Params {
    targets: Target[]
    language: string
}

interface Target {
    id: string
    fork: string
}

interface Ng {
    ngScore: NgScore
    owner: any[]
    /** 未ログイン時は null */
    viewer: NgData | null
}

interface NgScore {
    isDisabled: boolean
}

interface Layer {
    index: number
    isTranslucent: boolean
    components: Component[]
}

interface Component {
    threadId: number
    fork: number
    forkLabel: string
}

export interface VideoDataThread {
    id: number
    fork: number
    forkLabel: string
    videoId: string
    isPostTarget: boolean
    isOwnerThread: boolean
    is184Forced: boolean
    label: string
    /** チャンネル限定動画では "channelRestriction" のような理由が入る */
    postNgReason: string | null
    syncBufferTime: number
}

export interface Client {
    nicosid: string
    watchId: string
    watchTrackId: string
}

/**
 * `meta.status !== 200` のときのレスポンス (`data.response` に入る)。
 * 実例: 削除済み動画なら statusCode 403 / errorCode "FORBIDDEN" / reasonCode "ADMINISTRATOR_DELETE_VIDEO"
 */
export interface ErrorResponse {
    statusCode: number
    errorCode: string
    reasonCode: string
    deletedMessage: string | null
    publishScheduledAt: string | null
    dataSet: null
}
