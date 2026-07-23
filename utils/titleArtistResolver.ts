// A / B
// A=楽曲名, B=アーティスト名ORボーカル名
const artistSlashSeparatedRegex = /(.*)\s?[/／-]\s?(.*)/
// A『B』C
// A, C=アーティスト名ORボーカル名, B=楽曲名
const artistParenthesesRegex = /(.*)\s?[「『]\s?(.*)\s?[」』](.*)/

const removeZeroWidthSpacesRegex = /[\u200B-\u200D\uFEFF]/g

function trimWithZeroWidthSpaces(str: string): string {
    return str.replace(removeZeroWidthSpacesRegex, "").trim()
}

export function resolveTitleAndArtist(videoTitle: string, ownerNickname: string | undefined | null): { title: string, artist: string | null } {
    if (typeof ownerNickname !== "string") return { title: videoTitle, artist: null }

    let title = videoTitle
    let artist = ownerNickname ?? null

    const SlashSeparatedMethodResult = artistSlashSeparatedRegex.exec(videoTitle)
    if (SlashSeparatedMethodResult) {
        const stringA = SlashSeparatedMethodResult[1].trim()
        const stringB = SlashSeparatedMethodResult[2].trim()
        // ゼロ幅スペースが仕込まれていても対応できるようにtrim
        const isStringAIncludeOwnerNickName = stringA && ownerNickname && trimWithZeroWidthSpaces(stringA).includes(trimWithZeroWidthSpaces(ownerNickname))
        const isStringBIncludeOwnerNickName = stringB && ownerNickname && trimWithZeroWidthSpaces(stringB).includes(trimWithZeroWidthSpaces(ownerNickname))

        if (isStringAIncludeOwnerNickName) {
            title = stringB
            artist = stringA
        } else if (isStringBIncludeOwnerNickName) {
            title = stringA
            artist = stringB
        } else {
            title = stringA
            artist = `${ownerNickname} / ${stringB}`
        }

        return {
            title,
            artist,
        }
    }

    const parenthesesMethodResult = artistParenthesesRegex.exec(videoTitle)
    if (parenthesesMethodResult) {
        const artistStringA = parenthesesMethodResult[1].trim()
        const artistStringB = parenthesesMethodResult[3].trim()
        const isArtistStringAIncludeOwnerNickName = artistStringA && ownerNickname && trimWithZeroWidthSpaces(artistStringA).includes(trimWithZeroWidthSpaces(ownerNickname))
        const isArtistStringBIncludeOwnerNickName = artistStringB && ownerNickname && trimWithZeroWidthSpaces(artistStringB).includes(trimWithZeroWidthSpaces(ownerNickname))

        if (isArtistStringAIncludeOwnerNickName) { // Owner「Title」Somebody
            artist = `${artistStringA} / ${artistStringB}`.trim()
        } else if (isArtistStringBIncludeOwnerNickName) { // Somebody「Title」Owner
            artist = `${artistStringB} / ${artistStringA}`.trim()
        } else if (ownerNickname && artistStringA.length > 0 && artistStringB.length > 0) { // Somebody「Title」Somebody
            artist = `${ownerNickname} / ${artistStringA} / ${artistStringB}`.trim()
        } else if (ownerNickname && artistStringA.length > 0) { // Owner「Title」
            artist = `${ownerNickname} / ${artistStringA}`.trim()
        } else if (ownerNickname && artistStringB.length > 0) { // 「Title」Owner
            artist = `${ownerNickname} / ${artistStringB}`.trim()
        }

        title = parenthesesMethodResult[2].trim()

        return {
            title,
            artist,
        }
    }

    return {
        title: videoTitle,
        artist: ownerNickname ?? null,
    }
}
