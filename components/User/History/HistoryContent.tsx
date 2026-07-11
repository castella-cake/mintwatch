import { Match } from "@/components/Router/RouterUI"
import { NavigationAnchorButton } from "../Navigation"
import { WatchHistory } from "./Watch"
import { LikeHistory } from "./Like"
import { NicoruHistory } from "./Nicoru"

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
        </div>
    )
}
