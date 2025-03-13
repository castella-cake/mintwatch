import { createContext, Dispatch, ReactNode, SetStateAction } from "react";
import { useVideoInfoContext } from "./VideoDataProvider";
import { CommentDataRootObject } from "@/types/CommentData";

const ICommentContentContext = createContext<CommentDataRootObject>(null!);

type CommentControllerContext = {
    setCommentContent: Dispatch<SetStateAction<CommentDataRootObject>>;
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
            videoInfo.data?.response.comment.nvComment,
            videoInfo.data?.response.video.id,
        );
    const isEventFired = useRef<boolean>(false);

    useEffect(() => {
        if (
            commentContent.meta?.status === 200 &&
            isEventFired.current !== true
        ) {
            document.dispatchEvent(
                new CustomEvent("pmw_commentInformationReady", {
                    detail: JSON.stringify({ commentContent }),
                }),
            );
            isEventFired.current = true;
        }
    }, [commentContent]); // コメント情報が最後に更新されると踏んで、commentContentだけを依存する

    return (
        <ICommentContentContext.Provider value={commentContent}>
            <ICommentControllerContext.Provider
                value={{ setCommentContent, reloadCommentContent }}
            >
                {children}
            </ICommentControllerContext.Provider>
        </ICommentContentContext.Provider>
    );
}

export function useCommentContentContext() {
    return useContext(ICommentContentContext);
}

export function useCommentControllerContext() {
    return useContext(ICommentControllerContext);
}
