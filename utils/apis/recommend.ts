import { RecommendDataRootObject } from "@/types/RecommendData"
import APIError from "../classes/APIError"

/**
 * 指定した動画に関連したおすすめ動画を取得するAPI
 * @param smId おすすめ動画を取得する動画ID
 */
export async function getRecommend(smId: string) {
    const response = await fetch(`https://nvapi.nicovideo.jp/v1/recommend?recipeId=video_watch_recommendation&videoId=${encodeURIComponent(smId)}&limit=25&site=nicovideo&_frontendId=6&_frontendVersion=0`, {
        credentials: "include",
        method: "GET",
    })
    const responseJson: RecommendDataRootObject = await response.json()
    if (!validateBaseResponse(responseJson)) throw new APIError("Recommend API failed.", responseJson)
    return responseJson
}
