import {
    IconExclamationCircleFilled,
    IconTags,
} from "@tabler/icons-react"
import type { ErrorResponse } from "@/types/VideoData"
import { MouseEvent, useState } from "react"
import DOMPurify from "dompurify"
import HTMLReactParser from "html-react-parser"
import {
    useVideoInfoContext,
    useVideoRefContext,
} from "@/components/Global/Contexts/VideoDataProvider"
import OwnerInfo from "./Owner"
import UserFollowButton from "./UserFollowButton"
import Tags from "./Tags"
import VideoTitle from "./VideoTitle"

function htmlToText(htmlString: string) {
    const dummyDiv = document.createElement("div")
    dummyDiv.innerHTML = htmlString
    return dummyDiv.textContent || dummyDiv.innerText || ""
}

const reasonCodeLang = {
    INVALID_PARAMETER: "この動画は視聴できません",
    RIGHT_HOLDER_DELETE_VIDEO: "この動画は権利者の申し立てにより削除されたため視聴できません",
    HIDDEN_VIDEO: "この動画は非公開設定のため視聴できません",
    DOMESTIC_VIDEO: "現在のリージョン/ユーザーエージェントからは視聴できません(Domestic)",
    HIGH_RISK_COUNTRY_VIDEO: "現在のリージョン/ユーザーエージェントからは視聴できません(HighRiskCountry)",
    DELETED_CHANNEL_VIDEO: "チャンネルが閉鎖されたため視聴できません",
    ADMINISTRATOR_DELETE_VIDEO: "削除された動画のため視聴できません",
    HARMFUL_VIDEO: "センシティブな内容が含まれる可能性のある動画です",
}

function returnErrorMessage(errorResponse: ErrorResponse) {
    const reasonCode = errorResponse.reasonCode
    if (reasonCode === "HIDDEN_VIDEO" && errorResponse.publishScheduledAt) {
        return (
            <span>
                この動画は
                {new Date(errorResponse.publishScheduledAt).toLocaleString()}
                {" "}
                に公開されます
            </span>
        )
    } else if (reasonCode in reasonCodeLang) {
        return <span>{reasonCodeLang[reasonCode as keyof typeof reasonCodeLang]}</span>
    }
    return <span>この動画は視聴できません</span>
}

function ErrorUI({ error }: { error: any }) {
    if (!error.response || !error.response.data || !error.response.data.response)
        return (
            <div className="videoinfo-error-container">
                動画の取得に失敗しました
            </div>
        )
    const errorResponse: ErrorResponse = error.response.data.response
    return (
        <div className="videoinfo-container errorinfo-container">
            <div className="videoinfo-titlecontainer">
                <div className="videoinfo-titleinfo">
                    <div className="videotitle">
                        <IconExclamationCircleFilled />
                        <span>
                            {errorResponse.statusCode}
                            {" "}
                            {errorResponse.errorCode}
                            :
                            {" "}
                            {returnErrorMessage(errorResponse)}
                        </span>
                    </div>
                    {(errorResponse.reasonCode === "RIGHT_HOLDER_DELETE_VIDEO" && errorResponse.deletedMessage) ?? ""}
                    動画の取得に失敗しました。動画が削除されたか、サーバーに接続できなかった可能性があります。
                    削除動画→
                    <a href="https://www.nicovideo.jp/watch/sm38213757">
                        sm38213757
                    </a>
                </div>
            </div>
        </div>
    )
}

function LoadingUI({ isShinjukuLayout }: { isShinjukuLayout: boolean }) {
    return (
        <div className="videoinfo-container" id="pmw-videoinfo">
            <div className="videoinfo-titlecontainer">
                <div className="videoinfo-titleinfo">
                    {isShinjukuLayout && <div className="uploaddate"></div>}
                    <div className="videotitle-container">
                        <div className="videotitle">読み込み中</div>
                        {!isShinjukuLayout && (
                            <div className="videostats">
                                <span className="videostats-item">
                                    <span style={{ display: "inline-block", width: "3em", height: "1.5em" }}>
                                    </span>
                                </span>
                            </div>
                        )}
                    </div>
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
                    {!isShinjukuLayout && (
                        <button
                            className="tags-editbutton"
                            title="読み込み中"
                            aria-disabled={true}
                        >
                            <IconTags />
                            編集
                        </button>
                    )}

                </div>
            </div>
        </div>
    )
}

type Props = {
    isTitleShown: boolean
    isShinjukuLayout: boolean
}

function Info({ isShinjukuLayout, isTitleShown }: Props) {
    const { videoInfo, errorInfo } = useVideoInfoContext()
    const videoRef = useVideoRefContext()

    const {
        descriptionOpen,
    } = useStorageVar(["descriptionOpen"] as const, "local")
    const [isDescOpen, setIsDescOpen] = useState<boolean>(
        descriptionOpen || false,
    )
    if (errorInfo) return <ErrorUI error={errorInfo} />
    if (!videoInfo) return <LoadingUI isShinjukuLayout={isShinjukuLayout} />
    const videoInfoResponse = videoInfo.data.response

    // Not scary!
    const sanitizedDesc = DOMPurify.sanitize(
        videoInfoResponse.video.description || "",
    )
    const descElem = HTMLReactParser(sanitizedDesc)

    const handleAnchorClick = (e: MouseEvent<HTMLDivElement>) => {
        if (e.target instanceof Element) {
            const nearestAnchor: HTMLAnchorElement | null
                = e.target.closest("a")
            if (nearestAnchor && nearestAnchor.getAttribute("data-seektime")) {
                e.stopPropagation()
                e.preventDefault()
                if (videoRef.current) {
                    const seekTimeArray = nearestAnchor
                        .getAttribute("data-seektime")
                        ?.split(":")
                    // 反転して秒:分:時:日としていき、順に秒に直したらreduceですべて加算
                    const seekToTime = seekTimeArray
                        ?.reverse()
                        .map((time, index) => {
                            if (index === 0) return Number(time) // 秒
                            if (index <= 2) return Number(time) * (60 ^ index) // 分/時
                            return Number(time) * 172800 // 日
                        })
                        .reduce((prev, current) => prev + current)
                    if (seekToTime) videoRef.current.currentTime = seekToTime
                }
            }
        }
    }
    /* function ShareSelector() {
        return <select>
            <option value="x.com">X</option>
            {syncStorage.shareinstancelist && syncStorage.shareinstancelist.map((server: string, index: number) => {
                return <option key={`shareinstancelist-${index}`} value={server}>{server}</option>
            })}
        </select>
    } */

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
                            </strong>
                            {" "}
                            投稿の
                            {videoInfoResponse.channel ? "公式" : "ユーザー"}
                            動画
                            <span className="threeleader"> … </span>
                            <strong>
                                {videoInfoResponse.genre.isNotSet
                                    ? "未設定"
                                    : videoInfoResponse.genre.label}
                                {" "}
                            </strong>
                            カテゴリ
                            {videoInfoResponse.ranking.teiban
                                ? (
                                        <>
                                            (
                                            <strong>{videoInfoResponse.ranking.teiban.label}</strong>
                                            {" "}
                                            内現在順位:
                                            {videoInfoResponse.ranking.teiban.rank}
                                            位)
                                        </>
                                    )
                                : ""}
                        </div>
                    )}
                    {isTitleShown && <VideoTitle showStats={!isShinjukuLayout} />}
                </div>
                {!isShinjukuLayout && (
                    <>
                        {videoInfoResponse.owner && (
                            <OwnerInfo id={videoInfoResponse.owner.id} iconUrl={videoInfoResponse.owner.iconUrl} name={videoInfoResponse.owner.nickname}>
                                <UserFollowButton userId={videoInfoResponse.owner.id} />
                            </OwnerInfo>
                        )}
                        {videoInfoResponse.channel && (
                            <OwnerInfo id={videoInfoResponse.channel.id} iconUrl={videoInfoResponse.channel.thumbnail.smallUrl} name={videoInfoResponse.channel.name} isChannel />
                        )}
                    </>
                )}
            </div>
            {isShinjukuLayout && (
                <button
                    className="videoinfo-hjdesc-tabbutton"
                    onClick={() => {
                        setIsDescOpen(!isDescOpen)
                        storage.setItem(
                            "local:descriptionOpen",
                            !isDescOpen,
                        )
                    }}
                >
                    {isDescOpen ? "▲" : "▼"}
                    {" "}
                    動画概要
                </button>
            )}
            <details
                open={isDescOpen && true}
                onToggle={(e) => {
                    setIsDescOpen(e.currentTarget.open)
                    storage.setItem(
                        "local:descriptionOpen",
                        e.currentTarget.open,
                    )
                }}
            >
                <summary>
                    この動画の概要
                    {" "}
                    {!isDescOpen && <span>{htmlToText(sanitizedDesc)}</span>}
                </summary>
                <div
                    className="videodesc"
                    onClickCapture={(e) => {
                        handleAnchorClick(e)
                    }}
                >
                    {descElem}
                </div>
            </details>
            <Tags initialTagData={videoInfoResponse.tag} isShinjukuLayout={isShinjukuLayout} />
        </div>
    )
}

export default Info
