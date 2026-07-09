import { MyLikeHistoryRootObject } from "@/types/user/likeHistoryData"

export async function getMyLikeHistory(page: number, pageSize: number) {
    const response = await fetch(`https://nvapi.nicovideo.jp/v1/users/me/likes?page=${page}&pageSize=${pageSize}`, {
        headers: {
            "x-frontend-id": "6",
            "x-frontend-version": "0",
            "x-niconico-language": "ja-jp",
        },
        method: "GET",
        credentials: "include",
    })

    const responseJson = await response.json() as MyLikeHistoryRootObject
    if (!validateBaseResponse(responseJson)) throw new Error("getMyLikeHistory failed.")
    return responseJson
}
