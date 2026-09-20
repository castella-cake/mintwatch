import { MylistItemControlDataRootObject } from "@/types/user/mylistItemControlData"
import APIError from "@/utils/classes/APIError"

const controlOperationHeaders = {
    "x-frontend-id": "6",
    "x-frontend-version": "0",
    "x-niconico-language": "ja-jp",
    "x-request-with": "https://www.nicovideo.jp",
}

/**
 * マイリスト/あとで見る間でアイテムをコピーするAPI
 * @param from コピー元。number はマイリストID、"deflist" はあとで見る
 * @param to コピー先のマイリストID
 * @param itemIds 動画ID (sm...) の配列
 */
export async function copyMylistItems(from: number | "deflist", to: number, itemIds: string[]): Promise<MylistItemControlDataRootObject> {
    const url = new URL("https://nvapi.nicovideo.jp/v1/users/me/copy-mylist-items")
    url.searchParams.append("from", from.toString())
    url.searchParams.append("to", to.toString())
    url.searchParams.append("itemIds", itemIds.join(","))
    const response = await fetch(url, {
        credentials: "include",
        headers: controlOperationHeaders,
        method: "POST",
    })
    const responseJson = await response.json() as MylistItemControlDataRootObject
    if (!validateBaseResponse(responseJson)) throw new APIError("copyMylistItems failed.", responseJson)
    return responseJson
}

/**
 * マイリスト/あとで見る間でアイテムを移動するAPI
 * @param from 移動元。number はマイリストID、"deflist" はあとで見る (あとで見るからの移動も可能)
 * @param to 移動先のマイリストID
 * @param itemIds 動画ID (sm...) の配列
 */
export async function moveMylistItems(from: number | "deflist", to: number, itemIds: string[]): Promise<MylistItemControlDataRootObject> {
    const url = new URL("https://nvapi.nicovideo.jp/v1/users/me/move-mylist-items")
    url.searchParams.append("from", from.toString())
    url.searchParams.append("to", to.toString())
    url.searchParams.append("itemIds", itemIds.join(","))
    const response = await fetch(url, {
        credentials: "include",
        headers: controlOperationHeaders,
        method: "POST",
    })
    const responseJson = await response.json() as MylistItemControlDataRootObject
    if (!validateBaseResponse(responseJson)) throw new APIError("moveMylistItems failed.", responseJson)
    return responseJson
}
