import { VideoItemCard } from "@/components/Global/ItemCard/VideoItemCard"
import { LoadingFiller } from "@/components/Global/LoadingFiller"
import { useLocationContext } from "@/components/Router/RouterContext"
import { UserMylistVideosOptionSelector } from "./UserMylistVideosOptionSelector"
import { PageSelector } from "@/components/Global/PageSelector"
// import "../../styles/UserMylist.css"
import { IconPlayCard1, IconPlayerTrackNextFilled } from "@tabler/icons-react"
import { useUserMylistData } from "@/hooks/apiHooks/user/userMylistData"
import { UserMylistHeader } from "./UserMylistHeader"

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
            <div className="user-videolist-view user-mylist-item">
                <div className="user-videolist-view-error">
                    <p>無効なマイリストIDです</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="user-videolist-view user-mylist-item">
                <div className="user-videolist-view-error">
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
        <div className="user-videolist-view user-mylist-view">
            <title>{`マイページ ${mylistData ? `${mylistData?.data.mylist.name}` : ""} - ニコニコ`}</title>
            <UserMylistHeader mylistData={mylistData} />
            <UserMylistVideosOptionSelector>
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
                    totalCount: mylistData?.data.mylist.totalItemCount ?? 0,
                    pageSize: 100,
                    maxPage: Math.ceil((mylistData?.data.mylist.totalItemCount ?? 0) / 100),
                }}
                />
            </UserMylistVideosOptionSelector>
            <div className="user-videolist-view-videos">
                {mylistData?.data.mylist.items.map(item => (
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
                        <div className="user-videolist-view-video-mylistdata">
                            { item.description && (
                                <div className="user-videolist-view-video-mylistdata-description">
                                    {item.description}
                                </div>
                            )}
                            <div className="user-videolist-view-video-mylistdata-addedAt">
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
