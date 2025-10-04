import { DAnimeLinksDataRootObject } from "@/types/DAnimeLinksData"
import APIError from "../classes/APIError"

/**
 * チャンネル動画からdアニメストアニコニコ支店で投稿された動画へ移動するための情報を取得するAPI
 * @param videoId 元となるチャンネル動画
 */
export async function getChannelVideoDAnimeLinks(videoId: string) {
    const response = await fetch(`https://public-api.ch.nicovideo.jp/v1/user/channelVideoDAnimeLinks?videoId=${encodeURIComponent(videoId)}`, {
        headers: {
            "x-frontend-id": "6",
            "x-frontend-version": "0",
        },
        method: "GET",
        credentials: "include",
    })
    const responseJson = await response.json() as DAnimeLinksDataRootObject
    if (!validateBaseResponse(responseJson)) {
        throw new APIError("getChannelVideoDAnimeLinks failed.", responseJson)
    }
    return responseJson
}
