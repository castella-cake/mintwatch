import { useLocationContext, useHistoryContext } from "../../Router/RouterContext"
import { OptionSelector } from "../../Global/OptionSelector"
import type { ReactNode } from "react"
import type { SearchOption } from "@/types/search/Option"

interface SearchOptionSelectorProps {
    option: SearchOption
    children?: ReactNode
}

export function SearchOptionSelector({ option, children }: SearchOptionSelectorProps) {
    const { searchEnableGridCardLayout } = useStorageVar(["searchEnableGridCardLayout"], "local")
    const history = useHistoryContext()
    const location = useLocationContext()

    const pushSearchUrl = (apply: (url: URL) => void) => {
        const currentUrl = new URL("https://www.nicovideo.jp" + location.pathname + location.search)
        apply(currentUrl)
        history.push(currentUrl.toString())
    }

    return (
        <OptionSelector
            order={option.sort.order}
            onOrderChanged={(value) => {
                pushSearchUrl((currentUrl) => {
                    currentUrl.searchParams.set("order", value.toString())
                })
            }}
            sortKey={option.sort.key}
            onSortKeyChanged={(value) => {
                pushSearchUrl((currentUrl) => {
                    currentUrl.searchParams.set("sort", value.toString())
                    const defaultOrder = option.sort.order.find(order => order.default)
                    if (defaultOrder) currentUrl.searchParams.set("order", defaultOrder.value.toString())
                })
            }}
            gridSwitcherEnabled={searchEnableGridCardLayout ?? false}
            onLayoutSwitch={(enabled) => {
                storage.setItem("local:searchEnableGridCardLayout", enabled)
            }}

            additionalClassName="search-options"
        >
            {children}
        </OptionSelector>
    )
}
