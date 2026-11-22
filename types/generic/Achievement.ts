export interface AchievedHistoryItem {
    id: number
    user_id: number
    result_value: string | null
    achieved_at: string
    achievement: AchievementItem
    content: Content | null
}

interface Content {
    type: string
    id: string
    common: Common
}

interface Common {
    is_sensitive: boolean
    title: string
    url: string
    thumbnail_url: string
}

export interface AchievementItem {
    key: string
    name: string
    description: string
    related_url: null | string
    honor_class: 50 | 100 | 200 | 300 // プレジャー(緑), ホープ(青), スター(赤紫), レジェンド(黄)
    group_keys: string[]
}
