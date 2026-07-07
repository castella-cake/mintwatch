import { VideoItemCard } from "@/components/Global/ItemCard/VideoItemCard"
import { useWatchLaterData } from "@/hooks/apiHooks/user/watchLaterData"
import { IconPlayCard1, IconPlayerTrackNextFilled } from "@tabler/icons-react"
import { PageSelector } from "@/components/Global/PageSelector"
import { UserVideosOptionSelector } from "../Video/UserVideosOptionSelector"

const watchLaterSortKeys = [
    {
        label: "登録日時",
        value: "addedAt",
        default: true,
    },
    {
        label: "投稿日時",
        value: "registeredAt",
    },
    {
        label: "メモ",
        value: "memo",
    },
    {
        label: "再生数",
        value: "viewCount",
    },
    {
        label: "最終コメント日時",
        value: "lastCommentTime",
    },
    {
        label: "コメント数",
        value: "commentCount",
    },
    {
        label: "いいね！数",
        value: "likeCount",
    },
    {
        label: "マイリスト数",
        value: "mylistCount",
    },
    {
        label: "動画時間",
        value: "duration",
    },
]

const validOrder = ["asc", "desc"]

export function WatchLater() {
    const searchParams = new URLSearchParams(location.search)
    const page = searchParams.get("page") || "1"
    const sortKey = searchParams.get("sortKey") ?? undefined
    const sortOrder = validOrder.includes(searchParams.get("sortOrder") ?? "") ? searchParams.get("sortOrder") as "asc" | "desc" : undefined

    const { watchLaterData } = useWatchLaterData(sortKey ?? "addedAt", sortOrder ?? "desc", 20, parseInt(page))

    const firstValidId = watchLaterData?.data.watchLater.items.find(item => item.status === "public" && isValidVideoItem(item.video))?.video.id

    const watchPlaylistQuery = new URLSearchParams()
    const playlistObject: playlistQueryData = {
        type: "watchlater",
        context: {
            sortKey: sortKey ?? "addedAt",
            sortOrder: sortOrder ?? "desc",
        } as mylistContext,
    }
    const watchPlaylistString = btoa(JSON.stringify(playlistObject))
    watchPlaylistQuery.set("playlist", watchPlaylistString)

    return (
        <div className="watch-later-content user-category-content">
            <div className="user-videolist-view">
                <div className="user-videos-title">
                    <strong>
                        あとで見る
                    </strong>
                    {" "}
                    (
                    {watchLaterData?.data.watchLater.totalCount ?? 0}
                    )
                </div>
                <UserVideosOptionSelector sortKeys={watchLaterSortKeys}>
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
                        totalCount: watchLaterData?.data.watchLater.totalCount ?? 0,
                        pageSize: 20,
                        maxPage: Math.ceil((watchLaterData?.data.watchLater.totalCount ?? 0) / 20),
                    }}
                    />
                </UserVideosOptionSelector>
                <div className="user-videos-items">
                    {watchLaterData && watchLaterData.data.watchLater.items.map((item) => {
                        return (
                            <div className="user-videolist-view-video" key={item.watchId}>
                                <VideoItemCard
                                    video={item.video}
                                    customHref={`https://www.nicovideo.jp/watch/${item.video.id}?${watchPlaylistQuery.toString()}`}
                                    externalVideoActionChildren={(
                                        <a className="info-card-externalbutton" href={`https://www.nicovideo.jp/watch/${item.video.id}`} title="直接再生">
                                            <IconPlayCard1 />
                                        </a>
                                    )}
                                />
                                <div className="user-videolist-view-video-listdata">
                                    { item.memo && (
                                        <div className="user-videolist-view-video-listdata-description">
                                            {item.memo}
                                        </div>
                                    )}
                                    <div className="user-videolist-view-video-listdata-addedAt">
                                        追加日時
                                        {" "}
                                        {new Date(item.addedAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
