import { useSetMessageContext } from "@/components/Global/Contexts/MessageProvider"
import { useHistoryContext } from "../../Router/RouterContext"
import "./styles/FilterSelector.css"
import { useState } from "react"

export function FilterSelector({ option }: { option: SearchOption }) {
    const { showAlert } = useSetMessageContext()
    const history = useHistoryContext()
    const [pendingChanges, setPendingChanges] = useState(new Map())
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const [isDateRangeFilterTempActive, setIsDateRangeFilterTempActive] = useState(false)

    const applyChanges = () => {
        if (isDateRangeFilterTempActive && !pendingChanges.has("start") && !pendingChanges.has("end")) {
            showAlert({ title: "日付範囲が指定されていません", body: "投稿日時フィルターが「範囲指定」に設定されましたが、日付が指定されていません。\n日付範囲を指定するか、投稿日時フィルターをプリセットから選択してください。" })
        }
        if (pendingChanges.size === 0) return

        const currentUrl = new URL("https://www.nicovideo.jp" + location.pathname + location.search)
        pendingChanges.forEach((value, key) => {
            currentUrl.searchParams.set(key, value.toString())
            if (key === "f_range") {
                currentUrl.searchParams.delete("start")
                currentUrl.searchParams.delete("end")
            }
        })
        history.push(currentUrl.toString())
        setPendingChanges(new Map())
    }

    const isCurrentQueryDateRangeFiltered = option.dateRangeFilter?.start.value !== null
        || option.dateRangeFilter?.end.value !== null
    const isDateRangeFilterActive = isDateRangeFilterTempActive || isCurrentQueryDateRangeFiltered

    if (!option.presetFilter || option.presetFilter.length === 0) return

    return (
        <details
            className="search-filters"
            onToggle={(e) => {
                setIsDetailsOpen(e.currentTarget.open)
            }}
            open={isDetailsOpen}
        >
            <summary className="search-filters-summary">
                <span>
                    フィルター設定
                </span>
                { isDetailsOpen && (
                    <button
                        className="search-filters-apply"
                        onClick={applyChanges}
                        aria-disabled={pendingChanges.size === 0}
                    >
                        設定を適用
                    </button>
                )}
            </summary>
            <div className="search-filters-presets">
                {option.presetFilter && option.presetFilter.map((preset) => {
                    return (
                        <div className="search-preset" key={preset.query}>
                            <div className="search-preset-label">
                                {preset.label}
                            </div>
                            <div className="search-preset-items">
                                {preset.items.map((item) => {
                                    // wtf is this
                                    const isSelected = (
                                        (preset.query === "f_range" && isDateRangeFilterTempActive)
                                            ? false
                                            : pendingChanges.has(preset.query)
                                                ? pendingChanges.get(preset.query) === item.value
                                                : (preset.query !== "f_range" || !isCurrentQueryDateRangeFiltered) && item.active
                                    )
                                    return (
                                        <button
                                            className="search-preset-selector"
                                            key={item.value}
                                            title={`${item.label}に切り替え`}
                                            onClick={() => {
                                                if (preset.query === "f_range") {
                                                    setIsDateRangeFilterTempActive(false)
                                                }
                                                setPendingChanges((prev) => {
                                                    const next = new Map(prev)
                                                    next.set(preset.query, item.value)
                                                    if (preset.query === "f_range") {
                                                        next.delete("start")
                                                        next.delete("end")
                                                    }
                                                    return next
                                                })
                                            }}
                                            data-is-active={isSelected}
                                        >
                                            {item.label}
                                        </button>
                                    )
                                })}
                                {preset.query === "f_range" && option.dateRangeFilter && (
                                    <button
                                        title="日付範囲指定に切り替え"
                                        className="search-preset-selector"
                                        data-is-active={!pendingChanges.has("f_range") && isDateRangeFilterActive}
                                        onClick={() => {
                                            setIsDateRangeFilterTempActive(true)
                                            setPendingChanges((prev) => {
                                                const next = new Map(prev)
                                                next.delete("f_range")
                                                return next
                                            })
                                        }}
                                    >
                                        範囲指定
                                    </button>
                                )}
                                { isDateRangeFilterActive && preset.query === "f_range" && option.dateRangeFilter && (
                                    <div className="search-date-range">
                                        {Object.keys(option.dateRangeFilter).map((key) => {
                                            const filter = option.dateRangeFilter![key as keyof typeof option.dateRangeFilter]
                                            return (
                                                <label key={key}>
                                                    <span>{filter.label}</span>
                                                    <input
                                                        type="date"
                                                        defaultValue={filter.value ?? undefined}
                                                        max={new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\//g, "-")}
                                                        onChange={(e) => {
                                                            setPendingChanges((prev) => {
                                                                const next = new Map(prev)
                                                                if (e.target.value !== "") {
                                                                    next.set(key, e.target.value)
                                                                } else {
                                                                    next.delete(key)
                                                                }
                                                                return next
                                                            })
                                                        }}
                                                    >
                                                    </input>
                                                </label>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

        </details>
    )
}
