import { useState, useRef, createRef, RefObject, memo } from "react";
//import { useLang } from "../localizeHook";
import {
    doFilterComments,
    sharedNgLevelScore,
} from "../commonFunction";
import type { Comment, CommentDataRootObject } from "@/types/CommentData";
import { VideoDataRootObject } from "@/types/VideoData";
import {
    NicoruKeyResponseRootObject,
    NicoruPostBodyRootObject,
    NicoruPostResponseRootObject,
    NicoruRemoveRootObject,
} from "@/types/NicoruPostData";
import { useStorageContext } from "@/hooks/extensionHook";
import { IconAdjustmentsStar, IconBubbleX, IconHistoryToggle, IconTransitionBottom } from "@tabler/icons-react";
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

type scrollPos = {
    [vposSec: string]: RefObject<HTMLDivElement | null>;
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

const forkLabelToLang: { [key: string]: string } = {
    default: "メイン",
    community: "コミュニティ",
    easy: "かんたん",
    owner: "オーナー",
    nicos: "ニコス",
    "extra-community": "引用コミュニティ",
    "extra-easy": "引用かんたん",
};

function getDefaultThreadIndex(videoInfo: VideoDataRootObject) {
    return (
        videoInfo.data?.response.comment.threads.findIndex(
            (elem) => elem.isDefaultPostTarget,
        ) ?? 0
    );
}

function returnFirstScrollPos(scrollPosList: scrollPos) {
    for (const elem in scrollPosList) {
        if (scrollPosList[elem].current) return scrollPosList[elem];
    }
}

const MemoizedComments = memo(function ({
    comments,
    commentRefs,
    listFocusable,
    onNicoru,
    onSeekTo,
}: {
    comments: Comment[] | undefined;
    commentRefs: RefObject<RefObject<HTMLDivElement | null>[]>;
    listFocusable: boolean;
    onNicoru: (
        commentNo: number,
        commentBody: string,
        nicoruId: string | null,
        isMyPost: boolean,
    ) => {};
    onSeekTo: (currentTime: number) => void;
}) {
    const [openedCommentItem, setOpenedCommentItem] = useState<string>("");
    function toggleCommentItemExpand(id: string) {
        if (openedCommentItem === id) {
            setOpenedCommentItem("");
            return;
        }
        setOpenedCommentItem(id);
    }
    if (!comments) return;
    return comments?.map((elem, index) => {
        //console.log(elem)
        if (!commentRefs.current || !commentRefs.current[index]) return;
        return (
            <CommentRow
                key={`comment-${elem.id}`}
                comment={elem}
                nodeRef={commentRefs.current[index]}
                isOpen={openedCommentItem === elem.id}
                listFocusable={listFocusable}
                onNicoru={onNicoru}
                onSeekTo={onSeekTo}
                onItemExpand={toggleCommentItemExpand}
            />
        );
    });
});

const ariaDetails =
    "コメントリストはデフォルトでスクリーンリーダーから不可視です。\nコメントリストを読み上げたり、コメントに対してアクションする場合は、このボタンでコメントリストを開放することが出来ます。";

function CommentList() {
    const { videoInfo } = useVideoInfoContext();
    const commentContent = useCommentContentContext();
    const { setCommentContent, reloadCommentContent } = useCommentControllerContext();
    const videoRef = useVideoRefContext();
    const setVideoActionModalState = useSetVideoActionModalStateContext()
    const {ngData} = useViewerNgContext();

    //const lang = useLang()
    const { localStorage, syncStorage } = useStorageContext();
    const [currentForkType, setCurrentForkType] = useState(-1);
    const isCommentListHovered = useRef(false);
    const [autoScroll, setAutoScroll] = useState(true);
    const [listFocusable, setListFocusable] = useState(false);
    const [onlyShowMyselfComments, setOnlyShowMyselfComments] = useState(false);
    const [showTimemachineUi, setShowTimemachineUi] = useState(false);

    const commentListContainerRef = useRef<HTMLDivElement>(null);
    // 複数のref
    const commentRefs = useRef<RefObject<HTMLDivElement | null>[]>([]);

    const videoInfoRef = useRef<VideoDataRootObject | null>(null);
    videoInfoRef.current = videoInfo;

    const commentContentRef = useRef<CommentDataRootObject | null>(null);
    commentContentRef.current = commentContent;

    // スクロールタイミングを書いたオブジェクト
    const scrollPosList: scrollPos = {};

    function updateScrollPosition() {
        // データが足りない/オートスクロールが有効化されていない/コメントリストにホバーしている ならreturn
        if (
            !videoInfoRef.current?.data ||
            !commentContentRef.current?.data ||
            !videoRef.current ||
            !autoScroll ||
            isCommentListHovered.current ||
            !scrollPosList
        )
            return;
        // video要素の時間
        const currentTime = Math.floor(videoRef.current.currentTime);
        // とりあえず一番最初の要素の高さを取得
        const firstScrollPos = returnFirstScrollPos(scrollPosList);
        if (
            !firstScrollPos ||
            !firstScrollPos.current ||
            !scrollPosList[`${currentTime}` as keyof scrollPos] ||
            !commentListContainerRef.current
        )
            return;

        const elemHeight = firstScrollPos.current.offsetHeight;
        const listHeight = commentListContainerRef.current.clientHeight;
        const listPosTop = commentListContainerRef.current.offsetTop;
        const currentTimeElem =
            scrollPosList[`${currentTime}` as keyof scrollPos].current;
        if (!currentTimeElem) return;
        // offsetTopがでかいのでリスト自身の上からの座標を与えて正しくする
        const elemOffsetTop = currentTimeElem.offsetTop - listPosTop;

        // リストの高さからはみ出していればスクロール
        if (elemOffsetTop - listHeight > 0) {
            // そのまま座標を与えると上に行ってしまうので、リストの高さから1個分のアイテムの高さを引いて下からにする
            commentListContainerRef.current.scrollTop =
                elemOffsetTop - (listHeight - elemHeight);
        }
    }

    updateScrollPosition();
    useEffect(() => {
        if (!videoRef.current) return;
        videoRef.current.addEventListener("timeupdate", updateScrollPosition);
        return () =>
            videoRef.current?.removeEventListener(
                "timeupdate",
                updateScrollPosition,
            );
    }, [
        videoRef.current,
        autoScroll,
        isCommentListHovered.current,
        scrollPosList,
    ]);

    
    // 早い順にソート
    const filteredComments = useMemo(() => {
        if (!commentContent) return
        // 現在のフォークタイプで代入
        const currentThread = commentContent.data?.threads[currentForkType];
        if (!currentThread) return;
        const sortedComments = currentThread.comments.sort((a, b) => {
            if (a.vposMs > b.vposMs) return 1;
            if (a.vposMs < b.vposMs) return -1;
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
        ngData
    ]);

    // データが足りなかったら閉店
    if (!videoInfo || !commentContent || !commentContent.data) return <></>;

    const commentCount = commentContent.data?.threads.reduce((prev, current) => prev + current.comments.length, 0);

    // currentForkTypeが-1の場合は入れ直す
    if (currentForkType === -1) setCurrentForkType(getDefaultThreadIndex(videoInfo));

    //const videoInfo = videoInfo.data.response

    // 指定したフォークタイプのスレッドが見つからなかったらreturn
    // refを登録
    filteredComments?.forEach((elem, index) => {
        commentRefs.current[index] = createRef();
        if (commentRefs.current[index]) scrollPosList[`${Math.floor(elem.vposMs / 1000)}`] = commentRefs.current[index];
    });

    async function onNicoru(
        commentNo: number,
        commentBody: string,
        nicoruId: string | null,
        isMyPost: boolean,
    ) {
        //"{\"videoId\":\"\",\"fork\":\"\",\"no\":0,\"content\":\"\",\"nicoruKey\":\"\"}"
        if (
            !videoInfo ||
            !videoInfo.data.response.video.id ||
            !videoInfo.data.response.viewer ||
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
            const currentThread =
                videoInfo.data.response.comment.threads[currentForkType];
            const nicoruKeyResponse: NicoruKeyResponseRootObject =
                await getNicoruKey(currentThread.id, currentThread.forkLabel);
            if (nicoruKeyResponse.meta.status !== 200) return;
            const body: NicoruPostBodyRootObject = {
                videoId: videoInfo.data.response.video.id,
                fork: currentThread.forkLabel,
                no: commentNo,
                content: commentBody,
                nicoruKey: nicoruKeyResponse.data.nicoruKey,
            };
            const response: NicoruPostResponseRootObject = await postNicoru(
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
    //console.log(scrollPosList)

    function seekTo(time: number) {
        if (videoRef.current) {
            videoRef.current.currentTime = time;
        }
    }

    const commentListType = syncStorage.commentListType ?? getDefault("commentListType")

    return (
        <div className="commentlist-container" id="pmw-commentlist" data-commentlist-type={commentListType}>
            <div className="commentlist-title-container global-flex stacker-title">
                <div className="global-flex1 global-bold">
                    受信済み {commentCount} 件
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
                    className="commentlist-list-timemachine"
                    data-isenable={onlyShowMyselfComments}
                    onClick={() => {
                        setOnlyShowMyselfComments((state) => {
                            return !onlyShowMyselfComments;
                        });
                    }}
                    title={onlyShowMyselfComments ? "フィルターを解除" : "自分のコメントでフィルター"}
                >
                    <IconAdjustmentsStar />
                </button>
                <button
                    className="commentlist-list-togglemycomments"
                    data-isenable={showTimemachineUi}
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
                    data-isenable={autoScroll}
                    onClick={() => {
                        setAutoScroll((state) => {
                            return !state;
                        });
                    }}
                    title={autoScroll ? "自動スクロールを無効化" : "自動スクロールを有効化"}
                >
                    <IconTransitionBottom/>
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
                                elem.label as keyof typeof forkLabelToLang;
                            return (
                                <option
                                    key={`${index}-${elem.fork}-${elem.label}`}
                                    value={index}
                                >
                                    {forkLabelToLang[key] || elem.label}
                                </option>
                            );
                        },
                    )}
                </select>
            </div>
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
            <div
                className="commentlist-list-container"
                ref={commentListContainerRef}
                onMouseEnter={() => {
                    isCommentListHovered.current = true;
                }}
                onMouseLeave={() => {
                    isCommentListHovered.current = false;
                }}
            >
                <MemoizedComments
                    comments={filteredComments}
                    listFocusable={listFocusable}
                    commentRefs={commentRefs}
                    onNicoru={onNicoru}
                    onSeekTo={seekTo}
                />
            </div>
        </div>
    );
}

export default CommentList;
