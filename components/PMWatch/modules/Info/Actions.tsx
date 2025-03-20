import {
    IconCopy,
    IconFolder,
    IconHeart,
    IconHeartFilled,
    IconShare,
    IconSpeakerphone,
    IconX,
} from "@tabler/icons-react";
import { ReactNode, useEffect, useState } from "react";
import { sendLike } from "../../../../utils/watchApi";
import { readableInt } from "../commonFunction";
import { useVideoInfoContext } from "../Contexts/VideoDataProvider";

type Props = {
    children?: ReactNode;
    onModalOpen: (modalType: "mylist" | "share") => void;
};

function Actions({ children, onModalOpen }: Props) {
    const { videoInfo } = useVideoInfoContext();

    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [likeThanksMsg, setLikeThanksMsg] = useState<string | null>(null);
    const [isLikeThanksMsgClosed, setIsLikeThanksMsgClosed] = useState(false);
    const [isLikeHovered, setIsLikeHovered] = useState(false);
    const [temporalLikeModifier, setTemporalLikeModifier] = useState<number>(0); // videoInfoに焼き込まれていない「いいね」のための加算。

    const [isLikeMsgCopied, setIsLikeMsgCopied] = useState<boolean>(false);

    const likeMessageTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null!)
    //const [isMylistWindowOpen, setIsMylistWindowOpen] = useState<boolean>(false)
    useEffect(() => {
        if (!videoInfo.data) return;
        setTemporalLikeModifier(0);
        setIsLiked(
            videoInfo.data.response.video.viewer
                ? videoInfo.data.response.video.viewer.like.isLiked
                : false,
        );
        if (
            videoInfo.data.response.video.viewer &&
            videoInfo.data.response.video.viewer.like.isLiked
        ) {
            async function getData() {
                const likeResponse = await sendLike(
                    videoInfoResponse.video.id,
                    "GET",
                );
                if (
                    likeResponse &&
                    likeResponse.data &&
                    likeResponse.data.thanksMessage
                ) {
                    setLikeThanksMsg(likeResponse.data.thanksMessage);
                }
            }
            getData();
        } else {
            setLikeThanksMsg(null);
        }
        setIsLikeThanksMsgClosed(false);
    }, [videoInfo]);
    if (!videoInfo.data) return <></>;

    const videoInfoResponse = videoInfo.data.response;

    async function likeChange() {
        if (!videoInfo.data || !videoInfo.data.response.video.viewer) return;
        const method = isLiked ? "DELETE" : "POST";
        const likeResponse = await sendLike(videoInfoResponse.video.id, method);
        if (likeResponse) {
            if (!isLiked) {
                setTemporalLikeModifier(temporalLikeModifier + 1);
            } else {
                setTemporalLikeModifier(temporalLikeModifier - 1);
            }
            setIsLiked(!isLiked);
            if (likeResponse.data && likeResponse.data.thanksMessage) {
                setLikeThanksMsg(likeResponse.data.thanksMessage);
                setIsLikeThanksMsgClosed(false);
            }
        }
    }

    function onAdsClicked() {
        window.open(
            `https://nicoad.nicovideo.jp/video/publish/${videoInfo.data?.response.video.id}`,
            "_blank",
            "width=500,height=700,popup=yes",
        );
    }

    function onShareClicked() {
        onModalOpen("share");
    }

    function onMylistClicked() {
        onModalOpen("mylist");
    }

    /*function ShareSelector() {
        return <select>
            <option value="x.com">X</option>
            {syncStorage.shareinstancelist && syncStorage.shareinstancelist.map((server: string, index: number) => {
                return <option key={`shareinstancelist-${index}`} value={server}>{server}</option>
            })}
        </select>
    }*/

    function onLikeMouseEnter() {
        clearTimeout(likeMessageTimeoutRef.current)
        setIsLikeHovered(true)
    }

    function onLikeMouseLeave() {
        clearTimeout(likeMessageTimeoutRef.current)
        likeMessageTimeoutRef.current = setTimeout(() => {
            setIsLikeHovered(false)
        }, 100)
    }

    function onLikeMsgCopy() {
        if (!likeThanksMsg) return
        navigator.clipboard.writeText(likeThanksMsg);
        setIsLikeMsgCopied(true);
        setTimeout(() => {
            setIsLikeMsgCopied(false);
        }, 3000);
    }

    return (
        <div className="video-actions" id="pmw-videoactions">
            {/* row-reverse じゃなくなりました！！！！ */}
            <button
                type="button"
                onClick={likeChange}
                onMouseEnter={onLikeMouseEnter}
                onMouseLeave={onLikeMouseLeave}
                className="video-action-likebutton"
                title="いいね！"
                is-liked={isLiked ? "true" : "false"}
            >
                {isLiked ? <IconHeartFilled /> : <IconHeart />}
                <span>
                    いいね！
                    {readableInt(
                        videoInfoResponse.video.count.like +
                            temporalLikeModifier,
                    )}
                </span>
            </button>
            <button
                type="button"
                className="video-action-adbutton"
                onClick={onAdsClicked}
                title="ニコニ広告する"
            >
                <IconSpeakerphone /> <span>ニコニ広告</span>
            </button>
            <button
                type="button"
                className="video-action-sharebutton"
                onClick={onShareClicked}
                title="共有"
            >
                <IconShare />
            </button>
            <button
                type="button"
                className="video-action-mylistbutton"
                onClick={onMylistClicked}
                title="マイリスト"
            >
                <IconFolder />
            </button>
            {isLiked && likeThanksMsg &&
                ((videoInfo.data.response.video.viewer.like.isLiked && isLikeHovered) ||
                    (!videoInfo.data.response.video.viewer.like.isLiked &&
                        (!isLikeThanksMsgClosed || isLikeHovered))) && (
                    <div className="video-action-likethanks-outercontainer" onMouseEnter={onLikeMouseEnter} onMouseLeave={onLikeMouseLeave}>
                        <div className="video-action-likethanks-container">
                            <div className="global-flex video-action-likethanks-title">
                                <span className="global-flex1">
                                    いいね！へのお礼メッセージ
                                    <button onClick={onLikeMsgCopy} title="お礼メッセージをコピー" className="video-action-likethanks-copy">
                                        <IconCopy/>
                                        {isLikeMsgCopied && <span className="video-action-likethanks-copied">コピーしました</span>}
                                    </button>
                                </span>
                                {!videoInfo.data.response.video.viewer.like
                                    .isLiked && (
                                    <button
                                        type="button"
                                        title="お礼メッセージを閉じる"
                                        onClick={() => {
                                            setIsLikeHovered(false);
                                            setIsLikeThanksMsgClosed(true);
                                        }}
                                    >
                                        <IconX />
                                    </button>
                                )}
                            </div>
                            <div className="global-flex">
                                {videoInfo.data.response.owner &&
                                    videoInfo.data.response.owner.iconUrl && (
                                        <img
                                            src={
                                                videoInfo.data.response.owner
                                                    .iconUrl
                                            }
                                            className="video-action-likethanks-icon"
                                        ></img>
                                    )}
                                <span className="video-action-likethanks-arrow " />
                                <div className="video-action-likethanks-body global-flex1">
                                    {likeThanksMsg}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
}

/*
    <div className="video-action-mylists-outercontainer" is-open={isMylistWindowOpen ? "true" : undefined}>
        <Mylist videoInfo={videoInfo} onClose={onMylistClicked}/>
    </div>
*/

export default Actions;
