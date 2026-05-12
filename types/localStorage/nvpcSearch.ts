export interface localStorageNvpcSearchRootObject {
    data: Data
}

interface Data {
    history?: History
    isFollowedTagMigrated?: IsFollowedTagMigrated
    conditions?: Conditions
}

interface Conditions {
    data: any[]
    meta: object
}

interface IsFollowedTagMigrated {
    data: boolean
    meta: object
}

interface History {
    data: localStorageNvpcSearchHistoryItem[]
    meta: object
}

export interface localStorageNvpcSearchHistoryItem {
    type: "keyword" | "keyword_shorts" | "tag" | "tag_shorts" | "mylist" | "user" | "series"
    word: string
    sort: Sort
    presetFilters: PresetFilter[]
    dateRangeFilter: DateRangeFilter
}

interface Sort {
    key: Item
    order?: Item
}

interface DateRangeFilter {
    start?: Start
    end?: Start
}

interface Start {
    label: string
    value: string
}

interface PresetFilter {
    query: string
    label: string
    item: Item
}

interface Item {
    label: string
    value: number | string
    default: boolean
}
