import { IconFolder, IconInputSearch, IconListNumbers, IconMessageLanguage, IconSearch, IconTag, IconUser } from "@tabler/icons-react"
import { startTransition, useEffect, useId, useRef, useState } from "react"
import { useHistoryContext, useLocationContext } from "../Router/RouterContext"
import { useSearchExpandData } from "@/hooks/apiHooks/useSearchExpandData"
import useServerContext from "@/hooks/serverContextHook"
import { useBrowserLocalStorage } from "@/hooks/browserLocalStorageHook"
import { localStorageNvpcSearchRootObject } from "@/types/localStorage/nvpcSearch"
import { searchHistoryOptionToStrings } from "@/utils/searchHistoryOptionToStrings"

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

const nvPcSearchTypeKeys = ["keyword", "keyword_shorts", "tag", "tag_shorts", "mylist", "series", "user"] as const

const searchTypeIcons = [<IconMessageLanguage key="keyword" />, <IconMessageLanguage key="keyword_shorts" />, <IconTag key="tag" />, <IconTag key="tag_shorts" />, <IconFolder key="folder" />, <IconListNumbers key="series" />, <IconUser key="user" />]

function ExpandableSearchInput({ inputRef, currentSearchType, initialValue, onSearch: handleSearch, enableHotKey }: {
    inputRef: React.RefObject<HTMLInputElement | null>
    currentSearchType: keyof typeof searchType
    initialValue: string
    onSearch: (value: string) => void
    enableHotKey?: boolean
}) {
    const elementId = useId()
    const history = useHistoryContext()
    const [isComposing, setIsComposing] = useState(false)
    const [query, setQuery] = useState(initialValue)
    const { data: expandData } = useSearchExpandData(query)
    const contextData = useServerContext()
    const { data: nvpcSearchdata } = useBrowserLocalStorage(`nvpc:search:${contextData?.sessionUser?.id ?? "0"}`)
    const searchStorageData = typeof nvpcSearchdata === "string" ? JSON.parse(nvpcSearchdata) as localStorageNvpcSearchRootObject : null

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
                    {searchStorageData?.data.history?.data.map((historyItem, index) => (
                        <button
                            key={index}
                            className="searchbox-expand-item"
                            onClick={(e) => {
                                if (!e.shiftKey) {
                                    const href = returnHrefFromSearchType(historyItem.word, historyItem.type.replace("keyword", "search") as keyof typeof searchType)
                                    startTransition(() => history.push(href))
                                } else {
                                    setQuery(historyItem.word)
                                    if (inputRef.current) {
                                        inputRef.current.value = historyItem.word
                                        inputRef.current.focus()
                                    }
                                }
                            }}
                            title={`選択して ${historyItem.word} で${searchType[historyItem.type.replace("keyword", "search") as keyof typeof searchType][0]}検索 (Shift+選択で入力欄に反映)`}
                        >
                            <div className="searchbox-expand-item-title">
                                {nvPcSearchTypeKeys.indexOf(historyItem.type) !== -1 && searchTypeIcons[nvPcSearchTypeKeys.indexOf(historyItem.type)]}
                                <span className="searchbox-expand-item-word">
                                    {historyItem.word}
                                </span>
                                <IconSearch className="searchbox-expand-item-actionicon" />
                            </div>
                            <div className="searchbox-expand-item-options">
                                {searchHistoryOptionToStrings(historyItem).join(", ")}
                            </div>
                        </button>
                    ))}
                </div>
            )}
            {expandData?.candidates && (
                <div className="searchbox-expand">
                    {expandData.candidates.map(candidate => (
                        <button
                            key={candidate}
                            className="searchbox-expand-item"
                            onClick={(e) => {
                                if (e.shiftKey) {
                                    const href = returnHrefFromSearchType(candidate, currentSearchType)
                                    startTransition(() => history.push(href))
                                } else {
                                    setQuery(candidate)
                                    if (inputRef.current) {
                                        inputRef.current.value = candidate
                                        inputRef.current.focus()
                                    }
                                }
                            }}
                            title={`選択して ${candidate} を入力欄に反映 (Shift+選択で直接検索)`}
                        >
                            <div className="searchbox-expand-item-title">
                                <span className="searchbox-expand-item-word">
                                    {candidate}
                                </span>
                                <IconInputSearch className="searchbox-expand-item-actionicon" />
                            </div>
                        </button>
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
            />
        </search>
    )
}

export default Search
