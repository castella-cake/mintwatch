import { RankingTeibanFeaturedKeysDataRootObject } from "@/types/ranking/featuredKeys"
import APIError from "@/utils/classes/APIError"

/**
 * 利用可能なランキングの定番ジャンルを取得するAPI
 */
export async function getRankingTeibanFeaturedKeys() {
    const baseUrl = new URL(`https://nvapi.nicovideo.jp/v1/ranking/teiban/featured-keys`)
    const response = await fetch(baseUrl, {
        headers: {
            "x-client-os-type": "others",
            "x-frontend-id": "6",
        },
        method: "GET",
        credentials: "include",
    })
    const responseJson = await response.json() as RankingTeibanFeaturedKeysDataRootObject
    if (!validateBaseResponse(responseJson)) throw new APIError("getRankingTeibanFeaturedKeys failed.", responseJson)
    return responseJson
}
