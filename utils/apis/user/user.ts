import { UserDataRootObject } from "@/types/user/userData"
import APIError from "@/utils/classes/APIError"

export async function getUserData(userId: number) {
    const response = await fetch(`https://nvapi.nicovideo.jp/v1/users/${encodeURIComponent(userId)}`, {
        headers: {
            "x-client-os-type": "others",
            "x-frontend-id": "6",
            "x-frontend-version": "0",
            "x-niconico-language": "ja-jp",
        },
        referrer: "https://www.nicovideo.jp/",
        body: null,
        method: "GET",
        mode: "cors",
        credentials: "include",
    })
    const responseJson = await response.json() as UserDataRootObject
    if (!validateBaseResponse(responseJson)) throw new APIError("getUserData failed.", responseJson)
    return responseJson
}
