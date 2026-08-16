export interface playlistQueryData {
    type: "mylist" | "custom-ranking" | "series" | "pm-queue" | "search" | null
    context?: any
}

export interface seriesContext {
    seriesId: number
}
export interface mylistContext {
    mylistId: number
    // どういうわけかContinueがviewCountの存在を認知していた なんで？
    sortKey?: "addedAt" | "commentCount" | "duration" | "lastCommentTime" | "likeCount" | "mylistCount" | "registeredAt" | "title" | "viewCount"
    sortOrder?: "desc" | "asc"
}
export interface rankingContext {
    laneId: number
    limit?: number
    offset?: number
}

export interface searchContext {
    keyword?: string
    tag?: string
    sortKey?: string
    sortOrder?: string
    page?: number
    pageSize?: number
    channelVideoListingStatus?: string
    selectContentType?: string
}

export interface queueContext {
    videos: string[]
}
