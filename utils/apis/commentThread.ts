import { CommentDataRootObject } from "@/types/CommentData"
import { CommentThreadKeyData } from "@/types/CommentThreadKeyData"
import APIError from "../classes/APIError"

/**
 * コメントを取得するAPI
 * @param server サーバーへのURL(/v1...以降は含めない、動画情報APIから取得するべき)
 * @param body コメント取得のオブジェクト
 */
export async function getCommentThread(server: string, body: string) {
    const response = await fetch(`${server}/v1/threads`, {
        credentials: "omit",
        headers: {
            "x-client-os-type": "others",
            "x-frontend-id": "6",
            "x-frontend-version": "0",
            "Pragma": "no-cache",
            "Cache-Control": "no-cache",
        },
        body: body,
        method: "POST",
        mode: "cors",
    })
    const responseJson = await response.json() as CommentDataRootObject
    if (!validateBaseResponse(responseJson)) throw new APIError("Comment thread fetch failed.", responseJson)
    return responseJson
}

/**
 * コメント取得用のキーを取得するAPI
 * @param videoId キーを取得する動画ID
 */
export async function getCommentThreadKey(videoId: string) {
    const response = await fetch(`https://nvapi.nicovideo.jp/v1/comment/keys/thread?videoId=${encodeURIComponent(videoId)}`, {
        credentials: "include",
        headers: {
            "X-Frontend-Id": "6",
            "X-Frontend-Version": "0",
            "X-Niconico-Language": "ja-jp",
        },
        method: "GET",
    })
    const responseJson = await response.json() as CommentThreadKeyData
    if (!validateBaseResponse(responseJson)) throw new APIError("Comment thread key fetch failed.", responseJson)
    return responseJson
}
