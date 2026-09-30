export interface VideoDataRootObject extends baseResponse {
    data: Data
}

interface Data extends jsonResponseData {
    response: Response
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

interface WatchV4Data {
    responseType: string
    client: Client
    comment: Comment
    media: Media
    player: Player
    video: Video2
    genre: Genre
    tags: Tags
    lazy: Lazy
    system: System
    viewer: Viewer2
    videoAds: VideoAds
    videoLive: null
    payment: Payment
    baseVideo: BaseVideo
    metadata: Metadata
    okReason: string
}

interface Metadata {
    jsonLd: JsonLd
    gtm: Gtm
}

interface Gtm {
    channel: null
}

interface JsonLd {
    owner: Owner
    videoObject: VideoObject
}

interface VideoObject {
    regionsAllowed: null
    expiresAt: null
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

interface Payment {
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

interface VideoAds {
    additionalParams: AdditionalParams
    items: any[]
    reason: null
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
    genre: string
    gender: string
    age: number
}

interface Viewer2 {
    id: number
    nickname: string
    isPremium: boolean
    allowSensitiveContents: boolean
}

interface System {
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
    uneditableReason: null
    editKey: string
}

interface TagItem {
    name: string
    isLocked: boolean
}

interface Genre {
    key: string
    label: string
    isImmoral: boolean
    isDisabled: boolean
    isNotSet: boolean
}

interface Video2 {
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

interface Thumbnail2 {
    normal: string
    middle: string
    large: string
    player: string
    ogp: string
    short: null
}

interface Player {
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

interface Media {
    contents: Contents
    isStoryboardAvailable: boolean
    accessRightKey: string
    hls: Hls
    lowDataMode: LowDataMode
}

interface LowDataMode {
    videoUpperLimit: number
    audioUpperLimit: number
}

interface Hls {
    url: string
    outputs: Output[]
    createdAt: string
    expiredAt: string
}

interface Output {
    assetUnitNames: string[]
}

interface Contents {
    videos: Video[]
    audios: Audio[]
}

interface Audio {
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

interface Video {
    id: string
    isAvailable: boolean
    qualityLevel: number
    label: string
    bitRate: number
    width: number
    height: number
}

interface Comment {
    threads: Thread[]
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

interface NvComment {
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
    viewer: NgData
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
    postNgReason: null
    syncBufferTime: number
}

interface Client {
    nicosid: string
    watchId: string
    watchTrackId: string
}

export interface ErrorResponse {
    isCustomError: boolean
    statusCode: number
    errorCode: string
    reasonCode: string
    deletedMessage: null
    communityLink: null
    publishScheduledAt: null
    data: null
}
