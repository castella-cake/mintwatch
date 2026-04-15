import APIError from "@/utils/classes/APIError"
import { validateBaseResponse } from "@/utils/validateResponse"

/**
 * タグ検索を取得するAPI
 */
export async function getTagSearch(keyword: string, options: VideoSearchQuery = {}) {
    const requestUrl = new URL(`https://www.nicovideo.jp/tag/${encodeURIComponent(keyword)}?responseType=json`)
    for (const optionKey in options) {
        const option = options[optionKey as keyof typeof options]
        if (typeof option === "string") {
            requestUrl.searchParams.set(optionKey, option)
        } else if (typeof option === "number") {
            requestUrl.searchParams.set(optionKey, option.toString())
        }
    }
    const response = await fetch(requestUrl.toString(), {
        method: "GET",
        credentials: "include",
    })
    const responseJson = await response.json() as SearchTagDataRootObject
    if (!validateBaseResponse(responseJson)) throw new APIError("getTagSearch failed.", responseJson)
    return responseJson
}

/**
 * タグショート動画検索を取得するAPI
 */
export async function getTagShortsSearch(keyword: string, options: VideoSearchQuery = {}) {
    const requestUrl = new URL(`https://www.nicovideo.jp/tag_shorts/${encodeURIComponent(keyword)}?responseType=json`)
    for (const optionKey in options) {
        const option = options[optionKey as keyof typeof options]
        if (typeof option === "string") {
            requestUrl.searchParams.set(optionKey, option)
        } else if (typeof option === "number") {
            requestUrl.searchParams.set(optionKey, option.toString())
        }
    }
    const response = await fetch(requestUrl.toString(), {
        method: "GET",
        credentials: "include",
    })
    const responseJson = await response.json() as SearchTagDataRootObject
    if (!validateBaseResponse(responseJson)) throw new APIError("getTagShortsSearch failed.", responseJson)
    return responseJson
}

export async function getFastTagSearch(keyword: string, options: VideoSearchQuery = {}, isShorts = false) {
    if (isShorts) {
        return await initialResponse(`/tag_shorts/${encodeURIComponent(keyword)}`, getTagShortsSearch, keyword, options)
    }
    return await initialResponse(`/tag/${encodeURIComponent(keyword)}`, getTagSearch, keyword, options)
}
