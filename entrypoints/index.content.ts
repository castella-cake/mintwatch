import {
    getLocalStorageData,
    getSyncStorageData,
} from "../utils/storageControl";
import "@/components/PMWatch/index.styl";
import initializeWatch from "../utils/initWatch";

const watchPattern = new MatchPattern('*://www.nicovideo.jp/watch/*');

export default defineContentScript({
    matches: ["*://www.nicovideo.jp/*"],
    runAt: "document_start",
    main(ctx) {
        const storagePromises = [getSyncStorageData, getLocalStorageData];
        function onError(error: Error) {
            console.log(`Error: ${error}`);
        }

        if (watchPattern.includes(window.location.toString())) {
            Promise.allSettled(storagePromises).then(initializeWatch, onError);
        } else {
            ctx.addEventListener(window, 'wxt:locationchange', ({ newUrl }) => {
                if (watchPattern.includes(newUrl)) window.location.reload()//Promise.allSettled(storagePromises).then(initializeWatch, onError);
            });
        }

    },
});
