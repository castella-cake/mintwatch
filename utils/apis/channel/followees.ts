import APIError from "@/utils/classes/APIError"
import { validateBaseResponse } from "@/utils/validateResponse"

/**
 * フォロー中のチャンネル一覧を取得するAPI
 */
export async function getChannelFollowees(limit: number = 100) {
    const requestUrl = new URL("https://public-api.ch.nicovideo.jp/v1/user/followees/channels")
    requestUrl.searchParams.set("limit", limit.toString())

    const response = await fetch(requestUrl.toString(), {
        headers: {
            "x-frontend-id": "6",
            "x-frontend-version": "0",
        },
        method: "GET",
        credentials: "include",
    })

    const responseJson = await response.json() as ChannelFolloweesDataRootObject
    if (!validateBaseResponse(responseJson)) throw new APIError("getChannelFollowees failed.", responseJson)
    return responseJson
}
