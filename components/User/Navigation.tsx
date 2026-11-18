import { HistoryAnchor } from "../Router/HistoryAnchor"
import { useLocationContext } from "../Router/RouterContext"
import { pathMatcher } from "../Router/RouterUI"
import { IconExternalLink } from "@tabler/icons-react"
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
            <NavigationAnchorButton
                href={`/user/${userId}/follow`}
                otherMatchings={[`/user/${userId}/follow/follower`]}
            >
                フォロー
            </NavigationAnchorButton>

            <NavigationAnchorButton
                href={`/user/${userId}/video`}
                otherMatchings={[
                    `/user/${userId}/shorts`,
                ]}
            >
                投稿動画
            </NavigationAnchorButton>
            <NavigationAnchorButton
                href={`/user/${userId}/mylist`}
                otherMatchings={[
                    `/user/${userId}/series`,
                ]}
                activeWhenStartsWith
            >
                マイリスト・シリーズ
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
            <NavigationAnchorButton
                href="/my/follow"
                otherMatchings={[
                    "/my/follow/follower",
                    "/my/follow/follower",
                    "/my/follow/mylist",
                    "/my/follow/channel",
                ]}
            >
                フォロー
            </NavigationAnchorButton>
            <NavigationAnchorButton href="/my/creator-support">
                サポート
            </NavigationAnchorButton>
            <NavigationAnchorButton href="/my/watchlater" otherMatchings={["/my/timeshift-reservations"]}>
                あとで見る・タイムシフト
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
            <NavigationAnchorButton href="/my/achievement" otherMatchings={["/my/badge"]}>
                実績・図鑑
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
    const isActive = location.pathname === href || (activeWhenStartsWith && pathMatcher(location.pathname, href)) || (otherMatchings && otherMatchings.some(path => pathMatcher(location.pathname, path)))
    return (
        <HistoryAnchor href={href} className="userdata-navigation-anchor" data-isactive={isActive}>
            {children}
        </HistoryAnchor>
    )
}

export function ExternalAnchorButton({ children, href }: { children: React.ReactNode, href: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="userdata-navigation-anchor userdata-sidearea-externalanchor"
        >
            {children}
            <IconExternalLink />
        </a>
    )
}

export function ExternalWindowButton({ children, href, width, height }: { children: React.ReactNode, href: string, width: number, height: number }) {
    return (
        <button
            type="button"
            className="userdata-navigation-anchor userdata-sidearea-externalanchor"
            onClick={() => { window.open(href, "_blank", `width=${width},height=${height},noopener,noreferrer`) }}
        >
            {children}
            <IconExternalLink />
        </button>
    )
}
