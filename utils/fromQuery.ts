/**
 * `?from=<seconds>` クエリをパースして検証する。
 * 不正な値(欠落・空文字・非数値・0未満・非整数)は null を返す。
 * 0は「最初から再生」を示す有効な値として扱う。
 */
export function parseFromQuery(search: string): number | null {
    const raw = new URLSearchParams(search).get("from")
    if (raw === null || raw === "") return null
    const n = Number(raw)
    if (!Number.isInteger(n) || n < 0) return null
    return n
}
