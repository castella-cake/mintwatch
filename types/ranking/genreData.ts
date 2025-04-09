export interface GenreRankingDataRootObject extends baseResponse {
    data: Data4;
}

interface Data4 {
    metadata: Metadata;
    googleTagManager: GoogleTagManager;
    response: Response;
}

interface Response {
    '$getTeibanRanking': GetTeibanRanking;
    '$getTeibanRankingFeaturedKeyAndTrendTags': GetTeibanRankingFeaturedKeyAndTrendTags;
    '$getTeibanRankingFeaturedKeys': GetTeibanRankingFeaturedKeys;
    page: Page;
}

interface Page {
    pagination: Pagination;
    currentTag: null;
    currentTerm: string;
    availableTerms: AvailableTerm[];
    niconewsRanking: NiconewsRanking[];
    foryouRanking: ForyouRanking;
}

interface ForyouRanking {
    featuredKey: string;
    label: string;
    tag: string;
    items: GenreTeibanRankingItem[];
}

interface NiconewsRanking {
    rank: number;
    id: string;
    title: string;
    link: string;
    thumbnailUrl: string;
    commentCount: number;
}

interface AvailableTerm {
    label: string;
    value: string;
}

interface Pagination {
    page: number;
    pageSize: number;
    totalCount: number;
}

interface GetTeibanRankingFeaturedKeys {
    data: Data3;
}

interface Data3 {
    items: ForYouTeibanRankingItem[];
    definition: Definition;
}

interface Definition {
    maxItemCount: MaxItemCount;
}

interface MaxItemCount {
    teiban: number;
    trendTag: number;
    forYou: number;
}

interface ForYouTeibanRankingItem {
    featuredKey: string;
    label: string;
    isEnabledTrendTag: boolean;
    isMajorFeatured: boolean;
    isTopLevel: boolean;
    isImmoral: boolean;
    isEnabled: boolean;
}

interface GetTeibanRankingFeaturedKeyAndTrendTags {
    data: Data2;
}

interface Data2 {
    featuredKey: string;
    label: string;
    isTopLevel: boolean;
    isImmoral: boolean;
    trendTags: any[];
}

interface GetTeibanRanking {
    data: GenreTeibanRankingData;
}

interface GenreTeibanRankingData {
    featuredKey: string;
    label: string;
    tag: null;
    maxItemCount: number;
    items: GenreTeibanRankingItem[];
    hasNext: boolean;
}

interface GenreTeibanRankingItem {
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
    playbackPosition: null;
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