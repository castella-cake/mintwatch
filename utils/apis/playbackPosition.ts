import PlaybackPositionBody from "@/types/playbackPositionBody"
import APIError from "../classes/APIError"

/**
 * レジューム再生の記録用API
 * @param body レジューム再生のオブジェクト
 * @returns
 */
export async function putPlaybackPosition(body: PlaybackPositionBody) {
    const response = await fetch("https://nvapi.nicovideo.jp/v1/users/me/watch/history/playback-position", {
        headers: {
            "content-type": "application/json",
            "x-frontend-id": "6",
            "x-frontend-version": "0",
            "x-request-with": "https://www.nicovideo.jp",
        },
        body: JSON.stringify(body),
        method: "PUT",
        mode: "cors",
        credentials: "include",
    })
    const responseJson = await response.json() as baseResponse
    if (!validateBaseResponse(responseJson)) throw new APIError("Playback position update failed.", responseJson)
    return responseJson
}
