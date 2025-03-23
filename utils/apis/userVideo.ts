import { UserVideoData } from "@/types/UserVideoData";

export async function getUserVideo(userId: string | number, sortKey: string, sortOrder: "asc" | "desc") {
    const response = await fetch(`https://nvapi.nicovideo.jp/v3/users/${encodeURIComponent(userId)}/videos?sortKey=${encodeURIComponent(sortKey)}&sortOrder=${encodeURIComponent(sortOrder)}`, {
        "credentials": "include",
        "headers": {
            "content-type": "application/json",
            "X-Frontend-Id": "6",
            "X-Frontend-Version": "0",
            "X-Niconico-Language": "ja-jp",
        },
        "method": "GET",
    });
    return await response.json() as UserVideoData
}
