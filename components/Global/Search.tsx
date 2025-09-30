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

function Search() {
    const location = useLocationContext()
    const history = useHistoryContext()
    const [isComposing, setIsComposing] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const [currentSearchType, setSearchType] = useState<keyof typeof searchType>("search")
    const [query, setQuery] = useState("")
    const { data: expandData } = useSearchExpandData(query)

    useEffect(() => {
        const currentSearchType = returnSearchWhatWeReIn(location.pathname)
        if (currentSearchType) {
            setSearchType(currentSearchType as keyof typeof searchType)
        }
    }, [location.pathname])

    const startComposition = () => setIsComposing(true)
    const endComposition = () => setIsComposing(false)

    function handleEnter(keyName: string) {
        if (!isComposing && keyName === "Enter") {
            onSearch()
        }
    }
    function onSearch() {
        if (!inputRef.current) return
        const href = returnHrefFromSearchType(inputRef.current.value, currentSearchType)
        history.push(href)
    }
    function handleSearchTypeChange(key: keyof typeof searchType) {
        if (inputRef.current && returnSearchWord(location.pathname) === inputRef.current.value && inputRef.current.value.trim() !== "") {
            const href = returnHrefFromSearchType(inputRef.current.value, key)
            startTransition(() => history.push(href))
        }
        setSearchType(key)
    }
    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        setQuery(event.target.value)
    }

    return (
        <div className="searchbox-container" id="pmw-searchbox" data-in-search-page={returnSearchWhatWeReIn(location.pathname) !== undefined}>
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
                    defaultValue={returnSearchWord(location.pathname)}
                    key={location.pathname}
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
        </div>
    )
}

function returnHrefFromSearchType(keyword: string, type: keyof typeof searchType) {
    let href = `https://www.nicovideo.jp/search/${encodeURIComponent(keyword)}`
    if (type === "tag") {
        href = `https://www.nicovideo.jp/tag/${encodeURIComponent(keyword)}`
    } else if (type === "mylist") {
        href = `https://www.nicovideo.jp/mylist_search/${encodeURIComponent(keyword)}`
    } else if (type === "series") {
        href = `https://www.nicovideo.jp/series_search/${encodeURIComponent(keyword)}`
    } else if (type === "user") {
        href = `https://www.nicovideo.jp/user_search/${encodeURIComponent(keyword)}`
    }
    return href
}

export default Search
