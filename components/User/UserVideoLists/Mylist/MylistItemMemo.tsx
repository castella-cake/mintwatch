import { useSetMessageContext } from "@/components/Global/Contexts/MessageProvider"
import { IconAlertTriangle, IconCheck, IconEdit } from "@tabler/icons-react"

const MEMO_MAX_LENGTH = 256

interface MylistItemMemoProps {
    memo: string
    itemId: number
    save: (memo: string, itemId: number) => Promise<void>
}

export function MylistItemMemo({ memo, itemId, save }: MylistItemMemoProps) {
    const { showToast } = useSetMessageContext()
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [draft, setDraft] = useState(memo)

    const handleEdit = () => {
        setDraft(memo)
        setIsEditing(true)
    }

    const handleCancel = () => {
        setDraft(memo)
        setIsEditing(false)
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            await save(draft, itemId)
            setIsEditing(false)
            showToast({ title: "メモを保存しました", icon: <IconCheck /> })
        } catch (error) {
            showToast({
                title: "メモの保存に失敗しました",
                body: String(error),
                icon: <IconAlertTriangle />,
            })
        } finally {
            setIsSaving(false)
        }
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
                        disabled={isSaving}
                        aria-disabled={isSaving}
                    >
                        保存
                    </button>
                    <button
                        type="button"
                        className="user-videolist-view-video-listdata-memo-editor-button"
                        onClick={handleCancel}
                        disabled={isSaving}
                        aria-disabled={isSaving}
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
            {memo && (
                <div className="user-videolist-view-video-listdata-memo-text">
                    {memo}
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
