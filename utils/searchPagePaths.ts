export const searchPagePaths = [
    "/search/",
    "/tag/",
    "/series_search/",
    "/mylist_search/",
    "/user_search/",
]

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

export function returnSearchWhatWeReIn(pathname: string) {
    for (const i in searchPagePaths) {
        const path = searchPagePaths[i]
        if (pathname.startsWith(path)) {
            const regexExecResult = searchPagePathRegex.exec(path)
            if (regexExecResult && regexExecResult[1]) return regexExecResult[1]
        }
    }
    return undefined
}
