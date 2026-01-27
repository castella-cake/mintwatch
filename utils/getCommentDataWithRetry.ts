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
    try {
        return await getCommentThread(nvComment.server, JSON.stringify(commentRequestBody))
    } catch (error) {
        if (error instanceof APIError) {
            if (error.response?.meta?.errorCode === "EXPIRED_TOKEN") {
                // ここのFetch類は直接throwしてもらう
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
                    return await getCommentThread(
                        nvComment.server,
                        JSON.stringify(newCommentRequestBody),
                    )
                }
            } else {
                throw new APIError("getCommentThreadWithRetry failed with unknown reason. (no threadKey retry)", error.response)
            }
        }
    }
    throw new Error("getCommentThread failed with unknown reason.")
}
