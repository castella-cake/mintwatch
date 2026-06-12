import { VideoItemCard } from "@/components/Global/ItemCard/VideoItemCard"
import { LoadingFiller } from "@/components/Global/LoadingFiller"
import { PageSelector } from "@/components/Global/PageSelector"
import { useLocationContext } from "@/components/Router/RouterContext"
import { useSeriesInfo } from "@/hooks/apiHooks/watch/seriesData"
import { IconPlayCard1, IconPlayerTrackNextFilled } from "@tabler/icons-react"

export function UserSeries() {
    // /user/<userId>/series/<mylistId>
    const location = useLocationContext()
    const pathSegments = location.pathname.split("/")
    const seriesIdStr = pathSegments[4]
    const seriesId = seriesIdStr ? Number.parseInt(seriesIdStr, 10) : undefined

    const searchParams = new URLSearchParams(location.search)
    const page = searchParams.get("page") || "1"

    const { seriesData, isLoading, error } = useSeriesInfo(seriesId, 100, parseInt(page, 10))

    if (!seriesId || Number.isNaN(seriesId)) {
        return (
            <div className="user-videolist-view">
                <div className="user-videolist-view-error">
                    <p>無効なシリーズIDです</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="user-videolist-view">
                <div className="user-videolist-view-error">
                    <p>シリーズの読み込み中にエラーが返されました</p>
                </div>
            </div>
        )
    }

    if (isLoading) {
        return <LoadingFiller />
    }

    const watchPlaylistQuery = new URLSearchParams()
    const playlistObject: playlistQueryData = {
        type: "series",
        context: {
            seriesId: seriesId,
        } as seriesContext,
    }
    const watchPlaylistString = btoa(JSON.stringify(playlistObject))
    watchPlaylistQuery.set("playlist", watchPlaylistString)

    const firstValidId = seriesData?.data.items.find(item => isValidVideoItem(item.video))?.video.id

    return (
        <div className="user-videolist-view user-series-view">
            <title>{`${seriesData ? `${seriesData?.data.detail.title}` : ""} - ニコニコ`}</title>
            <div className="user-videolist-view-information">
                <div className="user-videolist-view-information-thumbnail">
                    <img src={seriesData?.data.detail.thumbnailUrl} alt={`${seriesData?.data.detail.title} のサムネイル`} />
                </div>
                <div className="user-videolist-view-information-data">
                    <h2 className="user-videolist-view-title">{seriesData?.data.detail.title}</h2>
                    <div className="user-videolist-view-stats">
                        <div className="user-videolist-view-stat">
                            全
                            {" "}
                            <strong>{seriesData?.data.totalCount}</strong>
                            {" "}
                            件
                        </div>
                        <div className="user-videolist-view-stat">
                            {seriesData?.data.detail.isListed ? "公開" : "限定公開"}
                        </div>
                    </div>
                    { seriesData?.data.detail.description && (
                        <div className="user-videolist-view-description">
                            {seriesData.data.detail.description}
                        </div>
                    )}
                </div>
            </div>
            <div className="user-series-view-videos-options">
                {
                    firstValidId && (
                        <a className="user-videolist-view-playbutton" href={`https://www.nicovideo.jp/watch/${firstValidId}?${watchPlaylistQuery.toString()}`}>
                            <IconPlayerTrackNextFilled />
                            <span className="user-videolist-view-playbutton-text">連続再生</span>
                        </a>
                    )
                }
                <PageSelector pagination={{
                    page: parseInt(page),
                    totalCount: seriesData?.data.totalCount ?? 0,
                    pageSize: 100,
                    maxPage: Math.ceil((seriesData?.data.totalCount ?? 0) / 100),
                }}
                />
            </div>
            <div className="user-videolist-view-videos">
                {seriesData?.data.items.map(item => (
                    <VideoItemCard
                        key={item.video.id}
                        video={item.video}
                        customHref={`https://www.nicovideo.jp/watch/${item.video.id}?${watchPlaylistQuery.toString()}`}
                        externalVideoActionChildren={(
                            <a className="info-card-externalbutton" href={`https://www.nicovideo.jp/watch/${item.video.id}`} title="直接再生">
                                <IconPlayCard1 />
                            </a>
                        )}
                    />
                ))}
            </div>
            <PageSelector pagination={{
                page: parseInt(page),
                totalCount: seriesData?.data.totalCount ?? 0,
                pageSize: 100,
                maxPage: Math.ceil((seriesData?.data.totalCount ?? 0) / 100),
            }}
            />
        </div>
    )
}
