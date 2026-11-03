import APIError from "@/utils/classes/APIError"
import { validateBaseResponse } from "@/utils/validateResponse"

/**
 * v2検索APIを取得するAPI
 */
export async function getV2Search(type: "keyword" | "tag" | "lockTag", query: string, pageSize: number, sortKey?: string, sortOrder?: string, genres?: string) {
    const requestUrl = new URL("https://nvapi.nicovideo.jp/v2/search/video")
    requestUrl.searchParams.set("site", "nicovideo")
    requestUrl.searchParams.set("_frontendId", "6")
    requestUrl.searchParams.set("_frontendVersion", "0")
    requestUrl.searchParams.set(type, query)
    requestUrl.searchParams.set("pageSize", pageSize.toString())
    if (sortKey) requestUrl.searchParams.set("sortKey", sortKey)
    if (sortOrder) requestUrl.searchParams.set("sortOrder", sortOrder)
    if (genres) requestUrl.searchParams.set("genres", genres)
    const response = await fetch(requestUrl.toString(), {
        method: "GET",
        credentials: "include",
    })
    const responseJson = await response.json() as V2SearchDataRootObject
    if (!validateBaseResponse(responseJson)) throw new APIError("getV2Search failed.", responseJson)
    return responseJson
}
