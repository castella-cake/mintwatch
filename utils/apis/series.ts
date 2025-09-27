import { SeriesResponseRootObject } from "@/types/seriesData"
import APIError from "../classes/APIError"

/**
 * シリーズ情報を取得するAPI
 * @param seriesId 取得するシリーズのID
 */
export async function getSeriesInfo(seriesId: string) {
    const response = await fetch(`https://nvapi.nicovideo.jp/v2/series/${encodeURIComponent(seriesId)}`, {
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
