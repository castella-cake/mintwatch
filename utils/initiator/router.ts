import { ContentScriptContext } from "#imports"
import RouterRoot from "@/components/Router/RouterRoot"
import { scan } from "react-scan"
import { createRoot } from "react-dom/client"
import { getStorageItemsWithObject } from "../storageControl"
// import MigrateRoot from "@/components/Safemode/MigrateRoot"

export default async function initiateRouter(ctx: ContentScriptContext) {
    document.getElementById("root")?.remove()
    const observer = new MutationObserver((records) => {
        records.forEach((record) => {
            const addedNodes = record.addedNodes
            for (const node of addedNodes) {
                // console.log("node: ", node)
                const elem = node as Element
                if (elem.id === "root") {
                    elem.remove()
                    console.log("blacklist element removed")
                }
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // console.log("nodetype")
                    blockScriptElement(elem)
                    elem.querySelectorAll("script").forEach(
                        blockScriptElement,
                    )
                }
            }
            const targetElem = record.target as Element
            targetElem.querySelectorAll("script").forEach(
                blockScriptElement,
            )
        })
    })
    if (!document.documentElement) return
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
    })
    setTimeout(() => {
        observer.disconnect()
    }, 500)

    const currentStorage = await getStorageItemsWithObject(["sync:starNightPalette", "sync:colorPalette", "sync:pmwforcepagehls", "local:playersettings"] as const)

    // HACK: 元のスクリプトがheadのタグを全削除する問題に対処するため、セレクターから避けるように属性を変更する
    const metaTags = document.getElementsByTagName("meta")
    for (const meta of metaTags) {
        if (meta.getAttribute("name") === "server-context") {
            meta.setAttribute("name", "server-context-mw")
        }
        if (meta.getAttribute("name") === "server-response") {
            meta.setAttribute("name", "server-response-mw")
            // pathnameとsearchを記録
            meta.setAttribute("data-pathname", window.location.pathname)
            meta.setAttribute("data-search", window.location.search)
        }
    }
    const protectTarget = document.querySelectorAll("[data-server=\"1\"]")
    for (const protectTargetElement of protectTarget) {
        protectTargetElement.setAttribute("data-server", "protected")
    }

    // スクリプトの実行を早々に阻止する。innerHTMLの前にやった方が安定する。
    for (const scriptElement of document.getElementsByTagName("script")) {
        blockScriptElement(scriptElement)
    }
    for (const linkElement of [...document.getElementsByTagName("link")]) {
        blockScriptElement(linkElement)
    }

    const faviconElement = document.querySelector("link[rel=\"shortcut icon\"]") as HTMLLinkElement
    if (faviconElement) {
        faviconElement.href = ""
        faviconElement.href = "https://resource.video.nimg.jp/web/images/favicon/favicon.ico"
    } else {
        const linkElement = document.createElement("link")
        linkElement.rel = "shortcut icon"
        linkElement.href = "https://resource.video.nimg.jp/web/images/favicon/favicon.ico"
        if (document.head) document.head.appendChild(linkElement)
    }

    // cleanup
    if (document.head) {
        const linkElements = [...document.head.getElementsByTagName("link")]
        linkElements.forEach((elem) => {
            if (elem.rel === "modulepreload" && elem.href.startsWith("https://resource.video.nimg.jp/web/scripts/nvpc_next/")) elem.remove()
        })
    }

    if (document.body) {
        document.body.innerHTML = ""
    }

    document.documentElement.classList.add("MW-Enabled")
    if (currentStorage["sync:starNightPalette"]) {
        document.documentElement.setAttribute("data-mw-palette", "starnight")
    } else if (currentStorage["sync:colorPalette"]) {
        document.documentElement.setAttribute("data-mw-palette", currentStorage["sync:colorPalette"])
    }

    // これでなぜかFirefoxで虚無になる問題が治る。逆にChromeのコードに入れると問題が起こる。
    // if (import.meta.env.FIREFOX) window.stop();
    if (import.meta.env.FIREFOX) {
        window.stop()
    }

    // 外部HLSプラグインを読み込む。pmw-ispluginを入れておかないとスクリプトの実行が阻止されます
    if (import.meta.env.FIREFOX || currentStorage["sync:pmwforcepagehls"]) {
        /* const script = document.createElement("script");
        script.src = browser.runtime.getURL("/watch_injector.js");
        script.setAttribute("pmw-isplugin", "true");
        head.appendChild(script); */
        await injectScript("/watch_injector.js")
    }

    // HACK: turnstileはscriptタグを要求し、そこで一部のモードを判断するので、実行されないダミーのscriptタグを事前に用意する
    const dummyScript = document.createElement("script")
    dummyScript.src = "https://challenges.cloudflare.com/turnstile/v0/api.js&render=explicit"
    dummyScript.type = "text/plain"
    if (document.head) document.head.appendChild(dummyScript)
    await injectScript("/load_turnstile.js")

    if (import.meta.env.DEV) {
        scan({
            enabled: true,
        })
    }

    const deferStyleLink = document.createElement("link")
    deferStyleLink.rel = "stylesheet"
    deferStyleLink.href = browser.runtime.getURL("/content-scripts/deferStyle.css" as any)
    document.head.appendChild(deferStyleLink)

    const ui = createIntegratedUi(ctx, {
        position: "inline",
        anchor: "body",
        onMount: (container) => {
            const unwatchPalette = storage.watch<string>("sync:colorPalette", (newPalette) => {
                if (newPalette) document.documentElement.setAttribute("data-mw-palette", newPalette)
            })
            const unwatchEasterEgg = storage.watch<string>("sync:starNightPalette", (newPalette) => {
                if (newPalette) {
                    document.documentElement.setAttribute("data-mw-palette", "starnight")
                } else {
                    storage.getItem("sync:colorPalette").then((c) => {
                        if (typeof c === "string") {
                            document.documentElement.setAttribute("data-mw-palette", c)
                        } else {
                            document.documentElement.setAttribute("data-mw-palette", "default")
                        }
                    })
                }
            })
            // root要素を足してレンダー！
            const rootElem = document.createElement("div")
            rootElem.id = "root-pmw"
            container.appendChild(rootElem)
            if (rootElem.childNodes.length != 0) {
                console.error("ranking page replace failed: #root is not empty.")
                return {}
            }
            const uiRoot = createRoot(rootElem)
            uiRoot.render(RouterRoot())
            return { uiRoot, unwatchPalette, unwatchEasterEgg }
        },
        onRemove: (cleanup) => {
            if (!cleanup) return

            if (cleanup.uiRoot) cleanup.uiRoot.unmount()
            if (cleanup.unwatchPalette) cleanup.unwatchPalette()
            if (cleanup.unwatchEasterEgg) cleanup.unwatchEasterEgg()
        },
    })
    // 0.8.0 以前の playersettings をすべて local 直下へ移動する処理。これは長くても200ms程度で完了する。
    if (!!currentStorage["local:playersettings"] && typeof currentStorage["local:playersettings"] === "object" && Object.keys(currentStorage["local:playersettings"]).length > 0) {
        console.time("migrate")
        const playerSettings = await storage.getItem<{ [key: string]: any }>("local:playersettings")
        if (playerSettings) {
            await storage.setItems(Object.keys(playerSettings).map(key => ({ key: `local:${key}`, value: playerSettings[key] })))
        }
        await storage.removeItem("local:playersettings")
        console.timeEnd("migrate")
    }
    ui.autoMount()
}
