export interface SearchOption {
    sort: Sort
    presetFilter: PresetFilter[] | null
    dateRangeFilter: DateRangeFilter | null
}

interface DateRangeFilter {
    start: Range
    end: Range
}

interface Range {
    label: string
    value: null
}

interface PresetFilter {
    label: string
    query: string
    items: PresetFilterItem[]
}

interface PresetFilterItem {
    label: string
    value: number | string
    active: boolean
    default: boolean
}

interface Sort {
    key: SortKey[]
    order: OptionItem[]
}

interface OptionItem {
    label: string
    value: string | number
    active: boolean
    default: boolean
}

interface SortKey extends OptionItem {
    orderable: boolean
}
