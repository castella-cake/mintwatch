import { VideoItemCard } from "@/components/Global/ItemCard/VideoItemCard"
import { LoadingFiller } from "@/components/Global/LoadingFiller"
import { useLocationContext } from "@/components/Router/RouterContext"
import { UserMylistVideosOptionSelector } from "./UserMylistVideosOptionSelector"
import { PageSelector } from "@/components/Global/PageSelector"
// import "../../styles/UserMylist.css"
import { IconPlayCard1, IconPlayerTrackNextFilled } from "@tabler/icons-react"
import { useUserMylistData } from "@/hooks/apiHooks/user/userMylistData"

const validOrder = ["asc", "desc"]

export function UserMylistByMe() {
    // /my/mylist/<mylistId>
    const location = useLocationContext()
    const pathSegments = location.pathname.split("/")
    const mylistIdStr = pathSegments[3]
    const mylistId = mylistIdStr ? Number.parseInt(mylistIdStr, 10) : undefined

    const searchParams = new URLSearchParams(location.search)
    const page = searchParams.get("page") || "1"
    const sortKey = searchParams.get("sortKey") ?? undefined
    const sortOrder = validOrder.includes(searchParams.get("sortOrder") ?? "") ? searchParams.get("sortOrder") as "asc" | "desc" : undefined

    const { mylistData, isLoading, error } = useUserMylistData("me", mylistId, 100, parseInt(page, 10), sortKey, sortOrder)
    if (!mylistId || Number.isNaN(mylistId)) {
        return (
            <div className="user-mylist-item">
                <div className="user-mylist-item-error">
                    <p>無効なマイリストIDです</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="user-mylist-item">
                <div className="user-mylist-item-error">
                    <p>マイリストの読み込み中にエラーが返されました</p>
                </div>
            </div>
        )
    }

    if (isLoading) {
        return <LoadingFiller />
    }

    const watchPlaylistQuery = new URLSearchParams()
    const playlistObject: playlistQueryData = {
        type: "mylist",
        context: {
            mylistId: mylistId,
            sortKey: sortKey ?? "addedAt",
            sortOrder: sortOrder ?? "desc",
        } as mylistContext,
    }
    const watchPlaylistString = btoa(JSON.stringify(playlistObject))
    watchPlaylistQuery.set("playlist", watchPlaylistString)

    const firstValidId = mylistData?.data.mylist.items.find(item => item.status === "public" && isValidVideoItem(item.video))?.video.id

    return (
        <div className="user-mylist-item">
            <div className="user-mylist-item-information">
                <h2 className="user-mylist-item-title">{mylistData?.data.mylist.name}</h2>
                <div className="user-mylist-item-stats">
                    <div className="user-mylist-item-stat">
                        全
                        {" "}
                        <strong>{mylistData?.data.mylist.totalItemCount}</strong>
                        {" "}
                        件
                    </div>
                    <div className="user-mylist-item-stat">
                        {mylistData?.data.mylist.isPublic ? "公開" : "非公開"}
                    </div>
                    <div className="user-mylist-item-stat">
                        フォロワー
                        {" "}
                        <strong>{mylistData?.data.mylist.followerCount}</strong>
                    </div>
                </div>
                { mylistData?.data.mylist.description && (
                    <div className="user-mylist-item-description">
                        {mylistData?.data.mylist.description}
                    </div>
                )}
            </div>
            <UserMylistVideosOptionSelector>
                {
                    firstValidId && (
                        <a className="user-mylist-item-playbutton" href={`https://www.nicovideo.jp/watch/${firstValidId}?${watchPlaylistQuery.toString()}`}>
                            <IconPlayerTrackNextFilled />
                            <span className="user-mylist-item-playbutton-text">連続再生</span>
                        </a>
                    )
                }
                <PageSelector pagination={{
                    page: parseInt(page),
                    totalCount: mylistData?.data.mylist.totalItemCount ?? 0,
                    pageSize: 100,
                    maxPage: Math.ceil((mylistData?.data.mylist.totalItemCount ?? 0) / 100),
                }}
                />
            </UserMylistVideosOptionSelector>
            <div className="user-mylist-item-videos">
                {mylistData?.data.mylist.items.map(item => (
                    <div className="user-mylist-item-video" key={item.watchId}>
                        <VideoItemCard
                            video={item.video}
                            customHref={`https://www.nicovideo.jp/watch/${item.video.id}?${watchPlaylistQuery.toString()}`}
                            externalVideoActionChildren={(
                                <a className="info-card-externalbutton" href={`https://www.nicovideo.jp/watch/${item.video.id}`} title="直接再生">
                                    <IconPlayCard1 />
                                </a>
                            )}
                        />
                        <div className="user-mylist-item-video-mylistdata">
                            { item.description && (
                                <div className="user-mylist-item-video-mylistdata-description">
                                    {item.description}
                                </div>
                            )}
                            <div className="user-mylist-item-video-mylistdata-addedAt">
                                追加日時
                                {" "}
                                {new Date(item.addedAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <PageSelector pagination={{
                page: parseInt(page),
                totalCount: mylistData?.data.mylist.totalItemCount ?? 0,
                pageSize: 100,
                maxPage: Math.ceil((mylistData?.data.mylist.totalItemCount ?? 0) / 100),
            }}
            />
        </div>
    )
}
