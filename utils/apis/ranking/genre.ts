import { GenreRankingDataRootObject } from "@/types/ranking/genreData"
import APIError from "@/utils/classes/APIError"

/**
 * ジャンル別ランキングを取得するAPI
 * @param page 何ページ目を取得するか
 * @param term 集計期間
 * @param featuredKey ジャンルのキー
 * @param tag タグ名
 */
export async function getGenreRanking(page = "1", term = "24h", featuredKey?: string, tag?: string) {
    const baseUrl = new URL(`https://www.nicovideo.jp/ranking/genre${featuredKey ? "/" + encodeURIComponent(featuredKey) : ""}?responseType=json&page=${encodeURIComponent(page)}&term=${encodeURIComponent(term)}`)
    if (featuredKey && tag) baseUrl.searchParams.set("tag", tag)
    const response = await fetch(baseUrl, {
        method: "GET",
        credentials: "include",
    })
    const responseJson = await response.json() as GenreRankingDataRootObject
    if (!validateBaseResponse(responseJson)) throw new APIError("getGenreRanking failed.", responseJson)
    return responseJson
}
