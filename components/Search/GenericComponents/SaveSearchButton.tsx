import { IconExclamationCircle, IconListSearch } from "@tabler/icons-react"
import { useSetMessageContext } from "@/components/Global/Contexts/MessageProvider"
import { openSavedSearchEditorAlert } from "@/components/Global/SavedSearchEditor"
import { createSavedSearchItemFromOption, useSavedSearchStorage } from "@/hooks/savedSearchStorage"
import { localStorageNvpcSearchItem } from "@/types/localStorage/nvpcSearch"
import { SearchOption } from "@/types/search/Option"
import "./styles/SaveSearchButton.css"
import { SavedSearchDuplicatedError, SavedSearchLimitExceededError } from "@/utils/classes/SavedSearchError"

export function SaveSearchButton({ option, word, type }: {
    option: SearchOption
    word: string
    type: localStorageNvpcSearchItem["type"]
}) {
    const { showAlert } = useSetMessageContext()
    const { savedSearches, saveSavedSearch } = useSavedSearchStorage()

    const isCurrentOptionSaved = savedSearches.some(saved => isSameSearchOption(saved, createSavedSearchItemFromOption(word, type, option)))

    const handleSave = () => {
        if (isCurrentOptionSaved) return
        const savedSearch = createSavedSearchItemFromOption(word, type, option)
        try {
            saveSavedSearch(savedSearch)
            showAlert({
                title: "検索を保存しました",
                body: (
                    <>
                        <strong>{word}</strong>
                        {" "}
                        の検索条件を保存しました。
                    </>
                ),
                customCloseButton: [
                    {
                        text: "OK",
                        key: "ok",
                        primary: true,
                    },
                    {
                        text: "編集する",
                        key: "edit",
                    },
                ],
                onClose: (key) => {
                    if (key === "edit") {
                        openSavedSearchEditorAlert(showAlert)
                    }
                },
            })
        } catch (error) {
            if (error instanceof SavedSearchLimitExceededError) {
                showAlert({
                    title: "検索を保存できません",
                    body: "保存できる検索の上限は30件です。不要な保存済み検索を削除してから再度お試しください。",
                    icon: <IconExclamationCircle />,
                })
            } else if (error instanceof SavedSearchDuplicatedError) {
                showAlert({
                    title: "検索を保存できません",
                    body: "同一の検索条件が既に保存されています。",
                })
            }
        }
    }

    return (
        <button className="search-save-button" type="button" onClick={handleSave} title="この検索を保存する" aria-disabled={isCurrentOptionSaved}>
            <IconListSearch />
            <span>
                {isCurrentOptionSaved ? "保存済み" : "この検索を保存する"}
                {" "}
                (
                {savedSearches.length}
                {" "}
                / 30)
            </span>
        </button>
    )
}
