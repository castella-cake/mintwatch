import { VideoItemCard } from "@/components/Global/ItemCard/VideoItemCard"
import { useWatchLaterData } from "@/hooks/apiHooks/user/watchLaterData"
import { useLocationContext } from "@/components/Router/RouterContext"
import { IconAlertTriangle, IconCheck, IconPlayCard1, IconPlayerTrackNextFilled } from "@tabler/icons-react"
import { PageSelector } from "@/components/Global/PageSelector"
import { useCopyMylistItems, useDeleteWatchLaterItems, useMoveMylistItems } from "@/hooks/apiHooks/user/mylistItemOperations"
import { useItemSelection } from "@/hooks/useItemSelection"
import { useSetMessageContext } from "@/components/Global/Contexts/MessageProvider"
import { MylistItemActionBar } from "../UserVideoLists/Mylist/MylistItemActionBar"
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
    const location = useLocationContext()
    const searchParams = new URLSearchParams(location.search)
    const page = searchParams.get("page") || "1"
    const sortKey = searchParams.get("sortKey") ?? undefined
    const sortOrder = validOrder.includes(searchParams.get("sortOrder") ?? "") ? searchParams.get("sortOrder") as "asc" | "desc" : undefined

    const { watchLaterData } = useWatchLaterData(sortKey ?? "addedAt", sortOrder ?? "desc", 20, parseInt(page))

    const copyMutation = useCopyMylistItems()
    const moveMutation = useMoveMylistItems()
    const deleteMutation = useDeleteWatchLaterItems()

    const [selectedDestinationId, setSelectedDestinationId] = useState<number | null>(null)
    const isProcessing = copyMutation.isPending || moveMutation.isPending || deleteMutation.isPending
    const items = watchLaterData?.data.watchLater.items ?? []
    const selection = useItemSelection(items, `${location.pathname}${location.search}`)
    const { showAlert, showToast } = useSetMessageContext()

    const firstValidId = watchLaterData?.data.watchLater.items.find(item => item.status === "public" && isValidVideoItem(item.video))?.video.id

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
                    deleteMutation.mutate({ itemIds: Array.from(selection.selected) })
                    selection.clear()
                    setSelectedDestinationId(null)
                }
            },
        })
    }

    const handleMove = () => {
        if (selectedDestinationId === null) return
        moveMutation.mutate({ from: "deflist", to: selectedDestinationId, itemIds: moveItemIds }, {
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
        copyMutation.mutate({ from: "deflist", to: selectedDestinationId, itemIds: moveItemIds }, {
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
                <MylistItemActionBar
                    items={items.map(item => ({ watchId: item.watchId, videoId: item.video.id, title: item.video.title }))}
                    selectedIds={selection.selected}
                    onToggleOne={selection.toggleOne}
                    onToggleAll={selection.toggleAll}
                    allSelected={selection.allSelected}
                    someSelected={selection.someSelected}
                    currentSourceId="deflist"
                    selectedDestinationId={selectedDestinationId}
                    onSelectDestination={setSelectedDestinationId}
                    onMove={handleMove}
                    onCopy={handleCopy}
                    onDelete={handleDelete}
                    isProcessing={isProcessing}
                />
                <div className="user-videos-items">
                    {watchLaterData && watchLaterData.data.watchLater.items.map((item) => {
                        return (
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
