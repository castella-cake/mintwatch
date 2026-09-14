export function isContentIsVideoItem(recommendItem: RecommendItem): recommendItem is RecommendItem & { content: VideoItem } {
    return recommendItem.contentType === "video"
}

export function isContentIsMylistItem(recommendItem: RecommendItem): recommendItem is RecommendItem & { content: MylistItem } {
    return recommendItem.contentType === "mylist"
}

export function isContentIsLive(recommendItem: RecommendItem): recommendItem is RecommendItem & { content: any } {
    return recommendItem.contentType === "live"
}
