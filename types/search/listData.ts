export interface SearchListDataRootObject extends baseResponse {
    data: Data
}

interface Data extends jsonResponseData {
    response: Response
}

interface Response {
    $getSearchList: GetSearchList
    page: Page
}

interface Page {
    common: SearchPageCommon
}

interface GetSearchList {
    data: Data2
}

interface Data2 {
    searchId: string
    totalCount: number
    hasNext: boolean
    items: GenericListItem[]
}

export interface GenericListItem {
    id: number
    type: "mylist" | "series"
    title: string
    description: string
    thumbnailUrl: string
    videoCount: number
    owner: GenericOwner
    isMuted: boolean
    isFollowing: boolean
    followerCount: number
    lastVideoAddedAt: string
    sampleItems: SampleItem[]
}

interface SampleItem {
    videoId: string
    status: string
    video: VideoItem
}
