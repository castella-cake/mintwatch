const videoIdRegex = /(?:s[mo]|n[lm])(?!0)\d+/g
export function detectVideoIdFromString(string: string): string[] | null {
    const matches = string.match(videoIdRegex)
    return matches ? Array.from(new Set(matches)) : null
}
