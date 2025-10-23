export const searchPagePaths = [
    "/search/",
    "/tag/",
    "/series_search/",
    "/mylist_search/",
    "/user_search/",
]

type searchType = "search" | "tag" | "mylist" | "series" | "user"

/**
 * pathnameから検索ワードを返す
 * @param pathname URLのパス
 * @returns 検索タイプ
 */
export function returnSearchWord(pathname: string) {
    for (const i in searchPagePaths) {
        const path = searchPagePaths[i]
        if (pathname.startsWith(path)) {
            return decodeURIComponent(pathname).replace(path, "")
        }
    }
    return ""
}

const searchPagePathRegex = /\/(search|tag|series|mylist|user)(_search)?\//

/**
 * pathnameから現在の検索タイプを返す
 * @param pathname URLのパス
 * @returns 検索タイプ
 */
export function returnSearchWhatWeReIn(pathname: string): searchType | undefined {
    for (const i in searchPagePaths) {
        const path = searchPagePaths[i]
        if (pathname.startsWith(path)) {
            const regexExecResult = searchPagePathRegex.exec(path)
            if (regexExecResult && regexExecResult[1]) return regexExecResult[1] as searchType
        }
    }
    return undefined
}

/**
 * 検索タイプとキーワードからURL文字列を返す
 * @param keyword 検索キーワード
 * @param type 検索タイプ
 * @returns URLの文字列
 */
export function returnHrefFromSearchType(keyword: string, type: searchType) {
    let href = `https://www.nicovideo.jp/search/${encodeURIComponent(keyword)}`
    if (type === "tag") {
        href = `https://www.nicovideo.jp/tag/${encodeURIComponent(keyword)}`
    } else if (type === "mylist") {
        href = `https://www.nicovideo.jp/mylist_search/${encodeURIComponent(keyword)}`
    } else if (type === "series") {
        href = `https://www.nicovideo.jp/series_search/${encodeURIComponent(keyword)}`
    } else if (type === "user") {
        href = `https://www.nicovideo.jp/user_search/${encodeURIComponent(keyword)}`
    }
    return href
}
