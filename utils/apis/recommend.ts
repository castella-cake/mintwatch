import { RecommendDataRootObject } from "@/types/RecommendData"
import APIError from "../classes/APIError"

/**
 * 指定した動画に関連したおすすめ動画を取得するAPI
 * @param recipeId おすすめ動画のレシピID("video_watch_recommendation" | "video_top_recommend")
 * @param query "video_watch_recommendation" の場合にvideoId, "spweb_video_top_genre_tag_recommend" の場合にgenreKeyを指定する
 * @param limit 取得するおすすめ動画の数の上限(デフォルト: 25)
 */
export async function getRecommend(recipeId: "video_watch_recommendation" | "video_top_recommend" | "spweb_video_top_genre_tag_recommend", query?: string | null, limit = 25) {
    const apiUrl = new URL("https://nvapi.nicovideo.jp/v1/recommend?site=nicovideo&_frontendId=6&_frontendVersion=0")
    apiUrl.searchParams.append("recipeId", recipeId)
    apiUrl.searchParams.append("limit", limit.toString())

    if (recipeId === "video_watch_recommendation") {
        if (!query) throw new Error("smId is required when recipeId is video_watch_recommendation")
        apiUrl.searchParams.append("videoId", query)
    }

    if (recipeId === "spweb_video_top_genre_tag_recommend") {
        if (!query) throw new Error("genreKey is required when recipeId is spweb_video_top_genre_tag_recommend")
        apiUrl.searchParams.append("genreKey", query)
        apiUrl.searchParams.append("contentTypeFilter", "video")
        apiUrl.searchParams.append("recipeVersion", "1")
    }

    const response = await fetch(apiUrl.toString(), {
        credentials: "include",
        method: "GET",
    })
    const responseJson: RecommendDataRootObject = await response.json()
    if (!validateBaseResponse(responseJson)) throw new APIError("Recommend API failed.", responseJson)
    return responseJson
}
