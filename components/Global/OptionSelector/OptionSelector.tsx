import { IconSortAscending, IconSortDescending } from "@tabler/icons-react"
import { useId, type ReactNode } from "react"
import { DisplaySwitcher } from "./DisplaySwitcher"
import "./styleModules/GenericOptionSelector.css"

export interface OptionSelectorItem {
    label: string
    value: string | number
    active: boolean
    default?: boolean
    orderable?: boolean
}

export interface OptionSelectorProps {
    order?: OptionSelectorItem[]
    onOrderChanged?: (value: string | number) => void
    sortKey?: OptionSelectorItem[]
    onSortKeyChanged?: (value: string | number) => void
    gridSwitcherEnabled?: boolean
    onLayoutSwitch?: (enabled: boolean) => void
    additionalClassName?: string
    children?: ReactNode
}

/**
 * オプションコントローラー。プロップが渡されたセクションだけを表示する。
 * - order + onOrderChanged: 昇順/降順切替ボタン
 * - sortKey + onSortKeyChanged: ソートキーの select
 * - onLayoutSwitch: リスト/グリッド表示切替ボタン
 */
export function OptionSelector({ order, onOrderChanged, sortKey, onSortKeyChanged, gridSwitcherEnabled, onLayoutSwitch, additionalClassName, children }: OptionSelectorProps) {
    const sortKeySelectorId = useId()

    const activeSortKey = sortKey?.find(key => key.active)
    const isOrderSwitcherDisabled = activeSortKey?.orderable === false

    return (
        <div className={`generic-optionselector ${additionalClassName || ""}`}>
            {order && order.length > 0 && (
                <div className="generic-option-switcher" data-switcher-type="sortorder" aria-disabled={isOrderSwitcherDisabled}>
                    {order.map((item) => {
                        return (
                            <button
                                type="button"
                                className="generic-sortorder-selector"
                                key={item.value}
                                title={`${item.label}に切り替え`}
                                onClick={() => {
                                    onOrderChanged?.(item.value)
                                }}
                                data-is-active={item.active}
                            >
                                {item.value === "asc" && <IconSortAscending />}
                                {item.value === "desc" && <IconSortDescending />}
                            </button>
                        )
                    })}
                </div>
            )}
            {sortKey && sortKey.length > 0 && (
                <select
                    className="generic-sortkey-selector"
                    value={activeSortKey?.value ?? ""}
                    onChange={(e) => {
                        onSortKeyChanged?.(e.target.value)
                    }}
                    id={sortKeySelectorId}
                >
                    {sortKey.map((item) => {
                        return (
                            <option className="generic-sortkey-selector" key={item.value} value={item.value}>
                                {item.label}
                            </option>
                        )
                    })}
                </select>
            )}
            {onLayoutSwitch && (
                <DisplaySwitcher gridSwitcherEnabled={gridSwitcherEnabled ?? false} onLayoutSwitch={onLayoutSwitch} />
            )}
            {children}
        </div>
    )
}
