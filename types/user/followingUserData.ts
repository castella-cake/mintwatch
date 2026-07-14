export interface FollowingUserDataRootObject extends baseResponse {
    data: Data
}

interface Data {
    items: FollowUserItem[]
    summary: Summary
}

interface Summary {
    followees: number
    followers: number
    hasNext: boolean
    cursor: string
}

export interface FollowUserItem {
    id: number
    nickname: string
    icons: Icons
    type: string
    isPremium: boolean
    description: string
    strippedDescription: string
    shortDescription: string
    relationships: Relationships
}

interface Relationships {
    sessionUser: SessionUser
}

interface SessionUser {
    isFollowing: boolean
}

interface Icons {
    small: string
    large: string
}
