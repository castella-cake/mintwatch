import { UserFollowApiDataRootObject } from "@/types/UserFollowApiData";

export async function userFollowApi(userId: string | number, method: "GET" | "POST" | "DELETE" = "GET") { 
    const response = await fetch(`https://user-follow-api.nicovideo.jp/v1/user/followees/niconico-users/${encodeURIComponent(userId)}.json`, {
        "headers": {
            "x-frontend-id": "6",
            "x-frontend-version": "0",
            "x-request-with": "https://www.nicovideo.jp"
        },
        "method": method,
        "credentials": "include"
    });
    return await response.json() as UserFollowApiDataRootObject
}
