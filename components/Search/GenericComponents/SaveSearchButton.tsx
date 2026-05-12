import { IconListSearch } from "@tabler/icons-react"
import { useSetMessageContext } from "@/components/Global/Contexts/MessageProvider"
import { openSavedSearchEditorAlert } from "@/components/Global/SavedSearchEditor"
import { createSavedSearchItemFromOption, useSavedSearchStorage } from "@/hooks/savedSearchStorage"
import { localStorageNvpcSearchItem } from "@/types/localStorage/nvpcSearch"
import { SearchOption } from "@/types/search/Option"
import "./styles/SaveSearchButton.css"

export function SaveSearchButton({ option, word, type }: {
    option: SearchOption
    word: string
    type: localStorageNvpcSearchItem["type"]
}) {
    const { showAlert } = useSetMessageContext()
    const { saveSavedSearch } = useSavedSearchStorage()

    const handleSave = () => {
        const savedSearch = createSavedSearchItemFromOption(word, type, option)
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
    }

    return (
        <button className="search-save-button" type="button" onClick={handleSave} title="この検索を保存する">
            <IconListSearch />
            <span>この検索を保存する</span>
        </button>
    )
}
