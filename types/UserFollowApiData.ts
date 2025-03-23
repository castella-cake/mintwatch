export interface UserFollowApiDataRootObject extends baseResponse {
    data?: Data;
}


interface Data {
    following: boolean;
}