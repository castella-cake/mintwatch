import initializeRouter from "@/utils/initiator/router"

const watchPattern = new MatchPattern("*://www.nicovideo.jp/watch/*")
const rankingPattern = new MatchPattern("*://www.nicovideo.jp/ranking*")

const searchPatternArray = [
    new MatchPattern("*://www.nicovideo.jp/search/*"),
    new MatchPattern("*://www.nicovideo.jp/tag/*"),
    new MatchPattern("*://www.nicovideo.jp/series_search/*"),
    new MatchPattern("*://www.nicovideo.jp/mylist_search/*"),
    new MatchPattern("*://www.nicovideo.jp/user_search/*"),
] as const

export default defineContentScript({
    matches: ["*://www.nicovideo.jp/*"],
    runAt: "document_start",
    main(ctx) {
        getStorageItemsWithObject(["sync:enableReshogi", "sync:enableSearchPage"] as const).then((storage) => {
            const enableReshogi = storage["sync:enableReshogi"]
            const enableSearchPage = storage["sync:enableSearchPage"]
            // nopmwだったら何もしない
            const queryString = location.search
            const searchParams = new URLSearchParams(queryString)
            if (searchParams.get("nopmw") == "true" || searchParams.get("responseType") === "json") return

            if (
                watchPattern.includes(window.location.toString())
                || (rankingPattern.includes(window.location.toString()) && enableReshogi)
                || (enableSearchPage && searchPatternArray.some(m => m.includes(window.location.toString())))
            ) {
                initializeRouter(ctx)
            } else {
                ctx.addEventListener(window, "wxt:locationchange", ({ newUrl }) => {
                    if (watchPattern.includes(newUrl) || (rankingPattern.includes(window.location.toString()) && enableReshogi)) window.location.reload()// Promise.allSettled(storagePromises).then(initializeWatch, onError);
                })
            }
        })
    },
})
