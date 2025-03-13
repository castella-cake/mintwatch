import { useEffect, useState } from "react";
import type { NvComment, VideoDataRootObject } from "@/types/VideoData";
import {
    getCommentThread,
    getRecommend,
    getVideoInfo,
} from "../utils/watchApi";
import { CommentDataRootObject } from "@/types/CommentData";
import { RecommendDataRootObject } from "@/types/RecommendData";
import {
    StoryBoardImageRootObject,
    StoryBoardRightsRootObject,
} from "@/types/StoryBoardData";

export function useVideoData(smId: string) {
    const [videoInfo, setVideoInfo] = useState<VideoDataRootObject>({});
    const [errorInfo, setErrorInfo] = useState<any>(false);
    useEffect(() => {
        async function fetchInfo() {
            try {
                // metaタグからのレスポンスを入れる。ないかもしれないので最初はnull。
                let initialResponse: VideoDataRootObject | null = null;
                let fetchedVideoInfo: VideoDataRootObject | null = null;
                if (
                    document.getElementsByName("initial-response").length > 0 &&
                    typeof document
                        .getElementsByName("initial-response")[0]
                        .getAttribute("content") === "string"
                ) {
                    initialResponse = JSON.parse(
                        document
                            .getElementsByName("initial-response")[0]
                            .getAttribute("content")!,
                    ) as VideoDataRootObject;
                    //console.log("using initialResponse", initialResponse)
                } else {
                    //console.log("not using initialResponse")
                }
                // HTMlのレスポンスが今フェッチしようとしているvideoのidと同じならこっちを使う
                if (
                    initialResponse &&
                    initialResponse.meta?.status === 200 &&
                    initialResponse.data?.response.video.id === smId
                ) {
                    fetchedVideoInfo = initialResponse;
                    document.getElementsByName("initial-response")[0].remove(); // 使いまわすべきではないので削除。Reactの思想(一貫性)に反するがこうするしかない。
                    //console.log("using initialResponse")
                } else fetchedVideoInfo = await getVideoInfo(smId);
                if (!fetchedVideoInfo || !fetchedVideoInfo.data) return;
                setVideoInfo(fetchedVideoInfo);
                setErrorInfo(false);
            } catch (error) {
                console.error(error);
                setErrorInfo(error);
            }
        }
        fetchInfo();
    }, [smId]);
    return { videoInfo, errorInfo };
}

export function useCommentData(
    nvComment: NvComment | undefined,
    smId: string | undefined,
) {
    const [commentContent, setCommentContent] = useState<CommentDataRootObject>(
        {},
    );
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
                const threadKeyResponse: {
                    meta?: { status: number };
                    data?: { threadKey: string };
                } = await getCommentThreadKey(smId);
                if (
                    threadKeyResponse.meta &&
                    threadKeyResponse.meta.status === 200 &&
                    threadKeyResponse.data?.threadKey
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

export function useRecommendData(smId: string) {
    const [recommendData, setRecommendData] = useState<RecommendDataRootObject>(
        {},
    );
    useEffect(() => {
        async function fetchInfo() {
            const recommendResponse = await getRecommend(smId);
            setRecommendData(recommendResponse);
            //console.log(commentResponse)
        }
        fetchInfo();
    }, [smId]);
    return recommendData;
}

export function useStoryBoardData(
    videoInfo: VideoDataRootObject,
    smId: string,
    actionTrackId: string,
) {
    const [storyBoardData, _setStoryBoardData] =
        useState<null | StoryBoardImageRootObject>(null);
    useEffect(() => {
        async function getData() {
            _setStoryBoardData(null);
            const rightsResult: StoryBoardRightsRootObject = await getHls(
                smId,
                "{}",
                actionTrackId,
                videoInfo.data?.response.media.domand?.accessRightKey,
                true,
            );
            if (
                rightsResult.meta.status !== 201 ||
                !rightsResult.data.contentUrl
            )
                return;
            const imagesResult = await fetch(rightsResult.data.contentUrl);
            if (!imagesResult.ok) return;
            let imagesResultJson: StoryBoardImageRootObject =
                await imagesResult.json();
            _setStoryBoardData({
                ...imagesResultJson,
                images: imagesResultJson.images.map((image) => {
                    return {
                        ...image,
                        url: rightsResult.data.contentUrl.replace(
                            "storyboard.json",
                            image.url,
                        ),
                    };
                }),
            });
        }
        if (videoInfo.data?.response.media.domand?.isStoryboardAvailable) {
            getData();
        }
    }, [smId, videoInfo]);
    return storyBoardData;
}
