import { createContext, createRef, ReactNode, RefObject } from "react";
import { useSmIdContext } from "../../PMWatch/modules/WatchDataContext";
import { VideoDataRootObject } from "@/types/VideoData";
import { useSetBackgroundPlayInfoContext } from "./BackgroundPlayProvider";

const IActionTrackDataContext = createContext<string>("");

export const VideoRefContext = createContext<RefObject<HTMLVideoElement | null>>(createRef<HTMLVideoElement>());

type VideoInfoContext = {
    videoInfo: VideoDataRootObject | null;
    errorInfo: any;
};
const IVideoInfoContext = createContext<VideoInfoContext>({
    videoInfo: null,
    errorInfo: false,
});

export function VideoDataProvider({ children }: { children: ReactNode }) {
    const { smId } = useSmIdContext();

    const setBackgroundPlayInfo = useSetBackgroundPlayInfoContext()
    const { videoInfo, errorInfo } = useVideoData(smId);
    const [actionTrackId, setActionTrackId] = useState("");

    useEffect(() => {
        const newActionTrackId = generateActionTrackId();
        setActionTrackId(newActionTrackId);
        document.dispatchEvent(
            new CustomEvent("pmw_actionTrackIdGenerated", {
                detail: newActionTrackId,
            }),
        );
    }, [smId]);

    useEffect(() => {
        if (
            videoInfo &&
            videoInfo.meta?.status === 200 &&
            actionTrackId !== ""
        ) {
            if (videoInfo.data.response.video) {
                setBackgroundPlayInfo({
                    title: videoInfo.data.response.video.title,
                    videoId: videoInfo.data.response.video.id,
                    thumbnailSrc: videoInfo.data.response.video.thumbnail.player
                })
            } else {
                setBackgroundPlayInfo({})
            }
            document.dispatchEvent(
                new CustomEvent("pmw_videoInformationReady", {
                    detail: JSON.stringify({ videoInfo, actionTrackId }),
                }),
            );
        }
    }, [videoInfo]);

    if ( !videoInfo ) return <IVideoInfoContext.Provider value={{ videoInfo: null, errorInfo }}>{children}</IVideoInfoContext.Provider>

    return (
        <IActionTrackDataContext.Provider value={actionTrackId}>
            <IVideoInfoContext.Provider value={{ videoInfo, errorInfo }}>
                {children}
            </IVideoInfoContext.Provider>
        </IActionTrackDataContext.Provider>
    );
}

export function useActionTrackDataContext() {
    return useContext(IActionTrackDataContext);
}

export function useVideoInfoContext() {
    return useContext(IVideoInfoContext);
}

export function useVideoRefContext() {
    return useContext(VideoRefContext);
}
