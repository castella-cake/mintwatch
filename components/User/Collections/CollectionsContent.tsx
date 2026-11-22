import { Match } from "@/components/Router/RouterUI"
import { ExternalAnchorButton, NavigationAnchorButton } from "../Navigation"
import { BadgeIframe } from "./BadgeIframe"
import { Achievements } from "./Achievements"

export function CollectionsContent({ userId, isMyPage, nickname }: { userId: number, isMyPage: boolean, nickname?: string }) {
    return (
        <div className="user-category-container" data-scroll-anchor>
            <div className="user-category-sidearea">
                <NavigationAnchorButton href={isMyPage ? "/my/achievement" : `/user/${userId}/achievement`}>
                    実績
                </NavigationAnchorButton>
                { isMyPage && (
                    <NavigationAnchorButton href="/my/badge">
                        図鑑
                    </NavigationAnchorButton>
                )}
                { isMyPage && (
                    <>
                        <div className="user-category-sidearea-title">
                            その他
                        </div>
                        <ExternalAnchorButton href="https://gift.nicovideo.jp/giftionary">
                            ギフト図鑑
                        </ExternalAnchorButton>
                    </>
                ) }
            </div>
            <Match targetPathname={[isMyPage ? "/my/achievement!" : `/user/${userId}/achievement!`]}>
                <title>{isMyPage ? "マイページ 実績 - ニコニコ" : `${nickname}さんの実績 - ニコニコ`}</title>
                <Achievements userId={userId} isMyPage={isMyPage} />
            </Match>
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
