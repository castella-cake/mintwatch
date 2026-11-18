import { Match } from "@/components/Router/RouterUI"
import { ExternalAnchorButton, ExternalWindowButton, NavigationAnchorButton } from "../Navigation"
import { WatchHistory } from "./Watch"
import { LikeHistory } from "./Like"
import { NicoruHistory } from "./Nicoru"
import { LiveWatchHistory } from "./Live/Watch"
import { LiveOwnedTicketsHistory } from "./Live/OwnedTickets"
import { LivePurchasedSerialsHistory } from "./Live/PurchasedSerials"
import { TranslateHistory } from "./Translate"

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
                <ExternalAnchorButton href="https://ch.nicovideo.jp/my/purchased?ref=pc_mypage_history">
                    購入履歴を開く
                </ExternalAnchorButton>
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
                <div className="user-category-sidearea-title">
                    その他
                </div>
                <ExternalAnchorButton href="https://koken.nicovideo.jp/?ref=pc_mypage_history">
                    ニコニ貢献
                </ExternalAnchorButton>
                <ExternalWindowButton href="https://www.beta.hiroba.nicovideo.jp/thread-list/histories" width={375} height={479}>
                    ニコニコ広場
                </ExternalWindowButton>
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
            <Match targetPathname={["/my/history/translate_video!"]}>
                <title>マイページ 翻訳履歴 - ニコニコ</title>
                <TranslateHistory />
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
