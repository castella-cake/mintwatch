import { VideoItemCard } from "@/components/Global/ItemCard/VideoItemCard"
import { LoadingFiller } from "@/components/Global/LoadingFiller"
import { useLocationContext } from "@/components/Router/RouterContext"
import { PageSelector } from "@/components/Global/PageSelector"
// import "../../styles/UserMylist.css"
import { IconAlertTriangle, IconCheck, IconPlayCard1, IconPlayerTrackNextFilled } from "@tabler/icons-react"
import { useUserMylistData } from "@/hooks/apiHooks/user/userMylistData"
import { useCopyMylistItems, useDeleteMylistItems, useMoveMylistItems } from "@/hooks/apiHooks/user/mylistItemOperations"
import { useItemSelection } from "@/hooks/useItemSelection"
import { useSetMessageContext } from "@/components/Global/Contexts/MessageProvider"
import { UserMylistHeader } from "./UserMylistHeader"
import { MylistItemActionBar } from "./MylistItemActionBar"
import { UserVideosOptionSelector } from "../../Video/UserVideosOptionSelector"
import { mylistSortKeys } from "./UserMylist"

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

    const copyMutation = useCopyMylistItems()
    const moveMutation = useMoveMylistItems()
    const deleteMutation = useDeleteMylistItems()

    const [selectedDestinationId, setSelectedDestinationId] = useState<number | null>(null)
    const isProcessing = copyMutation.isPending || moveMutation.isPending || deleteMutation.isPending
    const items = mylistData?.data.mylist.items ?? []
    const selection = useItemSelection(items, `${location.pathname}${location.search}`)
    const { showAlert, showToast } = useSetMessageContext()

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

    const moveItemIds = items.filter(item => selection.selected.has(item.watchId)).map(item => item.video.id)

    const handleDelete = () => {
        const count = selection.selected.size
        showAlert({
            title: "アイテムを削除",
            body: `${count} 件のアイテムを削除します。よろしいですか？`,
            customCloseButton: [
                { text: "キャンセル", key: "cancel" },
                { text: "削除する", key: "confirm", primary: true },
            ],
            onClose: (key) => {
                if (key === "confirm") {
                    deleteMutation.mutate({ mylistId: mylistId!, itemIds: Array.from(selection.selected) })
                    selection.clear()
                    setSelectedDestinationId(null)
                }
            },
        })
    }

    const handleMove = () => {
        if (selectedDestinationId === null) return
        moveMutation.mutate({ from: mylistId!, to: selectedDestinationId, itemIds: moveItemIds }, {
            onSuccess: (data) => {
                selection.clear()
                setSelectedDestinationId(null)
                const duplicated = data.data.duplicatedIds
                if (duplicated.length > 0) {
                    showAlert({
                        title: "一部の動画は移動できませんでした",
                        body: (
                            <>
                                移動先に既に存在するため、
                                {duplicated.length}
                                {" "}
                                件はスキップされました。
                                <br />
                                対象:
                                {" "}
                                <code>{duplicated.join(", ")}</code>
                            </>
                        ),
                        icon: <IconAlertTriangle />,
                    })
                } else {
                    showToast({ title: `${data.data.processedIds.length} 件を移動しました`, icon: <IconCheck /> })
                }
            },
            onError: error => showAlert({ title: "移動に失敗しました", body: String(error), icon: <IconAlertTriangle /> }),
        })
    }

    const handleCopy = () => {
        if (selectedDestinationId === null) return
        copyMutation.mutate({ from: mylistId!, to: selectedDestinationId, itemIds: moveItemIds }, {
            onSuccess: (data) => {
                selection.clear()
                setSelectedDestinationId(null)
                const duplicated = data.data.duplicatedIds
                if (duplicated.length > 0) {
                    showAlert({
                        title: "一部の動画はコピーできませんでした",
                        body: (
                            <>
                                移動先に既に存在するため、
                                {duplicated.length}
                                {" "}
                                件はスキップされました。
                                <br />
                                対象:
                                {" "}
                                <code>{duplicated.join(", ")}</code>
                            </>
                        ),
                        icon: <IconAlertTriangle />,
                    })
                } else {
                    showToast({ title: `${data.data.processedIds.length} 件をコピーしました`, icon: <IconCheck /> })
                }
            },
            onError: error => showAlert({ title: "コピーに失敗しました", body: String(error), icon: <IconAlertTriangle /> }),
        })
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
            <UserVideosOptionSelector sortKeys={mylistSortKeys}>
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
            </UserVideosOptionSelector>
            <MylistItemActionBar
                items={items.map(item => ({ watchId: item.watchId, videoId: item.video.id, title: item.video.title }))}
                selectedIds={selection.selected}
                onToggleOne={selection.toggleOne}
                onToggleAll={selection.toggleAll}
                allSelected={selection.allSelected}
                someSelected={selection.someSelected}
                currentSourceId={mylistId}
                selectedDestinationId={selectedDestinationId}
                onSelectDestination={setSelectedDestinationId}
                onMove={handleMove}
                onCopy={handleCopy}
                onDelete={handleDelete}
                isProcessing={isProcessing}
            />
            <div className="user-videolist-view-videos">
                {mylistData?.data.mylist.items.map(item => (
                    <div className="user-videolist-view-video" key={item.watchId}>
                        <input
                            type="checkbox"
                            className="user-videolist-view-checkbox"
                            checked={selection.selected.has(item.watchId)}
                            onChange={(e) => {
                                e.stopPropagation()
                                selection.toggleOne(item.watchId)
                            }}
                            disabled={isProcessing}
                        />
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
                            { item.description && (
                                <div className="user-videolist-view-video-listdata-description">
                                    {item.description}
                                </div>
                            )}
                            <div className="user-videolist-view-video-listdata-addedAt">
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
