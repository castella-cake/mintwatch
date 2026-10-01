import { useEffect, useState } from "react"
import { useVideoInfoContext } from "@/components/Global/Contexts/VideoDataProvider"
import UserFollowButton from "./Info/UserFollowButton"

const weekDay = ["日", "月", "火", "水", "木", "金", "土"]

function Clock() {
    const [clockString, setClockString] = useState<string>("")
    useEffect(() => {
        const interval = setInterval(() => {
            const date = new Date()
            setClockString(
                `${date.getMonth() + 1}/${date.getDate()} (${weekDay[date.getDay()]}) ${date.toLocaleTimeString("en-GB")}`,
            ) // en-GBは24時間表記で返す(hh:mm:ss)
        }, 500)
        return () => clearInterval(interval)
    }, [])
    return <div className="videostat-clock">{clockString}</div>
}

export function Stats() {
    const { videoInfo } = useVideoInfoContext()
    if (!videoInfo?.video) return <></>

    return (
        <div className="videostat-container" id="pmw-videostat">
            <div className="videostat-left-container">
                <div className="videostat-left-row">
                    <span className="videostat-left-row-label">再生</span>
                    <span className="videostat-left-row-separator">
                        ：
                    </span>
                    <span className="videostat-left-row-value">
                        {videoInfo.video.count.view.toLocaleString()}
                    </span>
                </div>
                <div className="videostat-left-row">
                    <span className="videostat-left-row-label">コメント</span>
                    <span className="videostat-left-row-separator">
                        ：
                    </span>
                    <span className="videostat-left-row-value">
                        {videoInfo.video.count.comment.toLocaleString()}
                    </span>
                </div>
                <div className="videostat-left-row">
                    <span className="videostat-left-row-label">マイリスト</span>
                    <span className="videostat-left-row-separator">
                        ：
                    </span>
                    <span className="videostat-left-row-value">
                        {videoInfo.video.count.mylist.toLocaleString()}
                    </span>
                </div>
            </div>
            <div className="videostat-right-container">
                <div className="videostat-right-top-dummy">
                    MintWatch Player
                </div>
                <Clock />
            </div>
        </div>
    )
}

export function Owner() {
    const { videoInfo } = useVideoInfoContext()
    if (!videoInfo?.owner) return <></>

    const iconUrl = returnVideoOwnerIcon(videoInfo.owner)

    return (
        <div className="videoowner-container" id="pmw-videoowner">
            <a
                href={`https://www.nicovideo.jp/user/${videoInfo.owner.id}`}
            >
                {iconUrl && (
                    <img src={iconUrl} />
                )}
                <div>
                    ユーザー:
                    {" "}
                    <br />
                    <span>{returnVideoOwnerName(videoInfo.owner)}</span>
                </div>
            </a>
            <UserFollowButton userId={videoInfo.owner.id} />
        </div>
    )
}

export function NicoHarajukuLogo() {
    return (
        <a href="https://www.nicovideo.jp/video_top" className="harajuku-logo">
            <img
                src="https://nicovideo.cdn.nimg.jp/web/img/base/head/logo/hrjk.png"
                alt="ニコニコ動画"
            />
        </a>
    )
}

export function RandomHidariueImg() {
    const [hidariueNumber] = useState(
        [0, 0, 0].map(() => Math.floor(Math.random() * 9)),
    )
    return (
        <img
            src={`https://resource.video.nimg.jp/web/img/base/head/icon/nico/${hidariueNumber.join("")}.gif`}
            alt="左上"
        />
    )
}
