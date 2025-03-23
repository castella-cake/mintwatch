export interface CommentThreadKeyData extends baseResponse {
    data: Data;
}
interface Data {
    threadKey: string;
}