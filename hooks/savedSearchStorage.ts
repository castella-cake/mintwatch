import { useMemo } from "react"
import { useBrowserLocalStorage } from "./browserLocalStorageHook"
import { localStorageNvpcSearchItem, localStorageNvpcSearchRootObject } from "@/types/localStorage/nvpcSearch"
import { SearchOption } from "@/types/search/Option"
import { SavedSearchDuplicatedError, SavedSearchLimitExceededError } from "@/utils/classes/SavedSearchError"

const defaultPresetFilters = [
    {
        query: "kind",
        label: "動画種別",
        item: {
            value: "any",
            label: "指定なし",
            default: true,
        },
    },
    {
        query: "l_range",
        label: "再生時間",
        item: {
            value: 0,
            label: "指定なし",
            default: true,
        },
    },
    {
        query: "f_range",
        label: "投稿日時",
        item: {
            value: 0,
            label: "指定なし",
            default: true,
        },
    },
    {
        query: "genre",
        label: "ジャンル",
        item: {
            value: "all",
            label: "指定なし",
            default: true,
        },
    },
] as const

function isDateRangeFilterActive(dateRangeFilter: SearchOption["dateRangeFilter"] | undefined): dateRangeFilter is NonNullable<SearchOption["dateRangeFilter"]> {
    return !!dateRangeFilter?.start?.value || !!dateRangeFilter?.end?.value
}

function normalizeSavedSearchStorage(rawData: string | null): localStorageNvpcSearchRootObject {
    if (!rawData) return { data: {} }
    try {
        const parsed = JSON.parse(rawData) as localStorageNvpcSearchRootObject
        if (!parsed || typeof parsed !== "object" || !parsed.data) return { data: {} }
        return parsed
    } catch {
        return { data: {} }
    }
}

function createDefaultSort() {
    return {
        key: {
            label: "ニコニコで人気",
            value: "hotLikeAndMylist",
            default: true,
        },
    }
}

function sanitizeItem(item: { label: string, value: number | string, default: boolean }) {
    return {
        label: item.label,
        value: item.value,
        default: item.default,
    }
}

export function createSavedSearchItemFromOption(word: string, type: localStorageNvpcSearchItem["type"], option?: SearchOption): localStorageNvpcSearchItem {
    const sort = option?.sort.key ? activeSortResolver(option.sort.key) : undefined
    const order = sort?.orderable && option?.sort.order ? activeSortResolver(option.sort.order) : undefined
    const presetFilters = option?.presetFilter && option.presetFilter.every(filter => activeSortResolver(filter.items) !== undefined)
        ? option.presetFilter.map((filter) => {
                const item = activeSortResolver(filter.items)
                return {
                    query: filter.query,
                    label: filter.label,
                    item: sanitizeItem(item ?? {
                        label: "指定なし",
                        value: "",
                        default: true,
                    }),
                }
            })
        : defaultPresetFilters.map(filter => ({
                query: filter.query,
                label: filter.label,
                item: filter.item,
            }))

    return {
        word,
        type,
        sort: sort
            ? {
                    key: sanitizeItem(sort),
                    order: order ? sanitizeItem(order) : undefined,
                }
            : createDefaultSort(),
        presetFilters,
        dateRangeFilter: isDateRangeFilterActive(option?.dateRangeFilter) ? option.dateRangeFilter as localStorageNvpcSearchItem["dateRangeFilter"] : {},
    }
}

export function useSavedSearchStorage() {
    const contextData = useAccountContext()
    const storageKey = `nvpc:search:${contextData?.id ?? "0"}`
    const { data: rawData, setBrowserLocalStorage } = useBrowserLocalStorage(storageKey)

    const storage = useMemo(() => {
        if (typeof rawData === "string") {
            return normalizeSavedSearchStorage(rawData)
        }
        if (rawData && typeof rawData === "object") {
            return rawData as localStorageNvpcSearchRootObject
        }
        return { data: {} }
    }, [rawData])

    const savedSearches = storage.data.conditions?.data ?? []

    const persist = (nextSavedSearches: localStorageNvpcSearchItem[]) => {
        setBrowserLocalStorage({
            data: {
                ...storage.data,
                conditions: {
                    data: nextSavedSearches,
                    meta: storage.data.conditions?.meta ?? {},
                },
            },
        })
    }

    const saveSavedSearch = (savedSearchItem: localStorageNvpcSearchItem) => {
        if (savedSearches.some(item => isSameSearchOption(item, savedSearchItem))) {
            throw new SavedSearchDuplicatedError(savedSearchItem)
        }
        const nextSavedSearches = [savedSearchItem, ...savedSearches]
        if (nextSavedSearches.length > 30) {
            throw new SavedSearchLimitExceededError()
        }
        persist(nextSavedSearches)
    }

    const updateSavedSearch = (index: number, updater: (currentValue: localStorageNvpcSearchItem) => localStorageNvpcSearchItem) => {
        const nextSavedSearches = savedSearches.map((item, itemIndex) => (itemIndex === index ? updater(item) : item))
        persist(nextSavedSearches)
    }

    const deleteSavedSearch = (index: number) => {
        const nextSavedSearches = savedSearches.filter((_, itemIndex) => itemIndex !== index)
        persist(nextSavedSearches)
    }

    return {
        storage,
        savedSearches,
        saveSavedSearch,
        updateSavedSearch,
        deleteSavedSearch,
    }
}
