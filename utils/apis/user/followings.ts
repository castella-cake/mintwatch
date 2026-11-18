import APIError from "@/utils/classes/APIError"

export async function getUserFollowingsUsers(userId: "me" | number, pageSize: number = 100, cursor?: string) {
    const url = new URL(`https://nvapi.nicovideo.jp/v1/users/${userId}/following/users`)

    url.searchParams.append("pageSize", pageSize.toString())
    if (cursor && cursor !== "") url.searchParams.append("cursor", cursor)

    const response = await fetch(url, {
        headers: {
            "x-frontend-id": "6",
            "x-frontend-version": "0",
            "x-niconico-language": "ja-jp",
        },
        method: "GET",
        credentials: "include",
    })

    const responseJson = await response.json() as FollowingUserDataRootObject
    if (!validateBaseResponse(responseJson)) throw new APIError("getUserFollowingsUsers failed.", responseJson)
    return responseJson
}

/**
 * フォロー中のマイリスト一覧を取得するAPI
 */
export async function getUserFollowingsMylists(sampleItemCount: number = 3) {
    const url = new URL("https://nvapi.nicovideo.jp/v1/users/me/following/mylists")

    url.searchParams.append("sampleItemCount", sampleItemCount.toString())

    const response = await fetch(url, {
        headers: {
            "x-frontend-id": "6",
            "x-frontend-version": "0",
            "x-niconico-language": "ja-jp",
        },
        method: "GET",
        credentials: "include",
    })

    const responseJson = await response.json() as FollowingMylistDataRootObject
    if (!validateBaseResponse(responseJson)) throw new APIError("getUserFollowingsMylists failed.", responseJson)
    return responseJson
}

/**
 * マイリストのフォローを操作するAPI
 * @param mylistId 操作するマイリストID
 * @param method POSTでフォロー、DELETEでフォロー解除
 */
export async function mylistFollowApi(mylistId: number | string, method: "POST" | "DELETE") {
    const response = await fetch(`https://nvapi.nicovideo.jp/v1/users/me/following/mylists/${encodeURIComponent(mylistId)}`, {
        headers: {
            "x-frontend-id": "6",
            "x-frontend-version": "0",
        },
        method: method,
        credentials: "include",
    })

    const responseJson = await response.json() as baseResponse
    if (!validateBaseResponse(responseJson)) throw new APIError("mylistFollowApi failed.", responseJson)
    return responseJson
}
