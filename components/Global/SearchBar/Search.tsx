import { IconFolder, IconListNumbers, IconMessageLanguage, IconTag, IconUser } from "@tabler/icons-react"
import { startTransition, useEffect, useRef, useState } from "react"
import { useHistoryContext, useLocationContext } from "../../Router/RouterContext"
import { useSetMessageContext } from "../Contexts/MessageProvider"
import { ExpandableSearchInput } from "./ExpandableSearchInput"

export const searchTypeStrings = {
    search: ["キーワード", "で"],
    search_shorts: ["キーワード", "で"],
    tag: ["タグ", "で"],
    tag_shorts: ["タグ", "で"],
    mylist: ["マイリスト", "を"],
    series: ["シリーズ", "を"],
    user: ["ユーザー", "を"],
} as const
const searchTypeKeys = Object.keys(searchTypeStrings)

// const nvPcSearchTypeKeys = ["keyword", "keyword_shorts", "tag", "tag_shorts", "mylist", "series", "user"] as const

export const searchTypeIcons = [<IconMessageLanguage key="keyword" />, <IconMessageLanguage key="keyword_shorts" />, <IconTag key="tag" />, <IconTag key="tag_shorts" />, <IconFolder key="folder" />, <IconListNumbers key="series" />, <IconUser key="user" />]

function Search({ enableHotKey }: { enableHotKey?: boolean }) {
    const location = useLocationContext()
    const history = useHistoryContext()
    const inputRef = useRef<HTMLInputElement | null>(null)
    const { showAlert } = useSetMessageContext()

    const [currentSearchType, setSearchType] = useState<keyof typeof searchTypeStrings>("search")

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

    useEffect(() => {
        const currentSearchType = returnSearchWhatWeReIn(location.pathname)
        if (currentSearchType) {
            setSearchType(currentSearchType as keyof typeof searchTypeStrings)
        }
    }, [location.pathname])

    function handleSearchTypeChange(key: keyof typeof searchTypeStrings) {
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
                                    handleSearchTypeChange((elem + "_shorts") as keyof typeof searchTypeStrings)
                                } else {
                                    handleSearchTypeChange(elem as keyof typeof searchTypeStrings)
                                }
                            }}
                            title={searchTypeStrings[elem as keyof typeof searchTypeStrings][0]}
                            data-searchtype={elem}
                        >
                            {searchTypeIcons[index]}
                            <span className="searchbox-type-text">{searchTypeStrings[elem as keyof typeof searchTypeStrings][0]}</span>
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
                showAlert={showAlert}
            />
        </search>
    )
}

export default Search
