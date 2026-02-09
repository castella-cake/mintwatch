import { Match } from "@/components/Router/RouterUI"
import { NavigationAnchorButton } from "../Navigation"
import { WatchHistory } from "./Watch"

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
                <WatchHistory />
            </Match>
        </div>
    )
}
