export interface CustomRankingDataRootObject extends baseResponse {
    data: Data3;
}

interface Data3 {
    metadata: Metadata;
    googleTagManager: GoogleTagManager;
    response: Response;
}

interface Response {
    '$getCustomRankingSettings': GetCustomRankingSettings;
    '$getCustomRankingRanking': GetCustomRankingRanking[];
}

interface GetCustomRankingRanking {
    data: Data2;
}

interface Data2 {
    laneId: number;
    laneType: string;
    title: string;
    customType: string;
    isAllGenre: boolean;
    genres: Genre[];
    tags: string[];
    channelVideoListingStatus: string;
    isDefault: boolean;
    defaultTitle: string;
    hasNext: boolean;
    videoList: VideoList[];
}

interface VideoList {
    type: string;
    id: string;
    title: string;
    registeredAt: string;
    count: Count;
    thumbnail: Thumbnail;
    duration: number;
    shortDescription: string;
    latestCommentSummary: string;
    isChannelVideo: boolean;
    isPaymentRequired: boolean;
    playbackPosition: null | null | number;
    owner: Owner;
    requireSensitiveMasking: boolean;
    videoLive: null;
    isMuted: boolean;
}

interface Owner {
    ownerType: string;
    type: string;
    visibility: string;
    id: string;
    name: string;
    iconUrl: string;
}

interface Thumbnail {
    url: string;
    middleUrl: null | string;
    largeUrl: null | string;
    listingUrl: string;
    nHdUrl: string;
}

interface Count {
    view: number;
    comment: number;
    mylist: number;
    like: number;
}

interface GetCustomRankingSettings {
    data: CustomTeibanRankingData;
}

interface CustomTeibanRankingData {
    settings: Setting[];
    genres: Genre[];
}

interface Genre {
    key: string;
    label: string;
}

interface Setting {
    laneId: number;
    title: string;
    type: string;
    isAllGenre: boolean;
    genreKeys: string[];
    tags: string[];
    channelVideoListingStatus: string;
    isDefault: boolean;
}

interface GoogleTagManager {
    user: User;
}

interface User {
    login_status: string;
    user_id: string;
    member_status: string;
    ui_area: string;
    ui_lang: string;
}

interface Metadata {
    title: string;
    linkTags: LinkTag[];
    metaTags: MetaTag[];
    jsonLds: any[];
}

interface MetaTag {
    name?: string;
    content: string;
    property?: string;
}

interface LinkTag {
    rel: string;
    href: string;
    attrs: Attr | any[] | Attrs3;
}

interface Attrs3 {
    type: string;
    sizes: string;
}

interface Attr {
    as: string;
}