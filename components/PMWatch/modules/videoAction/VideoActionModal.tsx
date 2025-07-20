import {
    IconBubbleX,
    IconComet,
    IconFolder,
    IconHelpCircle,
    IconKeyboard,
    IconShare,
    IconX,
} from "@tabler/icons-react";
import ReactFocusLock from "react-focus-lock";
import { Mylist } from "./MylistUI";
import { Share } from "./ShareUI";
import { ReactNode, RefObject } from "react";
import { useVideoInfoContext } from "@/components/Global/Contexts/VideoDataProvider";
import MarkdownHelp from "./MarkdownHelp";
import KeyboardShortcuts from "./KeyboardShortcuts";
import { CSSTransition } from "react-transition-group";
import { useSetVideoActionModalStateContext, useVideoActionModalStateContext } from "@/components/Global/Contexts/ModalStateProvider";
import NgComments from "./NgComments";
import MintWatchIcon from "@/public/mintwatch-white.svg?react"
import AboutMintWatch from "./About";

export function VideoActionModal({
    nodeRef,
}: {
    nodeRef: RefObject<HTMLDivElement | null>;
}) {
    const { videoInfo } = useVideoInfoContext();

    const videoActionModalState = useVideoActionModalStateContext()
    const setVideoActionModalState = useSetVideoActionModalStateContext()

    if (!videoInfo) return <></>;

    return (
        <CSSTransition
            nodeRef={nodeRef}
            in={videoActionModalState !== false}
            timeout={300}
            unmountOnExit
            classNames="videoaction-modal-transition"
        >
            <ReactFocusLock>
                <div className="videoaction-modal-wrapper" ref={nodeRef}>
                    <div className="videoaction-modal-container">
                        <div className="videoaction-modal-header global-flex">
                            <h2 className="global-flex1">
                                {returnTitle(videoActionModalState)}
                            </h2>
                            <button
                                className="videoaction-modal-close"
                                onClick={() => {
                                    setVideoActionModalState(false);
                                }}
                            >
                                <IconX />
                            </button>
                        </div>
                        <div className="videoaction-left">
                            <div className="videoaction-select-separator">動画アクション</div>
                            <VideoActionTabButton
                                stateKey={"mylist"}
                            >
                                <IconFolder /> マイリスト
                            </VideoActionTabButton>
                            <VideoActionTabButton
                                stateKey={"share"}
                            >
                                <IconShare /> 共有
                            </VideoActionTabButton>
                            <VideoActionTabButton
                                stateKey={"ngcomments"}
                            >
                                <IconBubbleX /> NGコメント設定
                            </VideoActionTabButton>

                            <div className="videoaction-select-separator videoaction-select-separator-bottom">ヘルプ</div>

                            <VideoActionTabButton
                                stateKey={"whatsnew"}
                                isBottom={true}
                            >
                                <IconComet /> 更新情報
                            </VideoActionTabButton>
                            <VideoActionTabButton
                                stateKey={"shortcuts"}
                                isBottom={true}
                            >
                                <IconKeyboard /> ショートカット
                            </VideoActionTabButton>
                            <VideoActionTabButton
                                stateKey={"help"}
                                isBottom={true}
                            >
                                <IconHelpCircle /> はじめに
                            </VideoActionTabButton>
                            <VideoActionTabButton
                                stateKey={"about"}
                                isBottom={true}
                            >
                                <MintWatchIcon /> MintWatch について
                            </VideoActionTabButton>
                        </div>
                        <div className="videoaction-content">
                            {videoActionModalState === "mylist" && (
                                <Mylist onClose={() => { }} videoInfo={videoInfo} />
                            )}
                            {videoActionModalState === "share" && (
                                <Share videoInfo={videoInfo} />
                            )}
                            {videoActionModalState === "ngcomments" && (
                                <NgComments />
                            )}
                            {(videoActionModalState === "help" || videoActionModalState === "whatsnew") && <MarkdownHelp contentKey={videoActionModalState}>
                                {videoActionModalState === "whatsnew" && <details>
                                    <summary>過去の更新情報</summary>
                                    <MarkdownHelp contentKey="whatsnew_archive" />
                                </details>}
                            </MarkdownHelp>}
                            {videoActionModalState === "shortcuts" && (
                                <KeyboardShortcuts />
                            )}
                            {videoActionModalState === "about" && (
                                <AboutMintWatch />
                            )}
                        </div>
                    </div>
                </div>
            </ReactFocusLock>
        </CSSTransition>
    );
}

function VideoActionTabButton({ stateKey, isBottom, children }: { stateKey: ReturnType<typeof useVideoActionModalStateContext>, isBottom?: boolean, children: ReactNode }) {
    const videoActionModalState = useVideoActionModalStateContext()
    const setVideoActionModalState = useSetVideoActionModalStateContext()
    return <button
        className={`videoaction-select ${isBottom ? "videoaction-select-bottom" : ""}`}
        onClick={() => {
            setVideoActionModalState(stateKey);
        }}
        data-is-active={
            videoActionModalState === stateKey ? "true" : "false"
        }
    >
        {children}
    </button>
}

function returnTitle(videoActionModalState: ReturnType<typeof useVideoActionModalStateContext>) {
    if (videoActionModalState === "help" || videoActionModalState === "shortcuts" || videoActionModalState === "whatsnew") return "ヘルプ"
    if (videoActionModalState === "about") return "MintWatch について"
    return "動画アクション"
}