import { UserFollowApiDataRootObject } from "@/types/UserFollowApiData"
import APIError from "../classes/APIError"

/**
 * ユーザーフォローを行うAPI
 * @param userId フォローを操作するユーザーID
 * @param method GETで取得/POSTでフォロー、DELETEでフォロー解除
 */
export async function userFollowApi(userId: string | number, method: "GET" | "POST" | "DELETE" = "GET") {
    const response = await fetch(`https://user-follow-api.nicovideo.jp/v1/user/followees/niconico-users/${encodeURIComponent(userId)}.json`, {
        headers: {
            "x-frontend-id": "6",
            "x-frontend-version": "0",
            "x-request-with": "https://www.nicovideo.jp",
        },
        method: method,
        credentials: "include",
    })
    const responseJson = await response.json() as UserFollowApiDataRootObject
    if (!validateBaseResponse(responseJson)) throw new APIError("UserFollow API failed.", responseJson)
    return responseJson
}
