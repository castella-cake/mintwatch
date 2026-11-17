import { IconLayoutGrid, IconListDetails } from "@tabler/icons-react"
import "./styleModules/GenericOptionSelector.css"

export function DisplaySwitcher({ gridSwitcherEnabled, onLayoutSwitch }: { gridSwitcherEnabled: boolean, onLayoutSwitch: (enabled: boolean) => void }) {
    return (
        <div className="generic-option-switcher" data-switcher-type="display">
            <button type="button" title="リスト表示" data-is-active={!gridSwitcherEnabled} onClick={() => { onLayoutSwitch(false) }}>
                <IconListDetails />
            </button>
            <button type="button" title="グリッド表示" data-is-active={gridSwitcherEnabled} onClick={() => { onLayoutSwitch(true) }}>
                <IconLayoutGrid />
            </button>
        </div>
    )
}
