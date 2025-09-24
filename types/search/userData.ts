export interface SearchUserDataRootObject extends baseResponse {
    data: Data2
}

interface Data2 extends jsonResponseData {
    response: Response
}

interface Response {
    $getSearchUser: GetSearchUser
    page: Page
}

interface Page {
    common: SearchPageCommon
}

interface GetSearchUser {
    data: Data
}

interface Data {
    searchId: string
    totalCount: number
    hasNext: boolean
    items: SearchUserItem[]
}

export interface SearchUserItem {
    id: number
    nickname: string
    icons: Icons
    type: string
    isPremium: boolean
    description: string
    strippedDescription: string
    shortDescription: string
    relationships: Relationships
    followerCount: number
    videoCount: number
    liveCount: number
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
