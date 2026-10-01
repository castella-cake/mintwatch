import { VideoDataRootObject } from "@/types/watch/Base"
import APIError from "../classes/APIError"
import { VideoDataLazyRootObject } from "@/types/watch/Lazy"
import { HeartBeatPayload } from "@/types/watch/HeartBeat"

const manifestData = browser.runtime.getManifest()

/**
 * 動画情報を取得する(正確には視聴ページ情報を取得する)API
 * @param smId 動画ID
 */
export async function getVideoInfo(smId: string) {
    // responseType=jsonで取得。
    const response = await fetch(`https://www.nicovideo.jp/watch/${encodeURIComponent(smId)}?responseType=json`, {
        credentials: "include",
        headers: {
            "User-Agent": `PepperMintPlus-Watch/${manifestData.version}`,
        },
        method: "GET",
    })
    const responseJson: VideoDataRootObject = await response.json()
    if (!validateBaseResponse(responseJson)) throw new APIError("VideoData fetch failed.", responseJson)
    return responseJson
}

/**
 * 動画情報の初期取得では取得されないデータを取得する
 * @param videoId 動画ID
 * @param body 元の動画情報のlazyから取得されたトークンを含むbody
 * @returns 残りの動画情報
 */
export async function getVideoInfoLazy(videoId: string, body: { actionTrackId: string, keyToken: string }) {
    const response = await fetch(`https://nvapi.nicovideo.jp/v4/watch/lazy/${videoId}`, {
        headers: {
            "accept": "application/json;charset=utf-8",
            "accept-language": "ja",
            "content-type": "application/json",
            "x-frontend-id": "6",
            "x-frontend-version": "0",
            "x-niconico-language": "ja-jp",
            "x-request-with": "https://www.nicovideo.jp",
        },
        referrer: "https://www.nicovideo.jp/",
        body: JSON.stringify(body),
        method: "POST",
        mode: "cors",
        credentials: "include",
    })

    const responseJson: VideoDataLazyRootObject = await response.json()
    if (!validateBaseResponse(responseJson)) throw new APIError("getVideoInfoLazy failed.", responseJson)
    return responseJson
}

/**
 * 視聴データに関するイベント (start / impression / play など) 送信する
 *
 */
export async function sendVideoInfoHeartbeat(
    videoId: string,
    payload: HeartBeatPayload,
) {
    const response = await fetch(`https://nvapi.nicovideo.jp/v4/watch/${encodeURIComponent(videoId)}`, {
        headers: {
            "x-frontend-id": "6",
            "x-frontend-version": "0",
            "x-niconico-language": "ja-jp",
            "x-request-with": "https://www.nicovideo.jp",
            "content-type": "application/json",
            "accept": "application/json",
        },
        referrer: "https://www.nicovideo.jp/",
        body: JSON.stringify(payload),
        method: "POST",
        mode: "cors",
        credentials: "include",
    })

    const responseJson: VideoDataHeartBeatRootObject = await response.json()
    if (!validateBaseResponse) throw new APIError("VideoInfoHeartBeat failed.", responseJson)
    return responseJson
}
