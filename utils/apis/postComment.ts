import { CommentResponseRootObject } from "@/types/CommentData";
import { KeyRootObjectResponse } from "@/types/CommentPostData";

export async function getCommentPostKey(threadId: string | number) {
    const response = await fetch(`https://nvapi.nicovideo.jp/v1/comment/keys/post?threadId=${encodeURIComponent(threadId)}`, {
        "headers": {
            "x-frontend-id": "6",
            "x-frontend-version": "0",
            "x-niconico-language": "ja-jp"
        },
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    });
    return await response.json() as KeyRootObjectResponse
}
export async function postComment(threadId: string | number, body: string) {
    const response = await fetch(`https://public.nvcomment.nicovideo.jp/v1/threads/${encodeURIComponent(threadId)}/comments`, {
        "headers": {
            "x-client-os-type": "others",
            "x-frontend-id": "6",
            "x-frontend-version": "0"
        },
        "body": body,
        "method": "POST",
        "mode": "cors",
        "credentials": "omit"
    });
    return await response.json() as CommentResponseRootObject
}