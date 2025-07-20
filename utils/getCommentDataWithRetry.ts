import { CommentDataRootObject } from "@/types/CommentData"
import { NvComment } from "@/types/VideoData"
import { RefObject } from "react"
import APIError from "./classes/APIError"

export type PairedThreadKeyRef = {
    threadKey: string
    thisSmId: string
}

export async function getCommentDataWithRetry(nvComment: NvComment | undefined, smId: string | undefined, commentThreadKeyRef: RefObject<PairedThreadKeyRef>, logData?: { when: number }) {
    if (!nvComment || !smId) throw new Error("getCommentDataWithRetry requires nvComment and smId")
    const logParams = logData ?? {}
    const commentRequestBody = {
        params: {
            ...nvComment.params,
        },
        additionals: {
            ...logParams,
        },
        threadKey: commentThreadKeyRef.current.threadKey,
    }
    let commentResponse: CommentDataRootObject = await getCommentThread(
        nvComment.server,
        JSON.stringify(commentRequestBody),
    )
    if (!commentResponse.data || !commentResponse.data.threads) {
        if (commentResponse.meta?.errorCode === "EXPIRED_TOKEN") {
            console.log(
                "PMW: getCommentThread failed with expired token, fetching token...",
            )
            const threadKeyResponse = await getCommentThreadKey(smId)
            if (
                threadKeyResponse.meta
                && threadKeyResponse.meta.status === 200
                && threadKeyResponse.data.threadKey
            ) {
                commentThreadKeyRef.current = { threadKey: threadKeyResponse.data.threadKey, thisSmId: smId }
                const newCommentRequestBody = {
                    params: {
                        ...nvComment.params,
                        ...logParams,
                    },
                    threadKey: commentThreadKeyRef.current.threadKey,
                }
                commentResponse = await getCommentThread(
                    nvComment.server,
                    JSON.stringify(newCommentRequestBody),
                )
                if (
                    !commentResponse.data
                    || !commentResponse.data.threads
                ) {
                    throw new APIError("getCommentThread failed. (1 threadKey retry)", commentResponse)
                }
            } else {
                console.error("PMW: fetching threadKey failed.")
                throw new APIError("fetching threadKey failed.", threadKeyResponse)
            }
        } else {
            throw new APIError("getCommentThread failed with unknown reason. (no threadKey retry)", commentResponse)
        }
    }
    return commentResponse
}
