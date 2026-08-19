const videoIdRegex = /(?:s[mos]|n[lm])(?!0)\d+/g

const validateVideoIdRegex = /^(?:s[mos]|n[lm])(?!0)\d+$/

export function validateVideoId(videoId: string): boolean {
    return validateVideoIdRegex.test(videoId)
}

export function detectVideoIdFromString(string: string): string[] | null {
    const matches = string.match(videoIdRegex)
    return matches ? Array.from(new Set(matches)) : null
}

export function isPathnameIsVideoPage(pathname: string): boolean {
    const path = pathname.split("/").filter(Boolean)
    if (path.length !== 2) return false
    if (path[0] !== "watch" && path[0] !== "shorts") return false
    if (!validateVideoId(path[1])) return false
    return true
}

export function pathnameToVideoId(pathname: string): string | null {
    const path = pathname.split("/").filter(Boolean)
    if (path.length !== 2) return null
    if (path[0] !== "watch" && path[0] !== "shorts") return null
    if (!validateVideoId(path[1])) return null
    return path[1]
}

export function urlToVideoId(url: URL | string | null): string | null {
    if (url === null) return null

    if (typeof url === "string") {
        url = new URL(url)
    }

    return pathnameToVideoId(url.pathname)
}
