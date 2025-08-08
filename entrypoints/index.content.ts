import initializeRouter from "@/utils/initiator/router"

const watchPattern = new MatchPattern("*://www.nicovideo.jp/watch/*")
const rankingPattern = new MatchPattern("*://www.nicovideo.jp/ranking*")

export default defineContentScript({
    matches: ["*://www.nicovideo.jp/*"],
    runAt: "document_start",
    main(ctx) {
        storage.getItem<boolean>("sync:enableReshogi").then((enableReshogi) => {
            if (watchPattern.includes(window.location.toString()) || (rankingPattern.includes(window.location.toString()) && enableReshogi)) {
                initializeRouter(ctx)
            } else {
                ctx.addEventListener(window, "wxt:locationchange", ({ newUrl }) => {
                    if (watchPattern.includes(newUrl) || (rankingPattern.includes(window.location.toString()) && enableReshogi)) window.location.reload()// Promise.allSettled(storagePromises).then(initializeWatch, onError);
                })
            }
        })
    },
})
