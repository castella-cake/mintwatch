import { VideoDataRootObject } from "@/types/VideoData"
import { Mylists } from "../Mylists"

type Props = {
    onClose: () => void
    videoInfo: VideoDataRootObject
}

export function Mylist({ videoInfo }: Props) {
    const videoTitle = (videoInfo.data.response && videoInfo.data.response.video && videoInfo.data.response.video.title) ? videoInfo.data.response.video.title : "タイトル不明"
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
            <Mylists smId={videoInfo.data.response.video.id} />
        </div>
    )
}
