import { useEffect, useState } from "react"

export interface UseItemSelectionResult {
    selected: Set<string>
    allSelected: boolean
    someSelected: boolean
    toggleOne: (watchId: string) => void
    toggleAll: () => void
    clear: () => void
}

export function useItemSelection<T extends { watchId: string }>(items: T[], pageKey: string): UseItemSelectionResult {
    const [selected, setSelected] = useState<Set<string>>(new Set())

    useEffect(() => {
        setSelected(new Set())
    }, [pageKey])

    const allSelected = items.length > 0 && items.every(item => selected.has(item.watchId))
    const someSelected = selected.size > 0 && !allSelected

    const toggleOne = (watchId: string) => {
        setSelected((prev) => {
            const next = new Set(prev)
            if (next.has(watchId)) {
                next.delete(watchId)
            } else {
                next.add(watchId)
            }
            return next
        })
    }

    const clear = () => {
        setSelected(new Set())
    }

    const toggleAll = () => {
        if (allSelected) {
            clear()
        } else {
            setSelected(new Set(items.map(item => item.watchId)))
        }
    }

    return {
        selected,
        allSelected,
        someSelected,
        toggleOne,
        toggleAll,
        clear,
    }
}
