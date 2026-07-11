import { MyNicoruHistoryDataRootObject } from "@/types/user/nicoruHistoryData"
import { MyNicoruReceiveCountDataRootObject } from "@/types/user/nicoruReceiveCountData"
import APIError from "@/utils/classes/APIError"

export async function getNicoruHistory(type: "send" | "receive", limit: number, cursor?: string) {
    const url = new URL(`https://nvapi.nicovideo.jp/v1/users/me/nicoru/${type}`)
    url.searchParams.append("limit", limit.toString())
    if (cursor) {
        url.searchParams.append("cursor", cursor)
    }
    const response = await fetch(url, {
        headers: {
            "x-frontend-id": "6",
            "x-frontend-version": "0",
            "x-niconico-language": "ja-jp",
        },
        method: "GET",
        credentials: "include",
    })

    const responseJson = await response.json() as MyNicoruHistoryDataRootObject
    if (!validateBaseResponse(responseJson)) throw new APIError("getNicoruHistory failed.", responseJson)
    return responseJson
}

export async function getNicoruReceiveCount() {
    const response = await fetch("https://nvapi.nicovideo.jp/v1/users/me/nicoru/receive/count", {
        headers: {
            "x-frontend-id": "6",
            "x-frontend-version": "0",
            "x-niconico-language": "ja-jp",
        },
        method: "GET",
        credentials: "include",
    })

    const responseJson = await response.json() as MyNicoruReceiveCountDataRootObject
    if (!validateBaseResponse(responseJson)) throw new APIError("getNicoruReceiveCount failed.", responseJson)
    return responseJson
}
