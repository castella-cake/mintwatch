import { type IAlert, useSetMessageContext } from "@/components/Global/Contexts/MessageProvider"
import { useCreateMylistMutation } from "@/hooks/apiHooks/user/mylistOperations"
import { getMyWatchHistory } from "@/utils/apis/user/me/history"
import { useQuery } from "@tanstack/react-query"
import "../../../Global/styleModules/Alert.css"
import "../../styles/MylistCreateAlert.css"

const TITLE_MAX_LENGTH = 128
const DESCRIPTION_MAX_LENGTH = 256

export function openMylistCreateAlert(showAlert: (alert: IAlert) => void) {
    showAlert({
        title: "マイリストを新規追加",
        icon: null,
        body: <MylistCreateForm />,
        customCloseButton: [],
    })
}

function MylistCreateForm() {
    const { showToast, closeAlert } = useSetMessageContext()
    const createMylistMutation = useCreateMylistMutation()

    const [title, setTitle] = useState(() => `新しいマイリスト(${new Date().toLocaleDateString("ja-JP")})`)
    const [description, setDescription] = useState("")
    const [isPublic, setIsPublic] = useState(false)
    const [defaultSortKey, setDefaultSortKey] = useState("addedAt")
    const [selectedItemIds, setSelectedItemIds] = useState<string[]>([])
    const [isRequiredError, setIsRequiredError] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const { data: recentHistoryData, isLoading: isRecentHistoryLoading } = useQuery({
        queryKey: ["mylistCreateRecentHistory"],
        queryFn: () => getMyWatchHistory(8),
    })

    const isTitleEmpty = title.trim().length === 0

    const toggleItemId = (itemId: string) => {
        setSelectedItemIds(current => current.includes(itemId) ? current.filter(id => id !== itemId) : [...current, itemId])
    }

    const handleSubmit = async (event: React.SubmitEvent) => {
        event.preventDefault()
        if (isTitleEmpty) {
            setIsRequiredError(true)
            return
        }

        setErrorMessage(null)
        try {
            const result = await createMylistMutation.mutateAsync({
                name: title,
                description: description,
                defaultSortKey: defaultSortKey,
                defaultSortOrder: "desc",
                isPublic: isPublic,
                itemIds: selectedItemIds,
            })
            if (result.failedItemCount > 0) {
                setErrorMessage(`マイリストを作成しましたが、${result.failedItemCount} 件の動画の登録に失敗しました。`)
                return
            }
            showToast({ title: "マイリストを作成しました" })
            closeAlert()
        } catch (error) {
            setErrorMessage(`マイリストの作成に失敗しました。${String(error)}`)
        }
    }

    return (
        <form className="mylist-create-form" onSubmit={handleSubmit}>
            <div className="mylist-create-content">
                <label className="mylist-create-field">
                    <span>
                        タイトル
                        <span className="mylist-create-required" data-is-error={isRequiredError}>{isRequiredError ? "このフィールドは必須です" : "必須"}</span>
                    </span>
                    <div className="mylist-create-input-wrapper">
                        <input
                            type="text"
                            value={title}
                            maxLength={TITLE_MAX_LENGTH}
                            data-is-required-error={isRequiredError}
                            onChange={(event) => {
                                setTitle(event.target.value)
                                if (event.target.value.trim().length > 0) setIsRequiredError(false)
                            }}
                        />
                        <span className="mylist-create-counter" data-is-visible={title.length > 0}>
                            {TITLE_MAX_LENGTH - title.length}
                            {" "}
                            /
                            {" "}
                            {TITLE_MAX_LENGTH}
                        </span>
                    </div>
                </label>
                <label className="mylist-create-field">
                    <span>説明文</span>
                    <div className="mylist-create-input-wrapper">
                        <textarea
                            value={description}
                            maxLength={DESCRIPTION_MAX_LENGTH}
                            rows={3}
                            onChange={event => setDescription(event.target.value)}
                        />
                        <span className="mylist-create-counter" data-is-visible={description.length > 0}>
                            {DESCRIPTION_MAX_LENGTH - description.length}
                            {" "}
                            /
                            {" "}
                            {DESCRIPTION_MAX_LENGTH}
                        </span>
                    </div>
                </label>
                <label className="mylist-create-field mylist-create-row-field">
                    <span>並び順</span>
                    <select
                        value={defaultSortKey}
                        onChange={event => setDefaultSortKey(event.target.value)}
                    >
                        <option value="addedAt">マイリスト登録日時</option>
                        <option value="title">タイトル</option>
                        <option value="memo">メモ</option>
                    </select>
                </label>
                <div className="mylist-create-field mylist-create-row-field">
                    <span>公開設定</span>
                    <div className="mylist-create-selectbuttons" role="radiogroup" aria-label="公開設定">
                        <label className="mylist-create-selectbutton" data-is-current={!isPublic}>
                            <input
                                type="radio"
                                name="mylist-create-visibility"
                                className="mylist-create-radioinput"
                                checked={!isPublic}
                                onChange={() => setIsPublic(false)}
                            />
                            非公開
                        </label>
                        <label className="mylist-create-selectbutton" data-is-current={isPublic}>
                            <input
                                type="radio"
                                name="mylist-create-visibility"
                                className="mylist-create-radioinput"
                                checked={isPublic}
                                onChange={() => setIsPublic(true)}
                            />
                            公開
                        </label>
                    </div>
                </div>
                <div className="mylist-create-history-section">
                    <span>最近視聴した動画</span>
                    <div className="mylist-create-history">
                        { isRecentHistoryLoading && <p className="mylist-create-history-loading">視聴履歴を取得中...</p> }
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
                { errorMessage && <p className="mylist-create-error">{errorMessage}</p> }
            </div>
            <div className="alert-buttons">
                <button
                    type="button"
                    className="alert-button"
                    onClick={closeAlert}
                    disabled={createMylistMutation.isPending}
                    aria-disabled={createMylistMutation.isPending}
                >
                    キャンセル
                </button>
                <button
                    type="submit"
                    className="alert-button"
                    disabled={createMylistMutation.isPending}
                    aria-disabled={createMylistMutation.isPending}
                    data-isprimary="true"
                >
                    作成
                </button>
            </div>
        </form>
    )
}
