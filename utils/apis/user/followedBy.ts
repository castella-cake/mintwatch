import APIError from "@/utils/classes/APIError"

export async function getUserFollowedBy(userId: "me" | number, pageSize: number = 100) {
    const url = new URL(`https://nvapi.nicovideo.jp/v1/users/${userId}/followed-by`)

    url.searchParams.append("pageSize", pageSize.toString())

    const response = await fetch(url, {
        headers: {
            "x-frontend-id": "6",
            "x-frontend-version": "0",
            "x-niconico-language": "ja-jp",
        },
        method: "GET",
        credentials: "include",
    })

    const responseJson = await response.json() as FollowingUserDataRootObject
    if (!validateBaseResponse(responseJson)) throw new APIError("getUserFollowedBy failed.", responseJson)
    return responseJson
}
