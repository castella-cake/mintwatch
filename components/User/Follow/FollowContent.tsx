import { Match } from "@/components/Router/RouterUI"
import { NavigationAnchorButton } from "../Navigation"
import { FollowingUsers } from "./FollowingUsers"

export function FollowContent({ userId, isMyPage }: { userId?: number, isMyPage?: boolean }) {
    const hrefPrefix = (isMyPage) ? `/my/follow` : `/user/${userId}/follow`

    if (!isMyPage && !userId) return
    return (
        <div className="user-follow user-category-container">
            <div className="user-follow-sidearea user-category-sidearea">
                <div className="user-category-sidearea-title">
                    フォロー中
                </div>
                <NavigationAnchorButton href={hrefPrefix}>
                    ユーザー
                </NavigationAnchorButton>
                { isMyPage && (
                    <>
                        <NavigationAnchorButton href={`${hrefPrefix}/mylist`}>
                            マイリスト
                        </NavigationAnchorButton>
                        <NavigationAnchorButton href={`${hrefPrefix}/channel`}>
                            チャンネル
                        </NavigationAnchorButton>
                    </>
                )}
                <div className="user-category-sidearea-title">
                    フォロワー
                </div>
                <NavigationAnchorButton href={`${hrefPrefix}/follower`}>
                    ユーザー
                </NavigationAnchorButton>
            </div>
            <div className="user-follow-content user-category-content">
                <Match targetPathname={[
                    `${hrefPrefix}!`,
                ]}
                >
                    {isMyPage && <title>マイページ フォロー中 - ニコニコ</title>}
                    <FollowingUsers userId={(isMyPage) ? "me" : userId!} />
                </Match>
            </div>
        </div>
    )
}
