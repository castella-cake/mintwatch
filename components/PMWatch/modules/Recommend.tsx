import { useEffect } from "react";
//import { useLang } from "../localizeHook";
import { InfoCard } from "./InfoCards";
import { UserVideoData } from "@/types/UserVideoData";
import { Timeline } from "./Timeline";
import { useRecommendContext } from "./Contexts/RecommendProvider";
import { useVideoInfoContext } from "./Contexts/VideoDataProvider";
import { wheelTranslator } from "./commonFunction";

function Recommend({ enableWheelTranslate }: { enableWheelTranslate?: boolean }) {
    const { videoInfo } = useVideoInfoContext();
    const contentRef = useRef<HTMLDivElement>(null)
    const recommendData = useRecommendContext();

    const videoOwnerData = videoInfo.data?.response.owner;
    //const lang = useLang()
    const [recommendDisplayType, setRecommendDisplayType] =
        useState<string>("recommend");
    const [userVideos, setUserVideos] = useState<UserVideoData | null>(null);

    useEffect(() => {
        if (!contentRef.current || !enableWheelTranslate) return
        contentRef.current?.addEventListener(
            "wheel",
            wheelTranslator,
            { passive: false },
        );
        contentRef.current?.addEventListener(
            "wheel",
            wheelTranslator,
            { passive: false },
        );
        return () => {
            contentRef.current?.removeEventListener(
                "wheel",
                wheelTranslator,
            );
            contentRef.current?.removeEventListener(
                "wheel",
                wheelTranslator,
            );
        };
    });

    useEffect(() => {
        // 今は要素が利用可能であるということだけを伝えます
        if (recommendData.data)
            document.dispatchEvent(
                new CustomEvent("pmw_recommendReady", { detail: "" }),
            ); // JSON.stringify({ recommendData: recommendResponse })
    }, [recommendData]);

    useEffect(() => {
        async function getUserVideoData() {
            if (!videoOwnerData) return;
            const response: UserVideoData = await getUserVideo(
                videoOwnerData.id,
                "registeredAt",
                "asc",
            );
            if (response.meta.status === 200) setUserVideos(response);
        }
        if (recommendDisplayType === "userVideos") {
            getUserVideoData();
        }
    }, [recommendDisplayType, videoOwnerData]);
    if (!recommendData.data)
        return (
            <div className="recommend-wrapper">
                <div className="recommend-container" id="pmw-recommend">
                    レコメンド取得中
                </div>
            </div>
        );
    return (
        <div className="recommend-wrapper">
            <div className="recommend-container" id="pmw-recommend">
                <div className="recommend-selector">
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
                            onClick={() =>
                                setRecommendDisplayType("userVideos")
                            }
                        >
                            {videoOwnerData.nickname} の投稿動画
                        </button>
                    )}
                </div>
                <div className="recommend-content" ref={contentRef}>
                    {recommendDisplayType === "recommend" &&
                        recommendData.data.items.map((elem, index) => {
                            return (
                                <InfoCard
                                    key={`recommend-${elem.id}`}
                                    obj={elem}
                                />
                            );
                        })}
                    {recommendDisplayType === "userVideos" &&
                        userVideos &&
                        userVideos.data.items.map((item) => {
                            return (
                                <InfoCard
                                    key={`userVideos-${item.essential.id}`}
                                    obj={{
                                        id: item.essential.id,
                                        contentType: "video",
                                        recommendType: "",
                                        content: { ...item.essential },
                                    }}
                                />
                            );
                        })}
                    {recommendDisplayType === "timeline" && <Timeline />}
                </div>
            </div>
        </div>
    );
}

export default Recommend;
