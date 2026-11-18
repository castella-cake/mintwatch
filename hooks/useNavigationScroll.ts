import { Action } from "history"
import { RefObject, useLayoutEffect, useRef } from "react"
import { useHistoryContext, useLocationContext } from "../components/Router/RouterContext"

/** ルート遷移時にhistory stateへ載せる追加データ */
export type NavigationState = {
    /** リンククリック由来の遷移であることを示す。スクロール制御の対象になる */
    scrollPlan?: "link"
}

const SCROLL_POSITIONS_STORAGE_KEY = "mintwatch:scrollPositions"
const MAX_SCROLL_POSITIONS = 50

let scrollPositions: Map<string, number> | null = null

function getScrollPositions(): Map<string, number> {
    if (!scrollPositions) {
        try {
            const raw = sessionStorage.getItem(SCROLL_POSITIONS_STORAGE_KEY)
            scrollPositions = raw ? new Map(JSON.parse(raw) as Array<[string, number]>) : new Map()
        } catch {
            scrollPositions = new Map()
        }
    }
    return scrollPositions
}

function recordScrollPosition(key: string, scrollY: number) {
    const positions = getScrollPositions()
    positions.set(key, scrollY)
    while (positions.size > MAX_SCROLL_POSITIONS) {
        positions.delete(positions.keys().next().value!)
    }
    try {
        sessionStorage.setItem(SCROLL_POSITIONS_STORAGE_KEY, JSON.stringify([...positions.entries()]))
    } catch {
        // sessionStorageに書き込めなくてもタブ内のメモリには残る
    }
}

/**
 * ユーザーページ内遷移かどうかの判定に使う「ページ種別+同一性」。
 * /user/:userId はユーザーID込みで同一性を見て、/my は別種別として扱う。
 * 同一ユーザーページ内の遷移のみ、主要コンテンツ位置の維持判定を行う。
 */
function userPageKindOf(pathname: string): string | null {
    if (pathname.startsWith("/user/")) {
        const userId = pathname.split("/")[2]
        return userId ? `user:${userId}` : "user"
    }
    if (pathname === "/my" || pathname.startsWith("/my/")) return "my"
    return null
}

/**
 * 固定・sticky表示中のヘッダーがビューポート上端で占める高さ。
 * ヘッダーがスクロール追従しない設定の場合は0。
 */
function getScrollOcclusionTop(): number {
    const headerEl = document.getElementById("pmw-header")
    if (!headerEl) return 0
    if (headerEl.getAttribute("data-is-fixed") !== "true") return 0
    if (headerEl.getAttribute("data-navbar-type") === "shinjuku") {
        // shinjukuレイアウトではヘッダー上部のみが固定表示される
        return headerEl.querySelector<HTMLElement>(".header-upper-container")?.offsetHeight ?? 0
    }
    return headerEl.getBoundingClientRect().bottom
}

/**
 * 同一ユーザーページ内遷移時に、主要コンテンツ(data-scroll-anchor)の先頭が
 * ヘッダーの下に隠れている場合だけ、先頭が見える位置までスクロールする。
 * すでに先頭が見えている場合はスクロールしない。
 */
function applyScrollAnchorNavigation(rootRef: RefObject<HTMLElement | null>) {
    const anchor = rootRef.current?.querySelector<HTMLElement>("main [data-scroll-anchor]")
    if (!anchor) {
        // アンカーが見つからない場合は従来通りページ先頭へ
        window.scroll({ top: 0 })
        return
    }
    const occlusionTop = getScrollOcclusionTop()
    const anchorTop = anchor.getBoundingClientRect().top
    if (anchorTop >= occlusionTop) {
        // 主要コンテンツの先頭がすでに見えている
        return
    }
    window.scrollTo({ top: Math.max(0, window.scrollY + anchorTop - occlusionTop) })
}

/**
 * ルート遷移時のスクロール制御。
 * スクロール位置は location.key をキーに保存し、戻る/進む(POP)で復元する。
 * - POP: 保存済みのスクロール位置を復元する
 * - リンク経由のPUSH(scrollPlan付き): ユーザーページ内遷移はアンカー判定、それ以外はページ先頭へ
 * - プログラマティックなPUSH/REPLACE: 従来通り各コンポーネントの個別処理に任せる
 */
export function useNavigationScroll(rootRef: RefObject<HTMLElement | null>) {
    const history = useHistoryContext()
    const location = useLocationContext()

    const prevLocationRef = useRef(location)

    useLayoutEffect(() => {
        // リスナーはスクロール位置が変わる前に同期的に呼ばれるため、
        // ここで「離れる直前のエントリ」のスクロール位置をlocation.keyで記録する。
        // push時だけでなくPOP時にも記録されるため、back→forward→backを繰り返しても位置が陳腐化しない
        return history.listen(() => {
            recordScrollPosition(prevLocationRef.current.key, window.scrollY)
        })
    }, [history])

    useLayoutEffect(() => {
        const prevLocation = prevLocationRef.current
        if (prevLocation.key === location.key) return // 初回マウント
        prevLocationRef.current = location

        const action = history.action
        if (action === Action.Replace) return // REPLACEは位置を維持する

        if (action === Action.Pop) {
            const savedScrollY = getScrollPositions().get(location.key)
            if (typeof savedScrollY === "number") {
                // 既知の制限: 戻り先のコンテンツが非同期ロード中だとdocumentが短く、位置がクランプされる
                window.scrollTo(0, savedScrollY)
            }
            return
        }

        // PUSH: リンク経由の遷移(scrollPlan付き)のみスクロール制御する。
        // プログラマティックなpush(WatchUIの動画切り替え等)は各コンポーネントの個別処理に任せる
        if ((location.state as NavigationState | null)?.scrollPlan !== "link") return

        if (userPageKindOf(prevLocation.pathname) === userPageKindOf(location.pathname) && userPageKindOf(location.pathname) !== null) {
            applyScrollAnchorNavigation(rootRef)
        } else {
            window.scroll({ top: 0 })
        }
    }, [location, rootRef, history])
}
