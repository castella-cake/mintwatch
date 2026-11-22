import { IconButterflyFilled, IconLeafFilled, IconSparkles2Filled, IconTrophyFilled } from "@tabler/icons-react"

const honorClassConfig = {
    50: { icon: IconLeafFilled, label: "プレジャー" },
    100: { icon: IconButterflyFilled, label: "ホープ" },
    200: { icon: IconSparkles2Filled, label: "スター" },
    300: { icon: IconTrophyFilled, label: "レジェンド" },
} as const

function formatAchievedDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" })
}

export function AchievementCard({ item }: { item: AchievedHistoryItem }) {
    const { achievement, achieved_at, result_value } = item
    const config = honorClassConfig[achievement.honor_class]
    const Icon = config.icon

    return (
        <div className="achievement-card" data-honor-class={achievement.honor_class}>
            <div className="achievement-card-icon">
                <Icon aria-hidden="true" />
            </div>
            <div className="achievement-card-content">
                <div className="achievement-card-title">
                    {achievement.name}
                    {result_value && (
                        <span className="achievement-card-result">{result_value}</span>
                    )}
                </div>
                <div className="achievement-card-description">{achievement.description}</div>
                <div className="achievement-card-meta">
                    <span data-honor-class={achievement.honor_class}>
                        {config.label}
                        クラス
                    </span>
                    <span>
                        実績獲得日:
                        {" "}
                        {formatAchievedDate(achieved_at)}
                    </span>
                    {achievement.related_url && (
                        <a
                            href={achievement.related_url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            関連ページを見る
                        </a>
                    )}
                </div>
            </div>
        </div>
    )
}
