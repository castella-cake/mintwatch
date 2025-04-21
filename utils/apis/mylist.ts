import { MylistResponseRootObject } from "@/types/mylistData";
import { MylistsResponseRootObject } from "@/types/mylistsData";

/**
 * 指定したマイリストの内容を取得するAPI
 * @param mylistId 取得するマイリストのID
 * @param sortKey ソートを行う種類
 * @param sortOrder 昇順/降順の指定
 */
export async function getMylist(mylistId: string | number, sortKey: string, sortOrder: "asc" | "desc") {
    const response = await fetch(`https://nvapi.nicovideo.jp/v1/playlist/mylist/${encodeURIComponent(mylistId)}?sortKey=${encodeURIComponent(sortKey)}&sortOrder=${encodeURIComponent(sortOrder)}`, {
        "credentials": "include",
        "headers": {
            "content-type": "application/json",
            "X-Frontend-Id": "6",
            "X-Frontend-Version": "0",
            "X-Niconico-Language": "ja-jp",
        },
        "method": "GET",
    });
    return await response.json() as MylistResponseRootObject
}

/**
 * ユーザーのマイリスト一覧を取得するAPI
 */
export async function getMylists() {
    const response = await fetch("https://nvapi.nicovideo.jp/v1/users/me/mylists", {
        "credentials": "include",
        "headers": {
            "X-Frontend-Id": "6",
            "X-Frontend-Version": "0",
            "X-Niconico-Language": "ja-jp",
        },
        "method": "GET",
        "mode": "cors"
    });
    return await response.json() as MylistsResponseRootObject
}

/**
 * 指定したマイリストに動画を追加するAPI
 * @param mylistId マイリストのID
 * @param itemId 動画ID
 * @param requestWith これを行ったページのURL
 * @returns 
 */
export async function addItemToMylist(mylistId: string | number, itemId: string | number, requestWith: string) {
    const response = await fetch(`https://nvapi.nicovideo.jp/v1/users/me/mylists/${encodeURIComponent(mylistId)}/items?itemId=${encodeURIComponent(itemId)}`, {
        "credentials": "include",
        "headers": {
            "X-Frontend-Id": "6",
            "X-Frontend-Version": "0",
            "X-Niconico-Language": "ja-jp",
            "X-Request-With": requestWith,
        },
        "referrer": "https://www.nicovideo.jp/",
        "method": "POST",
        "mode": "cors"
    });
    return await response.json() as baseResponse
}