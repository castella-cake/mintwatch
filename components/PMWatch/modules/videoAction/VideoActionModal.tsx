import {
    IconBubbleX,
    IconFolder,
    IconHelpCircle,
    IconShare,
    IconTags,
    IconX,
} from "@tabler/icons-react"
import ReactFocusLock from "react-focus-lock"
import { Mylist } from "./MylistUI"
import { ShareAction } from "./ShareUI"
import { ReactNode, RefObject } from "react"
import { useVideoInfoContext } from "@/components/Global/Contexts/VideoDataProvider"
import { CSSTransition } from "react-transition-group"
import { useSetMintConfigShownContext, useSetVideoActionModalStateContext, useVideoActionModalStateContext } from "@/components/Global/Contexts/ModalStateProvider"
import NgComments from "./NgComments"
import { TagInfo } from "./TagInfo"
import { MWButton } from "@/components/Global/MWButton"
import { useOutsideClose } from "@/hooks/useOutsideClose"

export function VideoActionModal({
    nodeRef,
}: {
    nodeRef: RefObject<HTMLDivElement | null>
}) {
    const containerRef = useRef<HTMLDivElement>(null)
    const { videoInfo } = useVideoInfoContext()

    const videoActionModalState = useVideoActionModalStateContext()
    const setVideoActionModalState = useSetVideoActionModalStateContext()
    const setIsMintConfigShown = useSetMintConfigShownContext()
    useOutsideClose(containerRef, videoActionModalState !== false, () => setVideoActionModalState(false))

    if (!videoInfo) return <></>

    return (
        <CSSTransition
            nodeRef={nodeRef}
            in={videoActionModalState !== false}
            timeout={300}
            unmountOnExit
            classNames="modal-transition"
        >
            <ReactFocusLock>
                <div className="modal-wrapper" ref={nodeRef}>
                    <div className="modal-container" ref={containerRef}>
                        <div className="modal-header global-flex">
                            <h2 className="global-flex1">
                                動画アクション
                            </h2>
                            <MWButton
                                className="modal-close"
                                onClick={() => {
                                    setVideoActionModalState(false)
                                }}
                                label="閉じる"
                            >
                                <IconX />
                            </MWButton>
                        </div>
                        <div className="modal-selector">
                            <div className="modal-select-separator">動画アクション</div>
                            <VideoActionTabButton
                                stateKey="mylist"
                            >
                                <IconFolder />
                                {" "}
                                マイリスト
                            </VideoActionTabButton>
                            <VideoActionTabButton
                                stateKey="share"
                            >
                                <IconShare />
                                {" "}
                                共有
                            </VideoActionTabButton>
                            <VideoActionTabButton
                                stateKey="ngcomments"
                            >
                                <IconBubbleX />
                                {" "}
                                NGコメント設定
                            </VideoActionTabButton>
                            <VideoActionTabButton
                                stateKey="taginfo"
                            >
                                <IconTags />
                                {" "}
                                この動画のタグ
                            </VideoActionTabButton>
                            <div className="modal-select-separator select-separator-bottom">ヘルプ</div>
                            <button
                                className="modal-select modal-select-bottom"
                                onClick={() => {
                                    setIsMintConfigShown("help")
                                    setVideoActionModalState(false)
                                }}
                            >
                                <IconHelpCircle />
                                {" "}
                                MintWatch ヘルプ
                            </button>
                        </div>
                        <div className="modal-content">
                            {videoActionModalState === "mylist" && (
                                <Mylist onClose={() => { }} videoInfo={videoInfo} />
                            )}
                            {videoActionModalState === "share" && (
                                <ShareAction videoInfo={videoInfo} />
                            )}
                            {videoActionModalState === "ngcomments" && (
                                <NgComments />
                            )}
                            {videoActionModalState === "taginfo" && (<TagInfo />)}
                        </div>
                    </div>
                </div>
            </ReactFocusLock>
        </CSSTransition>
    )
}

function VideoActionTabButton({ stateKey, isBottom, children }: { stateKey: ReturnType<typeof useVideoActionModalStateContext>, isBottom?: boolean, children: ReactNode }) {
    const videoActionModalState = useVideoActionModalStateContext()
    const setVideoActionModalState = useSetVideoActionModalStateContext()
    return (
        <button
            className={`modal-select ${isBottom ? "modal-select-bottom" : ""}`}
            onClick={() => {
                setVideoActionModalState(stateKey)
            }}
            data-is-active={
                videoActionModalState === stateKey ? "true" : "false"
            }
        >
            {children}
        </button>
    )
}
