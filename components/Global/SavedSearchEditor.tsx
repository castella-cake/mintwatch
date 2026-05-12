import { IconChevronDown, IconChevronUp, IconFolder, IconListNumbers, IconMessageLanguage, IconTrash, IconTag, IconUser } from "@tabler/icons-react"
import { useEffect, useMemo, useState } from "react"
import { type IAlert } from "./Contexts/MessageProvider"
import { searchHistoryOptionToStrings } from "@/utils/searchHistoryOptionUtils"
import { useSavedSearchStorage } from "@/hooks/savedSearchStorage"
import { localStorageNvpcSearchItem } from "@/types/localStorage/nvpcSearch"
import "./styleModules/SavedSearchEditor.css"

export function openSavedSearchEditorAlert(showAlert: (alert: IAlert) => void) {
    showAlert({
        title: "保存した検索を編集",
        icon: null,
        body: <SavedSearchEditor />,
        customCloseButton: [
            {
                text: "おしまい",
                key: "close",
                primary: true,
            },
        ],
    })
}

const savedSearchTypeIcons = {
    keyword: <IconMessageLanguage />,
    keyword_shorts: <IconMessageLanguage />,
    tag: <IconTag />,
    tag_shorts: <IconTag />,
    mylist: <IconFolder />,
    series: <IconListNumbers />,
    user: <IconUser />,
} as const

function SavedSearchEditorItem({ item, index }: { item: localStorageNvpcSearchItem, index: number }) {
    const { updateSavedSearch, deleteSavedSearch } = useSavedSearchStorage()
    const [isOpen, setIsOpen] = useState(false)
    const [conditionText, setConditionText] = useState(() => JSON.stringify({
        sort: item.sort,
        presetFilters: item.presetFilters,
        dateRangeFilter: item.dateRangeFilter,
    }, null, 2))
    const [conditionError, setConditionError] = useState<string | null>(null)

    useEffect(() => {
        setConditionText(JSON.stringify({
            sort: item.sort,
            presetFilters: item.presetFilters,
            dateRangeFilter: item.dateRangeFilter,
        }, null, 2))
    }, [item.sort, item.presetFilters, item.dateRangeFilter])

    const summaryText = useMemo(() => {
        try {
            return searchHistoryOptionToStrings(item).join(", ")
        } catch {
            return "条件の表示に失敗しました"
        }
    }, [item])

    const updateItem = (nextItem: localStorageNvpcSearchItem) => {
        updateSavedSearch(index, () => nextItem)
    }

    const handleConditionChange = (nextText: string) => {
        setConditionText(nextText)
        try {
            const parsed = JSON.parse(nextText) as Partial<Pick<localStorageNvpcSearchItem, "sort" | "presetFilters" | "dateRangeFilter">>
            if (!parsed || typeof parsed !== "object") {
                setConditionError("条件の形式が正しくありません")
                return
            }
            setConditionError(null)
            updateItem({
                ...item,
                sort: parsed.sort ?? item.sort,
                presetFilters: parsed.presetFilters ?? item.presetFilters,
                dateRangeFilter: parsed.dateRangeFilter ?? item.dateRangeFilter,
            })
        } catch {
            setConditionError("JSONの形式が正しくありません")
        }
    }

    const handleDelete = () => {
        deleteSavedSearch(index)
    }

    return (
        <details className="saved-search-editor-item" open={isOpen} onToggle={(event) => { setIsOpen(event.currentTarget.open) }}>
            <summary className="saved-search-editor-summary">
                <div className="saved-search-editor-summary-top">
                    <div className="saved-search-editor-summary-left">
                        <span className="saved-search-editor-summary-icon">{savedSearchTypeIcons[item.type]}</span>
                        <span className="saved-search-editor-summary-title">{item.word}</span>
                    </div>
                    <span className="saved-search-editor-summary-arrow">{isOpen ? <IconChevronUp /> : <IconChevronDown />}</span>
                </div>
                <div className="saved-search-editor-summary-options">{summaryText}</div>
            </summary>
            <div className="saved-search-editor-body">
                <label className="saved-search-editor-field">
                    <span>名前</span>
                    <input
                        type="text"
                        value={item.word}
                        onChange={(e) => {
                            updateItem({
                                ...item,
                                word: e.target.value,
                            })
                        }}
                    />
                </label>
                <label className="saved-search-editor-field">
                    <span>種類</span>
                    <select
                        value={item.type}
                        onChange={(e) => {
                            updateItem({
                                ...item,
                                type: e.target.value as localStorageNvpcSearchItem["type"],
                            })
                        }}
                    >
                        <option value="keyword">キーワード</option>
                        <option value="keyword_shorts">キーワード(ショート)</option>
                        <option value="tag">タグ</option>
                        <option value="tag_shorts">タグ(ショート)</option>
                        <option value="mylist">マイリスト</option>
                        <option value="series">シリーズ</option>
                        <option value="user">ユーザー</option>
                    </select>
                </label>
                <label className="saved-search-editor-field">
                    <span>条件JSON</span>
                    <textarea
                        value={conditionText}
                        onChange={(e) => {
                            handleConditionChange(e.target.value)
                        }}
                        rows={10}
                    />
                </label>
                {conditionError && <p className="saved-search-editor-error">{conditionError}</p>}
                <div className="saved-search-editor-actions">
                    <button type="button" className="saved-search-editor-delete" onClick={handleDelete}>
                        <IconTrash />
                        <span>削除</span>
                    </button>
                </div>
            </div>
        </details>
    )
}

export function SavedSearchEditor() {
    const { savedSearches } = useSavedSearchStorage()

    if (savedSearches.length === 0) {
        return (
            <div className="saved-search-editor">
                <p className="saved-search-editor-empty">保存した検索はまだありません。</p>
            </div>
        )
    }

    return (
        <div className="saved-search-editor">
            <p className="saved-search-editor-intro">保存した検索を編集、削除します。新しいエントリーは検索ページから追加できます。</p>
            <div className="saved-search-editor-list">
                {savedSearches.map((item, index) => (
                    <SavedSearchEditorItem key={`${item.type}:${item.word}:${index}`} item={item} index={index} />
                ))}
            </div>
        </div>
    )
}
