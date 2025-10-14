import APIError from "@/utils/classes/APIError"
import { validateBaseResponse } from "@/utils/validateResponse"

/**
 * ユーザー検索を取得するAPI
 */
export async function getUserSearch(keyword: string, options: VideoSearchQuery = {}) {
    const requestUrl = new URL(`https://www.nicovideo.jp/user_search/${encodeURIComponent(keyword)}?responseType=json`)
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

export async function getFastUserSearch(keyword: string, options: VideoSearchQuery = {}) {
    return await initialResponse(`/user_search/${encodeURIComponent(keyword)}`, getUserSearch, keyword, options)
}
