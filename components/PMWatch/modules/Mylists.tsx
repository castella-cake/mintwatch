import { useSetMessageContext } from "@/components/Global/Contexts/MessageProvider"
import { useVideoInfoContext } from "@/components/Global/Contexts/VideoDataProvider"
import { useMylistsData } from "@/hooks/apiHooks/watch/mylistsData"
import { IconAlertTriangle, IconCheck } from "@tabler/icons-react"

export function Mylists() {
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
        <div className="mylist-item-container">
            {
                mylistsData
                    ? mylistsData.data.mylists.map((elem) => {
                            return (
                                <button
                                    key={elem.id}
                                    className="mylist-item"
                                    onClick={() => {
                                        if (!addedMylists.includes(elem.id) && videoInfo.data) onAddToMylist(elem.id, videoInfo.data.response.video.id)
                                    }}
                                >
                                    {addedMylists.includes(elem.id) && (
                                        <>
                                            <IconCheck />
                                            追加済み:
                                            {" "}
                                        </>
                                    )}
                                    <span className="mylist-title">{ elem.name }</span>
                                    <br />
                                    <span className="mylist-desc">
                                        { elem.isPublic ? "公開" : "非公開" }
                                        のマイリスト /
                                        {" "}
                                        { elem.itemsCount}
                                        {" "}
                                        個の動画
                                    </span>
                                </button>
                            )
                        })
                    : <div>マイリスト取得中</div>
            }
        </div>
    )
}
