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

export function searchHistoryOptionToUrlSearchParams(history: localStorageNvpcSearchHistoryItem): URLSearchParams {
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
