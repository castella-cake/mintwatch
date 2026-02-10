import APIError from "../classes/APIError"

/**
 * 動画投稿のフォロー新着を取得するAPI
 */
export async function getVideoTimeline() {
    const response = await fetch("https://api.feed.nicovideo.jp/v1/activities/followings/video?context=my_timeline", {
        headers: {
            "x-frontend-id": "6",
        },
        method: "GET",
        credentials: "include",
    })
    const responseJson = await response.json() as ActivitiesDataRootObject
    if (responseJson.code !== "ok") throw new APIError("getVideoTimeline failed: response code is not ok", responseJson)
    return responseJson
}

/**
 * フォロー新着を取得するAPI
 */
export async function getPublishTimeline(context = "header_timeline") {
    const response = await fetch(`https://api.feed.nicovideo.jp/v1/activities/followings/publish?context=${encodeURIComponent(context)}`, {
        headers: {
            "x-frontend-id": "6",
        },
        method: "GET",
        credentials: "include",
    })

    const responseJson = await response.json() as ActivitiesDataRootObject
    if (responseJson.code !== "ok") throw new APIError("getPublishTimeline failed: response code is not ok", responseJson)
    return responseJson
}

/**
 * アクティビティを取得するAPI
 * @param context このAPIが呼ばれたコンテキスト("header_timeline" | "my_timeline" | `user_timeline_${number}`)
 * @param type アクティビティの種別
 * @param userId ユーザーID
 * @param isActorsQuery falseでフォロー新着, trueで純粋な新着を取得
 * @returns ActivitiesDataRootObject
 */
export async function getActivities(context: "header_timeline" | "my_timeline" | `user_timeline_${number}` = "header_timeline", type: "publish" | "video" | "live" | "all" = "publish", userId?: number, isActorsQuery = false) {
    let apiUrlString = `https://api.feed.nicovideo.jp/v1/activities/followings/${encodeURIComponent(type)}`
    if (userId) {
        apiUrlString = `https://api.feed.nicovideo.jp/v1/activities/${isActorsQuery ? "actors" : "followings"}/users/${encodeURIComponent(userId)}/${encodeURIComponent(type)}`
    }
    const apiUrl = new URL(apiUrlString)
    apiUrl.searchParams.append("context", context)
    const response = await fetch(apiUrl.toString(), {
        headers: {
            "x-frontend-id": "6",
        },
        method: "GET",
        credentials: "include",
    })
    const responseJson = await response.json() as ActivitiesDataRootObject
    if (responseJson.code !== "ok") throw new APIError("getActivities failed: response code is not ok", responseJson)
    return responseJson
}

/**
 * 未読のフォロー新着があるかを返すAPI
 */
export async function getFeedUnread() {
    const response = await fetch("https://api.feed.nicovideo.jp/v1/unread", {
        headers: {
            "x-frontend-id": "6",
        },
        method: "GET",
        credentials: "include",
    })
    const responseJson = await response.json() as FeedUnreadDataRootObject
    if (responseJson.code !== "ok") throw new APIError("getFeedRead failed: response code is not ok", responseJson)
    return responseJson
}

/**
 * フォロー新着を既読としてマーク
 * @param requestWith 現在のURL
 */
export async function postFeedRead(requestWith: string) {
    const response = await fetch("https://api.feed.nicovideo.jp/v1/read", {
        headers: {
            "x-frontend-id": "6",
            "x-request-with": requestWith,
        },
        body: null,
        method: "POST",
        credentials: "include",
    })

    const responseJson = await response.json() as feedBaseResponse
    if (responseJson.code !== "ok") throw new APIError("postFeedRead failed: response code is not ok", responseJson)
    return responseJson
}
