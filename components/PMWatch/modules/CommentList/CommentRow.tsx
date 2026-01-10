import { Comment } from "@/types/CommentData"
import { secondsToTime } from "@/utils/readableValue"
import NicoruSvg from "./nicoruSvg"
import { detectVideoIdFromString } from "@/utils/detectVideoId"
import { IconArrowRight, IconDeviceTv, IconExclamationCircle, IconUserMinus } from "@tabler/icons-react"
import { useViewerNgContext } from "@/components/Global/Contexts/ViewerNgProvider"
import { useSetMessageContext } from "@/components/Global/Contexts/MessageProvider"
import { useCallback } from "react"
import APIError from "@/utils/classes/APIError"

type RowProps = {
    comment: Comment
    isOpen: boolean
    listFocusable: boolean
    onNicoru: (
        commentNo: number,
        commentBody: string,
        nicoruId: string | null,
        isMyPost: boolean,
    ) => void
    onSeekTo: (currentTime: number) => void
    onItemExpand: (id: string) => void
    onCommentDeletion: (commentNo: number) => void
    isAdvancedMode?: boolean
}

function returnNicoruRank(nicoruCount: number) {
    if (nicoruCount >= 9) return 4
    if (nicoruCount >= 5) return 3
    if (nicoruCount >= 3) return 2
    if (nicoruCount >= 1) return 1
    return 0
}

export function CommentRow({
    comment,
    isOpen,
    listFocusable,
    onNicoru,
    onSeekTo,
    onItemExpand,
    onCommentDeletion,
    isAdvancedMode = false,
}: RowProps) {
    const { showAlert, showToast } = useSetMessageContext()
    const { setNgData } = useViewerNgContext()

    const detectedVideoIds = detectVideoIdFromString(comment.body)

    const handleItemExpand = useCallback(() => {
        onItemExpand(comment.id)
    }, [comment.id, onItemExpand])

    const handleNicoru = useCallback(() => {
        onNicoru(
            comment.no,
            comment.body,
            comment.nicoruId,
            comment.isMyPost,
        )
    }, [comment, onNicoru])

    const handleSeekTo = useCallback(() => {
        onSeekTo(comment.vposMs / 1000)
    }, [comment.vposMs, onSeekTo])

    const handleCopyUserId = useCallback(() => {
        navigator.clipboard.writeText(comment.userId)
    }, [comment.userId])

    const handleAddNg = useCallback(async () => {
        showAlert({
            title: "このユーザーをNGに追加しますか？",
            icon: <IconUserMinus />,
            body: `ID ${comment.userId} をNGに追加します。\nこのユーザーのコメントはコメントリストと動画プレイヤーから非表示になります。`,
            customCloseButton: [
                { key: "cancel", text: "キャンセル" },
                { key: "confirm", text: "追加", primary: true },
            ],
            onClose: async (key) => {
                if (key !== "confirm") return
                try {
                    const response = await addNgComment("id", comment.userId)
                    if (response.meta.status === 200) {
                        setNgData(response.data)
                        showToast({ title: "NGを追加しました" })
                    }
                } catch (e) {
                    if (e instanceof APIError) {
                        showToast({ title: `NGの追加に失敗しました: ${e.response?.meta?.status}`, icon: <IconExclamationCircle />, body: `APIリクエストでエラーが発生しました。` })
                    }
                }
            },
        })
    }, [comment.userId, showAlert, setNgData, showToast])

    const handleCommentDeletion = useCallback(() => {
        onCommentDeletion(comment.no)
    }, [comment.no, onCommentDeletion])

    return (
        <div
            className={`commentlist-list-item ${isOpen ? "commentlist-list-item-open" : ""}`}
            data-nicoru-count={returnNicoruRank(comment.nicoruCount)}
            aria-hidden={!listFocusable}
        >
            <button
                type="button"
                tabIndex={listFocusable ? undefined : -1}
                onClick={handleNicoru}
                aria-disabled={comment.isMyPost ? true : false}
                className="commentlist-list-item-nicorubutton"
                data-nicotta={comment.nicoruId ? true : false}
            >
                <NicoruSvg />
                <span>{comment.nicoruCount}</span>
            </button>
            <div className="commentlist-list-item-body" title={comment.body}>
                {comment.body}
            </div>
            <button
                type="button"
                tabIndex={listFocusable ? undefined : -1}
                className="commentlist-list-item-vpos"
                onClick={handleItemExpand}
                title="コメントの詳細を開く"
            >
                {secondsToTime(Math.floor(comment.vposMs / 1000))}
            </button>
            {isOpen && (
                <>
                    { comment.commands.length > 0 && (
                        <div className="commentlist-list-item-stats">
                            {comment.commands.map((command) => {
                                return <code className="commentlist-list-item-command" key={command}>{command}</code>
                            })}
                        </div>
                    ) }
                    <div className="commentlist-list-item-stats">
                        <span>
                            コメ番:
                            {" "}
                            {comment.no}
                            {" "}
                            / 投稿日時:
                            {" "}
                            {new Date(comment.postedAt).toLocaleString()}
                            { isAdvancedMode && (
                                <>
                                    {" / "}
                                    ソース:
                                    {" "}
                                    {comment.source}
                                </>
                            )}
                        </span>
                    </div>
                    <div className="commentlist-list-item-actions">
                        <button
                            onClick={handleSeekTo}
                            className="commentlist-list-item-button"
                        >
                            投稿時間にシーク
                        </button>
                        <button
                            onClick={handleCopyUserId}
                            className="commentlist-list-item-button"
                        >
                            ユーザーIDをコピー
                        </button>
                        { !comment.isMyPost && (
                            <button
                                onClick={handleAddNg}
                                className="commentlist-list-item-button"
                            >
                                このユーザーをNG
                            </button>
                        )}
                        { comment.isMyPost && (
                            <button
                                onClick={handleCommentDeletion}
                                className="commentlist-list-item-button"
                            >
                                自分のコメントを削除
                            </button>
                        ) }
                    </div>
                    { detectedVideoIds && (
                        <div className="commentlist-list-item-videolink">
                            <span title="このコメントに含まれている動画ID">
                                <IconDeviceTv />
                                <IconArrowRight />
                            </span>
                            {detectedVideoIds.map(videoId => (
                                <a
                                    key={videoId}
                                    href={`https://www.nicovideo.jp/watch/${encodeURIComponent(videoId)}`}
                                >
                                    {videoId}
                                </a>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
