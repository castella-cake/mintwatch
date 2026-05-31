import { RecommendDataRootObject } from "@/types/RecommendData"
import APIError from "../classes/APIError"

/**
 * 指定した動画に関連したおすすめ動画を取得するAPI
 * @param recipeId おすすめ動画のレシピID("video_watch_recommendation" | "video_top_recommend")
 * @param smId おすすめ動画を取得する動画ID("video_watch_recommendation" の場合に必須)
 * @param limit 取得するおすすめ動画の数の上限(デフォルト: 25)
 */
export async function getRecommend(recipeId: "video_watch_recommendation" | "video_top_recommend", smId?: string | null, limit = 25) {
    const apiUrl = new URL("https://nvapi.nicovideo.jp/v1/recommend?site=nicovideo&_frontendId=6&_frontendVersion=0")
    apiUrl.searchParams.append("recipeId", recipeId)
    apiUrl.searchParams.append("limit", limit.toString())
    if (recipeId === "video_watch_recommendation") {
        if (!smId) throw new Error("smId is required when recipeId is video_watch_recommendation")
        apiUrl.searchParams.append("videoId", smId)
    }

    const response = await fetch(apiUrl.toString(), {
        credentials: "include",
        method: "GET",
    })
    const responseJson: RecommendDataRootObject = await response.json()
    if (!validateBaseResponse(responseJson)) throw new APIError("Recommend API failed.", responseJson)
    return responseJson
}
