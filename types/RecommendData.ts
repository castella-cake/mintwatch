// JSON to TS で生成したものを手直ししたものです

import { MylistItem } from "./generic/MylistItemData"

// mylistの扱いとかもうちょっと修正したいですが、とりあえず名前の書き直しだけしています
export interface RecommendDataRootObject extends baseResponse {
    data?: Data
}

interface Data {
    recipe: Recipe
    recommendId: string
    items: RecommendItem[]
}

export interface RecommendItem {
    id: string
    contentType: string
    recommendType: string
    content: VideoItem | MylistItem
}

interface Recipe {
    id: string
    meta: null
}
