import { createContext, createRef, ReactNode, RefObject } from "react";
import { useSmIdContext } from "../WatchDataContext";
import { VideoDataRootObject } from "@/types/VideoData";

const IActionTrackDataContext = createContext<string>("");

const VideoRefContext = createContext<RefObject<HTMLVideoElement>>(null!);
const IVideoRef = createRef<HTMLVideoElement>();

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
            document.dispatchEvent(
                new CustomEvent("pmw_videoInformationReady", {
                    detail: JSON.stringify({ videoInfo, actionTrackId }),
                }),
            );
        }
    }, [videoInfo]);

    if ( !videoInfo ) return children

    return (
        <IActionTrackDataContext.Provider value={actionTrackId}>
            <IVideoInfoContext.Provider value={{ videoInfo, errorInfo }}>
                <VideoRefContext.Provider value={IVideoRef}>
                    {children}
                </VideoRefContext.Provider>
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
