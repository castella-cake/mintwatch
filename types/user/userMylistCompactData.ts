export interface UserMylistCompactDataRootObject extends baseResponse {
    data: Data
}

interface Data {
    mylists: CompactMylist[]
}

interface CompactMylist {
    id: number
    isPublic: boolean
    name: string
    description: string
    createdAt: string
}
