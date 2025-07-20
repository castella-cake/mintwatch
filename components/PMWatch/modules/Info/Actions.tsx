import {
    IconFolder,
    IconGift,
    IconHeart,
    IconHeartFilled,
    IconShare,
    IconSpeakerphone,
} from "@tabler/icons-react";
import { ReactNode, useEffect, useState } from "react";
import { readableInt } from "@/utils/readableValue";
import { useVideoInfoContext } from "@/components/Global/Contexts/VideoDataProvider";
import LikeThanksMessage from "./LikeThanksMessage";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
    children?: ReactNode;
    onModalOpen: (modalType: "mylist" | "share" | "help") => void;
};

function Actions({ onModalOpen }: Props) {
    const { videoInfo } = useVideoInfoContext();

    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [likeThanksMsg, setLikeThanksMsg] = useState<string | null>(null);
    const [isLikeThanksMsgClosed, setIsLikeThanksMsgClosed] = useState(false);
    const [isLikeHovered, setIsLikeHovered] = useState(false);
    const [temporalLikeModifier, setTemporalLikeModifier] = useState<number>(0); // videoInfoに焼き込まれていない「いいね」のための加算。

    const likeMessageTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null!)

    const queryClient = useQueryClient()
    //const [isMylistWindowOpen, setIsMylistWindowOpen] = useState<boolean>(false)
    useEffect(() => {
        if (!videoInfo) return;
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
    if (!videoInfo) return <></>;

    const videoInfoResponse = videoInfo.data.response;

    async function likeChange() {
        if (!videoInfo || !videoInfo.data.response.video.viewer) return;
        const method = isLiked ? "DELETE" : "POST";
        const likeResponse = await sendLike(videoInfoResponse.video.id, method);
        if (likeResponse) {
            if (!isLiked) {
                setTemporalLikeModifier(temporalLikeModifier + 1);
            } else {
                setTemporalLikeModifier(temporalLikeModifier - 1);
            }
            setIsLiked(!isLiked);
            queryClient.setQueryData(["likeResponse", videoInfoResponse.video.id], likeResponse)
            if (likeResponse.data && likeResponse.data.thanksMessage) {
                setLikeThanksMsg(likeResponse.data.thanksMessage);
                setIsLikeThanksMsgClosed(false);
            }
        }
    }

    function onAdsClicked() {
        if (!videoInfo) return
        window.open(
            `https://nicoad.nicovideo.jp/video/publish/${videoInfo.data.response.video.id}`,
            "_blank",
            "width=500,height=700,popup=yes",
        );
    }

    function onGiftClicked() {
        if (!videoInfo) return
        window.open(
            `https://gift.nicovideo.jp/video/${videoInfo.data.response.video.id}/purchase?frontend_id=6&frontend_version=0`,
            "_blank",
            "width=500,height=700,popup=yes"
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

    function onLikeClose() {
        setIsLikeHovered(false);
        setIsLikeThanksMsgClosed(true);
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
                data-is-liked={isLiked ? "true" : "false"}
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
                <IconSpeakerphone />
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
            <button
                type="button"
                className="video-action-giftbutton"
                onClick={onGiftClicked}
                title="ギフト"
            >
                <IconGift />
            </button>
            {isLiked && likeThanksMsg &&
                ((videoInfo.data.response.video.viewer && videoInfo.data.response.video.viewer.like.isLiked && isLikeHovered) ||
                    (videoInfo.data.response.video.viewer && !videoInfo.data.response.video.viewer.like.isLiked &&
                        (!isLikeThanksMsgClosed || isLikeHovered))) && (
                    <LikeThanksMessage
                        onMouseEnter={onLikeMouseEnter}
                        onMouseLeave={onLikeMouseLeave}
                        onClose={onLikeClose}
                        isPermament={!videoInfo.data.response.video.viewer.like.isLiked}
                        iconUrl={videoInfo.data.response.owner && videoInfo.data.response.owner.iconUrl}
                    />
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
