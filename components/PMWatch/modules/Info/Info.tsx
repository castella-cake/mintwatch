import {
    IconClockHour4Filled,
    IconExclamationCircleFilled,
    IconFolderFilled,
    IconMessageFilled,
    IconPlayerPlayFilled,
} from "@tabler/icons-react";
import type { ErrorResponse } from "@/types/VideoData";
import { MouseEvent, ReactNode, useState } from "react";
import DOMPurify from "dompurify";
import HTMLReactParser from "html-react-parser";
import { readableInt } from "../commonFunction";
import { useStorageContext } from "@/hooks/extensionHook";
import {
    useVideoInfoContext,
    useVideoRefContext,
} from "@/components/Global/Contexts/VideoDataProvider";
import OwnerInfo from "./Owner";
import UserFollowButton from "./UserFollowButton";
import Tags from "./Tags";
function htmlToText(htmlString: string) {
    const dummyDiv = document.createElement("div");
    dummyDiv.innerHTML = htmlString;
    return dummyDiv.textContent || dummyDiv.innerText || "";
}

function ErrorUI({ error }: { error: any }) {
    if (!error.data || !error.data.response)
        return (
            <div className="videoinfo-error-container">
                動画の取得に失敗しました
            </div>
        );
    const errorResponse: ErrorResponse = error.data.response;
    return (
        <div className="videoinfo-container errorinfo-container">
            <div className="videoinfo-titlecontainer">
                <div className="videoinfo-titleinfo">
                    <div className="videotitle">
                        <IconExclamationCircleFilled />
                        {errorResponse.statusCode}: {errorResponse.reasonCode}
                    </div>
                    動画の取得に失敗しました。動画が削除されたか、サーバーに接続できなかった可能性があります。
                    削除動画→
                    <a href="https://www.nicovideo.jp/watch/sm38213757">
                        sm38213757
                    </a>
                </div>
            </div>
        </div>
    );
}

function LoadingUI({ isShinjukuLayout }: { isShinjukuLayout: boolean }) {
    return (
        <div className="videoinfo-container" id="pmw-videoinfo">
            <div className="videoinfo-titlecontainer">
                <div className="videoinfo-titleinfo">
                    {isShinjukuLayout && <div className="uploaddate"></div>}
                    <div className="videotitle">動画情報読み込み中</div>
                    {!isShinjukuLayout && (
                        <div className="videostats">
                            <span className="videostats-item">
                                <span
                                    style={{
                                        display: "inline-block",
                                        width: "3em",
                                    }}
                                ></span>
                            </span>
                            <span className="videostats-item">
                                <span
                                    style={{
                                        display: "inline-block",
                                        width: "3em",
                                    }}
                                ></span>
                            </span>
                            <span className="videostats-item">
                                <span
                                    style={{
                                        display: "inline-block",
                                        width: "3em",
                                    }}
                                ></span>
                            </span>
                            <span className="videostats-item">
                                <span
                                    style={{
                                        display: "inline-block",
                                        width: "3em",
                                    }}
                                ></span>
                            </span>
                            <span className="videostats-item">
                                <span
                                    style={{
                                        display: "inline-block",
                                        width: "3em",
                                    }}
                                ></span>
                            </span>
                        </div>
                    )}
                </div>
                {!isShinjukuLayout && <div className="videoinfo-owner"></div>}
            </div>
            <details>
                <summary>この動画の概要</summary>
                <div className="videodesc"></div>
            </details>
            <div className="tags-container">
                <div className="tags-title">
                    <span>登録タグ</span>
                </div>
            </div>
        </div>
    );
}

export function VideoTitle({ children, showStats }: { children?: ReactNode, showStats: boolean }) {
    const { videoInfo } = useVideoInfoContext();
    if (!videoInfo) return;
    const videoInfoResponse = videoInfo.data.response;
    return (
        <div className="videotitle-container">
            <div className="videotitle">{videoInfoResponse.video.title}</div>
            {showStats && (
                <div className="videostats">
                    <span className="videostats-item">
                        <IconClockHour4Filled />
                        <span>
                            {new Date(
                                videoInfoResponse.video.registeredAt,
                            ).toLocaleString("ja-JP")}
                        </span>
                    </span>
                    <span className="videostats-item">
                        <IconPlayerPlayFilled />
                        <span>
                            {readableInt(
                                videoInfoResponse.video.count.view,
                            )}
                        </span>
                    </span>
                    <span className="videostats-item">
                        <IconMessageFilled />
                        <span>
                            {readableInt(
                                videoInfoResponse.video.count.comment,
                            )}
                        </span>
                    </span>
                    <span className="videostats-item">
                        <IconFolderFilled />
                        <span>
                            {readableInt(
                                videoInfoResponse.video.count.mylist,
                            )}
                        </span>
                    </span>
                    <span className="videostats-item">
                        <span>
                            {videoInfoResponse.genre.isNotSet
                                ? "未設定"
                                : videoInfoResponse.genre.label}
                            {videoInfoResponse.ranking.teiban
                                ? <>
                                    (<strong>{videoInfoResponse.ranking.teiban.label}</strong> 内現在順位: {videoInfoResponse.ranking.teiban.rank}位)
                                </>
                                : ""}
                        </span>
                    </span>
                </div>
            )}
            { children }
        </div>
    );
}

type Props = {
    isTitleShown: boolean;
    isShinjukuLayout: boolean;
};

function Info({ isShinjukuLayout, isTitleShown }: Props) {
    const { videoInfo, errorInfo } = useVideoInfoContext();
    const videoRef = useVideoRefContext();

    const { localStorage, setLocalStorageValue } = useStorageContext();
    const localStorageRef = useRef<any>(null);
    localStorageRef.current = localStorage;
    function writePlayerSettings(
        name: string,
        value: any,
        silent: boolean = false,
    ) {
        setLocalStorageValue(
            "playersettings",
            { ...localStorageRef.current.playersettings, [name]: value },
            silent,
        );
    }
    const [isDescOpen, setIsDescOpen] = useState<boolean>(
        localStorage.playersettings.descriptionOpen || false,
    );
    if (errorInfo !== false) return <ErrorUI error={errorInfo} />;
    if (!videoInfo) return <LoadingUI isShinjukuLayout={isShinjukuLayout} />;
    const videoInfoResponse = videoInfo.data.response;

    // Not scary!
    const sanitizedDesc = DOMPurify.sanitize(
        videoInfoResponse.video.description || "",
    );
    const descElem = HTMLReactParser(sanitizedDesc);

    const handleAnchorClick = (e: MouseEvent<HTMLDivElement>) => {
        if (e.target instanceof Element) {
            const nearestAnchor: HTMLAnchorElement | null =
                e.target.closest("a");
            if (nearestAnchor && nearestAnchor.getAttribute("data-seektime")) {
                e.stopPropagation();
                e.preventDefault();
                if (videoRef.current) {
                    const seekTimeArray = nearestAnchor
                        .getAttribute("data-seektime")
                        ?.split(":");
                    // 反転して秒:分:時:日としていき、順に秒に直したらreduceですべて加算
                    const seekToTime = seekTimeArray
                        ?.reverse()
                        .map((time, index) => {
                            if (index === 0) return Number(time); // 秒
                            if (index <= 2) return Number(time) * (60 ^ index); // 分/時
                            return Number(time) * 172800; // 日
                        })
                        .reduce((prev, current) => prev + current);
                    if (seekToTime) videoRef.current.currentTime = seekToTime;
                }
            }
        }
    };
    /*function ShareSelector() {
        return <select>
            <option value="x.com">X</option>
            {syncStorage.shareinstancelist && syncStorage.shareinstancelist.map((server: string, index: number) => {
                return <option key={`shareinstancelist-${index}`} value={server}>{server}</option>
            })}
        </select>
    }*/

    return (
        <div className="videoinfo-container" id="pmw-videoinfo">
            <div className="videoinfo-titlecontainer">
                <div className="videoinfo-titleinfo">
                    {isShinjukuLayout && (
                        <div className="uploaddate">
                            <strong>
                                {new Date(
                                    videoInfoResponse.video.registeredAt,
                                ).toLocaleString("ja-JP")}
                            </strong>{" "}
                            投稿の
                            {videoInfoResponse.channel ? "公式" : "ユーザー"}
                            動画
                            <span className="threeleader"> … </span>
                            <strong>
                                {videoInfoResponse.genre.isNotSet
                                    ? "未設定"
                                    : videoInfoResponse.genre.label}{" "}
                            </strong>
                            カテゴリ
                            {videoInfoResponse.ranking.teiban
                                ? <>
                                    (<strong>{videoInfoResponse.ranking.teiban.label}</strong> 内現在順位: {videoInfoResponse.ranking.teiban.rank}位)
                                </>
                                : ""}
                        </div>
                    )}
                    {isTitleShown && <VideoTitle showStats={!isShinjukuLayout}/>}
                </div>
                {!isShinjukuLayout && (<>
                        {videoInfoResponse.owner && (
                            <OwnerInfo id={videoInfoResponse.owner.id} iconUrl={videoInfoResponse.owner.iconUrl} name={videoInfoResponse.owner.nickname}>
                                <UserFollowButton userId={videoInfoResponse.owner.id}/>
                            </OwnerInfo>
                        )}
                        {videoInfoResponse.channel && (
                            <OwnerInfo id={videoInfoResponse.channel.id} iconUrl={videoInfoResponse.channel.thumbnail.smallUrl} name={videoInfoResponse.channel.name} isChannel/>
                        )}
                    </>
                )}
            </div>
            {isShinjukuLayout && (
                <button
                    className="videoinfo-hjdesc-tabbutton"
                    onClick={(e) => {
                        setIsDescOpen(!isDescOpen);
                        writePlayerSettings(
                            "descriptionOpen",
                            !isDescOpen,
                            true,
                        );
                    }}
                >
                    {isDescOpen ? "▲" : "▼"} 動画概要
                </button>
            )}
            <details
                open={isDescOpen && true}
                onToggle={(e) => {
                    setIsDescOpen(e.currentTarget.open);
                    writePlayerSettings(
                        "descriptionOpen",
                        e.currentTarget.open,
                        true,
                    );
                }}
            >
                <summary>
                    この動画の概要{" "}
                    {!isDescOpen && <span>{htmlToText(sanitizedDesc)}</span>}
                </summary>
                <div
                    className="videodesc"
                    onClickCapture={(e) => {
                        handleAnchorClick(e);
                    }}
                >
                    {descElem}
                </div>
            </details>
            <Tags initialTagData={videoInfoResponse.tag} isShinjukuLayout={isShinjukuLayout}/>
        </div>
    );
}

export default Info;
