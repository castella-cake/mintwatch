import { IconCircleX, IconSend2 } from "@tabler/icons-react"
import { useRef, useState } from "react"
import type { Dispatch, KeyboardEvent, RefObject, SetStateAction } from "react"
import type { VideoDataRootObject } from "@/types/VideoData"
import type { Comment, CommentDataRootObject, CommentResponseRootObject, Thread } from "@/types/CommentData"
import { CommentPostBody, KeyRootObjectResponse } from "@/types/CommentPostData"
import { useCommentControllerContext } from "@/components/Global/Contexts/CommentDataProvider"
import { useSetMessageContext } from "@/components/Global/Contexts/MessageProvider"

// import { getCommentPostKey, postComment } from "../../../modules/watchApi";

type Props = {
    videoId: string
    videoInfo: VideoDataRootObject | undefined
    videoRef: RefObject<HTMLVideoElement | null>
    commentInputRef: RefObject<HTMLTextAreaElement | null>
    setPreviewCommentItem: Dispatch<SetStateAction<Comment | null>>
}
function CommentInput({ videoRef, videoId, videoInfo, commentInputRef, setPreviewCommentItem }: Props) {
    const { pauseOnCommentInput } = useStorageVar(["pauseOnCommentInput"] as const, "local")
    const { showAlert } = useSetMessageContext()
    const { setCommentContent, reloadCommentContent } = useCommentControllerContext()
    const commandInput = useRef<HTMLInputElement>(null)

    const [dummyTextAreaContent, setDummyTextAreaContent] = useState("")
    const [isComposing, setIsComposing] = useState(false)
    const startComposition = () => setIsComposing(true)
    const endComposition = () => setIsComposing(false)

    const previewUpdateTimeout = useRef<ReturnType<typeof setTimeout>>(null!)

    // idが遅い方のデフォルトの投稿ターゲット
    const mainThreads = videoInfo?.data.response.comment.threads.filter(elem => elem.isDefaultPostTarget).sort((a, b) => Number(b.id) - Number(a.id))[0]
    /* useEffect(() => {
        const messageHandler = (event: MessageEvent) => {
            console.log(event)
            if (typeof event.data === "object" && event.data.source === "mintWatchTurnstileHandler" && event.data.type === "helloFromHandler") {
                console.log("Turnstile handler is alive")
                window.removeEventListener("message", messageHandler)
            }
        }
        window.addEventListener("message", messageHandler)
        window.postMessage({ source: "mintWatchRender", type: "checkHandler" }, "https://www.nicovideo.jp")
    }, []) */

    async function sendComment(videoId: string, commentBody: string, commentCommand: string[] = [], vposMs: number) {
        // {"videoId":"","commands":["184"],"body":"君ビートマニア上手いねぇ！","vposMs":147327,"postKey":""}
        // console.log(mainThreads)
        if (!mainThreads) return
        const postKeyResponse: KeyRootObjectResponse = await getCommentPostKey(mainThreads?.id)
        if (postKeyResponse.meta.status !== 200) return
        new Promise((resolve: (additionalBody?: { challengeToken?: string }) => void, reject) => {
            if (postKeyResponse.data.challenge.isRequired && postKeyResponse.data.challenge.siteKey) {
                // 念の為先に待ち受けて送信する
                const messageHandler = (event: MessageEvent) => {
                    if (typeof event.data === "object" && event.data.source === "mintWatchTurnstileHandler" && event.data.type === "challengeTokenResponse") {
                        if (event.data.data.status) {
                            // ユーザーがチャレンジに成功したことを受け取ったらresolve
                            window.removeEventListener("message", messageHandler)
                            resolve({
                                challengeToken: event.data.data.token,
                            })
                        } else {
                            reject("Turnstile のチャレンジに失敗しました。コード: " + event.data.data.reason)
                        }
                    }
                }
                window.addEventListener("message", messageHandler)
                // ページスクリプト側にサイトキーを送信。
                window.postMessage({ source: "mintWatchRender", type: "requestChallengeToken", data: { siteKey: postKeyResponse.data.challenge.siteKey } }, "https://www.nicovideo.jp")
            } else if (postKeyResponse.data.challenge.isRequired === false) {
                resolve({})
            } else {
                reject("failed")
            }
        }).then(async (additionalBody) => {
            const reqBody: CommentPostBody = {
                videoId,
                commands: [...commentCommand, "184"],
                body: commentBody,
                vposMs,
                postKey: postKeyResponse.data.postKey,
                ...additionalBody,
            }
            // console.log(reqBody)
            const commentPostResponse: CommentResponseRootObject = await postComment(mainThreads?.id, reqBody)
            // console.log(commentPostResponse)
            if (commentPostResponse.meta.status === 201 && videoInfo.data) {
                const commentResponse = await reloadCommentContent()
                if (!commentResponse || !commentResponse.data || !commentResponse.data.threads) return
                const newThreads: Thread[] = commentResponse.data.threads.map((thread: Thread) => {
                    const newComments = thread.comments.map((comment) => {
                        if (comment.id === commentPostResponse.data.id && comment.no === commentPostResponse.data.no) {
                            comment.commands = [...comment.commands, "nico:waku:#ff0"]
                            return comment
                        } else if (comment.isMyPost) {
                            comment.commands = [...comment.commands, "nico:waku:#fb6"]
                            return comment
                        } else {
                            return comment
                        }
                    })
                    return { ...thread, comments: newComments }
                })
                const commentDataResult: CommentDataRootObject = {
                    meta: commentResponse.meta,
                    data: {
                        ...commentResponse.data,
                        threads: newThreads,
                    },
                }
                setCommentContent(commentDataResult)
                // 今はただ要素が利用可能であることだけ伝えます
                document.dispatchEvent(new CustomEvent("pmw_commentDataUpdated", { detail: "" })) // JSON.stringify({commentContent: commentResponse})
                // TODO: コメント入力前から一時停止状態だったなら再生しない
                if (pauseOnCommentInput && videoRef.current && videoRef.current.currentTime !== videoRef.current.duration) {
                    videoRef.current.play()
                }
                if (commentBody === "＠ピザ" || commentBody === "@ピザ") {
                    window.open("https://www.google.com/search?q=ピザ")
                }
                setPreviewCommentItem(null)
                if (commentInputRef.current) commentInputRef.current.value = ""
                setDummyTextAreaContent("")
            } else {
                showAlert({
                    title: "コメントの投稿に失敗しました",
                    body: `サーバーがエラーを返しました: ${commentPostResponse.meta.status}`,
                    icon: <IconCircleX />,
                })
            }
        }).catch((error) => {
            console.error(error)
            showAlert({
                title: "コメントの投稿に失敗しました",
                body: `発生したエラー: ${error}`,
                icon: <IconCircleX />,
            })
        })
    }

    function onKeydown(e: KeyboardEvent<HTMLTextAreaElement>) {
        if (e.ctrlKey || e.altKey) return
        if (!e.shiftKey && e.key === "Enter" && commentInputRef.current && videoRef.current && !isComposing) {
            sendComment(videoId, commentInputRef.current.value, commandInput.current?.value.split(""), Math.floor(videoRef.current.currentTime * 1000))
            commentInputRef.current.value = ""
            e.preventDefault()
        }
    }

    function onChange() {
        if (commentInputRef.current) setDummyTextAreaContent(commentInputRef.current.value)
        if (pauseOnCommentInput && videoRef.current) {
            if (!videoRef.current.paused) {
                videoRef.current.pause()
            }
        }
        if (pauseOnCommentInput) {
            clearTimeout(previewUpdateTimeout.current)
            previewUpdateTimeout.current = setTimeout(() => {
                if (videoInfo && videoInfo.data.response.viewer && commentInputRef.current && commandInput.current && commentInputRef.current.value.length > 0 && videoRef.current) {
                    setPreviewCommentItem({
                        id: "-1",
                        no: -1,
                        vposMs: Math.floor(videoRef.current.currentTime * 1000),
                        body: commentInputRef.current.value,
                        commands: ["184", "nico:waku:#faf", ...commandInput.current.value.split(" ")],
                        isMyPost: true,
                        userId: "-1",
                        isPremium: videoInfo.data?.response.viewer?.isPremium,
                        score: 0,
                        postedAt: new Date().toString(),
                        nicoruCount: 0,
                        nicoruId: null,
                        source: "",
                    })
                } else {
                    setPreviewCommentItem(null)
                }
            }, 100)
        }
    }

    const commentableUser = videoInfo?.data.response.video.commentableUserTypeForPayment
    const isPaymentPreviewing = commentableUser === "purchaser" && videoInfo?.data.response.okReason === "PAYMENT_PREVIEW_SUPPORTED"

    if (commentableUser === "nobody" || isPaymentPreviewing || !videoInfo?.data.response.viewer) {
        return (
            <div className="commentinput-container global-flex" id="pmw-commentinput">
                <div className="commentinput-disabled">
                    { isPaymentPreviewing
                        ? "未購入のため"
                        : (
                                !videoInfo?.data.response.viewer
                                    ? "未ログインのため"
                                    : "この動画には"
                            )}
                    コメントできません
                </div>
            </div>
        )
    }

    const commentMaxLength = 75
    const remainingLength = commentMaxLength - dummyTextAreaContent.length
    const remainingTextOpacity = dummyTextAreaContent.length > 0 ? 0.8 : 0
    // textarea 周りの挙動は https://qiita.com/tsmd/items/fce7bf1f65f03239eef0 を参考にさせていただきました
    return (
        <div className="commentinput-container global-flex" id="pmw-commentinput">
            <input ref={commandInput} className="commentinput-cmdinput" placeholder="コマンド" onChange={onChange} />
            <div className="commentinput-textarea-container global-flex1">
                <div className="commentinput-textarea-dummy" aria-hidden="true">{dummyTextAreaContent + "\u200b"}</div>
                <textarea ref={commentInputRef} className="commentinput-input" placeholder="コメントを入力" onKeyDown={onKeydown} onChange={onChange} onCompositionStart={startComposition} onCompositionEnd={endComposition} />
                <div className="commentinput-remaining" style={(remainingLength < 0) ? { color: "var(--dangerous1)", opacity: remainingTextOpacity } : { opacity: remainingTextOpacity }}>
                    {remainingLength}
                </div>
            </div>
            <button
                type="button"
                className="commentinput-submit"
                onClick={() => {
                    if (!commentInputRef.current || !videoRef.current || commentInputRef.current.value === "" || remainingLength < 0) return
                    sendComment(videoId, commentInputRef.current.value, commandInput.current?.value.split(" "), Math.floor(videoRef.current.currentTime * 1000))
                }}
                aria-disabled={!commentInputRef.current || commentInputRef.current.value === "" || remainingLength < 0}
            >
                <IconSend2 />
                <span>コメント</span>
            </button>
            <div id="pmw-turnstile-widget"></div>
        </div>
    )
}

export default CommentInput
