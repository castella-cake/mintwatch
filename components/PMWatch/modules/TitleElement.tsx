import { useVideoInfoContext } from "./Contexts/VideoDataProvider";

export function TitleElement() {
    const { videoInfo } = useVideoInfoContext();
    return <title>
        {`${videoInfo.data ? videoInfo.data.response.video.title : "タイトル不明"} - ニコニコ動画`}
    </title>
}
