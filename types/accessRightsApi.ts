export interface AccessRightsRootObject extends baseResponse {
    data: Data;
}

interface Data {
    contentUrl: string;
    createTime: string;
    expireTime: string;
}