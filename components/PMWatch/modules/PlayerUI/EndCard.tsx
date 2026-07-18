import { useEffect, useState } from "react"
import { SeriesVideoCard } from "@/components/Global/InfoCard"
import { useVideoInfoContext, useVideoRefContext } from "@/components/Global/Contexts/VideoDataProvider"
import { useRecommendData } from "@/hooks/apiHooks/watch/recommendData"
import { VideoItemCard } from "@/components/Global/ItemCard/VideoItemCard"
import { KokenScreen } from "./kokenScreen"

export function EndCard({ smId }: { smId: string }) {
    const videoRef = useVideoRefContext()
    const { videoInfo } = useVideoInfoContext()
    const recommendData = useRecommendData(smId)

    const [currentTime, setCurrentTime] = useState<number>(0)
    const [duration, setDuration] = useState<number>(Infinity)

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

    if (currentTime < duration) return null

    let ownerName = "非公開または退会済みユーザー"
    if (videoInfo && videoInfo.data && videoInfo.data.response.owner) ownerName = videoInfo.data.response.owner.nickname
    if (videoInfo && videoInfo.data && videoInfo.data.response.channel) ownerName = videoInfo.data.response.channel.name

    const seriesData = videoInfo?.data.response.series
    const playlist = btoa(
        `{"type":"series","context":{"seriesId":${(seriesData && seriesData.id) || 0}}}`,
    )
    const showSeriesRecommend = seriesData && videoInfo?.data.response.channel && videoInfo?.data.response.genre.key === "anime"

    // Firefox環境ではpreload済みのサムネイルを読み込まない(失敗する)
    const currentVideoThumbnailSrc = videoInfo && (import.meta.env.FIREFOX ? videoInfo.data.response.video.thumbnail.url : videoInfo.data.response.video.thumbnail.player)

    /* eslint no-irregular-whitespace: 0 */
    return (
        <div className="endcard-container global-flex">
            <div className="endcard-left">
                <KokenScreen smId={smId} />
            </div>
            <div className="endcard-right">
                <h2>現在の動画</h2>
                {videoInfo && (
                    <div className="endcard-currentvideo-container">
                        <img className="endcard-currentvideo-thumbnail" src={currentVideoThumbnailSrc} alt={`${videoInfo.data.response.video.title} のサムネイル`} />
                        <div className="endcard-currentvideo-text">
                            <strong className="endcard-currentvideo-title">{videoInfo.data.response.video.title}</strong>
                            <br />
                            <span className="endcard-currentvideo-owner">{ownerName}</span>
                        </div>
                    </div>
                )}
                { showSeriesRecommend
                    ? (
                            <>
                                <h2>次のエピソードを見る</h2>
                                <div className="endcard-upnext-container">
                                    { seriesData.video.next && (
                                        <SeriesVideoCard
                                            seriesVideoItem={seriesData.video.next}
                                            playlistString={playlist}
                                            transitionId={seriesData.id}
                                            type="next"
                                        />
                                    )}
                                    { seriesData.video.prev && (
                                        <SeriesVideoCard
                                            seriesVideoItem={seriesData.video.prev}
                                            playlistString={playlist}
                                            transitionId={seriesData.id}
                                            type="prev"
                                        />
                                    )}
                                </div>
                            </>
                        )
                    : (
                            <>
                                <h2>おすすめの動画</h2>
                                <div className="endcard-upnext-container">
                                    {recommendData && recommendData.data && recommendData.data.items.filter(item => isContentIsVideoItem(item) && !item.content.isMuted).slice(0, 4).map((elem) => {
                                        return <VideoItemCard key={`${elem.id}`} video={elem.content as VideoItem} layoutType="horizontal-simple" /> // filterで保証されているのでアサーションして通す
                                    })}
                                </div>
                            </>
                        )}
            </div>
        </div>
    )
}
