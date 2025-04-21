import { CommentResponseRootObject } from "@/types/CommentData";
import { CommentPostBody, KeyRootObjectResponse } from "@/types/CommentPostData";

/**
 * コメント投稿のキーを取得するAPI
 * @param threadId 投稿先のスレッドID
 */
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

/**
 * コメント投稿のAPI
 * @param threadId 投稿先のスレッドID
 * @param body コメント投稿のオブジェクト
*/

export async function postComment(threadId: string | number, body: CommentPostBody) {
    const response = await fetch(`https://public.nvcomment.nicovideo.jp/v1/threads/${encodeURIComponent(threadId)}/comments`, {
        "headers": {
            "x-client-os-type": "others",
            "x-frontend-id": "6",
            "x-frontend-version": "0"
        },
        "body": JSON.stringify(body),
        "method": "POST",
        "mode": "cors",
        "credentials": "omit"
    });
    return await response.json() as CommentResponseRootObject
}