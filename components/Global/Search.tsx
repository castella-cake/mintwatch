import { IconFolder, IconListNumbers, IconMessageLanguage, IconSearch, IconTag, IconUser } from "@tabler/icons-react"
import { startTransition, useEffect, useRef, useState } from "react"
import { useHistoryContext, useLocationContext } from "../Router/RouterContext"
import { useSearchExpandData } from "@/hooks/apiHooks/useSearchExpandData"

const searchType = {
    search: ["キーワード", "で"],
    tag: ["タグ", "で"],
    mylist: ["マイリスト", "を"],
    series: ["シリーズ", "を"],
    user: ["ユーザー", "を"],
} as const
const searchTypeKeys = Object.keys(searchType)
const searchTypeIcons = [<IconMessageLanguage key="keyword" />, <IconTag key="tag" />, <IconFolder key="folder" />, <IconListNumbers key="series" />, <IconUser key="user" />]

function ExpandableSearchInput({ inputRef, currentSearchType, initialValue, onSearch: handleSearch, enableHotKey }: {
    inputRef: React.RefObject<HTMLInputElement | null>
    currentSearchType: keyof typeof searchType
    initialValue: string
    onSearch: (value: string) => void
    enableHotKey?: boolean
}) {
    const history = useHistoryContext()
    const [isComposing, setIsComposing] = useState(false)
    const [query, setQuery] = useState(initialValue)
    const { data: expandData } = useSearchExpandData(query)

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
            />
            <button onClick={() => onSearch()} type="button" title="検索">
                <IconSearch />
            </button>
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
                            {candidate}
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
                    const isActive = currentSearchType === elem
                    return (
                        <button
                            key={elem}
                            className={`searchbox-type-item${isActive ? " searchbox-type-active" : ""}`}
                            onClick={() => handleSearchTypeChange(elem as keyof typeof searchType)}
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
