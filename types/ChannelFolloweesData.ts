export interface ChannelFolloweesDataRootObject {
    meta: Meta
    data: ChannelFollowee[]
}

export interface ChannelFollowee {
    session: Session
    id: number
    name: string
    description: string
    isFree: boolean
    screenName: string
    ownerName: string
    price: number
    bodyPrice: number
    url: string
    thumbnailUrl: string
    thumbnailSmallUrl: string
    canAdmit: boolean
    isAdult: boolean
}

interface Session {
    joining: boolean
}

interface Meta {
    status: number
    total: number
    count: number
}
