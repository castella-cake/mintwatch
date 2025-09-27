import APIError from "../classes/APIError"

/**
 * 指定した動画のコンテンツツリーを取得するAPI
 * @param videoId 動画ID
 * @param limit 取得する親子作品の個数
 */
export async function getCommonsRelatives(videoId: string, limit = 15) {
    const response = await fetch(`https://public-api.commons.nicovideo.jp/v1/tree/${encodeURIComponent(videoId)}/relatives?_limit=${encodeURIComponent(limit)}&with_meta=1&_sort=-id`, {
        method: "GET",
        mode: "cors",
        credentials: "include",
    })
    const responseJson = await response.json() as CommonsRelativeRootObject
    if (!validateBaseResponse(responseJson)) throw new APIError("getCommonsRelatives failed.", responseJson)
    return responseJson
}
