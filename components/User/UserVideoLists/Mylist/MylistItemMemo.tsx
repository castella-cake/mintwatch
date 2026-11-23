import { useSetMessageContext } from "@/components/Global/Contexts/MessageProvider"
import { usePutMylistItemDescription } from "@/hooks/apiHooks/user/mylistItemOperations"
import { IconAlertTriangle, IconCheck, IconEdit } from "@tabler/icons-react"

const MEMO_MAX_LENGTH = 256

interface MylistItemMemoProps {
    mylistId: number
    item: MylistVideoItem
}

export function MylistItemMemo({ mylistId, item }: MylistItemMemoProps) {
    const { showToast } = useSetMessageContext()
    const memoMutation = usePutMylistItemDescription()
    const [isEditing, setIsEditing] = useState(false)
    const [draft, setDraft] = useState(item.description)

    const handleEdit = () => {
        setDraft(item.description)
        setIsEditing(true)
    }

    const handleCancel = () => {
        setDraft(item.description)
        setIsEditing(false)
    }

    const handleSave = () => {
        memoMutation.mutate(
            { mylistId, itemId: item.itemId, description: draft },
            {
                onSuccess: () => {
                    setIsEditing(false)
                    showToast({ title: "メモを保存しました", icon: <IconCheck /> })
                },
                onError: (error) => {
                    showToast({
                        title: "メモの保存に失敗しました",
                        body: String(error),
                        icon: <IconAlertTriangle />,
                    })
                },
            },
        )
    }

    if (isEditing) {
        return (
            <div className="user-videolist-view-video-listdata-memo-editor">
                <textarea
                    className="user-videolist-view-video-listdata-memo-editor-textarea"
                    value={draft}
                    maxLength={MEMO_MAX_LENGTH}
                    onChange={event => setDraft(event.target.value)}
                    autoFocus
                />
                <div className="user-videolist-view-video-listdata-memo-editor-controls">
                    <button
                        type="button"
                        className="user-videolist-view-video-listdata-memo-editor-button"
                        data-isprimary="true"
                        onClick={handleSave}
                        disabled={memoMutation.isPending}
                        aria-disabled={memoMutation.isPending}
                    >
                        保存
                    </button>
                    <button
                        type="button"
                        className="user-videolist-view-video-listdata-memo-editor-button"
                        onClick={handleCancel}
                        disabled={memoMutation.isPending}
                        aria-disabled={memoMutation.isPending}
                    >
                        キャンセル
                    </button>
                    <span className="user-videolist-view-video-listdata-memo-editor-spacer" />
                    <span
                        className="user-videolist-view-video-listdata-memo-editor-counter"
                        data-is-visible={draft.length > 0}
                    >
                        {MEMO_MAX_LENGTH - draft.length}
                        {" "}
                        /
                        {" "}
                        {MEMO_MAX_LENGTH}
                    </span>
                </div>
            </div>
        )
    }

    return (
        <div className="user-videolist-view-video-listdata-memo">
            {item.description && (
                <div className="user-videolist-view-video-listdata-memo-text">
                    {item.description}
                </div>
            )}
            <button
                type="button"
                className="user-videolist-view-video-listdata-memo-editbutton"
                onClick={handleEdit}
                title="メモを編集"
                aria-label="メモを編集"
            >
                <IconEdit />
            </button>
        </div>
    )
}
