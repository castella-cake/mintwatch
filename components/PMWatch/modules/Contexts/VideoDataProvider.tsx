import { createContext, createRef, ReactNode, RefObject } from "react";
import { useSmIdContext } from "../WatchDataContext";
import { VideoDataRootObject } from "@/types/VideoData";

const IActionTrackDataContext = createContext<string>("");

const VideoRefContext = createContext<RefObject<HTMLVideoElement>>(null!);
const IVideoRef = createRef<HTMLVideoElement>();

type VideoInfoContext = {
    videoInfo: VideoDataRootObject;
    errorInfo: any;
};
const IVideoInfoContext = createContext<VideoInfoContext>({
    videoInfo: null!,
    errorInfo: false,
});

export function VideoDataProvider({ children }: { children: ReactNode }) {
    const { smId } = useSmIdContext();

    const { videoInfo, errorInfo } = useVideoData(smId);
    const [actionTrackId, setActionTrackId] = useState("");

    const isEventFired = useRef<boolean>(false);

    useEffect(() => {
        const newActionTrackId = generateActionTrackId();
        setActionTrackId(newActionTrackId);
        document.dispatchEvent(
            new CustomEvent("actionTrackIdGenerated", {
                detail: newActionTrackId,
            }),
        );
        isEventFired.current = false;
    }, [smId]);

    useEffect(() => {
        if (
            videoInfo.meta?.status === 200 &&
            actionTrackId !== "" &&
            isEventFired.current !== true
        ) {
            document.dispatchEvent(
                new CustomEvent("pmw_videoInformationReady", {
                    detail: JSON.stringify({ videoInfo, actionTrackId }),
                }),
            );
            isEventFired.current = true;
        }
    }, [videoInfo]);

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
