import { IconFolder, IconMessageLanguage, IconSearch, IconTag } from "@tabler/icons-react"
import { useRef, useState } from "react"
import { useHistoryContext, useLocationContext } from "../Router/RouterContext"

function Search() {
    const location = useLocationContext()
    const history = useHistoryContext()
    const [isComposing, setIsComposing] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const searchTypes = {
        KEYWORD: 0,
        TAG: 1,
        MYLIST: 2,
    }

    const [currentSearchType, setSearchType] = useState(searchTypes.KEYWORD)

    const startComposition = () => setIsComposing(true)
    const endComposition = () => setIsComposing(false)
    const searchTypeTexts = ["キーワード", "タグ", "マイリスト"]
    const searchTypeIcons = [<IconMessageLanguage key="keyword" />, <IconTag key="tag" />, <IconFolder key="folder" />]

    function handleEnter(keyName: string) {
        if (!isComposing && keyName === "Enter") {
            onSearch()
        }
    }
    function onSearch() {
        if (!inputRef.current) return
        let href = `https://www.nicovideo.jp/search/${inputRef.current.value}`
        if (currentSearchType === searchTypes.TAG) {
            href = `https://www.nicovideo.jp/tag/${inputRef.current.value}`
        } else if (currentSearchType === searchTypes.MYLIST) {
            href = `https://www.nicovideo.jp/mylist_search/${inputRef.current.value}`
        }
        history.push(href)
    }
    return (
        <div className="searchbox-container" id="pmw-searchbox">
            <div className="searchbox-typeselector">
                { Object.keys(searchTypes).map((elem, index) => {
                    const isActive = currentSearchType === index
                    return (
                        <button key={index} className={`searchbox-type-item${isActive ? " searchbox-type-active" : ""}`} onClick={() => setSearchType(index)} title={searchTypeTexts[index]}>
                            {searchTypeIcons[index]}
                            <span className="searchbox-type-text">{searchTypeTexts[index]}</span>
                        </button>
                    )
                })}
            </div>
            <div className="searchbox-inputcontainer">
                <input
                    type="text"
                    ref={inputRef}
                    placeholder={`${searchTypeTexts[currentSearchType]}で検索...`}
                    onKeyDown={(e) => { handleEnter(e.key) }}
                    onCompositionStart={startComposition}
                    onCompositionEnd={endComposition}
                    defaultValue={returnSearchWord(location.pathname)}
                    key={location.pathname}
                />
                <button onClick={() => { onSearch() }} type="button" title="検索"><IconSearch /></button>
            </div>
        </div>
    )
}

export default Search
