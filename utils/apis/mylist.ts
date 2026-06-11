import APIError from "../classes/APIError"

/**
 * 指定したマイリストの内容を取得するAPI
 * @param mylistId 取得するマイリストのID
 * @param pageSize 1ページのアイテム数
 * @param page ページ番号
 * @param sortKey ソートを行う種類
 * @param sortOrder 昇順/降順の指定
 * @returns UserMylistResponseRootObject
 */
export async function getMylist(mylistId: number, pageSize = 100, page = 1, sortKey?: string, sortOrder?: "asc" | "desc") {
    const url = new URL(`https://nvapi.nicovideo.jp/v2/mylists/${mylistId}?pageSize=${pageSize}&page=${page}`)
    if (sortKey) {
        url.searchParams.set("sortKey", sortKey)
    }
    if (sortOrder) {
        url.searchParams.set("sortOrder", sortOrder)
    }

    const response = await fetch(url, {
        headers: {
            "x-frontend-id": "6",
            "x-frontend-version": "0",
            "x-niconico-language": "ja-jp",
        },
        method: "GET",
        mode: "cors",
        credentials: "include",
    })

    const responseJson = await response.json() as UserMylistResponseRootObject
    if (!validateBaseResponse(responseJson)) throw new APIError("getUserData failed.", responseJson)
    return responseJson
}

/**
 * 指定したマイリストの内容をプレイリスト用に取得するAPI
 * @param mylistId 取得するマイリストのID
 * @param sortKey ソートを行う種類
 * @param sortOrder 昇順/降順の指定
 */
export async function getPlaylistMylist(mylistId: string | number, sortKey: string, sortOrder: "asc" | "desc") {
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
    const responseJson = await response.json() as PlaylistMylistResponseRootObject
    if (!validateBaseResponse(responseJson)) throw new APIError("getPlaylistMylist failed.", responseJson)
    return responseJson
}

/**
 * ユーザーのマイリスト一覧を取得するAPI
 * @param sampleItemCount 各マイリストのサンプルとして表示するアイテム数
 */
export async function getMylists(userId: "me" | number | undefined = "me", sampleItemCount?: number) {
    const url = new URL(`https://nvapi.nicovideo.jp/v1/users/${userId}/mylists`)
    if (sampleItemCount !== undefined) {
        url.searchParams.set("sampleItemCount", sampleItemCount.toString())
    }

    const response = await fetch(url, {
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
