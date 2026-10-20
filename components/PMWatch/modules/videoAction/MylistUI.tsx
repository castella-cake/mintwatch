import { useVideoInfoContext } from "@/components/Global/Contexts/VideoDataProvider"
import { Mylists } from "../Mylists"

export function Mylist() {
    const { videoInfo } = useVideoInfoContext()
    if (!videoInfo?.video) return <></>
    const videoTitle = videoInfo.video.title
    return (
        <div className="mylists-container" id="pmw-mylists">
            <div className="mylists-title videoaction-actiontitle">
                視聴中の動画をマイリストに追加
                <br />
                <span className="mylists-title-addingtitle videoaction-actiontitle-subtitle">
                    <span className="mylist-title-addingtitle-videotitle">{videoTitle}</span>
                    {" "}
                    を追加します
                </span>
            </div>
            <Mylists smId={videoInfo.video.id} />
        </div>
    )
}
