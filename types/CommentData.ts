// JSON to TS で生成したものをそのまま使ってます
export interface CommentDataRootObject extends baseResponse {
    data?: Data;
}

interface Data {
    globalComments: GlobalComment[];
    threads: Thread[];
}

export interface Thread {
    id: string;
    fork: string;
    commentCount: number;
    comments: Comment[];
}

export interface Comment {
    id: string;
    no: number;
    vposMs: number;
    body: string;
    commands: string[];
    userId: string;
    isPremium: boolean;
    score: number;
    postedAt: string;
    nicoruCount: number;
    nicoruId: string | null;
    source: string;
    isMyPost: boolean;
}

interface GlobalComment {
    id: string;
    count: number;
}

export interface CommentResponseRootObject extends baseResponse {
    data: CommentResponseData;
}

interface CommentResponseData {
    id: string;
    no: number;
}