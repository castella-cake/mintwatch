import { AchievedHistoryDataRootObject } from "@/types/user/achievedHistoryData"
import { PinnedAchievedHistoryDataRootObject } from "@/types/user/pinnedAchievedHistoryData"
import APIError from "@/utils/classes/APIError"

const achievedHistoryHeaders = {
    "x-frontend-id": "6",
    "x-requested-with": "https://www.nicovideo.jp",
}

/**
 * ユーザーの実績獲得履歴を取得するAPI
 * @param userId 対象ユーザーID (me は不可)
 * @param order 並び順 (honor_class: 実績クラス順, achieved_at: 達成日時順)
 * @param limit 取得上限
 * @param page ページ
 */
export async function getUserAchievedHistories(userId: number, order: "honor_class" | "achieved_at", limit = 100, page = 1) {
    const url = new URL(`https://mjk.nicovideo.jp/api/v1/users/${userId}/achieved_histories`)

    url.searchParams.append("limit", limit.toString())
    url.searchParams.append("page", page.toString())
    url.searchParams.append("order", order)
    url.searchParams.append("additional_fields", "content")

    const response = await fetch(url, {
        headers: achievedHistoryHeaders,
        method: "GET",
        mode: "cors",
        credentials: "include",
    })

    const responseJson = await response.json() as AchievedHistoryDataRootObject
    if (!validateBaseResponse(responseJson)) throw new APIError("getUserAchievedHistories failed.", responseJson)
    return responseJson
}

/**
 * ユーザーの代表実績を取得するAPI
 * @param userId 対象ユーザーID (me は不可)
 */
export async function getUserPinnedAchievedHistory(userId: number) {
    const url = new URL(`https://mjk.nicovideo.jp/api/v1/users/${userId}/pinned_achieved_history`)

    url.searchParams.append("additional_fields", "content")

    const response = await fetch(url, {
        headers: achievedHistoryHeaders,
        method: "GET",
        mode: "cors",
        credentials: "include",
    })

    const responseJson = await response.json() as PinnedAchievedHistoryDataRootObject
    if (!validateBaseResponse(responseJson)) throw new APIError("getUserPinnedAchievedHistory failed.", responseJson)
    return responseJson
}
