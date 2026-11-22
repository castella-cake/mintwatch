import { IconButterflyFilled, IconLeafFilled, IconSparkles2Filled, IconTrophyFilled } from "@tabler/icons-react"

export const honorClassConfig = {
    50: { icon: IconLeafFilled, label: "プレジャー" },
    100: { icon: IconButterflyFilled, label: "ホープ" },
    200: { icon: IconSparkles2Filled, label: "スター" },
    300: { icon: IconTrophyFilled, label: "レジェンド" },
} as const

export function formatAchievedDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" })
}
