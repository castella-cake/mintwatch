// key
export interface KeyRootObjectResponse extends baseResponse {
    data: KeyData;
}

interface KeyData {
    postKey: string;
}

//commentpost
export interface CommentPostBody {
    videoId: string;
    commands: string[];
    body: string;
    vposMs: number;
    postKey: string;
}