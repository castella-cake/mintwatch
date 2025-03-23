export async function putPlaybackPosition(body: string) {
    const response = await fetch("https://nvapi.nicovideo.jp/v1/users/me/watch/history/playback-position", {
        "headers": {
            "content-type": "application/json",
            "x-frontend-id": "6",
            "x-frontend-version": "0",
            "x-request-with": "https://www.nicovideo.jp"
        },
        "body": body,
        "method": "PUT",
        "mode": "cors",
        "credentials": "include"
    });
    return await response.json() as baseResponse
}