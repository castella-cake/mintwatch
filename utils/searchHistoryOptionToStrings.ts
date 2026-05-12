import { localStorageNvpcSearchHistoryItem } from "@/types/localStorage/nvpcSearch"

export function searchHistoryOptionToStrings(history: localStorageNvpcSearchHistoryItem): string[] {
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
