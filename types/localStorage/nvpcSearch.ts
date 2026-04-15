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
    data: Datum[]
    meta: object
}

interface Datum {
    type: "keyword" | "tag" | "mylist" | "user" | "series"
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
