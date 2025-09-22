import { SearchMylistDataRootObject } from "@/types/search/mylistData"
import APIError from "@/utils/classes/APIError"
import { validateBaseResponse } from "@/utils/validateResponse"

/**
 * マイリスト検索結果を取得するAPI
 */
export async function getMylistSearch(keyword: string, options: VideoSearchQuery = {}) {
    const requestUrl = new URL(`https://www.nicovideo.jp/mylist_search/${encodeURIComponent(keyword)}?responseType=json`)
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
    const responseJson = await response.json() as SearchMylistDataRootObject
    if (!validateBaseResponse(responseJson)) throw new APIError("getMylistSearch failed.", responseJson)
    return responseJson
}
