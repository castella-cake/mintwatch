import { CommentDataRootObject } from "@/types/CommentData";
import { CommentThreadKeyData } from "@/types/CommentThreadKeyData";

export async function getCommentThread(server: string, body: string) {
    const response = await fetch(`${server}/v1/threads`, {
        "credentials": "omit",
        "headers": {
            "x-client-os-type": "others",
            "x-frontend-id": "6",
            "x-frontend-version": "0",
            "Pragma": "no-cache",
            "Cache-Control": "no-cache"
        },
        "body": body,
        "method": "POST",
        "mode": "cors"
    });
    return await response.json() as CommentDataRootObject
}

export async function getCommentThreadKey(videoId: string) {
    const response = await fetch(`https://nvapi.nicovideo.jp/v1/comment/keys/thread?videoId=${encodeURIComponent(videoId)}`, {
        "credentials": "include",
        "headers": {
            "X-Frontend-Id": "6",
            "X-Frontend-Version": "0",
            "X-Niconico-Language": "ja-jp",
        },
        "method": "GET"
    })
    return await response.json() as CommentThreadKeyData
}