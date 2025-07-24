import { createContext, ReactNode } from "react"
import { useVideoInfoContext } from "./VideoDataProvider"
import { CommentDataRootObject } from "@/types/CommentData"
import { useCommentDataQuery } from "@/hooks/apiHooks/watch/commentData"
import { UseMutateFunction } from "@tanstack/react-query"
import { VideoDataThread } from "@/types/VideoData"

const ICommentContentContext = createContext<CommentDataRootObject | undefined>(undefined)

type CommentControllerContext = {
    setCommentContent: (newCommentContent: CommentDataRootObject) => void
    reloadCommentContent: (logData?: {
        when: number
    }) => Promise<CommentDataRootObject | undefined>
    sendNicoru: UseMutateFunction<CommentDataRootObject, Error, { currentForkType: number, currentThread: VideoDataThread, commentNo: number, commentBody: string, nicoruId: string | null, isMyPost: boolean }, unknown>
}
const ICommentControllerContext = createContext<CommentControllerContext>({
    setCommentContent: () => {},
    reloadCommentContent: null!,
    sendNicoru: null!,
})

export function CommentDataProvider({ children }: { children: ReactNode }) {
    const { videoInfo } = useVideoInfoContext()

    const { commentContent, setCommentContent, reloadCommentContent, sendNicoru } = useCommentDataQuery(videoInfo?.data.response.comment.nvComment, videoInfo?.data.response.video.id)

    useEffect(() => {
        if (
            commentContent && commentContent.meta?.status === 200
        ) {
            document.dispatchEvent(
                new CustomEvent("pmw_commentInformationUpdated", {
                    detail: JSON.stringify({ commentContent }),
                }),
            )
        }
    }, [commentContent]) // コメント情報が最後に更新されると踏んで、commentContentだけを依存する

    return (
        <ICommentContentContext value={commentContent}>
            <ICommentControllerContext
                value={{ setCommentContent, reloadCommentContent, sendNicoru }}
            >
                {children}
            </ICommentControllerContext>
        </ICommentContentContext>
    )
}

export function useCommentContentContext() {
    return useContext(ICommentContentContext)
}

export function useCommentControllerContext() {
    return useContext(ICommentControllerContext)
}
