import { useHistoryContext } from "../Router/RouterContext"

export function FilterSelector({ option }: { option: SearchOption }) {
    const history = useHistoryContext()
    return (
        <div className="search-filters">
            {option.presetFilter.map((preset) => {
                return (
                    <div className="search-preset" key={preset.query}>
                        <div className="search-preset-label">
                            {preset.label}
                            :
                            {" "}
                            {preset.query}
                        </div>
                        <div className="search-preset-items">
                            {preset.items.map((item) => {
                                return (
                                    <button
                                        className="search-preset-selector"
                                        key={item.value}
                                        title={`${item.label}に切り替え`}
                                        onClick={() => {
                                            const currentUrl = new URL("https://www.nicovideo.jp" + location.pathname + location.search)
                                            currentUrl.searchParams.set(preset.query, item.value.toString())
                                            history.push(currentUrl.toString())
                                        }}
                                        data-is-active={item.active}
                                    >
                                        {item.label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
