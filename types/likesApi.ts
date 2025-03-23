export interface LikesApi extends baseResponse {
    data: Data;
}

interface Data {
    thanksMessage?: string;
}