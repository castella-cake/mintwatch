import APIError from "@/utils/classes/APIError"
import { validateBaseResponse } from "@/utils/validateResponse"

/**
 * チャンネル検索を行うAPI
 */
export async function getChannelSearch(keyword: string, options: { searchType?: string, limit?: number, sort?: string, responseGroup?: string } = { searchType: "keyword", limit: 3, sort: "popularity", responseGroup: "detail" }) {
    const requestUrl = new URL(`https://public-api.ch.nicovideo.jp/v1/open/search/channels?query=${encodeURIComponent(keyword)}`)
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
    const responseJson = await response.json() as SearchUserDataRootObject
    if (!validateBaseResponse(responseJson)) throw new APIError("getUserSearch failed.", responseJson)
    return responseJson
}
