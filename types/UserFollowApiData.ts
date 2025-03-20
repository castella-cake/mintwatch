export interface UserFollowApiDataRootObject {
    data?: Data;
    meta: Meta;
}

interface Meta {
    status: number;
}

interface Data {
    following: boolean;
}