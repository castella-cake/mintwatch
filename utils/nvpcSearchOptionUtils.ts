import { localStorageNvpcSearchItem } from "@/types/localStorage/nvpcSearch"

export function searchHistoryOptionToStrings(history: localStorageNvpcSearchItem): string[] {
    const result: string[] = []

    if (history.type.includes("_shorts")) {
        result.push("ショート")
    }

    history.presetFilters.forEach((filter) => {
        if (!filter.item.default) {
            result.push(`${filter.item.label}`)
        }
    })

    if (history.dateRangeFilter.start?.value || history.dateRangeFilter.end?.value) {
        let dateRangeString = ""
        if (history.dateRangeFilter.start?.value) {
            dateRangeString = `${history.dateRangeFilter.start.value.replace(/-/g, "/")}`
        }
        dateRangeString += "~"
        if (history.dateRangeFilter.end?.value) {
            dateRangeString += `${history.dateRangeFilter.end.value.replace(/-/g, "/")}`
        }
        result.push(dateRangeString)
    }

    result.push(history.sort.key.label)

    if (history.sort.order && !history.sort.order.default) {
        result.push(history.sort.order.label)
    }

    return result
}

export function searchHistoryOptionToUrlSearchParams(history: localStorageNvpcSearchItem): URLSearchParams {
    const params = new URLSearchParams()

    history.presetFilters.forEach((filter) => {
        if (!filter.item.default) {
            params.append(filter.query, filter.item.value.toString())
        }
    })

    if (history.dateRangeFilter.start?.value) {
        params.append("start", history.dateRangeFilter.start.value)
    }

    if (history.dateRangeFilter.end?.value) {
        params.append("end", history.dateRangeFilter.end.value)
    }

    if (history.sort?.key && !history.sort.key.default) {
        params.append("sort", history.sort.key.value.toString())
    }

    if (history.sort?.order && !history.sort.order.default) {
        params.append("order", history.sort.order.value.toString())
    }

    return params
}

/**
 * 検索オプションのキー配列から、アクティブなソートオプションへResolveする関数
 * @param options boolean で active と default を持つオブジェクトの配列
 */
export function activeSortResolver<T extends { default: boolean, active: boolean }>(options: T[] | undefined): Omit<T, "active"> | undefined {
    if (!options) return undefined
    const activeOption = options.find(option => option.active) ?? options.find(option => option.default)
    if (!activeOption) return undefined
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { active, ...rest } = activeOption
    return rest
}

export function PresetFilterToObject(filter: localStorageNvpcSearchItem["presetFilters"]) {
    return Object.fromEntries(filter.map(f => [f.query, f.item.value]))
}

export function isSameSearchOption(a: localStorageNvpcSearchItem, b: localStorageNvpcSearchItem): boolean {
    if (a.word !== b.word) return false

    if (a.type !== b.type) return false

    if (a.sort.key.value !== b.sort.key.value) return false

    if (a.sort.order?.value !== b.sort.order?.value) return false

    const aPreset = PresetFilterToObject(a.presetFilters)
    const bPreset = PresetFilterToObject(b.presetFilters)
    if (Object.keys(aPreset).length !== Object.keys(bPreset).length) return false
    for (const key in aPreset) {
        if (aPreset[key] !== bPreset[key]) return false
    }

    if (a.dateRangeFilter.start?.value !== b.dateRangeFilter.start?.value) return false
    if (a.dateRangeFilter.end?.value !== b.dateRangeFilter.end?.value) return false

    return true
}
