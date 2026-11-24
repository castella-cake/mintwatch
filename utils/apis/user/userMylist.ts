import { UserMylistResponseRootObject } from "@/types/user/userMylistData"
import APIError from "@/utils/classes/APIError"

export async function getUserMylistData(userId: "me", mylistId: number, pageSize = 100, page = 1, sortKey?: string, sortOrder?: "asc" | "desc") {
    const url = new URL(`https://nvapi.nicovideo.jp/v1/users/${userId}/mylists/${mylistId}?pageSize=${pageSize}&page=${page}`)
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

const controlOperationHeaders = {
    "x-frontend-id": "6",
    "x-frontend-version": "0",
    "x-niconico-language": "ja-jp",
    "x-request-with": "https://www.nicovideo.jp",
}

/**
 * マイリストからアイテムを削除するAPI
 * @param mylistId 削除対象のマイリストID
 * @param itemIds watchId の配列
 */
export async function deleteMylistItems(mylistId: number, itemIds: string[]): Promise<baseResponse> {
    const url = new URL(`https://nvapi.nicovideo.jp/v1/users/me/mylists/${mylistId}/items`)
    url.searchParams.append("itemIds", itemIds.join(","))
    const response = await fetch(url, {
        credentials: "include",
        headers: controlOperationHeaders,
        method: "DELETE",
    })
    const responseJson = await response.json() as baseResponse
    if (!validateBaseResponse(responseJson)) throw new APIError("deleteMylistItems failed.", responseJson)
    return responseJson
}

/**
 * 簡潔なマイリスト一覧を取得するAPI
 */
export async function getUserMylistsCompact() {
    const response = await fetch("https://nvapi.nicovideo.jp/v1/users/me/mylists/compact", {
        headers: {
            "x-frontend-id": "6",
            "x-frontend-version": "0",
            "x-niconico-language": "ja-jp",
        },
        method: "GET",
        credentials: "include",
    })
    const responseJson = await response.json() as UserMylistCompactDataRootObject
    if (!validateBaseResponse(responseJson)) throw new APIError("getUserMylistsCompact failed.", responseJson)
    return responseJson
}

const formOperationHeaders = {
    "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
    "x-frontend-id": "6",
    "x-frontend-version": "0",
    "x-niconico-language": "ja-jp",
    "x-request-with": "https://www.nicovideo.jp",
}

/**
 * マイリストの並び順を更新するAPI
 * @param mylistIds 並べたい順のマイリストID
 */
export async function putUserMylistsOrder(mylistIds: number[]) {
    const response = await fetch("https://nvapi.nicovideo.jp/v1/users/me/mylists/order", {
        headers: formOperationHeaders,
        method: "PUT",
        credentials: "include",
        body: new URLSearchParams({ order: mylistIds.join(",") }).toString(),
    })
    const responseJson = await response.json() as UserMylistOrderDataRootObject
    if (!validateBaseResponse(responseJson)) throw new APIError("putUserMylistsOrder failed.", responseJson)
    return responseJson
}

/**
 * マイリストを新規作成するAPI
 * @param name マイリスト名
 * @param description 説明文
 * @param defaultSortKey 既定の並び順
 * @param defaultSortOrder 既定の昇順/降順
 * @param isPublic 公開するかどうか
 */
export async function createMylist(name: string, description: string, defaultSortKey: string, defaultSortOrder: "asc" | "desc", isPublic: boolean) {
    const response = await fetch("https://nvapi.nicovideo.jp/v1/users/me/mylists", {
        headers: formOperationHeaders,
        method: "POST",
        credentials: "include",
        body: new URLSearchParams({
            name: name,
            description: description,
            defaultSortKey: defaultSortKey,
            defaultSortOrder: defaultSortOrder,
            isPublic: isPublic ? "true" : "false",
        }).toString(),
    })
    const responseJson = await response.json() as UserMylistPostDataRootObject
    if (!validateBaseResponse(responseJson)) throw new APIError("createMylist failed.", responseJson)
    return responseJson
}

/**
 * マイリスト情報を編集するAPI
 * @param mylistId 更新するマイリストのID
 * @param name マイリスト名
 * @param description 説明文
 * @param defaultSortKey 既定の並び順
 * @param defaultSortOrder 既定の昇順/降順
 * @param isPublic 公開するかどうか
 * @returns アイテム情報を抜いた UserMylistResponseRootObject (items: [], totalItemCount: 0)
 */
export async function updateMylist(mylistId: number, name: string, description: string, defaultSortKey: string, defaultSortOrder: "asc" | "desc", isPublic: boolean) {
    const response = await fetch(`https://nvapi.nicovideo.jp/v1/users/me/mylists/${encodeURIComponent(mylistId)}`, {
        headers: formOperationHeaders,
        method: "PUT",
        credentials: "include",
        body: new URLSearchParams({
            name: name,
            description: description,
            defaultSortKey: defaultSortKey,
            defaultSortOrder: defaultSortOrder,
            isPublic: isPublic ? "true" : "false",
        }).toString(),
    })
    const responseJson = await response.json() as UserMylistResponseRootObject
    if (!validateBaseResponse(responseJson)) throw new APIError("updateMylist failed.", responseJson)
    return responseJson
}

/**
 * マイリストを削除するAPI
 * @param mylistId 削除するマイリストのID
 */
export async function deleteMylist(mylistId: number) {
    const response = await fetch(`https://nvapi.nicovideo.jp/v1/users/me/mylists/${encodeURIComponent(mylistId)}`, {
        headers: formOperationHeaders,
        method: "DELETE",
        credentials: "include",
    })
    const responseJson = await response.json() as baseResponse
    if (!validateBaseResponse(responseJson)) throw new APIError("deleteMylist failed.", responseJson)
    return responseJson
}

/**
 * マイリストアイテムのメモを更新するAPI
 * @param mylistId マイリストID
 * @param itemId アイテムID
 * @param description メモの内容
 */
export async function putMylistItemDescription(mylistId: number, itemId: number, description: string) {
    const response = await fetch(`https://nvapi.nicovideo.jp/v1/users/me/mylists/${mylistId}/items/${itemId}`, {
        headers: formOperationHeaders,
        method: "PUT",
        credentials: "include",
        body: new URLSearchParams({ description: description }).toString(),
    })
    const responseJson = await response.json() as UserMylistItemPutResponseDataRootObject
    if (!validateBaseResponse(responseJson)) throw new APIError("putMylistItemDescription failed.", responseJson)
    return responseJson
}
