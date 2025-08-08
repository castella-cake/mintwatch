import { ContentScriptContext } from "#imports"
import RouterRoot from "@/components/Router/RouterRoot"
import { scan } from "react-scan"
import { createRoot } from "react-dom/client"
import { getStorageItemsWithObject } from "../storageControl"
// import MigrateRoot from "@/components/Safemode/MigrateRoot"

export default async function initiateRouter(ctx: ContentScriptContext) {
    const currentStorage = await getStorageItemsWithObject(["sync:starNightPalette", "sync:colorPalette", "sync:pmwforcepagehls", "local:playersettings"] as const)

    // nopmwだったら終了
    const queryString = location.search
    const searchParams = new URLSearchParams(queryString)
    if (searchParams.get("nopmw") == "true") return

    if (!document.documentElement) return

    const metaTags = document.getElementsByTagName("meta")
    for (const meta of metaTags) {
        meta.setAttribute("data-server", "protected")
        if (meta.getAttribute("name") === "server-context") {
            meta.setAttribute("name", "server-context-mw")
        }
        if (meta.getAttribute("name") === "server-response") {
            meta.setAttribute("name", "server-response-mw")
        }
    }

    // スクリプトの実行を早々に阻止する。innerHTMLの前にやった方が安定する。
    for (const scriptElement of document.head.getElementsByTagName("script")) {
        blockScriptElement(scriptElement)
    }
    for (const linkElement of [...document.head.getElementsByTagName("link")]) {
        blockScriptElement(linkElement)
    }

    const observer = new MutationObserver((records) => {
        records.forEach((record) => {
            const addedNodes = record.addedNodes
            for (const node of addedNodes) {
                // console.log("node: ", node)
                const elem = node as Element
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // console.log("nodetype")
                    blockScriptElement(elem)
                    elem.querySelectorAll("script").forEach(
                        blockScriptElement,
                    )
                }
            }
        })
    })
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
    })

    // cleanup
    const linkElements = [...document.head.getElementsByTagName("link")]
    linkElements.forEach((elem) => {
        if (elem.rel === "modulepreload" && elem.href.startsWith("https://resource.video.nimg.jp/web/scripts/nvpc_next/")) elem.remove()
    })
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
        const faviconElement = document.querySelector("link[rel=\"shortcut icon\"]") as HTMLLinkElement
        if (faviconElement) {
            faviconElement.href = ""
            faviconElement.href = "https://resource.video.nimg.jp/web/images/favicon/favicon.ico"
        } else {
            const linkElement = document.createElement("link")
            linkElement.rel = "shortcut icon"
            linkElement.href = "https://resource.video.nimg.jp/web/images/favicon/favicon.ico"
            document.head.appendChild(linkElement)
        }
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
    dummyScript.src = browser.runtime.getURL("/dummy.js") + "?dummy=/turnstile/v0/api.js&render=explicit"
    dummyScript.type = "text/plain"
    if (document.head) document.head.appendChild(dummyScript)
    await injectScript("/load_turnstile.js")

    if (import.meta.env.DEV) {
        scan({
            enabled: true,
        })
    }

    const sanitizeStyleLink = document.createElement("link")
    sanitizeStyleLink.rel = "stylesheet"
    sanitizeStyleLink.href = browser.runtime.getURL("/content-scripts/sanitize.css" as any)
    document.head.appendChild(sanitizeStyleLink)

    const ui = createIntegratedUi(ctx, {
        position: "inline",
        anchor: "body",
        onMount: (container) => {
            const unwatchPalette = storage.watch<string>("sync:colorPalette", (newPalette) => {
                if (newPalette) document.body.setAttribute("data-mw-palette", newPalette)
            })
            const unwatchEasterEgg = storage.watch<string>("sync:starNightPalette", (newPalette) => {
                if (newPalette) {
                    document.body.setAttribute("data-mw-palette", "starnight")
                } else {
                    storage.getItem("sync:colorPalette").then((c) => {
                        if (typeof c === "string") {
                            document.body.setAttribute("data-mw-palette", c)
                        } else {
                            document.body.setAttribute("data-mw-palette", "default")
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
