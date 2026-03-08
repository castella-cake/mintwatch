import { useLocationContext } from "@/components/Router/RouterContext"
import { NavigationAnchorButton } from "../Navigation"
import { ActivitiesTimeline } from "@/components/Global/Activities/ActivitiesTimeline"
import "../styles/TimelineContent.css"

const validTypes = ["publish", "video", "live", "all"] as const

export function TimelineContent({ thisUserPageId }: { thisUserPageId?: number }) {
    const location = useLocationContext()
    const hrefPrefix = thisUserPageId ? `/user/${thisUserPageId}/timeline` : `/my/timeline`
    const currentType = location.pathname.replace(`${hrefPrefix}/`, "").replace("postings", "publish")
    return (
        <div className="user-timeline user-category-container">
            <div className="user-timeline-sidearea user-category-sidearea">
                <div className="user-timeline-sidearea-title">
                    種別選択
                </div>
                <NavigationAnchorButton href={`${hrefPrefix}/postings`} otherMatchings={[`/user/${thisUserPageId}`]}>
                    コンテンツ投稿
                </NavigationAnchorButton>
                <NavigationAnchorButton href={`${hrefPrefix}/video`}>
                    動画投稿
                </NavigationAnchorButton>
                <NavigationAnchorButton href={`${hrefPrefix}/live`}>
                    生放送
                </NavigationAnchorButton>
                <NavigationAnchorButton href={`${hrefPrefix}/all`}>
                    全て
                </NavigationAnchorButton>
            </div>
            <div className="user-timeline-content user-category-content">
                <ActivitiesTimeline
                    context={thisUserPageId ? `user_timeline_${thisUserPageId}` : "my_timeline"}
                    type={currentType && validTypes.includes(currentType as typeof validTypes[number]) ? (currentType as typeof validTypes[number]) : "publish"}
                    userId={thisUserPageId ?? undefined}
                    isActorsQuery={!!thisUserPageId}
                />
            </div>
        </div>
    )
}
