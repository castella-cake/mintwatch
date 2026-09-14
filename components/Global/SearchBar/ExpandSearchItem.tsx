import { IconInputSearch, IconSearch } from "@tabler/icons-react"
import { ReactNode, startTransition } from "react"
import { useHistoryContext } from "../../Router/RouterContext"
import { searchTypeIcons, searchTypeStrings } from "./Search"

export function ExpandSearchInputItem({
    ref,
    candidate,
    type,
    additionalSearchOptions,
    optionText,
    inputRef,
    setQuery,
    isAnchor = false,
    showIcon = false,
    onKeyDown,
    ...additionalAttributes
}: {
    ref?: React.Ref<HTMLButtonElement | null>
    candidate: string
    type: keyof typeof searchTypeStrings
    additionalSearchOptions?: URLSearchParams
    optionText?: ReactNode
    inputRef: React.RefObject<HTMLInputElement | null>
    setQuery: React.Dispatch<React.SetStateAction<string>>
    showIcon?: boolean
    isAnchor?: boolean
    onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>
}) {
    const history = useHistoryContext()
    return (
        <button
            ref={ref}
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
            onKeyDown={onKeyDown}
            title={`選択して ${candidate} ${isAnchor ? `で${searchTypeStrings[type][0]}検索` : `を入力欄に反映`} (Shift+選択で${isAnchor ? "入力欄に反映" : `${searchTypeStrings[type][0]}検索`})`}
            {...additionalAttributes}
        >
            <div className="searchbox-expand-item-title">
                {showIcon && Object.keys(searchTypeStrings).indexOf(type) !== -1 && searchTypeIcons[Object.keys(searchTypeStrings).indexOf(type)]}
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
