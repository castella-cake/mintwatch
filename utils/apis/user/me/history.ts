import { HistoryDataRootObject } from "@/types/user/historyData"
import APIError from "@/utils/classes/APIError"

export async function getMyWatchHistory(limit = 6, cursor?: string | null) {
    const url = new URL(`https://nvapi.nicovideo.jp/v2/users/me/watch/history?limit=${limit}`)
    if (cursor && cursor !== "") url.searchParams.append("cursor", cursor)
    const response = await fetch(url.toString(), {
        credentials: "include",
        headers: {
            "X-Frontend-Id": "6",
            "X-Frontend-Version": "0",
            "X-Niconico-Language": "ja-jp",
        },
        method: "GET",
    })
    const responseJson = await response.json() as HistoryDataRootObject
    if (!validateBaseResponse(responseJson)) throw new APIError("getMyWatchHistory failed.", responseJson)
    return responseJson
}
