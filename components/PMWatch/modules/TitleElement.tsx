import { useVideoInfoContext } from "@/components/Global/Contexts/VideoDataProvider"

export function TitleElement() {
    const { videoInfo } = useVideoInfoContext()
    return (
        <title>
            {`${videoInfo?.video?.title ?? "タイトル不明"} - ニコニコ動画`}
        </title>
    )
}
