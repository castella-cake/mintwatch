import { useState, useRef } from "react";
//import { useLang } from "../localizeHook";
import {
    doFilterComments,
    sharedNgLevelScore,
} from "../commonFunction";
import type { Comment, CommentDataRootObject } from "@/types/CommentData";
import { VideoDataRootObject } from "@/types/VideoData";
import { useStorageContext } from "@/hooks/extensionHook";
import { IconAdjustmentsHorizontal, IconBubbleX, IconHistoryToggle, IconSortAscending, IconSortDescending, IconTransitionBottom } from "@tabler/icons-react";
import { TimeMachine } from "./TimeMachineUi";
import {
    useVideoInfoContext,
    useVideoRefContext,
} from "@/components/Global/Contexts/VideoDataProvider";
import {
    useCommentContentContext,
    useCommentControllerContext,
} from "@/components/Global/Contexts/CommentDataProvider";
import { useViewerNgContext } from "@/components/Global/Contexts/ViewerNgProvider";
import { useSetVideoActionModalStateContext } from "@/components/Global/Contexts/ModalStateProvider";
import CommentRow from "./CommentRow";
import { threadLabelLang } from "@/utils/threadLabel";
import { VList, VListHandle } from "virtua";

export type scrollPos = {
    [vposSec: string]: HTMLDivElement | null;
};
/*
// 選択した名前のスレッドを返す関数
// 同名のforkがある場合はidが遅い方を返します(dアニメのため)
function returnSelectedThread(threads: Thread[], forkName: string) {
    const filteredThreads = threads.filter(elem => elem.fork === forkName ).sort((a, b) => {
        return Number(b.id) - Number(a.id)
    })
    if ( filteredThreads.length > 0 ) {
        return filteredThreads[0]
    } else {
        return false
    }
}*/

const sortKeys = {
    vposMs: "動画時間",
    postedAt: "投稿日時",
    nicoruCount: "ニコる数"
}

function getDefaultThreadIndex(videoInfo: VideoDataRootObject) {
    return (
        videoInfo.data?.response.comment.threads.findIndex(
            (elem) => elem.isDefaultPostTarget,
        ) ?? 0
    );
}

const Comments = ({
    comments,
    listFocusable,
    onNicoru,
    onSeekTo,
    doAutoScroll,
}: {
    comments: Comment[] | undefined;
    listFocusable: boolean;
    onNicoru: (
        commentNo: number,
        commentBody: string,
        nicoruId: string | null,
        isMyPost: boolean,
    ) => void;
    onSeekTo: (currentTime: number) => void;
    doAutoScroll: boolean;
}) => {
    const [openedCommentItem, setOpenedCommentItem] = useState<string>("");
    const toggleCommentItemExpand = useCallback((id: string) => {
        setOpenedCommentItem(current => {
            if (current === id) {
                return "";
            } else {
                return id
            }
        })
    }, [setOpenedCommentItem]);

    const isCommentListHovered = useRef(false);

    const videoRef = useVideoRefContext()

    const vlistRef = useRef<VListHandle>(null)
    const updateScrollPosition = useCallback((e?: Event, doSmoothScroll = true) => {
        if (!comments || !videoRef.current || !vlistRef.current || !doAutoScroll || isCommentListHovered.current) return
        const currentTime = videoRef.current.currentTime
        let nearestComment = comments
            .filter(c => c.vposMs <= currentTime * 1000) // 未来のキーを対象にしない
            .reduce((prev: null | Comment, current) => {
                if (prev === null) return current
                return Math.abs(current.vposMs - currentTime * 1000) < Math.abs(prev.vposMs - currentTime * 1000) ? current : prev;
            }, null);
        if (!nearestComment) return;
        vlistRef.current.scrollToIndex(comments.findIndex(c => c.id === nearestComment.id), { align: "end", smooth: doSmoothScroll })
    }, [doAutoScroll])

    useEffect(() => {
        if (!videoRef.current) return;
        updateScrollPosition(undefined, false)
        videoRef.current.addEventListener("timeupdate", updateScrollPosition);
        return () =>
            videoRef.current?.removeEventListener(
                "timeupdate",
                updateScrollPosition,
            );
    }, [
        videoRef.current,
        doAutoScroll
    ]);

    if (!comments) return;
    return <div
        className="commentlist-list-container"
        onMouseEnter={() => {
            isCommentListHovered.current = true;
        }}
        onMouseLeave={() => {
            isCommentListHovered.current = false;
        }}
    >
        <VList ref={vlistRef} count={comments.length}>
            {comments.map((elem, index) => {
                //console.log(elem)
                return (
                    <CommentRow
                        key={`comment-${elem.id}`}
                        comment={elem}
                        isOpen={openedCommentItem === elem.id}
                        listFocusable={listFocusable}
                        onNicoru={onNicoru}
                        onSeekTo={onSeekTo}
                        onItemExpand={toggleCommentItemExpand}
                    />
                );
            })}
        </VList>
    </div>
};

const ariaDetails =
    "コメントリストはデフォルトでスクリーンリーダーから不可視です。\nコメントリストを読み上げたり、コメントに対してアクションする場合は、このボタンでコメントリストを開放することが出来ます。";

function CommentList() {
    const { videoInfo } = useVideoInfoContext();
    const commentContent = useCommentContentContext();
    const { reloadCommentContent, sendNicoru } = useCommentControllerContext();
    const videoRef = useVideoRefContext();
    const setVideoActionModalState = useSetVideoActionModalStateContext()
    const {ngData} = useViewerNgContext();

    //const lang = useLang()
    const { localStorage, syncStorage } = useStorageContext();
    const [currentForkType, setCurrentForkType] = useState(-1);

    const [autoScroll, setAutoScroll] = useState(true);

    const [listFocusable, setListFocusable] = useState(false);

    const [onlyShowMyselfComments, setOnlyShowMyselfComments] = useState(false);
    const [showTimemachineUi, setShowTimemachineUi] = useState(false);
    const [externalMenuExpanded, setExternalMenuExpanded] = useState(false);

    const [commentSortKey, setCommentSortKey] = useState<keyof typeof sortKeys>("vposMs");
    const [reverseCommentSort, setReverseCommentSort] = useState(false);

    const videoInfoRef = useRef<VideoDataRootObject | undefined>(null);
    videoInfoRef.current = videoInfo;

    const commentContentRef = useRef<CommentDataRootObject | undefined>(undefined);
    commentContentRef.current = commentContent;
    
    // 早い順にソート
    const filteredComments = useMemo(() => {
        if (!commentContent) return
        // 現在のフォークタイプで代入
        const currentThread = commentContent.data?.threads[currentForkType];
        if (!currentThread) return;
        const sortedComments = currentThread.comments.sort((a, b) => {
            if (a[commentSortKey] > b[commentSortKey]) return (reverseCommentSort ? -1 : 1);
            if (a[commentSortKey] < b[commentSortKey]) return (reverseCommentSort ? 1 : -1);
            return 0;
        });
        return doFilterComments(
            sortedComments,
            sharedNgLevelScore[
                (localStorage.playersettings.sharedNgLevel ??
                    "mid") as keyof typeof sharedNgLevelScore
            ],
            ngData,
            onlyShowMyselfComments,
        );
    }, [
        currentForkType,
        commentContent,
        localStorage.playersettings.sharedNgLevel,
        onlyShowMyselfComments,
        videoInfo,
        ngData,
        commentSortKey,
        reverseCommentSort,
    ]);

    const onNicoru = useCallback((
        commentNo: number,
        commentBody: string,
        nicoruId: string | null,
        isMyPost: boolean,
    ) => {
        if (!videoInfo) return;
        sendNicoru({
            currentForkType,
            currentThread: videoInfo.data.response.comment.threads[currentForkType],
            commentNo,
            commentBody,
            nicoruId,
            isMyPost
        })
    }, [currentForkType, videoInfo])
    //console.log(scrollPosList)

    const seekTo = useCallback((time: number) => {
        if (videoRef.current) {
            videoRef.current.currentTime = time;
        }
    }, [videoRef.current])

    // データが足りなかったら閉店
    if (!videoInfo || !commentContent || !commentContent.data) return <></>;

    const commentCount = commentContent.data?.threads.reduce((prev, current) => prev + current.comments.length, 0);

    // currentForkTypeが-1の場合は入れ直す
    if (currentForkType === -1) setCurrentForkType(getDefaultThreadIndex(videoInfo));

    //const videoInfo = videoInfo.data.response

    const commentListType = syncStorage.commentListType ?? getDefault("commentListType")

    return (
        <div className="commentlist-container" id="pmw-commentlist" data-commentlist-type={commentListType}>
            <div className="commentlist-title-container global-flex stacker-title">
                <div className="global-flex1 global-bold">
                    {commentCount} 件受信済み
                </div>
                <button
                    className="commentlist-list-openng"
                    onClick={() => {
                        setVideoActionModalState("ngcomments")
                    }}
                    title="NG設定を開く"
                >
                    <IconBubbleX />
                </button>
                <button
                    className="commentlist-list-togglemycomments"
                    data-isenabled={showTimemachineUi}
                    onClick={() => {
                        setShowTimemachineUi((state) => {
                            return !showTimemachineUi;
                        });
                    }}
                    title={showTimemachineUi ? "過去ログローダーを閉じる" : "過去ログローダーを開く"}
                >
                    <IconHistoryToggle />
                </button>
                <button
                    className="commentlist-list-toggleautoscroll"
                    data-isenabled={autoScroll}
                    aria-disabled={commentSortKey !== "vposMs"}
                    onClick={() => {
                        if (commentSortKey !== "vposMs") return;
                        setAutoScroll((state) => {
                            return !state;
                        });
                    }}
                    title={autoScroll ? "自動スクロールを無効化" : "自動スクロールを有効化"}
                >
                    <IconTransitionBottom/>
                </button>
                <button
                    className="commentlist-list-toggleexternalmenu"
                    data-isenabled={externalMenuExpanded}
                    onClick={() => {
                        setExternalMenuExpanded((state) => {
                            return !state;
                        });
                    }}
                    title={externalMenuExpanded ? "拡張メニューを閉じる" : "拡張メニューを開く"}
                >
                    <IconAdjustmentsHorizontal/>
                </button>
                <select
                    onChange={(e) => {
                        setCurrentForkType(Number(e.currentTarget.value));
                    }}
                    value={currentForkType}
                    className="commentlist-fork-selector"
                    title="コメント種類選択"
                >
                    {videoInfo.data.response.comment.threads.map(
                        (elem, index) => {
                            const key =
                                elem.label as keyof typeof threadLabelLang;
                            return (
                                <option
                                    key={`${index}-${elem.fork}-${elem.label}`}
                                    value={index}
                                >
                                    {threadLabelLang[key] || elem.label}
                                </option>
                            );
                        },
                    )}
                </select>
            </div>
            { externalMenuExpanded && <div className="commentlist-externalmenu">
                <label><input type="checkbox" checked={onlyShowMyselfComments} onChange={(e) => {
                    setOnlyShowMyselfComments(e.target.checked);
                }}></input>自分のコメントのみ表示</label>
                <select
                    onChange={(e) => {
                        setCommentSortKey(e.target.value as keyof typeof sortKeys);
                    }}
                    value={commentSortKey}
                    className="commentlist-fork-selector"
                    title="ソート選択"
                >
                    {Object.keys(sortKeys).map((sortKey) => {
                        return <option key={sortKey} value={sortKey}>{sortKeys[sortKey as keyof typeof sortKeys]}</option>
                    })}
                </select>
                <button
                    className="commentlist-list-togglesortasc"
                    onClick={() => {
                        setReverseCommentSort((state) => {
                            return !state;
                        });
                    }}
                    title={reverseCommentSort ? "昇順に切り替え" : "降順に切り替え"}
                >
                    {reverseCommentSort ? <IconSortDescending/> : <IconSortAscending/>}
                </button>
            </div>}
            <button
                className="commentlist-list-toggletabindex"
                aria-description={ariaDetails}
                onClick={() => {
                    setListFocusable(!listFocusable);
                    setAutoScroll(false);
                }}
                data-isopen={listFocusable}
            >
                コメントリストを{listFocusable ? "閉じる" : "開く"}
            </button>
            {showTimemachineUi && (
                <TimeMachine
                    onConfirm={(date) => {
                        reloadCommentContent({
                            when: Math.floor(date.getTime() / 1000),
                        });
                    }}
                    onReload={() => {
                        reloadCommentContent();
                    }}
                />
            )}
            <Comments
                comments={filteredComments}
                listFocusable={listFocusable}
                onNicoru={onNicoru}
                onSeekTo={seekTo}
                doAutoScroll={autoScroll && commentSortKey === "vposMs"}
            />
        </div>
    );
}

export default CommentList;
