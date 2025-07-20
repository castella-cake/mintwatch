import {
    getLocalStorageData,
    getSyncStorageData,
} from "../utils/storageControl"
import initializeRouter from "@/utils/initiator/router"

const watchPattern = new MatchPattern("*://www.nicovideo.jp/watch/*")
const rankingPattern = new MatchPattern("*://www.nicovideo.jp/ranking*")

export default defineContentScript({
    matches: ["*://www.nicovideo.jp/*"],
    runAt: "document_start",
    main(ctx) {
        const storagePromises = [getSyncStorageData, getLocalStorageData]
        Promise.allSettled(storagePromises).then((storages) => {
            const syncStorage: { [key: string]: any } = storages[0].status === "fulfilled" ? storages[0].value : {}
            if (watchPattern.includes(window.location.toString()) || (rankingPattern.includes(window.location.toString()) && syncStorage.enableReshogi)) {
                initializeRouter(ctx, storages)
            }
            else {
                ctx.addEventListener(window, "wxt:locationchange", ({ newUrl }) => {
                    if (watchPattern.includes(newUrl) || (rankingPattern.includes(window.location.toString()) && syncStorage.enableReshogi)) window.location.reload()// Promise.allSettled(storagePromises).then(initializeWatch, onError);
                })
            }
        })
    },
})
