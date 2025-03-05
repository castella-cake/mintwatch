export interface StoryBoardRightsRootObject {
    meta: Meta;
    data: Data;
}

interface Data {
    contentUrl: string;
    createTime: string;
    expireTime: string;
}

interface Meta {
    status: number;
}

export interface StoryBoardImageRootObject {
    version: string;
    thumbnailWidth: number;
    thumbnailHeight: number;
    columns: number;
    rows: number;
    interval: number;
    images: Image[];
}

interface Image {
    timestamp: number;
    url: string;
}