import { GenresDataRootObject } from "@/types/GenresData"
import APIError from "../classes/APIError"

/**
 * VideoTop 用のジャンル一覧を取得するAPI
 */
export async function getGenres() {
    const response = await fetch("https://nvapi.nicovideo.jp/v1/genres", {
        headers: {
            "x-client-os-type": "others",
            "x-frontend-id": "6",
        },
        method: "GET",
        credentials: "include",
    })
    const responseJson = await response.json() as GenresDataRootObject
    if (!validateBaseResponse(responseJson)) throw new APIError("getGenres failed.", responseJson)
    return responseJson
}
