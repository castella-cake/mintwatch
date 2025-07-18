import { Comment } from "@/types/CommentData";
import { secondsToTime } from "@/utils/readableValue";
import NicoruSvg from "./nicoruSvg";

type RowProps = {
    comment: Comment;
    isOpen: boolean;
    listFocusable: boolean;
    onNicoru: (
        commentNo: number,
        commentBody: string,
        nicoruId: string | null,
        isMyPost: boolean,
    ) => void;
    onSeekTo: (currentTime: number) => void;
    onItemExpand: (id: string) => void;
};

function returnNicoruRank(nicoruCount: number) {
    if (nicoruCount >= 9) return 4;
    if (nicoruCount >= 5) return 3;
    if (nicoruCount >= 3) return 2;
    if (nicoruCount >= 1) return 1;
    return 0;
}

export default function CommentRow({
    comment,
    isOpen,
    listFocusable,
    onNicoru,
    onSeekTo,
    onItemExpand,
}: RowProps) {
    return (
        <div
            className={`commentlist-list-item ${isOpen ? "commentlist-list-item-open" : ""}`}
            nicoru-count={returnNicoruRank(comment.nicoruCount)}
            aria-hidden={!listFocusable}
        >
            <button
                type="button"
                tabIndex={listFocusable ? undefined : -1}
                onClick={() =>
                    onNicoru(
                        comment.no,
                        comment.body,
                        comment.nicoruId,
                        comment.isMyPost,
                    )
                }
                aria-disabled={comment.isMyPost ? true : false}
                className={`commentlist-list-item-nicorubutton`}
                data-nicotta={comment.nicoruId ? true : false}
            >
                <NicoruSvg/><span>{comment.nicoruCount}</span>
            </button>
            <div className="commentlist-list-item-body" title={comment.body}>
                {comment.body}
            </div>
            <button
                type="button"
                tabIndex={listFocusable ? undefined : -1}
                className="commentlist-list-item-vpos"
                onClick={() => {
                    onItemExpand(comment.id);
                }}
                title="コメントの詳細を開く"
            >
                {secondsToTime(Math.floor(comment.vposMs / 1000))}
            </button>
            {isOpen && (
                <>
                    { comment.commands.length > 0 && <div className="commentlist-list-item-stats">
                        {comment.commands.map(command => {
                            return <code className="commentlist-list-item-command" key={command}>{command}</code>
                        })}
                    </div> }
                    <div className="commentlist-list-item-stats">
                        <span>
                            コメ番: {comment.no} / 投稿日時:{" "}
                            {new Date(comment.postedAt).toLocaleString()}
                        </span>
                    </div>
                    <div className="commentlist-list-item-actions">
                        <button
                            onClick={() => {
                                onSeekTo(comment.vposMs / 1000);
                            }}
                            className="commentlist-list-item-button"
                        >
                            投稿時間にシーク
                        </button>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(comment.userId)
                            }}
                            className="commentlist-list-item-button"
                        >
                            ユーザーIDをコピー
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}