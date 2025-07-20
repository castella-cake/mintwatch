// Old Twitter Layoutの実装を大いに参考にさせていただきました
// https://github.com/dimdenGD/OldTwitter/blob/master/scripts/blockBeforeInject.js
export default function blockScriptElement(element: Element) {
    // console.log("acting block:" , element)
    const href: string = element.getAttribute("href") ?? ""
    const src: string = element.getAttribute("src") ?? ""
    if (
        element.tagName.toLowerCase() === "script"
        && element.getAttribute("pmw-isplugin") !== "true"
        && !src.includes("extension://")
        && !(src === "" && element.innerHTML.includes("watchinjector"))
    ) {
        // console.log("blocked:",element);
        element.setAttribute("type", "javascript/blocked")
        function onBeforeScriptExecute(e: Event) {
            if (element.getAttribute("type") === "javascript/blocked") {
                e.preventDefault()
            }
            element.removeEventListener(
                "beforescriptexecute",
                onBeforeScriptExecute,
            )
        }
        element.addEventListener("beforescriptexecute", onBeforeScriptExecute)
        element.remove()
    } else if (
        element.tagName.toLowerCase() === "link"
        && typeof element.getAttribute("href") === "string"
        && href.includes("resource.video.nimg.jp")
    ) {
        // console.log("blocked:",element);
        element.setAttribute("href", "")
        element.remove()
    } else {
        // console.log("not blocked:",element);
    }
}
