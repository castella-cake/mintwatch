import { useMylistsData } from "@/hooks/apiHooks/watch/mylistsData"
import { useEffect, useRef } from "react"

export interface MylistItemActionBarProps {
    items: Array<{ watchId: string, videoId: string, title?: string }>
    selectedIds: Set<string>
    onToggleOne: (watchId: string) => void
    onToggleAll: () => void
    allSelected: boolean
    someSelected: boolean
    currentSourceId: number | "deflist"
    selectedDestinationId: number | null
    onSelectDestination: (id: number | null) => void
    onMove: () => void
    onCopy: () => void
    onDelete: () => void
    isProcessing: boolean
}

export function MylistItemActionBar({
    items,
    selectedIds,
    onToggleOne,
    onToggleAll,
    allSelected,
    someSelected,
    currentSourceId,
    selectedDestinationId,
    onSelectDestination,
    onMove,
    onCopy,
    onDelete,
    isProcessing,
}: MylistItemActionBarProps) {
    const { mylistsData } = useMylistsData("me", 1)
    const destinationMylists = (mylistsData?.data.mylists ?? []).map(m => ({ id: m.id, name: m.name }))

    const checkboxRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (checkboxRef.current) {
            checkboxRef.current.indeterminate = someSelected
        }
    }, [someSelected])

    const selectLabel = allSelected ? "選択解除" : "すべて選択"
    const hasSelection = selectedIds.size > 0
    const canMoveOrCopy = hasSelection && selectedDestinationId !== null && !isProcessing
    const canDelete = hasSelection && !isProcessing

    return (
        <div className="user-videolist-actionbar-container">
            <div className="user-videolist-actionbar-left">
                <label className="user-videolist-actionbar-selectall">
                    <input
                        ref={checkboxRef}
                        type="checkbox"
                        checked={allSelected}
                        onChange={onToggleAll}
                        disabled={isProcessing}
                    />
                    <span>{selectLabel}</span>
                </label>
                { selectedIds.size > 0 && (
                    <span className="user-videolist-actionbar-count">
                        {selectedIds.size}
                        件選択中
                    </span>
                )}
            </div>
            <div className="user-videolist-actionbar-spacer" />
            <div className="user-videolist-actionbar-right">
                <label className="user-videolist-actionbar-destination">
                    <span className="user-videolist-actionbar-destination-label">移動先マイリスト</span>
                    <select
                        value={selectedDestinationId ?? ""}
                        onChange={(e) => {
                            const value = e.target.value
                            onSelectDestination(value === "" ? null : Number.parseInt(value, 10))
                        }}
                        disabled={isProcessing}
                    >
                        <option value="">選択してください</option>
                        {destinationMylists
                            .filter(mylist => mylist.id !== currentSourceId)
                            .map(mylist => (
                                <option key={mylist.id} value={mylist.id}>
                                    {mylist.name}
                                </option>
                            ))}
                    </select>
                </label>
                <button
                    type="button"
                    className="user-videolist-actionbar-button"
                    onClick={onMove}
                    disabled={!canMoveOrCopy}
                >
                    移動する
                </button>
                <button
                    type="button"
                    className="user-videolist-actionbar-button"
                    onClick={onCopy}
                    disabled={!canMoveOrCopy}
                >
                    コピーする
                </button>
                <span className="user-videolist-actionbar-divider" aria-hidden="true">|</span>
                <button
                    type="button"
                    className="user-videolist-actionbar-button user-videolist-actionbar-button-destructive"
                    onClick={onDelete}
                    disabled={!canDelete}
                >
                    削除する
                </button>
            </div>
        </div>
    )
}
