// A / B
// A=楽曲名, B=アーティスト名ORボーカル名
const artistSlashSeparatedRegex = /(.*?)\s?[/／]\s?(.*)/
const artistHyphenSeparatedRegex = /(.*?)\s?-\s?(.*)/
// 両側にスペースがある区切りを優先（アーティスト名や楽曲名の内部ハイフンと区別するため）
const artistSeparatedRegexWithSpaces = /(.*?)\s[/／-]\s(.*)/
// A『B』C
// A, C=アーティスト名ORボーカル名, B=楽曲名
const artistParenthesesRegex = /(.*)\s?[「『]\s?(.*)\s?[」』](.*)/
// B (SubtitleA - SubtitleB)
// const subTitleParenthesesRegex = /(.*)\s?[（(]\s?(.*)\s?[/／-]\s?(.*)\s?[）)]/

const removeZeroWidthSpacesRegex = /[\u200B-\u200D\uFEFF]/g

function trimWithZeroWidthSpaces(str: string): string {
    return str.replace(removeZeroWidthSpacesRegex, "").trim()
}

type TripleSplit = { a: string, b: string, c: string } | null

/**
 * a - b - c のような文字列を分離する関数。二分割したものの片方を分割する形で解決する。
 * 結果を使い回せるように、第二引数に正規表現のマッチ結果を渡している。
 */
function tryTripleSeparate(input: string, separatorRegexWithSpacesResult: RegExpExecArray | null): TripleSplit {
    if (!separatorRegexWithSpacesResult) return null
    const a = separatorRegexWithSpacesResult[1].trim()
    const bOriginal = separatorRegexWithSpacesResult[2].trim()
    if (a.length === 0 || bOriginal.length === 0) return null

    // B側をさらに同じ区切り文字で分割できるか
    const secondInB = artistSeparatedRegexWithSpaces.exec(bOriginal)
    if (secondInB) {
        const b = secondInB[1].trim()
        const c = secondInB[2].trim()
        if (c.length > 0) return { a, b, c }
    }

    /**
    // A側をさらに同じ区切り文字で分割できるか
    const secondInA = artistSeparatedRegexWithSpaces.exec(a)
    if (secondInA) {
        const aLeft = secondInA[1].trim()
        const b = secondInA[2].trim()
        if (aLeft.length > 0) {
            // Aを{aLeft, b}に再構成し、B側は元の first の右側を維持
            return { a: aLeft, b, c: bOriginal }
        }
    }
     */

    return null
}

export function resolveTitleAndArtist(videoTitle: string, ownerNickname: string | undefined | null): { title: string, artist: string | null } {
    console.time("resolveTitleAndArtist")
    if (typeof ownerNickname !== "string") return { title: videoTitle, artist: null }

    let title = videoTitle
    let artist = ownerNickname ?? null

    const parenthesesMethodResult = artistParenthesesRegex.exec(videoTitle)
    if (parenthesesMethodResult) {
        const artistStringA = parenthesesMethodResult[1].trim()
        const artistStringB = parenthesesMethodResult[3].trim()
        const isArtistStringAIncludeOwnerNickName = artistStringA && ownerNickname && trimWithZeroWidthSpaces(artistStringA).includes(trimWithZeroWidthSpaces(ownerNickname))
        const isArtistStringBIncludeOwnerNickName = artistStringB && ownerNickname && trimWithZeroWidthSpaces(artistStringB).includes(trimWithZeroWidthSpaces(ownerNickname))

        if (isArtistStringAIncludeOwnerNickName && artistStringA.length > 0 && artistStringB.length > 0) {
            // Owner「Title」Somebody
            artist = `${artistStringA} / ${artistStringB}`.trim()
        } else if (isArtistStringBIncludeOwnerNickName && artistStringA.length > 0 && artistStringB.length > 0) {
            // Somebody「Title」Owner
            artist = `${artistStringB} / ${artistStringA}`.trim()
        } else if (isArtistStringAIncludeOwnerNickName && artistStringA.length > 0) {
            // Owner「Title」
            artist = artistStringA
        } else if (isArtistStringBIncludeOwnerNickName && artistStringB.length > 0) {
            // 「Title」Somebody / Owner から Owner / Somebody へ並び替える
            const SeparatedMethodResult = artistSlashSeparatedRegex.exec(artistStringB) ?? artistHyphenSeparatedRegex.exec(artistStringB)
            if (SeparatedMethodResult) {
                const stringA = SeparatedMethodResult[1].trim()
                const stringB = SeparatedMethodResult[2].trim()
                const isStringAIncludeOwnerNickName = stringA && ownerNickname && trimWithZeroWidthSpaces(stringA).includes(trimWithZeroWidthSpaces(ownerNickname))
                const isStringBIncludeOwnerNickName = stringB && ownerNickname && trimWithZeroWidthSpaces(stringB).includes(trimWithZeroWidthSpaces(ownerNickname))
                if (isStringAIncludeOwnerNickName) {
                    artist = `${stringA} / ${stringB}`.trim()
                } else if (isStringBIncludeOwnerNickName) {
                    artist = `${stringB} / ${stringA}`.trim()
                } // この時点でオーナーが含まれていることは確定しているのでelseはない
            } else {
                // 「Title」Owner
                artist = artistStringB
            }
        } else if (ownerNickname && artistStringA.length > 0 && artistStringB.length > 0) {
            // Somebody「Title」Somebody
            artist = `${ownerNickname} / ${artistStringA} / ${artistStringB}`.trim()
        } else if (ownerNickname && artistStringA.length > 0) { // Owner「Title」
            artist = `${ownerNickname} / ${artistStringA}`.trim()
        } else if (ownerNickname && artistStringB.length > 0) { // 「Title」Owner
            artist = `${ownerNickname} / ${artistStringB}`.trim()
        }

        title = parenthesesMethodResult[2].trim()

        console.timeEnd("resolveTitleAndArtist")
        return {
            title,
            artist,
        }
    }

    // 3連でも2連でも使うので先に計算する
    const artistSeparatedRegexWithSpacesResult = artistSeparatedRegexWithSpaces.exec(videoTitle)

    // 三連分離を先に試す
    const triple = tryTripleSeparate(videoTitle, artistSeparatedRegexWithSpacesResult)
    if (triple) {
        const { a, b, c } = triple
        const trimmedOwner = trimWithZeroWidthSpaces(ownerNickname)
        const isAIncludeOwner = trimWithZeroWidthSpaces(a).includes(trimmedOwner)
        const isCIncludeOwner = trimWithZeroWidthSpaces(c).includes(trimmedOwner)

        if ((isAIncludeOwner || isCIncludeOwner) && c.length > 0) {
            artist = isCIncludeOwner && !isAIncludeOwner
                ? `${c} / ${a}`
                : `${a} / ${c}`
            console.timeEnd("resolveTitleAndArtist")
            return {
                title: b,
                artist: artist.trim(),
            }
        }
        // バリデーション失敗時は2項分離にフォールバック
    }

    // スペースあり→スラッシュ→ハイフンの順で分離を試みる
    const SlashSeparatedMethodResult = artistSeparatedRegexWithSpacesResult
        ?? artistSlashSeparatedRegex.exec(videoTitle)
        ?? artistHyphenSeparatedRegex.exec(videoTitle)
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

        console.timeEnd("resolveTitleAndArtist")
        return {
            title,
            artist,
        }
    }

    console.timeEnd("resolveTitleAndArtist")

    return {
        title: videoTitle,
        artist: ownerNickname ?? null,
    }
}
