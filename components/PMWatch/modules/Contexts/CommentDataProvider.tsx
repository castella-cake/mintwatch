import { createContext, Dispatch, ReactNode, SetStateAction } from "react";
import { useVideoInfoContext } from "./VideoDataProvider";
import { CommentDataRootObject } from "@/types/CommentData";

const ICommentContentContext = createContext<CommentDataRootObject | null>(null);

type CommentControllerContext = {
    setCommentContent: Dispatch<SetStateAction<CommentDataRootObject | null>>;
    reloadCommentContent: (logData?: {
        when: number;
    }) => Promise<CommentDataRootObject | undefined>;
};
const ICommentControllerContext = createContext<CommentControllerContext>({
    setCommentContent: () => {},
    reloadCommentContent: null!,
});

export function CommentDataProvider({ children }: { children: ReactNode }) {
    const { videoInfo } = useVideoInfoContext();

    const { commentContent, setCommentContent, reloadCommentContent } =
        useCommentData(
            videoInfo?.data.response.comment.nvComment,
            videoInfo?.data.response.video.id,
        );

    useEffect(() => {
        if (
            commentContent && commentContent.meta?.status === 200
        ) {
            document.dispatchEvent(
                new CustomEvent("pmw_commentInformationUpdated", {
                    detail: JSON.stringify({ commentContent }),
                }),
            );
        }
    }, [commentContent]); // コメント情報が最後に更新されると踏んで、commentContentだけを依存する

    return (
        <ICommentContentContext value={commentContent}>
            <ICommentControllerContext
                value={{ setCommentContent, reloadCommentContent }}
            >
                {children}
            </ICommentControllerContext>
        </ICommentContentContext>
    );
}

export function useCommentContentContext() {
    return useContext(ICommentContentContext);
}

export function useCommentControllerContext() {
    return useContext(ICommentControllerContext);
}
