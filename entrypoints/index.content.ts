import { initiateRouter, blockPage } from "@/utils/initiator/router"

const watchPattern = new MatchPattern("*://www.nicovideo.jp/watch/*")
const shortsWatchPattern = new MatchPattern("*://www.nicovideo.jp/shorts/*")
const rankingPattern = new MatchPattern("*://www.nicovideo.jp/ranking*")
const recommendationPattern = new MatchPattern("*://www.nicovideo.jp/recommendations*")

const searchPatternArray = [
    new MatchPattern("*://www.nicovideo.jp/search/*"),
    new MatchPattern("*://www.nicovideo.jp/search_shorts/*"),
    new MatchPattern("*://www.nicovideo.jp/tag/*"),
    new MatchPattern("*://www.nicovideo.jp/tag_shorts/*"),
    new MatchPattern("*://www.nicovideo.jp/series_search/*"),
    new MatchPattern("*://www.nicovideo.jp/mylist_search/*"),
    new MatchPattern("*://www.nicovideo.jp/user_search/*"),
] as const

export type catchMatchFor = {
    watch: boolean
    ranking: boolean
    search: boolean
    recommendations: boolean
    shorts: boolean
}

export default defineContentScript({
    matches: ["*://www.nicovideo.jp/*"],
    runAt: "document_start",
    main(ctx) {
        const isWatch = watchPattern.includes(window.location.toString())
        const isShortsWatch = shortsWatchPattern.includes(window.location.toString())
        const isRanking = rankingPattern.includes(window.location.toString())
        const isSearch = searchPatternArray.some(m => m.includes(window.location.toString()))
        const isRecommendations = recommendationPattern.includes(window.location.toString())
        // nopmwだったら何もしない
        const queryString = location.search
        const searchParams = new URLSearchParams(queryString)
        if (searchParams.get("nopmw") == "true" || searchParams.get("responseType") === "json") return

        // 視聴ページは常に動作するため、storageを待たずにブロック処理を即時実行する
        if (isWatch) blockPage()

        getStorageItemsWithObject([
            "sync:starNightPalette",
            "sync:colorPalette",
            "sync:pmwforcepagehls",
            "sync:pmwplayertype",
            "local:playersettings",
            "sync:enableFirefoxWindowStop",
            "sync:enableReshogi",
            "sync:enableSearchPage",
            "sync:enableShortsPage",
            "sync:enableRecommendationsPage",
        ] as const).then((storage) => {
            const enableReshogi = storage["sync:enableReshogi"]
            const enableSearchPage = storage["sync:enableSearchPage"]
            const enableShortsPage = storage["sync:enableShortsPage"] ?? getDefault("enableShortsPage")
            const enableRecommendationsPage = storage["sync:enableRecommendationsPage"]

            if (
                isWatch
                || (isRanking && enableReshogi)
                || (isSearch && enableSearchPage)
                || (isShortsWatch && enableShortsPage)
                || (isRecommendations && enableRecommendationsPage)
            ) {
                // 外部HLSプラグインを読み込む。pmw-ispluginを入れておかないとスクリプトの実行が阻止されます
                if ((import.meta.env.FIREFOX || storage["sync:pmwforcepagehls"])) {
                    injectScript("/watch_injector.js", {
                        modifyScript(script) {
                            script.setAttribute("pmw-isplugin", "true")
                            script.addEventListener("mwPageHlsReady", () => {
                                initiateRouter(ctx, storage)
                            })
                        },
                    })
                } else {
                    initiateRouter(ctx, storage)
                }
            } else if ((!enableReshogi && isRanking) || (!enableSearchPage && isSearch) || (!enableShortsPage && isShortsWatch) || (!enableRecommendationsPage && isRecommendations)) {
                const matchFor = {
                    watch: true,
                    ranking: enableReshogi,
                    search: enableSearchPage,
                    recommendations: enableRecommendationsPage,
                    shorts: enableShortsPage,
                }
                injectScript("/catchTargetPage.js", {
                    modifyScript(script) {
                        // MAINスクリプト側から引っかかったことを受け取ったらreload
                        script.addEventListener("mwReactRouterHit", (event) => {
                            if (event instanceof CustomEvent) {
                                console.log(`${event.type}:`, event.detail)
                            }
                            window.location.reload()
                        })
                        // どのページが有効化されているかをMAINスクリプト側に伝える
                        script.dataset["matchfor"] = JSON.stringify(matchFor)
                    },
                })
                /* ctx.addEventListener(window, "wxt:locationchange", ({ newUrl }) => {
                    if (watchPattern.includes(newUrl) || (rankingPattern.includes(newUrl) && enableReshogi)) window.location.reload()// Promise.allSettled(storagePromises).then(initializeWatch, onError);
                }) */
            }
        })
    },
})
