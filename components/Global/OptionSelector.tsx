import { IconLayoutGrid, IconListDetails, IconSortAscending, IconSortDescending } from "@tabler/icons-react"
import { useId, type ReactNode } from "react"
import "./styleModules/GenericOptionSelector.css"

export interface OptionSelectorItem {
    label: string
    value: string | number
    active: boolean
    default?: boolean
    orderable?: boolean
}

export interface OptionSelectorProps {
    order: OptionSelectorItem[]
    onOrderChanged: (value: string | number) => void
    sortKey: OptionSelectorItem[]
    onSortKeyChanged: (value: string | number) => void
    gridSwitcherEnabled: boolean
    onLayoutSwitch: (enabled: boolean) => void
    additionalClassName?: string
    children?: ReactNode
}

export function OptionSelector({ order, onOrderChanged, sortKey, onSortKeyChanged, gridSwitcherEnabled, onLayoutSwitch, additionalClassName, children }: OptionSelectorProps) {
    const sortKeySelectorId = useId()

    const activeSortKey = sortKey.find(key => key.active)
    const isOrderSwitcherDisabled = activeSortKey?.orderable === false

    return (
        <div className={`generic-optionselector ${additionalClassName || ""}`}>
            <div className="generic-option-switcher" data-switcher-type="sortorder" aria-disabled={isOrderSwitcherDisabled}>
                {order.map((item) => {
                    return (
                        <button
                            className="generic-sortorder-selector"
                            key={item.value}
                            title={`${item.label}に切り替え`}
                            onClick={() => {
                                onOrderChanged(item.value)
                            }}
                            data-is-active={item.active}
                        >
                            {item.value === "asc" && <IconSortAscending />}
                            {item.value === "desc" && <IconSortDescending />}
                        </button>
                    )
                })}
            </div>
            <select
                className="generic-sortkey-selector"
                value={activeSortKey?.value ?? ""}
                onChange={(e) => {
                    onSortKeyChanged(e.target.value)
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
            <div className="generic-option-switcher" data-switcher-type="display">
                <button title="リスト表示" data-is-active={!gridSwitcherEnabled} onClick={() => { onLayoutSwitch(false) }}><IconListDetails /></button>
                <button title="グリッド表示" data-is-active={gridSwitcherEnabled} onClick={() => { onLayoutSwitch(true) }}><IconLayoutGrid /></button>
            </div>
            {children}
        </div>
    )
}
