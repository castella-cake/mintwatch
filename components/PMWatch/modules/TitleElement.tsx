import { useVideoInfoContext } from "./Contexts/VideoDataProvider";

export function TitleElement() {
    const { videoInfo } = useVideoInfoContext();
    if (!videoInfo || !videoInfo.data || !videoInfo.data.response.video)
        return <></>;
    return <title>{videoInfo.data.response.video.title} - ニコニコ動画</title>;
}
