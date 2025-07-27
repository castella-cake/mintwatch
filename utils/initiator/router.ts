import { ContentScriptContext } from "#imports"
import RouterRoot from "@/components/Router/RouterRoot"
import { scan } from "react-scan"
import { createRoot } from "react-dom/client"

export default async function initiateRouter(ctx: ContentScriptContext, storages: any) {
    const syncStorage: { [key: string]: any } = storages[0].value
    const localStorage: { [key: string]: any } = storages[1].value
    // if (!syncStorage.enablewatchpagereplace) return;

    // nopmwだったら終了
    const queryString = location.search
    const searchParams = new URLSearchParams(queryString)
    if (searchParams.get("nopmw") == "true") return

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

    if (!document.documentElement) return

    if (syncStorage.starNightPalette) {
        document.body.setAttribute("data-mw-palette", "starnight")
    } else if (syncStorage.colorPalette) {
        document.body.setAttribute("data-mw-palette", syncStorage.colorPalette)
    }

    // スクリプトの実行を早々に阻止する。innerHTMLの前にやった方が安定する。
    document.documentElement.querySelectorAll("script").forEach(
        blockScriptElement,
    )
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

    // 外部HLSプラグインを読み込む。pmw-ispluginを入れておかないとスクリプトの実行が阻止されます
    if (import.meta.env.FIREFOX || syncStorage.pmwforcepagehls) {
        /* const script = document.createElement("script");
        script.src = browser.runtime.getURL("/watch_injector.js");
        script.setAttribute("pmw-isplugin", "true");
        head.appendChild(script); */
        await injectScript("/watch_injector.js")
    }
    // HACK: turnstileはscriptタグを要求し、そこで一部のモードを判断するので、実行されないダミーのscriptタグを事前に用意する
    const dummyScript = document.createElement("script")
    dummyScript.src = browser.runtime.getURL("/dummy_for_turnstile.js") + "?dummy=/turnstile/v0/api.js&render=explicit"
    dummyScript.type = "text/plain"
    if (document.head) document.head.appendChild(dummyScript)
    await injectScript("/load_turnstile.js")
    // console.log(document.documentElement.outerHTML)

    // わたってくるdocumentには既に動画情報のレスポンスが入っている。使えるならこっちを使って高速化してしまったほうが良いので、innerHTMLが書き換わる前に取得しておく
    /* const initialResponse =
        (document.getElementsByName("server-response").length > 0 &&
            document
                .getElementsByName("server-response")[0]
                .getAttribute("content")) ??
        "";
    //console.log("DOM serverResponse", initialResponse)
    const initialClassNames =
        document.documentElement.classList.values();
    const initialStyle = document.documentElement.style.cssText; */

    /* document.head.innerHTML = `
        <meta charset="utf-8">
        <link rel="shortcut icon" href="https://resource.video.nimg.jp/web/images/favicon/favicon.ico">
        <meta name="initial-response" content="{}">
    ` */
    if (document.body) document.body.innerHTML = ""
    // cleanup
    const linkElements = [...document.head.getElementsByTagName("link")]
    linkElements.forEach((elem) => {
        if (elem.rel === "modulepreload" && elem.href.startsWith("https://resource.video.nimg.jp/web/scripts/nvpc_next/")) elem.remove()
    })
    /*
    document.documentElement.innerHTML = `
        <head>
            <meta charset="utf-8">
            <link rel="shortcut icon" href="https://resource.video.nimg.jp/web/images/favicon/favicon.ico">
            <meta name="initial-response" content="{}">
        </head>
        <body>
        </body>
    `;

    document.dispatchEvent(
        new CustomEvent("reshogi_pageReplaced", { detail: "" }),
    );

    //console.log("initialResponse", JSON.parse(initialResponse))
    // さっき書き換える前に取得した値を書き戻す。innerHTMLに直接埋め込むのは信用できない。
    if (
        document.getElementsByName("initial-response").length > 0 &&
        initialResponse
    ) {
        document
            .getElementsByName("initial-response")[0]
            .setAttribute("content", initialResponse);
        //console.log("embedded")
    }
    // PepperMint+ のダークモードが使えるようにここも引き継ぐ
    /*document.documentElement.classList.add(...initialClassNames);
    document.documentElement.setAttribute(
        "style",
        `${document.documentElement.style.cssText}
        ${initialStyle}`,
    ); */

    // watchPage は playersettings の値が何かしら入ってないと落ちるので絶対に書き込む
    if (!localStorage.playersettings) browser.storage.local.set({ playersettings: {} })

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
    ui.autoMount()
}
