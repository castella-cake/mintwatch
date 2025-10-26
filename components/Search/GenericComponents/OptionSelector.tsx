import { IconLayoutGrid, IconListDetails, IconSortAscending, IconSortDescending } from "@tabler/icons-react"
import { useHistoryContext } from "../../Router/RouterContext"
import "./styles/OptionSelector.css"

export function OptionSelector(page: { option: SearchOption, isGridOptionUnavailable?: boolean }) {
    const { searchEnableGridCardLayout } = useStorageVar(["searchEnableGridCardLayout"], "local")
    const history = useHistoryContext()
    return (
        <div className="search-options">
            <div className="search-option-switcher" data-switcher-type="sortorder" aria-disabled={!page.option.sort.key.find(key => key.active)?.orderable}>
                { page.option.sort.order.map((order) => {
                    return (
                        <button
                            className="search-sortorder-selector"
                            key={order.value}
                            title={`${order.label}に切り替え`}
                            onClick={() => {
                                const currentUrl = new URL("https://www.nicovideo.jp" + location.pathname + location.search)
                                currentUrl.searchParams.set("order", order.value.toString())
                                history.push(currentUrl.toString())
                            }}
                            data-is-active={order.active}
                        >
                            {order.value === "asc" && <IconSortAscending />}
                            {order.value === "desc" && <IconSortDescending />}
                        </button>
                    )
                })}
            </div>
            <select
                className="search-sortkey-selector"
                value={page.option.sort.key.find(key => key.active)?.value}
                onChange={(e) => {
                    const currentUrl = new URL("https://www.nicovideo.jp" + location.pathname + location.search)
                    currentUrl.searchParams.set("sort", e.target.value)
                    const defaultOrder = page.option.sort.order.find(order => order.default)
                    if (defaultOrder) currentUrl.searchParams.set("order", defaultOrder.value.toString())
                    history.push(currentUrl.toString())
                }}
            >
                {page.option.sort.key.map((key) => {
                    return (
                        <option className="search-sortkey-selector" key={key.value} value={key.value}>
                            {key.label}
                        </option>
                    )
                })}
            </select>
            <div className="search-option-switcher" data-switcher-type="display" aria-disabled={page.isGridOptionUnavailable}>
                <button title="リスト表示" data-is-active={!searchEnableGridCardLayout} onClick={() => { storage.setItem("local:searchEnableGridCardLayout", false) }}><IconListDetails /></button>
                <button title="グリッド表示" data-is-active={searchEnableGridCardLayout} onClick={() => { storage.setItem("local:searchEnableGridCardLayout", true) }}><IconLayoutGrid /></button>
            </div>
        </div>
    )
}
