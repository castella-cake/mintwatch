import Hls from "hls.js"
import { VideoDataRootObject } from "@/types/VideoData"
import { RefObject, useEffect, useState } from "react"

export function StatsOverlay({ videoInfo, hlsRef }: { videoInfo: VideoDataRootObject | undefined, hlsRef: RefObject<Hls>, videoRef: RefObject<HTMLVideoElement | null> }) {
    const [hlsLevel, setHlsLevel] = useState(hlsRef.current?.currentLevel || 0)

    useEffect(() => {
        if (!hlsRef.current) return
        hlsRef.current.on(Hls.Events.LEVEL_SWITCHED, () => {
            if (!hlsRef.current) return
            setHlsLevel(hlsRef.current.currentLevel)
        })
    }, [hlsRef.current])

    if (!videoInfo) return <div className="statsoverlay">動画情報が利用できません</div>
    const loudnessData = (videoInfo.data?.response.media.domand && videoInfo.data?.response.media.domand?.audios[0].loudnessCollection[0].value)
    return (
        <div className="statsoverlay">
            動画ID:
            {" "}
            {videoInfo.data?.response.video.id}
            <br />
            <br />
            現在のHLS再生クオリティ:
            {" "}
            { hlsRef.current && hlsRef.current?.levels[hlsLevel]
                ? (hlsLevel === -1
                        ? (
                                <>
                                    Lv
                                    {hlsLevel}
                                    {" "}
                                    Auto
                                </>
                            )
                        : (
                                <>
                                    Lv
                                    {" "}
                                    {hlsLevel}
                                    {" "}
                                    {hlsRef.current?.levels[hlsLevel].width}
                                    x
                                    {hlsRef.current?.levels[hlsLevel].height}
                                    {" "}
                                    {hlsRef.current?.levels[hlsLevel].frameRate}
                                    FPS
                                    <br />
                                    {hlsRef.current?.levels[hlsLevel].bitrate / 1000}
                                    kbps (max
                                    {hlsRef.current?.levels[hlsLevel].maxBitrate / 1000}
                                    {" "}
                                    / avg
                                    {hlsRef.current?.levels[hlsLevel].averageBitrate / 1000}
                                    )
                                </>
                            )
                    )
                : <>内部HLS無効</>}
            <br />
            <br />
            取得した動画クオリティ:
            {" "}
            <br />
            {videoInfo.data?.response.media.domand?.videos.map((elem) => {
                return (
                    <span key={`videoq-${elem.id}`}>
                        {`ID: ${elem.id} - ${elem.width}x${elem.height} (${elem.label} / ${elem.bitRate / 1000}kbps)`}
                        <br />
                    </span>
                )
            })}
            <br />
            取得した音声クオリティ:
            {" "}
            <br />
            {videoInfo.data?.response.media.domand?.audios.map((elem) => {
                return (
                    <span key={`audioq-${elem.id}`}>
                        {`ID: ${elem.id} - ${elem.bitRate / 1000}kbps / ${elem.samplingRate}Hz`}
                        <br />
                    </span>
                )
            })}
            <br />
            ラウドネスノーマライズ:
            {" "}
            {loudnessData ?? "不明"}
            <br />
            { loudnessData && `( Volume -${Math.floor(100 - loudnessData * 100)}%, ${scaleToDecibel(loudnessData)}dB )` }
        </div>
    )
}
