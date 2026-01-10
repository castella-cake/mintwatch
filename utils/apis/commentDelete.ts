import { CommentDeleteKeyRootObject } from "@/types/CommentDeleteKeyData"
import APIError from "../classes/APIError"

export async function getCommentDeleteKey(threadId: string | number, fork: string) {
    const response = await fetch(`https://nvapi.nicovideo.jp/v1/comment/keys/delete?threadId=${encodeURIComponent(threadId)}&fork=${encodeURIComponent(fork)}&pc=1`, {
        headers: {
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
    const responseJson = await response.json() as CommentDeleteKeyRootObject
    if (!validateBaseResponse(responseJson)) throw new APIError("Comment delete key fetch failed.", responseJson)
    return responseJson
}

type commentOwnerDeletionBody = {
    videoId: string
    targets: {
        no: number // コメ番
        operation: "DELETE" // 多分これ以外に使うことはない
    }[]
    fork: string
    language: string
    deleteKey: string // getCommentDeleteKeyで取得した削除キー
}

export async function putCommentOwnerDeletion(threadId: string | number, body: commentOwnerDeletionBody) {
    const response = await fetch(`https://public.nvcomment.nicovideo.jp/v1/threads/${threadId}/comment-comment-owner-deletions?pc=1`, {
        headers: {
            "x-client-os-type": "others",
            "x-frontend-id": "6",
            "x-frontend-version": "0",
        },
        body: JSON.stringify(body),
        method: "PUT",
        mode: "cors",
        credentials: "omit",
    })
    const responseJson = await response.json() as baseResponse
    if (!validateBaseResponse(responseJson)) throw new APIError("Comment owner deletion failed.", responseJson)
    return responseJson
}
