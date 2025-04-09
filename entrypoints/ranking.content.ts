import { reShogi } from "@/components/ReShogi/ShogiRoot";
import {
    getLocalStorageData,
    getSyncStorageData,
} from "../utils/storageControl";
import { createRoot } from "react-dom/client";
import "@/components/ReShogi/index.styl"
import blockScriptElement from "@/utils/blockScriptElement";

export default defineContentScript({
    matches: ["*://www.nicovideo.jp/*"],
    runAt: "document_start",
    main() {
        if (!location.pathname.startsWith("/ranking")) return;
        const storagePromises = [getSyncStorageData, getLocalStorageData];

        Promise.allSettled(storagePromises).then(createCSSRule, onError);
        function onError(error: Error) {
            console.log(`Error: ${error}`);
        }
        async function createCSSRule(storages: any) {
            const syncStorage: { [key: string]: any } = storages[0].value;
            //const localStorage: { [key: string]: any } = storages[1].value;
            //if (!syncStorage.enablewatchpagereplace) return;

            // nopmwだったら終了
            const queryString = location.search;
            const searchParams = new URLSearchParams(queryString);
            if (!syncStorage.enableReshogi || searchParams.get("nopmw") == "true") return;

            // これでなぜかFirefoxで虚無になる問題が治る。逆にChromeのコードに入れると問題が起こる。
            if (import.meta.env.FIREFOX) window.stop();

            if (!document.documentElement) return;

            // PMW-Enabledを追加してスタイルシートを有効化
            document.documentElement.classList.add(`ReShogi-Enabled`);
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
            /*document.documentElement.innerHTML = `
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

            // root要素を足してレンダー！
            const body = document.body;
            const root = document.createElement("div");
            root.id = "root-pmw";
            body.appendChild(root);
            if (root.childNodes.length != 0) {
                console.error("ranking page replace failed: #root is not empty.");
                return;
            }
            createRoot(root).render(reShogi());
        }
    },
});
