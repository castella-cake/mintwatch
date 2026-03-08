import { AccountUserData } from "@/types/user/accountUserData"
import APIError from "@/utils/classes/APIError"

export async function getAccountUserData() {
    const response = await fetch(`https://account.nicovideo.jp/api/public/v2/user.json`, {
        method: "GET",
        credentials: "include",
    })
    const responseJson = await response.json() as AccountUserData
    if (!validateBaseResponse(responseJson)) throw new APIError("getAccountUserData failed.", responseJson)
    return responseJson
}
