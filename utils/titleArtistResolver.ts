const artistRegex = /(.*)\s?[/／]\s?(.*)/
const removeZeroWidthSpacesRegex = /[\u200B-\u200D\uFEFF]/g

function trimWithZeroWidthSpaces(str: string): string {
    return str.replace(removeZeroWidthSpacesRegex, "").trim()
}

export function resolveTitleAndArtist(videoTitle: string, ownerNickname: string | undefined | null): { title: string, artist: string | null } {
    const titleRegexResult = artistRegex.exec(videoTitle)
    const artistString = titleRegexResult && titleRegexResult[2]
    // ゼロ幅スペースが仕込まれていても対応できるようにtrim
    const isArtistNameIncludeOwnerNickName = artistString && ownerNickname && trimWithZeroWidthSpaces(artistString).includes(trimWithZeroWidthSpaces(ownerNickname))

    return {
        title: titleRegexResult ? titleRegexResult[1] : videoTitle,
        artist: (ownerNickname && titleRegexResult) ? (isArtistNameIncludeOwnerNickName ? artistString : `${ownerNickname} / ${artistString}`) : ownerNickname ?? null,
    }
}
