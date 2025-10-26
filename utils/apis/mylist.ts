import { MylistResponseRootObject } from "@/types/mylistData"
import { MylistsResponseRootObject } from "@/types/mylistsData"
import APIError from "../classes/APIError"

/**
 * 指定したマイリストの内容を取得するAPI
 * @param mylistId 取得するマイリストのID
 * @param sortKey ソートを行う種類
 * @param sortOrder 昇順/降順の指定
 */
export async function getMylist(mylistId: string | number, sortKey: string, sortOrder: "asc" | "desc") {
    const response = await fetch(`https://nvapi.nicovideo.jp/v1/playlist/mylist/${encodeURIComponent(mylistId)}?sortKey=${encodeURIComponent(sortKey)}&sortOrder=${encodeURIComponent(sortOrder)}`, {
        credentials: "include",
        headers: {
            "content-type": "application/json",
            "X-Frontend-Id": "6",
            "X-Frontend-Version": "0",
            "X-Niconico-Language": "ja-jp",
        },
        method: "GET",
    })
    const responseJson = await response.json() as MylistResponseRootObject
    if (!validateBaseResponse(responseJson)) throw new APIError("getMylist failed.", responseJson)
    return responseJson
}

/**
 * ユーザーのマイリスト一覧を取得するAPI
 */
export async function getMylists() {
    const response = await fetch("https://nvapi.nicovideo.jp/v1/users/me/mylists", {
        credentials: "include",
        headers: {
            "X-Frontend-Id": "6",
            "X-Frontend-Version": "0",
            "X-Niconico-Language": "ja-jp",
        },
        method: "GET",
        mode: "cors",
    })
    const responseJson = await response.json() as MylistsResponseRootObject
    if (!validateBaseResponse(responseJson)) throw new APIError("getMylists failed.", responseJson)
    return responseJson
}

/**
 * 指定したマイリストに動画を追加するAPI
 * @param mylistId マイリストのID
 * @param itemId 動画ID
 * @param requestWith これを行ったページのURL
 * @returns status は追加完了で 201, 既に追加済みの場合は 200 を返す
 */
export async function addItemToMylist(mylistId: string | number, itemId: string | number, requestWith: string) {
    const response = await fetch(`https://nvapi.nicovideo.jp/v1/users/me/mylists/${encodeURIComponent(mylistId)}/items?itemId=${encodeURIComponent(itemId)}`, {
        credentials: "include",
        headers: {
            "X-Frontend-Id": "6",
            "X-Frontend-Version": "0",
            "X-Niconico-Language": "ja-jp",
            "X-Request-With": requestWith,
        },
        referrer: "https://www.nicovideo.jp/",
        method: "POST",
        mode: "cors",
    })
    const responseJson = await response.json() as baseResponse
    if (!validateBaseResponse(responseJson)) throw new APIError("addItemToMylist failed.", responseJson)
    return responseJson
}
