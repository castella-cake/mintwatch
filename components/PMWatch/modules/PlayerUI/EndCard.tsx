import { useEffect, useState } from "react";
import { PickupSupportersRootObject } from "@/types/pickupSupportersData";
import { InfoCard, SeriesVideoCard } from "../Info/InfoCards";
import { useVideoInfoContext, useVideoRefContext } from "@/components/Global/Contexts/VideoDataProvider";

export function EndCard({ smId }: { smId: string }) {
    const videoRef = useVideoRefContext()
    const { videoInfo } = useVideoInfoContext()
    const recommendData = useRecommendData(smId)
    const { localStorage, syncStorage } = useStorageContext()
    const [supportersInfo, setSupportersInfo] = useState<PickupSupportersRootObject | null>(null)
    const [currentTime, setCurrentTime] = useState<number>(0)
    const [duration, setDuration] = useState<number>(Infinity)

    const audioElemRef = useRef<HTMLAudioElement>(null)
    useEffect(() => {
        async function getData() {
            if (!videoInfo) return
            const response = await getPickupSupporters(videoInfo.data.response.video.id, 10)
            if (response) setSupportersInfo(response)
        }
        getData()
    }, [videoInfo])

    useEffect(() => {
        if (!videoRef.current) return
        const onTimeUpdate = () => {
            if (videoRef.current) setCurrentTime(videoRef.current.currentTime)
        }
        const onDurationChange = () => {
            if (videoRef.current) setDuration(videoRef.current.duration)
        }
        videoRef.current.addEventListener("timeupdate", onTimeUpdate)
        videoRef.current.addEventListener("durationchange", onDurationChange)
    }, [videoRef.current])

    useEffect(() => {
        //console.log("vol set:", audioElemRef.current)
        if (!audioElemRef.current) return

        audioElemRef.current.volume = (localStorage.playersettings.volume ?? 50) * 0.01
        audioElemRef.current.muted = localStorage.playersettings.isMuted ?? false
        
    }, [localStorage.playersettings, audioElemRef.current, currentTime])

    if (currentTime < duration) return null

    let ownerName = "非公開または退会済みユーザー"
    if (videoInfo && videoInfo.data && videoInfo.data.response.owner) ownerName = videoInfo.data.response.owner.nickname
    if (videoInfo && videoInfo.data && videoInfo.data.response.channel) ownerName = videoInfo.data.response.channel.name

    const isKokenMuted = syncStorage.muteKokenVoice ?? getDefault("muteKokenVoice")

    const seriesData = videoInfo?.data.response.series;
    const playlist = btoa(
        `{"type":"series","context":{"seriesId":${(seriesData && seriesData.id) || 0}}}`,
    );
    const showSeriesRecommend = seriesData && videoInfo?.data.response.channel && videoInfo?.data.response.genre.key === "anime"

    return <div className="endcard-container global-flex">
        <div className="endcard-left">
            <div className="endcard-supporters">
            {supportersInfo?.data && supportersInfo?.data.supporters && <span className="endcard-title">提　供</span>}<br/><br/>
            {supportersInfo?.data && supportersInfo?.data.supporters.map((elem,index) => {
                return <span key={`${elem.supporterName}-${elem.userId}-${elem.contribution}`}>
                    {elem.supporterName}<br/>
                </span>
            })}
            </div>
            { supportersInfo?.data && !isKokenMuted && <audio autoPlay src={supportersInfo?.data.voiceUrl} ref={audioElemRef}/> }
        </div>
        <div className="endcard-right">
            <h2>現在の動画</h2>
            {videoInfo && <div className="endcard-currentvideo-container">
                <img src={videoInfo.data.response.video.thumbnail.url}></img>
                <div className="endcard-currentvideo-text">
                    <strong>{videoInfo.data.response.video.title}</strong><br/>
                    <span>{ownerName}</span>
                </div>
            </div>}
            { showSeriesRecommend ? <>
                <h2>次のエピソードを見る</h2>
                <div className="endcard-upnext-container">
                    { seriesData.video.next && <SeriesVideoCard
                        seriesVideoItem={seriesData.video.next}
                        playlistString={playlist}
                        transitionId={seriesData.id}
                        type={"next"}
                    />}
                    { seriesData.video.prev && <SeriesVideoCard
                        seriesVideoItem={seriesData.video.prev}
                        playlistString={playlist}
                        transitionId={seriesData.id}
                        type={"prev"}
                    />}
                </div>
            </> : <>
                <h2>おすすめの動画</h2>
                <div className="endcard-upnext-container">
                    {recommendData && recommendData.data && recommendData.data.items.slice(0,4).map((elem, index) => {
                        return <InfoCard key={`${elem.id}`} obj={elem}/>
                    })}
                </div>
            </>}
        </div>
    </div>
}