import { useEffect } from "react"
// import { useLang } from "../localizeHook";
import { useVideoInfoContext } from "@/components/Global/Contexts/VideoDataProvider"
import Recommend from "./Recommend"
import UserVideos from "./UserVideos"
import { VideoActivities } from "@/components/Global/Activities/VideoActivities"

function WatchNext({ isHorizontalCardLayout }: { isHorizontalCardLayout?: boolean }) {
    const { videoInfo } = useVideoInfoContext()
    const contentRef = useRef<HTMLDivElement>(null)

    const videoOwnerData = videoInfo?.data.response.owner
    // const lang = useLang()
    const [recommendDisplayType, setRecommendDisplayType]
        = useState<string>("recommend")

    useEffect(() => {
        if (!contentRef.current || !isHorizontalCardLayout) return
        contentRef.current?.addEventListener(
            "wheel",
            wheelTranslator,
            { passive: false },
        )
        return () => {
            contentRef.current?.removeEventListener(
                "wheel",
                wheelTranslator,
            )
        }
    }, [isHorizontalCardLayout, contentRef.current])

    return (
        <div className="watchnext-wrapper">
            <div className="watchnext-container" id="pmw-watchnext">
                <div className="watchnext-selector">
                    <button
                        data-active={recommendDisplayType === "recommend"}
                        onClick={() => setRecommendDisplayType("recommend")}
                    >
                        おすすめ
                    </button>
                    <button
                        data-active={recommendDisplayType === "timeline"}
                        onClick={() => setRecommendDisplayType("timeline")}
                    >
                        フォロー新着
                    </button>
                    {videoOwnerData && videoOwnerData.nickname && (
                        <button
                            data-active={recommendDisplayType === "userVideos"}
                            onClick={() => setRecommendDisplayType("userVideos")}
                        >
                            {videoOwnerData.nickname}
                            {" "}
                            の投稿動画
                        </button>
                    )}
                </div>
                <div className="watchnext-content" ref={contentRef}>
                    {recommendDisplayType === "recommend" && <Recommend isHorizontalCardLayout={isHorizontalCardLayout} />}
                    {recommendDisplayType === "userVideos" && <UserVideos videoOwnerData={videoOwnerData} isHorizontalCardLayout={isHorizontalCardLayout} />}
                    {recommendDisplayType === "timeline" && <VideoActivities />}
                </div>
            </div>
        </div>
    )
}

export default WatchNext
