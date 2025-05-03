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
import { RefObject } from "react";
import { useVideoInfoContext } from "@/components/Global/Contexts/VideoDataProvider";
import MarkdownHelp from "./MarkdownHelp";
import KeyboardShortcuts from "./KeyboardShortcuts";
import { CSSTransition } from "react-transition-group";
import { useSetVideoActionModalStateContext, useVideoActionModalStateContext } from "@/components/Global/Contexts/ModalStateProvider";
import NgComments from "./NgComments";

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
                                {videoActionModalState === "help" || videoActionModalState === "shortcuts" || videoActionModalState === "whatsnew"
                                    ? "ヘルプ"
                                    : "動画アクション"}
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
                            <button
                                className="videoaction-select"
                                onClick={() => {
                                    setVideoActionModalState("mylist");
                                }}
                                is-active={
                                    videoActionModalState === "mylist" ? "true" : "false"
                                }
                            >
                                <IconFolder /> マイリスト
                            </button>
                            <button
                                className="videoaction-select"
                                onClick={() => {
                                    setVideoActionModalState("share");
                                }}
                                is-active={
                                    videoActionModalState === "share" ? "true" : "false"
                                }
                            >
                                <IconShare /> 共有
                            </button>
                            <button
                                className="videoaction-select"
                                onClick={() => {
                                    setVideoActionModalState("ngcomments");
                                }}
                                is-active={
                                    videoActionModalState === "ngcomments" ? "true" : "false"
                                }
                            >
                                <IconBubbleX/> NGコメント設定
                            </button>
                            <div className="videoaction-select-separator videoaction-select-separator-bottom">ヘルプ</div>
                            <button
                                className="videoaction-select videoaction-select-bottom"
                                onClick={() => {
                                    setVideoActionModalState("whatsnew");
                                }}
                                is-active={
                                    videoActionModalState === "whatsnew" ? "true" : "false"
                                }
                            >
                                <IconComet /> 更新情報
                            </button>
                            <button
                                className="videoaction-select videoaction-select-bottom"
                                onClick={() => {
                                    setVideoActionModalState("shortcuts");
                                }}
                                is-active={
                                    videoActionModalState === "shortcuts" ? "true" : "false"
                                }
                            >
                                <IconKeyboard /> ショートカット
                            </button>
                            <button
                                className="videoaction-select videoaction-select-bottom"
                                onClick={() => {
                                    setVideoActionModalState("help");
                                }}
                                is-active={
                                    videoActionModalState === "help" ? "true" : "false"
                                }
                            >
                                <IconHelpCircle /> はじめに
                            </button>
                        </div>
                        <div className="videoaction-content">
                            {videoActionModalState === "mylist" && (
                                <Mylist onClose={() => {}} videoInfo={videoInfo} />
                            )}
                            {videoActionModalState === "share" && (
                                <Share videoInfo={videoInfo} />
                            )}
                            {
                                videoActionModalState === "ngcomments" && (
                                    <NgComments/>
                                )
                            }
                            {(videoActionModalState === "help" || videoActionModalState === "whatsnew") && <MarkdownHelp contentKey={videoActionModalState}>
                                {videoActionModalState === "whatsnew" && <details>
                                    <summary>過去の更新情報</summary>
                                    <MarkdownHelp contentKey="whatsnew_archive"/>
                                </details>}
                            </MarkdownHelp>}
                            {videoActionModalState === "shortcuts" && <KeyboardShortcuts />}
                        </div>
                    </div>
                </div>
            </ReactFocusLock>
        </CSSTransition>
    );
}
