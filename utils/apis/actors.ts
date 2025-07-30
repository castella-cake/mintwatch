import { ActorsDataRootObject } from "@/types/ActorsData"
import APIError from "../classes/APIError"

/**
 * 動画投稿のフォロー新着を取得するAPI
 */
export async function getActors() {
    const response = await fetch("https://api.feed.nicovideo.jp/v1/actors?limit=50", {
        headers: {
            "x-frontend-id": "6",
        },
        method: "GET",
        credentials: "include",
    })
    const responseJson = await response.json() as ActorsDataRootObject
    if (responseJson.code !== "ok") throw new APIError("getActors failed: response code is not ok", responseJson)
    return responseJson
}
