import { SearchDataRootObject } from "@/types/search/searchData"
import APIError from "@/utils/classes/APIError"
import { validateBaseResponse } from "@/utils/validateResponse"

/**
 * キーワード検索を取得するAPI
 */
export async function getKeywordSearch(keyword: string, page = 1) {
    const response = await fetch(`https://www.nicovideo.jp/search/${encodeURIComponent(keyword)}?responseType=json&page=${encodeURIComponent(page)}`, {
        method: "GET",
        credentials: "include",
    })
    const responseJson = await response.json() as SearchDataRootObject
    if (!validateBaseResponse(responseJson)) throw new APIError("getKeywordSearch failed.", responseJson)
    return responseJson
}
