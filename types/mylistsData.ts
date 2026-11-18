export interface MylistsResponseRootObject extends baseResponse {
    data: Data
}

interface Data {
    hasNext: boolean
    mylists: MylistItem[]
    totalCount: number
}
