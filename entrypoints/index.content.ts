import {
    getLocalStorageData,
    getSyncStorageData,
} from "../utils/storageControl";
import initializeWatch from "../utils/initiator/watch";
import initRanking from "@/utils/initiator/ranking";
import initializeRouter from "@/utils/initiator/router"

const watchPattern = new MatchPattern('*://www.nicovideo.jp/watch/*');
const rankingPattern = new MatchPattern('*://www.nicovideo.jp/ranking*');

export default defineContentScript({
    matches: ["*://www.nicovideo.jp/*"],
    runAt: "document_start",
    main(ctx) {
        const storagePromises = [getSyncStorageData, getLocalStorageData];
        function onError(error: Error) {
            console.log(`Error: ${error}`);
        }

        if (rankingPattern.includes(window.location.toString()) || watchPattern.includes(window.location.toString())) {
            Promise.allSettled(storagePromises).then((storage) => initializeRouter(ctx, storage))
        } else if (watchPattern.includes(window.location.toString())) {
            Promise.allSettled(storagePromises).then(initializeWatch, onError);
        } else if (rankingPattern.includes(window.location.toString())) {
            Promise.allSettled(storagePromises).then(initRanking)
        } else {
            ctx.addEventListener(window, 'wxt:locationchange', ({ newUrl }) => {
                if (watchPattern.includes(newUrl) || rankingPattern.includes(newUrl)) window.location.reload()//Promise.allSettled(storagePromises).then(initializeWatch, onError);
            });
        }

    },
});
