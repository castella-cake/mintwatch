import { CommentDataRootObject } from "@/types/CommentData";
import { CommentThreadKeyData } from "@/types/CommentThreadKeyData";
import { NicoruPostBodyRootObject, NicoruRemoveRootObject } from "@/types/NicoruPostData";
import { NvComment, Thread } from "@/types/VideoData";
import { getCommentDataWithRetry, PairedThreadKeyRef } from "@/utils/getCommentDataWithRetry";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useCommentData(
    nvComment: NvComment | undefined,
    smId: string | undefined,
) {
    const [commentContent, setCommentContent] = useState<CommentDataRootObject | null>(null);
    const commentThreadKeyRef = useRef("");
    useEffect(() => {
        async function fetchInfo() {
            if (!nvComment) return;
            try {
                const commentRequestBody = {
                    params: {
                        ...nvComment.params,
                    },
                    threadKey: nvComment.threadKey,
                };
                const commentResponse: CommentDataRootObject =
                    await getCommentThread(
                        nvComment.server,
                        JSON.stringify(commentRequestBody),
                    );
                setCommentContent(commentResponse);
                commentThreadKeyRef.current = nvComment.threadKey;
            } catch (error) {
                console.error(error);
            }
        }
        fetchInfo();
    }, [nvComment]);
    async function reloadCommentContent(logData?: { when: number }) {
        if (!nvComment || !smId) return;
        const logParams = logData ?? {};
        const commentRequestBody = {
            params: {
                ...nvComment.params,
            },
            additionals: {
                ...logParams,
                resFrom: -1000,
                res_from: -1000,
            },
            threadKey: commentThreadKeyRef.current,
        };
        let commentResponse: CommentDataRootObject = await getCommentThread(
            nvComment.server,
            JSON.stringify(commentRequestBody),
        );
        if (!commentResponse.data || !commentResponse.data.threads) {
            if (commentResponse.meta?.errorCode === "EXPIRED_TOKEN") {
                console.log(
                    "PMW: getCommentThread failed with expired token, fetching token...",
                );
                const threadKeyResponse: CommentThreadKeyData = await getCommentThreadKey(smId);
                if (
                    threadKeyResponse.meta &&
                    threadKeyResponse.meta.status === 200 &&
                    threadKeyResponse.data.threadKey
                ) {
                    commentThreadKeyRef.current =
                        threadKeyResponse.data.threadKey;
                    const newCommentRequestBody = {
                        params: {
                            ...nvComment.params,
                            ...logParams,
                        },
                        threadKey: commentThreadKeyRef.current,
                    };
                    commentResponse = await getCommentThread(
                        nvComment.server,
                        JSON.stringify(newCommentRequestBody),
                    );
                    if (
                        !commentResponse.data ||
                        !commentResponse.data.threads
                    ) {
                        console.error(
                            "PMW: getCommentThread failed. (1 threadKey retry)",
                        );
                        return;
                    }
                } else {
                    console.error("PMW: fetching threadKey failed.");
                    return;
                }
            }
        }
        setCommentContent(commentResponse);
        return commentResponse;
    }
    return { commentContent, setCommentContent, reloadCommentContent };
}

export function useCommentDataQuery(nvComment: NvComment | undefined, smId: string | undefined) {
    const commentThreadKeyRef = useRef<PairedThreadKeyRef>({ threadKey: "", thisSmId: "" });
    if ( nvComment && smId ) commentThreadKeyRef.current = { threadKey: nvComment.threadKey, thisSmId: smId }
    const [currentLogData, setLogData] = useState<{when: number} | undefined>()

    const queryClient = useQueryClient()
    const { data: commentContent, error: errorInfo, isLoading } = useQuery({
        queryKey: ['commentData', smId, { logData: currentLogData }],
        queryFn: () => {
            return getCommentDataWithRetry(nvComment, smId, commentThreadKeyRef)
        },
        // threadKeyが存在しないか、threadKeyのsmIdが今と違う場合でもフェッチしない
        enabled: (!!smId && commentThreadKeyRef.current.threadKey !== "" && commentThreadKeyRef.current.thisSmId === smId),
    })

    const reloadCommentContent = async (logData?: { when: number }) => {
        const queryKey = ['comments', smId, { logData }]
        const result = await queryClient.fetchQuery({
            queryKey,
            queryFn: () => getCommentDataWithRetry(nvComment, smId, commentThreadKeyRef, logData),
        })
        setLogData(logData)
        return result
    }

    function setCommentContent(newCommentContent: CommentDataRootObject) {
        const queryKey = ['comments', smId, { logData: currentLogData }]
        queryClient.setQueriesData({ queryKey }, newCommentContent)
    }

    async function sendNicoruData(
        currentForkType: number,
        currentThread: Thread,
        commentNo: number,
        commentBody: string,
        nicoruId: string | null,
        isMyPost: boolean,
    ) {
        //"{\"videoId\":\"\",\"fork\":\"\",\"no\":0,\"content\":\"\",\"nicoruKey\":\"\"}"
        if (
            !smId ||
            !commentContent ||
            !commentContent.data ||
            isMyPost
        )
            return;
        if (nicoruId) {
            const response: NicoruRemoveRootObject =
                await removeNicoru(nicoruId);
            if (response.meta.status === 200) {
                const commentContentCopy: typeof commentContent = JSON.parse(
                    JSON.stringify(commentContent),
                );
                const comments =
                    commentContentCopy.data!.threads[currentForkType].comments;
                const thisComment =
                    comments[
                        comments.findIndex(
                            (comment) => comment.no === commentNo,
                        )
                    ];
                if (!thisComment) return;
                thisComment.nicoruCount = thisComment.nicoruCount - 1;
                thisComment.nicoruId = null;
                setCommentContent(commentContentCopy);
            }
        } else {
            const nicoruKeyResponse = await getNicoruKey(currentThread.id, currentThread.forkLabel);
            if (nicoruKeyResponse.meta.status !== 200) return;
            const body: NicoruPostBodyRootObject = {
                videoId: smId,
                fork: currentThread.forkLabel,
                no: commentNo,
                content: commentBody,
                nicoruKey: nicoruKeyResponse.data.nicoruKey,
            };
            const response = await postNicoru(
                currentThread.id,
                body,
            );
            //console.log(response)
            if (response.meta.status === 201) {
                const commentContentCopy: typeof commentContent = JSON.parse(
                    JSON.stringify(commentContent),
                );
                const comments =
                    commentContentCopy.data!.threads[currentForkType].comments;
                const thisComment =
                    comments[
                        comments.findIndex(
                            (comment) => comment.no === commentNo,
                        )
                    ];
                if (!thisComment) return;
                thisComment.nicoruCount = thisComment.nicoruCount + 1;
                thisComment.nicoruId = response.data.nicoruId;
                setCommentContent(commentContentCopy);
            }
        }
    }

    return { commentContent, setCommentContent, reloadCommentContent, sendNicoruData, currentLogData, errorInfo, isLoading }
}