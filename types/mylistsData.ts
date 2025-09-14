export interface MylistsResponseRootObject extends baseResponse {
    data: Data
}

interface Data {
    mylists: Mylist[]
}

export interface Mylist {
    id: number
    isPublic: boolean
    name: string
    description: string
    decoratedDescriptionHtml: string
    defaultSortKey: string
    defaultSortOrder: string
    itemsCount: number
    owner: Owner
    sampleItems: any[]
    followerCount: number
    createdAt: string
    isFollowing: boolean
}

interface Owner {
    ownerType: string
    type: string
    visibility: string
    id: string
    name: string
    iconUrl: string
}
