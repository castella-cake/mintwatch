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
    const responseJson = await response.json() as VideoTimelineDataRootObject
    if (responseJson.code !== "ok") throw new APIError("getVideoTimeline failed: response code is not ok", responseJson)
    return responseJson
}
