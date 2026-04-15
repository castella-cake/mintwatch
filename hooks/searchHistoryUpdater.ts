import useServerContext from "./serverContextHook"

function isDateRangeFilterActive(dateRangeFilter: SearchOption["dateRangeFilter"] | undefined): dateRangeFilter is NonNullable<SearchOption["dateRangeFilter"]> {
    return !!dateRangeFilter?.start?.value || !!dateRangeFilter?.end?.value
}

/**
 * 検索オプションのキー配列から、アクティブなソートオプションへResolveする関数
 * @param options
 */
function activeSortResolver<T extends { default: boolean, active: boolean }>(options: T[] | undefined): Omit<T, "active"> | undefined {
    if (options) {
        const activeOption = options.find(option => option.active) ?? options.find(option => option.default)
        if (activeOption) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { active, ...rest } = activeOption
            return rest
        }
    }
    return undefined
}

export function useSearchHistoryUpdater(word: string, type: "keyword" | "tag" | "user" | "mylist" | "series", option?: SearchOption, dependencies: any[] = []) {
    const contextData = useServerContext()
    const { data: nvpcSearchdata, setBrowserLocalStorage } = useBrowserLocalStorage(`nvpc:search:${contextData?.sessionUser?.id ?? "0"}`)
    const searchStorageData = typeof nvpcSearchdata === "string" ? JSON.parse(nvpcSearchdata) as localStorageNvpcSearchRootObject : null
    useEffect(() => {
        if (!contextData?.sessionUser) return
        const currentHistory = searchStorageData?.data.history?.data ?? []
        // SortとPresetFiltersの両方でresolveできることを保証してから追加する
        const newHistorySortOption = option && activeSortResolver(option.sort.key)
            ? {
                    key: activeSortResolver(option.sort.key)!,
                    order: option.sort.order ? activeSortResolver(option.sort.order) : undefined,
                }
            : {
                    key: {
                        label: "ニコニコで人気",
                        value: "hotLikeAndMylist",
                        default: true,
                    },
                }
        const newHistoryPresetFilters = option?.presetFilter && option.presetFilter.every(filter => activeSortResolver(filter.items) !== undefined)
            ? option.presetFilter.map((filter) => {
                    const b = {
                        ...filter,
                        item: activeSortResolver(filter.items)!,
                    }
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { items, ...rest } = b
                    return rest
                })
            : [
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
                ]
        const newHistory = [{ word, type, sort: newHistorySortOption, presetFilters: newHistoryPresetFilters, dateRangeFilter: isDateRangeFilterActive(option?.dateRangeFilter) ? option?.dateRangeFilter : {} }, ...currentHistory.filter(historyItem => historyItem.word !== word)].slice(0, 10)
        const newStorageData: localStorageNvpcSearchRootObject = {
            data: {
                ...searchStorageData ? searchStorageData.data : {},
                history: {
                    data: newHistory,
                    meta: {},
                },
            },
        }
        console.log("DEBUG >>> Updating search history in localStorage with data:", newStorageData)
        setBrowserLocalStorage(newStorageData)
    }, [contextData, searchStorageData, option, word, type, ...dependencies])
}
