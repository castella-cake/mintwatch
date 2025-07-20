import LyricDataRootObject from "@/types/lyricData"
import APIError from "../classes/APIError"

export async function getLyrics(smId: string) {
    const response = await fetch(`https://nvapi.nicovideo.jp/v1/videos/${encodeURIComponent(smId)}/lyrics`, {
        credentials: "include",
        headers: {
            "content-type": "application/json",
            "X-Frontend-Id": "6",
            "X-Frontend-Version": "0",
            "X-Niconico-Language": "ja-jp",
        },
        method: "GET",
    })
    const responseJson = await response.json() as LyricDataRootObject
    if (!validateBaseResponse(responseJson)) throw new APIError("getLyrics failed.", responseJson)
    return responseJson
}
