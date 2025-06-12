import { createContext, createRef, ReactNode, RefObject } from "react";
import { useSmIdContext } from "./WatchDataContext";
import { VideoDataRootObject } from "@/types/VideoData";
import { useSetBackgroundPlayInfoContext } from "./BackgroundPlayProvider";
import { useVideoDataQuery } from "@/hooks/apiHooks/watch/videoData";

const IActionTrackDataContext = createContext<string>("");

export const VideoRefContext = createContext<RefObject<HTMLVideoElement | null>>(createRef<HTMLVideoElement>());

type VideoInfoContext = {
    videoInfo: VideoDataRootObject | undefined;
    errorInfo: any;
};
const IVideoInfoContext = createContext<VideoInfoContext>({
    videoInfo: undefined,
    errorInfo: false,
});

export function VideoDataProvider({ children }: { children: ReactNode }) {
    const { smId } = useSmIdContext();

    const setBackgroundPlayInfo = useSetBackgroundPlayInfoContext()
    const { videoInfo, errorInfo } = useVideoDataQuery(smId);
    console.log(videoInfo)
    const [actionTrackId, setActionTrackId] = useState(generateActionTrackId());

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
