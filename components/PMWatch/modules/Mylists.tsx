import { useSetMessageContext } from "@/components/Global/Contexts/MessageProvider"
import { useVideoInfoContext } from "@/components/Global/Contexts/VideoDataProvider"
import { useMylistsData } from "@/hooks/apiHooks/watch/mylistsData"
import { IconAlertTriangle, IconCheck, IconFolder, IconLock, IconWorld } from "@tabler/icons-react"

export function Mylists({ compact = false, limit = Infinity, showMoreButton, onMoreButtonClick }: { compact?: boolean, limit?: number, showMoreButton?: boolean, onMoreButtonClick?: (e: React.MouseEvent) => void }) {
    const { videoInfo } = useVideoInfoContext()
    const { showToast, showAlert } = useSetMessageContext()

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

    if (!videoInfo) return

    return (
        <div className="mylist-item-container" data-is-compact={compact}>
            {
                mylistsData
                    ? mylistsData.data.mylists.slice(0, limit).map((mylist) => {
                            return (
                                <button
                                    key={mylist.id}
                                    className="mylist-item"
                                    onClick={() => {
                                        if (!addedMylists.includes(mylist.id) && videoInfo.data) onAddToMylist(mylist.id, videoInfo.data.response.video.id)
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
