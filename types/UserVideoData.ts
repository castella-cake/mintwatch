export interface UserVideoData  {
    meta: Meta;
    data: Data;
}

interface Data {
    totalCount: number;
    items: Item[];
}

interface Item {
    series: Series | null;
    essential: Essential;
}

interface Essential {
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
    playbackPosition: null | number;
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
    middleUrl: string;
    largeUrl: string;
    listingUrl: string;
    nHdUrl: string;
}

interface Count {
    view: number;
    comment: number;
    mylist: number;
    like: number;
}

interface Series {
    id: number;
    title: string;
    order: number;
}

interface Meta {
    status: number;
}