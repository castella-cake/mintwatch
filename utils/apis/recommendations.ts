import { RecommendationsDataRootObject } from "@/types/recommendations/recommendationsData"
import APIError from "@/utils/classes/APIError"
import { validateBaseResponse } from "@/utils/validateResponse"
import { initialResponse } from "@/utils/apis/initialResponse"

/**
 * 「おすすめの動画」ページを取得するAPI
 */
export async function getRecommendations() {
    const response = await fetch("https://www.nicovideo.jp/recommendations?responseType=json", {
        method: "GET",
        credentials: "include",
    })
    const responseJson = await response.json() as RecommendationsDataRootObject
    if (!validateBaseResponse(responseJson)) throw new APIError("getRecommendations failed.", responseJson)
    return responseJson
}

/**
 * initialResponse を優先して取得する高速版
 */
export async function getFastRecommendations() {
    return await initialResponse<RecommendationsDataRootObject>(
        "/recommendations",
        () => getRecommendations(),
    )
}
