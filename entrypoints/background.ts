export default defineBackground({
    persistent: false,
    main() {
        const manifestData = browser.runtime.getManifest()
        browser.runtime.onInstalled.addListener(function (details) {
            if (details.reason == "install") {
                browser.tabs.create({
                    url: browser.runtime.getURL("/welcome.html"),
                })
            }
            else if (details.reason == "update" && details.previousVersion && details.previousVersion !== manifestData.version) {
                if (
                    details.previousVersion.split(".")[0] != manifestData.version.split(".")[0]
                ) {
                    browser.tabs.create({
                        url: browser.runtime.getURL("/update.html"),
                    })
                }
                browser.storage.local.set({ versionupdated: true })
            }
        })
    },
})
