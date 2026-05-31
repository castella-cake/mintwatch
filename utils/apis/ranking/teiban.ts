import { RankingTeibanDataRootObject } from "@/types/ranking/teibanData"
import APIError from "@/utils/classes/APIError"

/**
 * 定番ランキングを取得するAPI
 */
export async function getTeibanRanking(featuredKey: string, term = "24h") {
    const response = await fetch(`https://nvapi.nicovideo.jp/v1/ranking/teiban/${featuredKey}?term=${term}`, {
        headers: {
            "x-client-os-type": "others",
            "x-frontend-id": "6",
        },
        method: "GET",
        credentials: "include",
    })
    const responseJson = await response.json() as RankingTeibanDataRootObject
    if (!validateBaseResponse(responseJson)) throw new APIError("getTeibanRanking failed.", responseJson)
    return responseJson
}
