import { SeriesResponseRootObject } from "@/types/seriesData"
import APIError from "../classes/APIError"

/**
 * シリーズ情報を取得するAPI
 * @param seriesId 取得するシリーズのID
 * @param pageSize 取得するアイテム数
 * @param page ページ番号
 */
export async function getSeriesInfo(seriesId: number, pageSize?: number, page?: number) {
    const url = new URL(`https://nvapi.nicovideo.jp/v2/series/${encodeURIComponent(seriesId.toString())}`)
    if (pageSize !== undefined) {
        url.searchParams.set("pageSize", pageSize.toString())
    }
    if (page !== undefined) {
        url.searchParams.set("page", page.toString())
    }
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "X-Frontend-Id": "6",
            "X-Frontend-Version": "0",
        },
    })
    const responseJson = await response.json() as SeriesResponseRootObject
    if (!validateBaseResponse(responseJson)) throw new APIError("Series info fetch failed.", responseJson)
    return responseJson
}
