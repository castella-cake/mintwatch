import { returnSearchWhatWeReIn, returnSearchWord } from "./searchPagePaths"

/**
 * ルート遷移時のスクロール制御で使う「ページ種別+同一性」を返す。
 * 同一種別内の遷移は主要コンテンツ先頭の可視性判定(data-scroll-anchor)に基づいてスクロールし、
 * 種別が変わる遷移はページ先頭へスクロールする。
 * @param pathname URLのパス
 * @returns 同一ページとみなすグループの識別子。スクロール制御の対象外のパスはnull
 */
export function pageKindOf(pathname: string): string | null {
    if (pathname.startsWith("/user/")) {
        // ユーザーページはユーザーID込みで同一性を見る(別ユーザーへの遷移はページ先頭へ)
        const userId = pathname.split("/")[2]
        return userId ? `user:${userId}` : "user"
    }
    if (pathname === "/my" || pathname.startsWith("/my/")) return "my"
    if (pathname === "/ranking" || pathname.startsWith("/ranking/")) return "ranking"
    if (pathname === "/recommendations" || pathname.startsWith("/recommendations/")) return "recommendations"
    const searchType = returnSearchWhatWeReIn(pathname)
    if (searchType) {
        // keyword/tagはsearch_shorts/tag_shortsと同一グループとする(動画/ショートの切替はフィルタ変更相当)
        const family = searchType.replace("_shorts", "")
        return `search:${family}:${returnSearchWord(pathname)}`
    }
    return null
}
