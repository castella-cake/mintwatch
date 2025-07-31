export function userIdToLiveUrl(userId: string) {
    return `https://live.nicovideo.jp/watch/user/${encodeURIComponent(userId)}`
}

export function userIdToUserUrl(userId: string) {
    return `https://www.nicovideo.jp/user/${encodeURIComponent(userId)}`
}
