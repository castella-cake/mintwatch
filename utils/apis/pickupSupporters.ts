/**
 * ニコニ広告者を取得するAPI
 * @param videoId 取得する動画ID
 * @param limit 貢献者の最大人数
 */
export async function getPickupSupporters(videoId: string, limit: number) {
    const response = await fetch(`https://api.nicoad.nicovideo.jp/v1/contents/video/${encodeURIComponent(videoId)}/pickup_supporters?limit=${encodeURIComponent(limit)}`)
    return await response.json()
}