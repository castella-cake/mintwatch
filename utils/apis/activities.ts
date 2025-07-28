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

    const responseJson = await response.json()
    if (responseJson.code !== "ok") throw new APIError("postFeedRead failed: response code is not ok", responseJson)
    return responseJson
}

export async function getFeedUnread() {
    const response = await fetch("https://api.feed.nicovideo.jp/v1/unread", {
        headers: {
            "x-frontend-id": "6",
        },
        method: "GET",
        credentials: "include",
    })
    const responseJson = await response.json() as { code: string, isUnread: boolean }
    if (responseJson.code !== "ok") throw new APIError("postFeedRead failed: response code is not ok", responseJson)
    return responseJson
}
