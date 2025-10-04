import { ForYouRankingDataRootObject } from "@/types/ranking/forYouData"
import APIError from "@/utils/classes/APIError"

/**
 * For you ランキングを取得するAPI
 */
export async function getForYouRanking() {
    const response = await fetch("https://www.nicovideo.jp/ranking?responseType=json", {
        method: "GET",
        credentials: "include",
    })
    const responseJson = await response.json() as ForYouRankingDataRootObject
    if (!validateBaseResponse(responseJson)) throw new APIError("getForYouRanking failed.", responseJson)
    return responseJson
}
