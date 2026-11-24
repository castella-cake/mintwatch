import { type IAlert, useSetMessageContext } from "@/components/Global/Contexts/MessageProvider"
import { useCreateMylistMutation } from "@/hooks/apiHooks/user/mylistOperations"
import { getMyWatchHistory } from "@/utils/apis/user/me/history"
import { useQuery } from "@tanstack/react-query"
import { LoadingFiller } from "@/components/Global/LoadingFiller"
import { MylistForm } from "./MylistForm"

export function openMylistCreateAlert(showAlert: (alert: IAlert) => void) {
    showAlert({
        title: "マイリストを新規追加",
        icon: null,
        body: <MylistCreateForm />,
        customCloseButton: [],
    })
}

function MylistCreateForm() {
    const { showToast } = useSetMessageContext()
    const createMylistMutation = useCreateMylistMutation()
    const [selectedItemIds, setSelectedItemIds] = useState<string[]>([])

    const { data: recentHistoryData, isLoading: isRecentHistoryLoading } = useQuery({
        queryKey: ["mylistCreateRecentHistory"],
        queryFn: () => getMyWatchHistory(8),
    })

    const toggleItemId = (itemId: string) => {
        setSelectedItemIds(current => current.includes(itemId) ? current.filter(id => id !== itemId) : [...current, itemId])
    }

    return (
        <MylistForm
            initialValues={{
                name: `新しいマイリスト(${new Date().toLocaleDateString("ja-JP")})`,
                description: "",
                defaultSortKey: "addedAt",
                defaultSortOrder: "desc",
                isPublic: false,
            }}
            submitLabel="作成"
            errorPrefix="マイリストの作成に失敗しました。"
            extraContent={(
                <div className="mylist-create-history-section">
                    <span>最近視聴した動画</span>
                    <div className="mylist-create-history">
                        { isRecentHistoryLoading && <LoadingFiller compact /> }
                        { recentHistoryData?.data.items.map(item => (
                            <label className="mylist-create-history-item" key={item.video.id} data-is-selected={selectedItemIds.includes(item.video.id)}>
                                <input
                                    type="checkbox"
                                    checked={selectedItemIds.includes(item.video.id)}
                                    onChange={() => toggleItemId(item.video.id)}
                                />
                                <img src={item.video.thumbnail.listingUrl} alt={item.video.title} />
                                <span className="mylist-create-history-caption">
                                    <span className="mylist-create-history-title">{item.video.title}</span>
                                </span>
                            </label>
                        )) }
                    </div>
                </div>
            )}
            onSubmit={async (values) => {
                const result = await createMylistMutation.mutateAsync({ ...values, itemIds: selectedItemIds })
                if (result.failedItemCount > 0) {
                    return `マイリストを作成しましたが、${result.failedItemCount} 件の動画の登録に失敗しました。`
                }
                showToast({ title: "マイリストを作成しました" })
                return null
            }}
        />
    )
}
