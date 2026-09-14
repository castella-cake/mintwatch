import { VideosDataRootObject } from "@/types/VideosData"
import APIError from "../classes/APIError"

export async function getVideosByIds(watchIds: string[]) {
    const response = await fetch(`https://nvapi.nicovideo.jp/v1/videos?watchIds=${watchIds.map(encodeURIComponent).join(",")}`, {
        headers: {
            "x-frontend-id": "6",
            "x-frontend-version": "0",
            "x-niconico-language": "ja-jp",
            "x-request-with": "https://www.nicovideo.jp",
        },
        method: "GET",
        credentials: "include",
    })

    const responseJson = await response.json() as VideosDataRootObject
    if (!validateBaseResponse(responseJson)) throw new APIError("getVideosByIds failed.", responseJson)
    return responseJson
}
