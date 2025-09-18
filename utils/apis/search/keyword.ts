import { SearchDataRootObject } from "@/types/search/searchData"
import APIError from "@/utils/classes/APIError"
import { validateBaseResponse } from "@/utils/validateResponse"

/**
 * キーワード検索を取得するAPI
 */
export async function getKeywordSearch(keyword: string, options: { page?: number, sort?: string, order?: string, kind?: string, l_range?: number, f_range?: number, genre?: string } = {}) {
    const requestUrl = new URL(`https://www.nicovideo.jp/search/${encodeURIComponent(keyword)}?responseType=json`)
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
    const responseJson = await response.json() as SearchDataRootObject
    if (!validateBaseResponse(responseJson)) throw new APIError("getKeywordSearch failed.", responseJson)
    return responseJson
}
