/**
 * `?past_log=<unixepoch>` クエリをパースして検証する。
 * 不正な値(欠落・非整数・0以下・未来日時)は null を返す。
 */
export function parsePastLogQuery(search: string): number | null {
    const raw = new URLSearchParams(search).get("past_log")
    if (raw === null) return null
    const n = Number(raw)
    if (!Number.isInteger(n) || n <= 0) return null
    if (n * 1000 > Date.now()) return null
    return n
}
