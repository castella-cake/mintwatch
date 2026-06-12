import { Match } from "@/components/Router/RouterUI"
import { UserMylistsList } from "./Mylist/UserMylistsList"
import { UserMylist } from "./Mylist/UserMylist"
import { UserMylistByMe } from "./Mylist/UserMylistByMe"
import "../styles/UserVideoLists.css"
import "../styles/UserVideoListView.css"
// series import is in UserSeriesList and UserSeries
import { NavigationAnchorButton } from "../Navigation"
import { UserSeriesList } from "./Series/UserSeriesList"
import { UserSeries } from "./Series/UserSeries"

export function UserVideoListsContent({ userId, isMyPage, nickname }: { userId?: number, isMyPage?: boolean, nickname?: string }) {
    if (!userId && !isMyPage) return

    return (
        <div className="user-videolists-container">
            <div className="user-videolists-left">
                { !isMyPage && (
                    <div className="user-videolists-switcher">
                        <NavigationAnchorButton href={`/user/${userId}/mylist`} activeWhenStartsWith>
                            マイリスト
                        </NavigationAnchorButton>
                        <NavigationAnchorButton href={`/user/${userId}/series`} activeWhenStartsWith>
                            シリーズ
                        </NavigationAnchorButton>
                    </div>
                )}
                <Match targetPathname={isMyPage
                    ? [
                            "/my/mylist",
                        ]
                    : [
                            `/user/${userId}/mylist`,
                        ]}
                >
                    <UserMylistsList showRootAnchor userId={userId} />
                </Match>
                <Match targetPathname={isMyPage
                    ? []
                    : [
                            `/user/${userId}/series`,
                        ]}
                >
                    <UserSeriesList showRootAnchor userId={userId} />
                </Match>
            </div>
            <div className="user-videolists-body">
                <Match targetPathname={isMyPage
                    ? [
                            "/my/mylist!",
                        ]
                    : [
                            `/user/${userId}/mylist!`,
                        ]}
                >
                    <title>{ isMyPage ? "マイページ マイリスト - ニコニコ" : `${nickname}さんの公開マイリスト - ニコニコ` }</title>
                    <UserMylistsList showSampleItems userId={userId} />
                </Match>
                <Match targetPathname={isMyPage
                    ? []
                    : [
                            `/user/${userId}/series!`,
                        ]}
                >
                    <title>{`${nickname}さんの公開シリーズ - ニコニコ`}</title>
                    <UserSeriesList showThumbnail userId={userId} />
                </Match>
                <Match targetPathname={isMyPage
                    ? []
                    : [
                            `/user/${userId}/series/:`,
                        ]}
                >
                    <UserSeries />
                </Match>
                { !isMyPage && (
                    <Match targetPathname={[
                        `/user/${userId}/mylist/:`,
                    ]}
                    >
                        <UserMylist userId={userId} />
                    </Match>
                )}
                { isMyPage && (
                    <Match targetPathname={[
                        "/my/mylist/:",
                    ]}
                    >
                        <UserMylistByMe />
                    </Match>
                )}
            </div>
        </div>
    )
}
