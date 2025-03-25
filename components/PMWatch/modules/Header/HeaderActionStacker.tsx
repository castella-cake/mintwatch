import {
    IconBell,
    IconCategory,
    IconX,
} from "@tabler/icons-react";
import ReactFocusLock from "react-focus-lock";
import { Dispatch, RefObject, SetStateAction } from "react";
import { useVideoInfoContext } from "../Contexts/VideoDataProvider";
import Notifications from "./Notifications";
import MyMenu from "./MyMenu";

export function HeaderActionStacker({
    onModalStateChanged,
    selectedType,
    nodeRef,
}: {
    onModalStateChanged: Dispatch<SetStateAction<"notifications" | "mymenu" | false>>;
    selectedType: "notifications" | "mymenu" | false;
    nodeRef: RefObject<HTMLDivElement | null>;
}) {
    const { videoInfo } = useVideoInfoContext();

    if (!videoInfo) return <></>;

    return (
        <ReactFocusLock>
            <div className="headeraction-modal-container" ref={nodeRef}>
                <div className="headeraction-modal-header global-flex">
                    <button
                        className="headeraction-select"
                        onClick={() => {
                            onModalStateChanged("notifications");
                        }}
                        is-active={
                            selectedType === "notifications" ? "true" : "false"
                        }
                    >
                        <IconBell/> お知らせ
                    </button>
                    <button
                        className="headeraction-select"
                        onClick={() => {
                            onModalStateChanged("mymenu");
                        }}
                        is-active={
                            selectedType === "mymenu" ? "true" : "false"
                        }
                    >
                        <IconCategory/> マイメニュー
                    </button>
                    <button
                        className="headeraction-modal-close"
                        onClick={() => {
                            onModalStateChanged(false);
                        }}
                    >
                        <IconX />
                    </button>
                </div>
                <div className="headeraction-content">
                    {selectedType === "notifications" && (
                        <Notifications />
                    )}
                    {selectedType === "mymenu" && (
                        <MyMenu />
                    )}
                </div>
            </div>
        </ReactFocusLock>
    );
}
