import { AccessRightsRootObject } from "@/types/accessRightsApi";

export async function getHls(videoId: string, body: string, actionTrackId: string, accessRightKey: string, isStoryBoard = false) {
    const response = await fetch(`https://nvapi.nicovideo.jp/v1/watch/${encodeURIComponent(videoId)}/access-rights/${isStoryBoard ? "storyboard" : "hls"}?actionTrackId=${encodeURIComponent(actionTrackId)}`, {
        "headers": {
            "content-type": "application/json",
            "x-access-right-key": accessRightKey,
            "x-frontend-id": "6",
            "x-frontend-version": "0",
            "x-niconico-language": "ja-jp",
            "x-request-with": "nicovideo"
        },
        "referrer": "https://www.nicovideo.jp/",
        "body": body,
        "method": "POST",
        "credentials": "include"
    });
    const responseJson: AccessRightsRootObject = await response.json()
    return responseJson
}