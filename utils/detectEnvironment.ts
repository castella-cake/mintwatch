/**
 * heartbeat ペイロードに乗せる実行環境情報を検出する。
 * navigator.userAgent をパースして OS / OSバージョン / ブラウザ を返す。
 *
 * heartbeat payload は `os` / `os_version` を必須とするが、ブラウザ種別フィールドは
 * 公式サンプルにも存在しないため、UA 文字列全体を別フィールドとして保持する想定。
 */

export type DetectedEnvironment = {
    os: string
    osVersion: string
    userAgent: string
}

export function detectEnvironment(): DetectedEnvironment {
    if (typeof navigator === "undefined") {
        return { os: "unknown", osVersion: "unknown", userAgent: "" }
    }
    const ua = navigator.userAgent
    const uaData = (navigator as any).userAgentData
    let os = "unknown"
    let osVersion = "unknown"

    if (uaData && typeof uaData.getHighEntropyValues === "function") {
        // Chromium 系は User-Agent Client Hints を使える
        try {
            const hints = uaData.platform
            os = hints || os
        } catch {
            // ignore
        }
    }

    // フォールバック: UA 文字列を正規表現でパース
    if (os === "unknown") {
        if (/Windows NT 10\.0/.test(ua)) {
            os = "Windows"
            osVersion = "10.0"
        } else if (/Windows NT 11\.0/.test(ua)) {
            os = "Windows"
            osVersion = "11.0"
        } else if (/Windows NT/.test(ua)) {
            os = "Windows"
            const m = ua.match(/Windows NT (\d+\.\d+)/)
            osVersion = m ? m[1] : "unknown"
        } else if (/Mac OS X/.test(ua) || /macOS/.test(ua)) {
            os = "macOS"
            const m = ua.match(/Mac OS X (\d+[._]\d+)/)
            osVersion = m ? m[1].replace("_", ".") : "unknown"
        } else if (/Linux/.test(ua)) {
            os = "Linux"
            osVersion = "unknown"
        } else if (/Android/.test(ua)) {
            os = "Android"
            const m = ua.match(/Android (\d+(?:\.\d+)?)/)
            osVersion = m ? m[1] : "unknown"
        } else if (/iPhone|iPad|iPod/.test(ua)) {
            os = "iOS"
            const m = ua.match(/OS (\d+_\d+)/)
            osVersion = m ? m[1].replace("_", ".") : "unknown"
        }
    }

    return { os, osVersion, userAgent: ua }
}
