import { catchMatchFor } from "./index.content"

const watchPattern = "/watch/:"
const rankingPattern = "/ranking"
const recommendationsPattern = "/recommendations"

const searchPatternArray = [
    "/search/:",
    "/search_shorts/:",
    "/tag/:",
    "/tag_shorts/:",
    "/series_search/:",
    "/mylist_search/:",
    "/user_search/:",
] as const

// TODO: user-pageあたりがマージされた辺りでimportするように変える
function pathMatcher(pathname: string, targetPathname: string) {
    const normalizedPathname = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname
    const normalizedTargetPathname = targetPathname.endsWith("/") ? targetPathname.slice(0, -1) : targetPathname

    const splittedPathname = normalizedPathname.split("/")

    if (normalizedTargetPathname.endsWith("/:")) {
        const splittedTargetPathname = normalizedTargetPathname.slice(0, -2).split("/")
        return splittedTargetPathname.every((segment, index) => segment === splittedPathname[index]) && splittedPathname.length === splittedTargetPathname.length + 1
    }
    if (normalizedTargetPathname.endsWith("!")) {
        const splittedTargetPathname = normalizedTargetPathname.slice(0, -1).split("/")
        return splittedTargetPathname.every((segment, index) => segment === splittedPathname[index]) && splittedPathname.length === splittedTargetPathname.length
    }
    const splittedTargetPathname = normalizedTargetPathname.split("/")
    return splittedTargetPathname.every((segment, index) => segment === splittedPathname[index]) && splittedPathname.length >= splittedTargetPathname.length
}

// 段スク水 の実装を参考にさせていただきました
// https://github.com/eneko0513/NicoNicoDansaScriptCustom/blob/main/src/hooks/useLocation.ts
interface NewWindow extends Window {
    __reactRouterDataRouter: {
        subscribe: (callback: (state: RouterState) => void) => () => void
        state: RouterState
    }
}

interface RouterState {
    historyAction: "PUSH" | "POP" | "REPLACE"
    location: {
        pathname: string
        search: string
        hash: string
        state: null
        key: string
    }
}
declare let window: NewWindow

export default defineUnlistedScript({
    main: () => {
        const script = document.currentScript

        const enabledMatchPatternString = script?.dataset["matchfor"]
        if (!enabledMatchPatternString) return
        // このコンテキストでは何が有効化されてるかを得る
        const enabledMatchPattern: catchMatchFor = JSON.parse(enabledMatchPatternString)

        // nvpc_next側のReact Routerを待ち受けて、ターゲットに入ったらコンテンツスクリプト側に通知する
        function reactRouterSubscribe() {
            if (!window.__reactRouterDataRouter || typeof window.__reactRouterDataRouter !== "object" || !window.__reactRouterDataRouter.subscribe) {
                return false
            }
            window.__reactRouterDataRouter.subscribe((newState) => {
                if (enabledMatchPattern.search && searchPatternArray.some(p => pathMatcher(newState.location.pathname, p))) {
                    script?.dispatchEvent(
                        new CustomEvent("mwReactRouterHit", {
                            detail: "search",
                        }),
                    )
                }
                if (enabledMatchPattern.watch && pathMatcher(newState.location.pathname, watchPattern)) {
                    script?.dispatchEvent(
                        new CustomEvent("mwReactRouterHit", {
                            detail: "watch",
                        }),
                    )
                }
                if (enabledMatchPattern.ranking && pathMatcher(newState.location.pathname, rankingPattern)) {
                    script?.dispatchEvent(
                        new CustomEvent("mwReactRouterHit", {
                            detail: "ranking",
                        }),
                    )
                }
                if (enabledMatchPattern.recommendations && pathMatcher(newState.location.pathname, recommendationsPattern)) {
                    script?.dispatchEvent(
                        new CustomEvent("mwReactRouterHit", {
                            detail: "recommendations",
                        }),
                    )
                }
            })
            return true
        }

        // 早すぎるとsubscribeがないので、時間を開けてリトライを続ける
        let tryCount = 0
        function trySubscribe() {
            tryCount++
            const result = reactRouterSubscribe()
            if (!result) {
                if (tryCount < 10) {
                    setTimeout(trySubscribe, 500)
                } else {
                    console.error("MW: Failed to subscribe to React Router after 10 attempts.")
                }
            }
        }
        trySubscribe()
    },
})
