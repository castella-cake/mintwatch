export interface CommentDeleteKeyRootObject extends baseResponse {
    data: Data
}

interface Data {
    deleteKey: string
}
