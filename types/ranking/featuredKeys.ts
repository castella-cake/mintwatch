// customData.ts からも使われるのでbaseResponseを継承しないものもエクスポート
export interface RankingTeibanFeaturedKeysDataRootObject extends RankingTeibanFeaturedKeysData, baseResponse {}

export interface RankingTeibanFeaturedKeysData {
    data: Data
}

interface Data {
    items: Item[]
    definition: Definition
}

interface Definition {
    maxItemCount: MaxItemCount
}

interface MaxItemCount {
    teiban: number
    trendTag: number
    forYou: number
}

interface Item {
    featuredKey: string
    label: string
    isEnabledTrendTag: boolean
    isMajorFeatured: boolean
    isTopLevel: boolean
    isImmoral: boolean
    isEnabled: boolean
}
