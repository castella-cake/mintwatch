import { ContentScriptContext } from "#imports";
import RouterRoot from "@/components/Router/RouterRoot";
import { createRoot } from "react-dom/client";

export default async function initiateRouter(ctx: ContentScriptContext, storages: any) {
    const syncStorage: { [key: string]: any } = storages[0].value;
    const localStorage: { [key: string]: any } = storages[1].value;
    //if (!syncStorage.enablewatchpagereplace) return;

    // nopmwだったら終了
    const queryString = location.search;
    const searchParams = new URLSearchParams(queryString);
    if (searchParams.get("nopmw") == "true") return;

    // これでなぜかFirefoxで虚無になる問題が治る。逆にChromeのコードに入れると問題が起こる。
    if (import.meta.env.FIREFOX) window.stop();

    if (!document.documentElement) return;

    // スクリプトの実行を早々に阻止する。innerHTMLの前にやった方が安定する。
    const observer = new MutationObserver((records) => {
        records.forEach((record) => {
            const addedNodes = record.addedNodes;
            for (const node of addedNodes) {
                //console.log("node: ", node)
                const elem = node as Element;
                if (node.nodeType === Node.ELEMENT_NODE) {
                    //console.log("nodetype")
                    blockScriptElement(elem);
                    elem.querySelectorAll("script").forEach(
                        blockScriptElement,
                    );
                }
            }
        });
    });
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
    });

    // 外部HLSプラグインを読み込む。pmw-ispluginを入れておかないとスクリプトの実行が阻止されます
    if (import.meta.env.FIREFOX || syncStorage.pmwforcepagehls) {
        /*const script = document.createElement("script");
        script.src = browser.runtime.getURL("/watch_injector.js");
        script.setAttribute("pmw-isplugin", "true");
        head.appendChild(script);*/
        await injectScript('/watch_injector.js');
    }
    //console.log(document.documentElement.outerHTML)

    // わたってくるdocumentには既に動画情報のレスポンスが入っている。使えるならこっちを使って高速化してしまったほうが良いので、innerHTMLが書き換わる前に取得しておく
    /*const initialResponse =
        (document.getElementsByName("server-response").length > 0 &&
            document
                .getElementsByName("server-response")[0]
                .getAttribute("content")) ??
        "";
    //console.log("DOM serverResponse", initialResponse)
    const initialClassNames =
        document.documentElement.classList.values();
    const initialStyle = document.documentElement.style.cssText;*/

    /*document.head.innerHTML = `
        <meta charset="utf-8">
        <link rel="shortcut icon" href="https://resource.video.nimg.jp/web/images/favicon/favicon.ico">
        <meta name="initial-response" content="{}">
    `*/
    document.body.innerHTML = "";
    // cleanup
    const linkElements = [...document.head.getElementsByTagName("link")]
    linkElements.forEach(elem => {
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
    );*/

    // watchPage は playersettings の値が何かしら入ってないと落ちるので絶対に書き込む
    if (!localStorage.playersettings) browser.storage.local.set({ playersettings: {} });

    const ui = createIntegratedUi(ctx, {
        position: "inline",
        anchor: "body",
        onMount: (container) => {
            // root要素を足してレンダー！
            const rootElem = document.createElement("div");
            rootElem.id = "root-pmw";
            container.appendChild(rootElem);
            if (rootElem.childNodes.length != 0) {
                console.error("ranking page replace failed: #root is not empty.");
                return;
            }
            const uiRoot = createRoot(rootElem)
            uiRoot.render(RouterRoot());
            return uiRoot
        },
        onRemove: (uiRoot) => {
            if (uiRoot) uiRoot.unmount();
        }
    })
    ui.mount()
}