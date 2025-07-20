import { useEffect } from "react"
// import { useLang } from "../localizeHook";
import { Timeline } from "./Timeline"
import { useVideoInfoContext } from "@/components/Global/Contexts/VideoDataProvider"
import { wheelTranslator } from "../commonFunction"
import Recommend from "./Recommend"
import UserVideos from "./UserVideos"

function WatchNext({ enableWheelTranslate }: { enableWheelTranslate?: boolean }) {
    const { videoInfo } = useVideoInfoContext()
    const contentRef = useRef<HTMLDivElement>(null)

    const videoOwnerData = videoInfo?.data.response.owner
    // const lang = useLang()
    const [recommendDisplayType, setRecommendDisplayType]
        = useState<string>("recommend")

    useEffect(() => {
        if (!contentRef.current || !enableWheelTranslate) return
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
    }, [enableWheelTranslate, contentRef.current])

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
                    {recommendDisplayType === "recommend" && <Recommend />}
                    {recommendDisplayType === "userVideos" && <UserVideos videoOwnerData={videoOwnerData} />}
                    {recommendDisplayType === "timeline" && <Timeline />}
                </div>
            </div>
        </div>
    )
}

export default WatchNext
