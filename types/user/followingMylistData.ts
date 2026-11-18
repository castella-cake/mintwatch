export interface FollowingMylistDataRootObject extends baseResponse {
    data: Data
}

interface Data {
    followLimit: number
    mylists: Mylist[]
}

interface Mylist {
    id: number
    status: string
    detail: MylistItem
}
