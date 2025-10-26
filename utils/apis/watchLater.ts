import { WatchLaterDataRootObject } from "@/types/watchLaterApi"
import APIError from "../classes/APIError"

export async function addToWatchLater(smId: string, memo = "") {
    const response = await fetch("https://nvapi.nicovideo.jp/v1/users/me/watch-later", {
        headers: {
            "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
            "x-frontend-id": "6",
            "x-frontend-version": "0",
            "x-niconico-language": "ja-jp",
            "x-request-with": "https://www.nicovideo.jp",
        },
        body: `watchId=${encodeURIComponent(smId)}&memo=${encodeURIComponent(memo)}`,
        method: "POST",
        credentials: "include",
    })

    const responseJson = await response.json() as WatchLaterDataRootObject
    if (!validateBaseResponse(responseJson)) throw new APIError("addToWatchLater failed.", responseJson)
    return responseJson
}

export async function modifyWatchLaterMemo(itemId: number, memo = "") {
    const response = await fetch(`https://nvapi.nicovideo.jp/v1/users/me/watch-later/${itemId}`, {
        headers: {
            "x-frontend-id": "6",
            "x-frontend-version": "0",
            "x-niconico-language": "ja-jp",
            "x-request-with": "https://www.nicovideo.jp",
        },
        body: `memo=${encodeURIComponent(memo)}`,
        method: "POST",
        credentials: "include",
    })
    const responseJson = await response.json() as WatchLaterDataRootObject
    if (!validateBaseResponse(responseJson)) throw new APIError("modifyWatchLaterMemo failed.", responseJson)
    return responseJson
}
