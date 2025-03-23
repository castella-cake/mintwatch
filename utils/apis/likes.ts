import { LikesApi } from "@/types/likesApi";

export async function sendLike(smId: string, method: string) {
    const response = await fetch(`https://nvapi.nicovideo.jp/v1/users/me/likes/items?videoId=${encodeURIComponent(smId)}`, {
        "headers": {
            "x-frontend-id": "6",
            "x-frontend-version": "0",
            "x-niconico-language": "ja-jp",
            "x-request-with": `https://www.nicovideo.jp/watch/${encodeURIComponent(smId)}`
        },
        "body": null,
        "method": method,
        "mode": "cors",
        "credentials": "include"
    });
    const json: LikesApi = await response.json()
    if (json.meta.status == 200 || json.meta.status == 201) {
        return json
    } else {
        return false
    }
}