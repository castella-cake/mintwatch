export async function getVideoTimeline() {
    const response = await fetch("https://api.feed.nicovideo.jp/v1/activities/followings/video?context=my_timeline", {
        "headers": {
            "x-frontend-id": "6"
        },
        "method": "GET",
        "credentials": "include"
    });
    return await response.json() as VideoTimelineDataRootObject
}