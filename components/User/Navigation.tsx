import { HistoryAnchor } from "../Router/HistoryAnchor"
import { useLocationContext } from "../Router/RouterContext"
import "./styles/Navigation.css"

export function UserNavigation({ userId }: { userId: number }) {
    return (
        <div className="userdata-navigation">
            <NavigationAnchorButton
                href={`/user/${userId}`}
                otherMatchings={[
                    `/user/${userId}/timeline/all`,
                    `/user/${userId}/timeline/postings`,
                    `/user/${userId}/timeline/video`,
                    `/user/${userId}/timeline/live`,
                ]}
            >
                新着
            </NavigationAnchorButton>
            <NavigationAnchorButton href={`/user/${userId}/follow`}>
                フォロー中
            </NavigationAnchorButton>
            <NavigationAnchorButton href={`/user/${userId}/follow/follower`}>
                フォロワー
            </NavigationAnchorButton>
            <NavigationAnchorButton href={`/user/${userId}/video`}>
                投稿動画
            </NavigationAnchorButton>
            <NavigationAnchorButton href={`/user/${userId}/mylist`} activeWhenStartsWith>
                マイリスト
            </NavigationAnchorButton>
            <NavigationAnchorButton href={`/user/${userId}/series`}>
                シリーズ
            </NavigationAnchorButton>
            <NavigationAnchorButton href={`/user/${userId}/live_programs`}>
                生放送
            </NavigationAnchorButton>
            <NavigationAnchorButton href={`/user/${userId}/achievement`}>
                実績
            </NavigationAnchorButton>
        </div>
    )
}

export function MyPageNavigation() {
    return (
        <div className="userdata-navigation">
            <NavigationAnchorButton
                href="/my"
                otherMatchings={[
                    `/my/timeline/all`,
                    `/my/timeline/postings`,
                    `/my/timeline/video`,
                    `/my/timeline/live`,
                ]}
            >
                フォロー新着
            </NavigationAnchorButton>
            <NavigationAnchorButton href="/my/follow">
                フォロー中
            </NavigationAnchorButton>
            <NavigationAnchorButton href="/my/follow/follower">
                フォロワー
            </NavigationAnchorButton>
            <NavigationAnchorButton href="/my/creator-support">
                サポート
            </NavigationAnchorButton>
            <NavigationAnchorButton href="/my/watchlater">
                あとで見る
            </NavigationAnchorButton>
            <NavigationAnchorButton href="/my/timeshift-reservations">
                タイムシフト
            </NavigationAnchorButton>
            <NavigationAnchorButton href="/my/mylist" activeWhenStartsWith>
                マイリスト
            </NavigationAnchorButton>
            <NavigationAnchorButton
                href="/my/history/video"
                activeWhenStartsWith
                otherMatchings={[
                    "/my/history/like",
                    "/my/nicoru/",
                    "/my/nicoru/active",
                    "/my/history/translate_video",
                    "/my/history/live",
                    "/my/history/owned-tickets",
                    "/my/history/purchased-serials",
                ]}
            >
                履歴
            </NavigationAnchorButton>
            <NavigationAnchorButton href="/my/achievement">
                実績
            </NavigationAnchorButton>
        </div>
    )
}

export function NavigationAnchorButton({ children, href, activeWhenStartsWith, otherMatchings }: {
    children: React.ReactNode
    href: string
    activeWhenStartsWith?: boolean
    otherMatchings?: string[]
}) {
    const location = useLocationContext()
    const isActive = location.pathname === href || (activeWhenStartsWith && location.pathname.startsWith(href)) || (otherMatchings && otherMatchings.includes(location.pathname))
    return (
        <HistoryAnchor href={href} className="userdata-navigation-anchor" data-isactive={isActive}>
            {children}
        </HistoryAnchor>
    )
}
