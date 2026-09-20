const videoIdRegex = /(?:s[mos]|n[lm])(?!0)\d+/g

// const validateVideoIdRegex = /^(?:s[mos]|n[lm])(?!0)\d+$/
const validateThreadIdRegex = /^(?!0)\d{10}$/

const validateWatchVideoIdRegex = /^(?:s[mos]|n[lm])?(?!0)\d+$/

export function validateThreadId(threadId: string): boolean {
    return validateThreadIdRegex.test(threadId)
}

export function validateVideoId(videoId: string): boolean {
    return validateWatchVideoIdRegex.test(videoId)
}

export function detectVideoIdFromString(string: string): string[] | undefined {
    const matches = string.match(videoIdRegex)
    return matches ? Array.from(new Set(matches)) : undefined
}

export function isPathnameIsVideoPage(pathname: string, isShortsPageEnabled?: boolean): boolean {
    const path = pathname.split("/").filter(Boolean)
    if (path.length !== 2) return false
    if (path[0] !== "watch" && path[0] !== "shorts") return false
    if (path[0] === "shorts" && isShortsPageEnabled === false) return false
    if (!validateVideoId(path[1])) return false
    return true
}

export function pathnameToVideoId(pathname: string): string | undefined {
    const path = pathname.split("/").filter(Boolean)
    if (path.length !== 2) return
    if (path[0] !== "watch" && path[0] !== "shorts") return
    if (!validateVideoId(path[1])) return
    return path[1]
}

export function urlToVideoId(url: URL | string | null): string | undefined {
    if (!url) return

    if (typeof url === "string") {
        url = new URL(url)
    }

    return pathnameToVideoId(url.pathname)
}
