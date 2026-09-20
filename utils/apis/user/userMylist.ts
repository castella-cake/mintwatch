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
