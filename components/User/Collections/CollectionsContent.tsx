import { Match } from "@/components/Router/RouterUI"
import { ExternalAnchorButton, NavigationAnchorButton } from "../Navigation"
import { BadgeIframe } from "./BadgeIframe"

export function CollectionsContent({ userId, isMyPage }: { userId: number, isMyPage: boolean }) {
    return (
        <div className="user-category-container">
            <div className="user-category-sidearea">
                <NavigationAnchorButton href={isMyPage ? "/my/achievement" : `/user/${userId}/achievement`}>
                    実績
                </NavigationAnchorButton>
                { isMyPage && (
                    <NavigationAnchorButton href="/my/badge">
                        図鑑
                    </NavigationAnchorButton>
                )}
                <div className="user-category-sidearea-title">
                    その他
                </div>
                <ExternalAnchorButton href="https://gift.nicovideo.jp/giftionary">
                    ギフト図鑑
                </ExternalAnchorButton>
            </div>
            { isMyPage && (
                <Match targetPathname={[
                    "/my/badge!",
                ]}
                >
                    <title>マイページ 図鑑 - ニコニコ</title>
                    <BadgeIframe userId={userId} />
                </Match>
            )}
        </div>
    )
}
