import { Match } from "@/components/Router/RouterUI"
import { NavigationAnchorButton } from "../Navigation"
import { WatchLater } from "./WatchLater"
import { TimeshiftIframe } from "./TimeshiftIframe"

export function WatchLaterContent() {
    return (
        <div className="user-category-container">
            <div className="user-category-sidearea">
                <NavigationAnchorButton href="/my/watchlater">
                    あとで見る
                </NavigationAnchorButton>
                <NavigationAnchorButton href="/my/timeshift-reservations">
                    タイムシフト
                </NavigationAnchorButton>
            </div>
            <Match targetPathname={[
                "/my/watchlater",
            ]}
            >
                <title>マイページ あとで見る - ニコニコ</title>
                <WatchLater />
            </Match>
            <Match targetPathname={[
                "/my/timeshift-reservations",
            ]}
            >
                <title>マイページ タイムシフト予約リスト - ニコニコ</title>
                <TimeshiftIframe />
            </Match>
        </div>
    )
}
