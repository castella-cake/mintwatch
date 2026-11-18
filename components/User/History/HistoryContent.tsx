import { Match } from "@/components/Router/RouterUI"
import { NavigationAnchorButton } from "../Navigation"
import { WatchHistory } from "./Watch"
import { LikeHistory } from "./Like"
import { NicoruHistory } from "./Nicoru"
import { LiveWatchHistory } from "./Live/Watch"
import { LiveOwnedTicketsHistory } from "./Live/OwnedTickets"
import { LivePurchasedSerialsHistory } from "./Live/PurchasedSerials"

export function UserHistoryContent() {
    return (
        <div className="watch-history user-category-container">
            <div className="watch-history-sidearea user-category-sidearea">
                <NavigationAnchorButton href="/my/history/video">
                    動画視聴
                </NavigationAnchorButton>
                <NavigationAnchorButton href="/my/history/like">
                    いいね！
                </NavigationAnchorButton>
                <NavigationAnchorButton href="/my/nicoru">
                    ニコられた
                </NavigationAnchorButton>
                <NavigationAnchorButton href="/my/nicoru/active">
                    ニコった
                </NavigationAnchorButton>
                <NavigationAnchorButton href="/my/history/translate_video">
                    翻訳
                </NavigationAnchorButton>
                <div className="user-category-sidearea-title">
                    生放送
                </div>
                <NavigationAnchorButton href="/my/history/live">
                    視聴
                </NavigationAnchorButton>
                <NavigationAnchorButton href="/my/history/owned-tickets">
                    購入
                </NavigationAnchorButton>
                <NavigationAnchorButton href="/my/history/purchased-serials">
                    プレゼントシリアルコード
                </NavigationAnchorButton>
            </div>
            <Match targetPathname={[
                "/my/history!",
                "/my/history/video",
            ]}
            >
                <title>マイページ 視聴履歴 - ニコニコ</title>
                <WatchHistory />
            </Match>
            <Match targetPathname={[
                "/my/history/like!",
            ]}
            >
                <title>マイページ いいね！履歴 - ニコニコ</title>
                <LikeHistory />
            </Match>
            <Match targetPathname={[
                "/my/nicoru!",
            ]}
            >
                <title>マイページ ニコられた履歴 - ニコニコ</title>
                <NicoruHistory type="receive" />
            </Match>
            <Match targetPathname={[
                "/my/nicoru/active!",
            ]}
            >
                <title>マイページ ニコった履歴 - ニコニコ</title>
                <NicoruHistory type="send" />
            </Match>
            <Match targetPathname={[
                "/my/history/live!",
            ]}
            >
                <title>マイページ 生放送視聴履歴 - ニコニコ</title>
                <LiveWatchHistory />
            </Match>
            <Match targetPathname={[
                "/my/history/owned-tickets!",
            ]}
            >
                <title>マイページ 生放送購入履歴 - ニコニコ</title>
                <LiveOwnedTicketsHistory />
            </Match>
            <Match targetPathname={[
                "/my/history/purchased-serials!",
            ]}
            >
                <title>マイページ プレゼントシリアルコード - ニコニコ</title>
                <LivePurchasedSerialsHistory />
            </Match>
        </div>
    )
}
