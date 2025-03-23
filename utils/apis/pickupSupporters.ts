export async function getPickupSupporters(videoId: string, limit: number) {
    const response = await fetch(`https://api.nicoad.nicovideo.jp/v1/contents/video/${encodeURIComponent(videoId)}/pickup_supporters?limit=${encodeURIComponent(limit)}`)
    return await response.json()
}