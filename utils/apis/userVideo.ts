import { UserVideoData } from "@/types/UserVideoData"
import APIError from "../classes/APIError"

/**
 * 指定したユーザーの投稿動画を取得するAPI
 * @param userId 投稿動画を取得するユーザーID
 * @param sortKey ソートを行う種類
 * @param sortOrder 昇順/降順
 */
export async function getUserVideo(userId: string | number, sortKey: string, sortOrder: "asc" | "desc", selectContentType?: "long" | "short", sensitiveContents?: "mask", pageSize?: number, page?: number) {
    const url = new URL(`https://nvapi.nicovideo.jp/v3/users/${encodeURIComponent(userId)}/videos`)
    url.searchParams.set("sortKey", sortKey)
    url.searchParams.set("sortOrder", sortOrder)
    if (selectContentType) url.searchParams.set("selectContentType", selectContentType)
    if (sensitiveContents) url.searchParams.set("sensitiveContents", sensitiveContents)
    if (pageSize) url.searchParams.set("pageSize", pageSize.toString())
    if (page) url.searchParams.set("page", page.toString())
    const response = await fetch(url.toString(), {
        credentials: "include",
        headers: {
            "content-type": "application/json",
            "X-Frontend-Id": "6",
            "X-Frontend-Version": "0",
            "X-Niconico-Language": "ja-jp",
        },
        method: "GET",
    })
    const responseJson = await response.json() as UserVideoData
    if (!validateBaseResponse(responseJson)) throw new APIError("UserVideo fetch failed.", responseJson)
    return responseJson
}
