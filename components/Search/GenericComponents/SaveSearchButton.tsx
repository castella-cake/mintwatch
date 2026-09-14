import { IconCheck, IconExclamationCircle, IconListSearch } from "@tabler/icons-react"
import { useSetMessageContext } from "@/components/Global/Contexts/MessageProvider"
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
    const { showToast, showAlert } = useSetMessageContext()
    const { savedSearches, saveSavedSearch, deleteSavedSearch } = useSavedSearchStorage()

    const isCurrentOptionSaved = savedSearches.some(saved => isSameSearchOption(saved, createSavedSearchItemFromOption(word, type, option)))

    const handleSave = () => {
        if (isCurrentOptionSaved) {
            const savedSearch = createSavedSearchItemFromOption(word, type, option)
            const index = savedSearches.findIndex(saved => isSameSearchOption(saved, savedSearch))
            if (index !== -1) {
                deleteSavedSearch(index)
                showToast({
                    title: "検索を削除しました",
                })
            }
            return
        }
        const savedSearch = createSavedSearchItemFromOption(word, type, option)
        try {
            saveSavedSearch(savedSearch)
            showToast({
                title: "検索を保存しました",
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
        <button className="search-save-button" type="button" onClick={handleSave} title={isCurrentOptionSaved ? "保存済み(クリックして削除)" : "この検索を保存する"}>
            { isCurrentOptionSaved ? <IconCheck /> : <IconListSearch /> }
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
