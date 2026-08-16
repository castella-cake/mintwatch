import { PlaylistResponseRootObject } from "@/types/playlistData"
import { searchContext } from "@/types/playlistQuery"
import APIError from "@/utils/classes/APIError"
import { validateBaseResponse } from "@/utils/validateResponse"

/**
 * 検索結果をプレイリストとして取得するAPI
 * @param context 検索プレイリストの条件（playlistクエリのcontextに含まれる情報）
 */
export async function getSearchPlaylist(context: searchContext) {
    const requestUrl = new URL("https://nvapi.nicovideo.jp/v1/playlist/search")
    for (const optionKey in context) {
        const option = context[optionKey as keyof typeof context]
        if (typeof option === "string") {
            requestUrl.searchParams.set(optionKey, option)
        } else if (typeof option === "number") {
            requestUrl.searchParams.set(optionKey, option.toString())
        }
    }
    const response = await fetch(requestUrl.toString(), {
        credentials: "include",
        headers: {
            "content-type": "application/json",
            "X-Frontend-Id": "6",
            "X-Frontend-Version": "0",
            "X-Niconico-Language": "ja-jp",
        },
        method: "GET",
    })
    const responseJson = await response.json() as PlaylistResponseRootObject
    if (!validateBaseResponse(responseJson)) throw new APIError("getSearchPlaylist failed.", responseJson)
    return responseJson
}
