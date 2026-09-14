import { useSetMessageContext } from "@/components/Global/Contexts/MessageProvider"
import { useMylistsData } from "@/hooks/apiHooks/watch/mylistsData"
import APIError from "@/utils/classes/APIError"
import { IconAlertTriangle, IconCheck, IconCircleX, IconClock, IconFolder, IconLock, IconWorld } from "@tabler/icons-react"

export function Mylists({ smId, compact = false, limit = Infinity, showMoreButton, onMoreButtonClick }: { smId: string, compact?: boolean, limit?: number, showMoreButton?: boolean, onMoreButtonClick?: (e: React.MouseEvent) => void }) {
    const { showToast, showAlert } = useSetMessageContext()

    const [isWatchLaterAdding, setIsWatchLaterAdding] = useState(false)
    const [isWatchLaterAdded, setIsWatchLaterAdded] = useState(false)

    const handleAddToWatchLater = async () => {
        if (isWatchLaterAdding) return

        setIsWatchLaterAdding(true)
        try {
            await addToWatchLater(smId)
            setIsWatchLaterAdded(true)
            showToast({
                title: "あとで見るに追加しました",
                icon: <IconCheck />,
            })
        } catch (error) {
            console.error("Failed to add to watch later:", error)
            if (error instanceof APIError && error.response.meta.status === 409) {
                showToast({
                    icon: <IconCircleX />,
                    title: "この動画は既に追加済みです",
                })
                setIsWatchLaterAdded(true)
            } else {
                showAlert({
                    icon: <IconCircleX />,
                    title: "あとで見るへの追加に失敗しました",
                    body: "追加上限を超えていないか確認してください。それでも追加できない場合は、時間を置いて再度お試しください。",
                })
                setIsWatchLaterAdding(false)
            }
        }
    }

    const { mylistsData, mutateMylistsAddItem } = useMylistsData()
    const [addedMylists, setAddedMylists] = useState<number[]>([])

    async function onAddToMylist(mylistId: number, itemId: string) {
        const mutationResult = await mutateMylistsAddItem.mutateAsync({ mylistId, itemId, requestWith: location.href })
        if (mutationResult.response.meta.status === 201) {
            showToast({
                title: "マイリストに追加しました",
                icon: <IconCheck />,
            })
            setAddedMylists(current => [...current, mylistId])
        } else if (mutationResult.response.meta.status === 200) {
            showAlert({
                title: "マイリストに追加できませんでした",
                body: "既にこのマイリストには追加済みです。",
                icon: <IconAlertTriangle />,
            })
        } else {
            showAlert({
                title: "マイリストの追加中にエラーが発生しました",
                body: `不明なエラーがサーバーから返されました。ステータスコードは ${mutationResult.response.meta.status} でした。`,
                icon: <IconAlertTriangle />,
            })
        }
    }

    return (
        <div className="mylist-item-container" data-is-compact={compact}>
            <button
                className="mylist-item mylist-item-watchlater"
                onClick={handleAddToWatchLater}
                data-added={isWatchLaterAdded}
                data-is-loading={isWatchLaterAdding}
            >
                <div className="mylist-title">
                    <span className="mylist-title-state">
                        {
                            isWatchLaterAdded ? <IconCheck /> : <IconClock />
                        }
                    </span>
                    {isWatchLaterAdded && <strong className="mylist-title-added">追加済み</strong>}
                    <span className="mylist-title-name">
                        あとで見る
                    </span>
                </div>
            </button>
            {
                mylistsData
                    ? mylistsData.data.mylists.slice(0, limit).map((mylist) => {
                            return (
                                <button
                                    key={mylist.id}
                                    className="mylist-item"
                                    onClick={() => {
                                        if (!addedMylists.includes(mylist.id)) onAddToMylist(mylist.id, smId)
                                    }}
                                    data-added={addedMylists.includes(mylist.id)}
                                >
                                    <div className="mylist-title">
                                        <span className="mylist-title-state" title={mylist.isPublic ? "公開のマイリスト" : "非公開のマイリスト"}>{mylist.isPublic ? <IconWorld /> : <IconLock />}</span>
                                        <span className="mylist-title-name">{mylist.name}</span>
                                    </div>
                                    <div className="mylist-description">
                                        {addedMylists.includes(mylist.id) && (
                                            <strong className="mylist-description-added">
                                                <IconCheck />
                                                {" "}
                                                追加済み
                                            </strong>
                                        )}
                                        <span className="mylist-description-count">
                                            全
                                            {" "}
                                            {mylist.itemsCount}
                                            {" "}
                                            件
                                        </span>
                                        { !compact && (
                                            <>
                                                {" / "}
                                                <span className="mylist-description-count">
                                                    作成日時
                                                    {" "}
                                                    {new Date(mylist.createdAt).toLocaleDateString()}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </button>
                            )
                        })
                    : <div>マイリスト取得中</div>
            }
            { mylistsData && mylistsData.data.mylists.length > limit && showMoreButton && (
                <button className="mylist-showmore" onClick={onMoreButtonClick}>
                    <IconFolder />
                    {" "}
                    全
                    {" "}
                    {mylistsData.data.mylists.length}
                    {" "}
                    件のマイリストを表示…
                </button>
            ) }
        </div>
    )
}
