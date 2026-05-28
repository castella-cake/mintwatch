import { IconFolder, IconInputSearch, IconListNumbers, IconMessageLanguage, IconPencilSearch, IconSearch, IconTag, IconUser } from "@tabler/icons-react"
import { ReactNode, startTransition, useEffect, useId, useRef, useState } from "react"
import { useHistoryContext, useLocationContext } from "../Router/RouterContext"
import { useSearchExpandData } from "@/hooks/apiHooks/useSearchExpandData"
import { searchHistoryOptionToStrings, searchHistoryOptionToUrlSearchParams } from "@/utils/nvpcSearchOptionUtils"
import { openSavedSearchEditorAlert } from "./SavedSearchEditor"
import { useSavedSearchStorage } from "@/hooks/savedSearchStorage"
import { useSetMessageContext, type IAlert } from "./Contexts/MessageProvider"

const searchType = {
    search: ["キーワード", "で"],
    search_shorts: ["キーワード", "で"],
    tag: ["タグ", "で"],
    tag_shorts: ["タグ", "で"],
    mylist: ["マイリスト", "を"],
    series: ["シリーズ", "を"],
    user: ["ユーザー", "を"],
} as const
const searchTypeKeys = Object.keys(searchType)

// const nvPcSearchTypeKeys = ["keyword", "keyword_shorts", "tag", "tag_shorts", "mylist", "series", "user"] as const

const searchTypeIcons = [<IconMessageLanguage key="keyword" />, <IconMessageLanguage key="keyword_shorts" />, <IconTag key="tag" />, <IconTag key="tag_shorts" />, <IconFolder key="folder" />, <IconListNumbers key="series" />, <IconUser key="user" />]

function ExpandableSearchInputItem({
    candidate,
    type,
    additionalSearchOptions,
    optionText,
    inputRef,
    setQuery,
    isAnchor = false,
    showIcon = false,
    ...additionalAttributes
}: {
    candidate: string
    type: keyof typeof searchType
    additionalSearchOptions?: URLSearchParams
    optionText?: ReactNode
    inputRef: React.RefObject<HTMLInputElement | null>
    setQuery: React.Dispatch<React.SetStateAction<string>>
    showIcon?: boolean
    isAnchor?: boolean
}) {
    const history = useHistoryContext()
    return (
        <button
            className="searchbox-expand-item"
            onClick={(e) => {
                if ((!e.shiftKey && isAnchor) || (e.shiftKey && !isAnchor)) {
                    const hrefString = returnHrefFromSearchType(candidate, type)
                    const href = new URL(hrefString)
                    if (additionalSearchOptions) {
                        href.search = additionalSearchOptions.toString()
                    }
                    startTransition(() => history.push(href.toString()))
                } else {
                    setQuery(candidate)
                    if (inputRef.current) {
                        inputRef.current.value = candidate
                        inputRef.current.focus()
                    }
                }
            }}
            title={`選択して ${candidate} ${isAnchor ? `で${searchType[type][0]}検索` : `を入力欄に反映`} (Shift+選択で${isAnchor ? "入力欄に反映" : `${searchType[type][0]}検索`})`}
            {...additionalAttributes}
        >
            <div className="searchbox-expand-item-title">
                {showIcon && Object.keys(searchType).indexOf(type) !== -1 && searchTypeIcons[Object.keys(searchType).indexOf(type)]}
                <span className="searchbox-expand-item-word">
                    {candidate}
                </span>
                { isAnchor ? <IconSearch className="searchbox-expand-item-actionicon" /> : <IconInputSearch className="searchbox-expand-item-actionicon" /> }
            </div>
            { optionText && (
                <div className="searchbox-expand-item-options">
                    {optionText}
                </div>
            )}
        </button>
    )
}

function ExpandableSearchInput({ inputRef, currentSearchType, initialValue, onSearch: handleSearch, enableHotKey, showAlert }: {
    inputRef: React.RefObject<HTMLInputElement | null>
    currentSearchType: keyof typeof searchType
    initialValue: string
    onSearch: (value: string) => void
    enableHotKey?: boolean
    showAlert: (alert: IAlert) => void
}) {
    const elementId = useId()
    const [isComposing, setIsComposing] = useState(false)
    const [query, setQuery] = useState(initialValue)
    const { data: expandData } = useSearchExpandData(query)
    const { savedSearches: conditions, storage: searchStorageData } = useSavedSearchStorage()

    useEffect(() => {
        if (!enableHotKey) return
        const controller = new AbortController()
        const { signal } = controller
        const handleGlobalKeydown = (e: KeyboardEvent) => {
            if (e.key === "/" && document.activeElement !== inputRef.current) {
                e.preventDefault()
                inputRef.current?.focus()
                return false
            }
            return true
        }
        document.addEventListener("keydown", handleGlobalKeydown, { signal })
        return () => controller.abort()
    }, [enableHotKey])

    const startComposition = () => setIsComposing(true)
    const endComposition = () => setIsComposing(false)

    function handleEnter(keyName: string) {
        if (!isComposing && keyName === "Enter") {
            onSearch()
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
                placeholder={`${searchType[currentSearchType][0]}${searchType[currentSearchType][1]}検索...`}
                onKeyDown={(e) => {
                    handleEnter(e.key)
                }}
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
                                <ExpandableSearchInputItem
                                    key={index}
                                    candidate={historyItem.word}
                                    type={historyItem.type.replace("keyword", "search") as keyof typeof searchType}
                                    additionalSearchOptions={searchHistoryOptionToUrlSearchParams(historyItem)}
                                    optionText={searchHistoryOptionToStrings(historyItem).join(", ")}
                                    inputRef={inputRef}
                                    setQuery={setQuery}
                                    isAnchor
                                    showIcon
                                    data-type="condition"
                                />
                            ))}
                        </>
                    )}
                    <div className="searchbox-expand-title">
                        <div className="searchbox-expand-title-text">検索履歴</div>
                    </div>
                    {searchStorageData?.data.history?.data.map((historyItem, index) => (
                        <ExpandableSearchInputItem
                            key={index}
                            candidate={historyItem.word}
                            type={historyItem.type.replace("keyword", "search") as keyof typeof searchType}
                            additionalSearchOptions={searchHistoryOptionToUrlSearchParams(historyItem)}
                            optionText={searchHistoryOptionToStrings(historyItem).join(", ")}
                            inputRef={inputRef}
                            setQuery={setQuery}
                            isAnchor
                            showIcon
                            data-type="history"
                        />
                    ))}
                </div>
            )}
            {expandData?.candidates && (
                <div className="searchbox-expand">
                    {expandData.candidates.map(candidate => (
                        <ExpandableSearchInputItem
                            key={candidate}
                            candidate={candidate}
                            type={currentSearchType}
                            inputRef={inputRef}
                            setQuery={setQuery}
                            data-type="expand"
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

function Search({ enableHotKey }: { enableHotKey?: boolean }) {
    const location = useLocationContext()
    const history = useHistoryContext()
    const inputRef = useRef<HTMLInputElement | null>(null)
    const { showAlert } = useSetMessageContext()

    const [currentSearchType, setSearchType] = useState<keyof typeof searchType>("search")

    useEffect(() => {
        const currentSearchType = returnSearchWhatWeReIn(location.pathname)
        if (currentSearchType) {
            setSearchType(currentSearchType as keyof typeof searchType)
        }
    }, [location.pathname])

    function handleSearchTypeChange(key: keyof typeof searchType) {
        if (inputRef?.current && returnSearchWord(location.pathname) === inputRef.current.value && inputRef.current.value.trim() !== "") {
            const href = returnHrefFromSearchType(inputRef.current.value, key)
            startTransition(() => history.push(href))
        }
        setSearchType(key)
    }

    function onSearch(value: string) {
        const href = returnHrefFromSearchType(value, currentSearchType)
        history.push(href)
    }

    return (
        <search className="searchbox-container" id="pmw-searchbox" data-in-search-page={returnSearchWhatWeReIn(location.pathname) !== undefined}>
            <div className="searchbox-typeselector">
                {searchTypeKeys.map((elem, index) => {
                    if (elem.includes("_shorts")) {
                        return
                    }
                    const isActive = currentSearchType.replace("_shorts", "") === elem
                    return (
                        <button
                            key={elem}
                            className={`searchbox-type-item${isActive ? " searchbox-type-active" : ""}`}
                            onClick={() => {
                                if (currentSearchType.endsWith("_shorts") && (elem === "search" || elem === "tag")) {
                                    handleSearchTypeChange((elem + "_shorts") as keyof typeof searchType)
                                } else {
                                    handleSearchTypeChange(elem as keyof typeof searchType)
                                }
                            }}
                            title={searchType[elem as keyof typeof searchType][0]}
                            data-searchtype={elem}
                        >
                            {searchTypeIcons[index]}
                            <span className="searchbox-type-text">{searchType[elem as keyof typeof searchType][0]}</span>
                        </button>
                    )
                })}
            </div>
            <ExpandableSearchInput
                inputRef={inputRef}
                key={location.pathname}
                currentSearchType={currentSearchType}
                initialValue={returnSearchWord(location.pathname)}
                onSearch={onSearch}
                enableHotKey={enableHotKey}
                showAlert={showAlert}
            />
        </search>
    )
}

export default Search
