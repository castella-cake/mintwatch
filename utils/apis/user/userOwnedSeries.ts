import { UserOwnedSeriesDataRootObject } from "@/types/user/seriesData"
import APIError from "@/utils/classes/APIError"

export async function getUserOwnedSeries(userId: number, page: number, pageSize: number) {
    const url = new URL(`https://nvapi.nicovideo.jp/v1/users/${userId}/series?pageSize=${pageSize}&page=${page}`)

    const response = await fetch(url, {
        headers: {
            "x-frontend-id": "6",
            "x-frontend-version": "0",
            "x-niconico-language": "ja-jp",
        },
        method: "GET",
        mode: "cors",
        credentials: "include",
    })

    const responseJson = await response.json() as UserOwnedSeriesDataRootObject
    if (!validateBaseResponse(responseJson)) throw new APIError("getUserOwnedSeries failed.", responseJson)
    return responseJson
}
