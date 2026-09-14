import { IconPencilSearch, IconSearch } from "@tabler/icons-react"
import { useId, useRef, useState } from "react"
import { useSearchExpandData } from "@/hooks/apiHooks/useSearchExpandData"
import { searchHistoryOptionToStrings, searchHistoryOptionToUrlSearchParams } from "@/utils/nvpcSearchOptionUtils"
import { openSavedSearchEditorAlert } from "../SavedSearchEditor"
import { useSavedSearchStorage } from "@/hooks/savedSearchStorage"
import { type IAlert } from "../Contexts/MessageProvider"
import { searchTypeStrings } from "./Search"
import { ExpandSearchInputItem } from "./ExpandSearchItem"

export function ExpandableSearchInput({ inputRef, currentSearchType, initialValue, onSearch: handleSearch, showAlert }: {
    inputRef: React.RefObject<HTMLInputElement | null>
    currentSearchType: keyof typeof searchTypeStrings
    initialValue: string
    onSearch: (value: string) => void
    showAlert: (alert: IAlert) => void
}) {
    const elementId = useId()
    const [isComposing, setIsComposing] = useState(false)
    const [query, setQuery] = useState(initialValue)
    const { data: expandData } = useSearchExpandData(query)
    const { savedSearches: conditions, storage: searchStorageData } = useSavedSearchStorage()
    const candidateRefs = useRef<(HTMLButtonElement | null)[]>([])

    const startComposition = () => setIsComposing(true)
    const endComposition = () => setIsComposing(false)

    function handleExpandItemMove(e: React.KeyboardEvent, index: number) {
        if (e.key === "ArrowDown" && candidateRefs.current.length > index + 1) {
            e.preventDefault()
            const nextButton = candidateRefs.current[index + 1]
            nextButton?.focus()
        } else if (e.key === "ArrowUp") {
            if (index < 1) {
                e.preventDefault()
                inputRef.current?.focus()
            } else {
                e.preventDefault()
                const prevButton = candidateRefs.current[index - 1]
                prevButton?.focus()
            }
        }
    }

    function handleInputKeyDown(e: React.KeyboardEvent) {
        if (!isComposing && e.key === "Enter") {
            onSearch()
        }
        if (!isComposing && e.key === "ArrowDown") {
            e.preventDefault()
            const firstCandidateButton = candidateRefs.current[0]
            firstCandidateButton?.focus()
        }
    }

    function onSearch() {
        if (!inputRef.current) return
        handleSearch(inputRef.current.value)
    }

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        setQuery(event.target.value)
    }

    return (
        <div className="searchbox-inputcontainer">
            <input
                type="text"
                ref={inputRef}
                placeholder={`${searchTypeStrings[currentSearchType][0]}${searchTypeStrings[currentSearchType][1]}検索...`}
                onKeyDown={handleInputKeyDown}
                onCompositionStart={startComposition}
                onCompositionEnd={endComposition}
                defaultValue={initialValue}
                onChange={handleInputChange}
                id={elementId}
                autoComplete="off"
            />
            <button onClick={() => onSearch()} type="button" title="検索">
                <IconSearch />
            </button>
            {query.trim().length < 1 && (
                <div className="searchbox-expand" data-is-default="true">
                    {conditions.length > 0 && (
                        <>
                            <div className="searchbox-expand-title">
                                <div className="searchbox-expand-title-text">
                                    保存した検索 (
                                    {conditions.length}
                                    {" "}
                                    / 30)
                                </div>
                                <div className="searchbox-expand-title-actions">
                                    <button type="button" title="保存した検索を編集する" onClick={() => { openSavedSearchEditorAlert(showAlert) }}>
                                        <IconPencilSearch />
                                    </button>
                                </div>
                            </div>
                            {conditions.map((historyItem, index) => (
                                <ExpandSearchInputItem
                                    key={index}
                                    ref={(e: HTMLButtonElement | null) => {
                                        if (e) {
                                            candidateRefs.current[index] = e
                                        } else {
                                            candidateRefs.current[index] = null
                                        }
                                    }}
                                    candidate={historyItem.word}
                                    type={historyItem.type.replace("keyword", "search") as keyof typeof searchTypeStrings}
                                    additionalSearchOptions={searchHistoryOptionToUrlSearchParams(historyItem)}
                                    optionText={searchHistoryOptionToStrings(historyItem).join(", ")}
                                    inputRef={inputRef}
                                    setQuery={setQuery}
                                    isAnchor
                                    showIcon
                                    onKeyDown={(e: React.KeyboardEvent) => {
                                        handleExpandItemMove(e, index)
                                    }}
                                    data-type="condition"
                                />
                            ))}
                        </>
                    )}
                    <div className="searchbox-expand-title">
                        <div className="searchbox-expand-title-text">検索履歴</div>
                    </div>
                    {searchStorageData?.data.history?.data.map((historyItem, index) => (
                        <ExpandSearchInputItem
                            key={index}
                            ref={(e: HTMLButtonElement | null) => {
                                if (e) {
                                    candidateRefs.current[conditions.length + index] = e
                                } else {
                                    candidateRefs.current[conditions.length + index] = null
                                }
                            }}
                            candidate={historyItem.word}
                            type={historyItem.type.replace("keyword", "search") as keyof typeof searchTypeStrings}
                            additionalSearchOptions={searchHistoryOptionToUrlSearchParams(historyItem)}
                            optionText={searchHistoryOptionToStrings(historyItem).join(", ")}
                            inputRef={inputRef}
                            setQuery={setQuery}
                            isAnchor
                            showIcon
                            onKeyDown={(e: React.KeyboardEvent) => {
                                handleExpandItemMove(e, conditions.length + index)
                            }}
                            data-type="history"
                        />
                    ))}
                </div>
            )}
            {expandData?.candidates && (
                <div className="searchbox-expand">
                    {expandData.candidates.map((candidate, index) => (
                        <ExpandSearchInputItem
                            key={candidate}
                            ref={(e: HTMLButtonElement | null) => {
                                if (e) {
                                    candidateRefs.current[index] = e
                                } else {
                                    candidateRefs.current[index] = null
                                }
                            }}
                            candidate={candidate}
                            type={currentSearchType}
                            inputRef={inputRef}
                            setQuery={setQuery}
                            onKeyDown={(e: React.KeyboardEvent) => {
                                handleExpandItemMove(e, index)
                            }}
                            data-type="expand"
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
