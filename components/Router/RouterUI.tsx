import { ReactNode } from "react";
import { WatchBody } from "../PMWatch/WatchBody";
import ShogiBody from "../ReShogi/ShogiBody";
import { useHistoryContext, useLocationContext } from "./RouterContext";
import Header from "../Global/Header/Header";
import { HeaderActionStacker } from "../Global/Header/HeaderActionStacker";
import { MintConfig } from "../PMWatch/modules/MintConfig";
import { useSetHeaderActionStateContext, useSetMintConfigShownContext, useSetSideMenuShownContext } from "../Global/Contexts/ModalStateProvider";

function Match({ targetPathname, children }: { targetPathname: string, children: ReactNode}) {
    const location = useLocationContext()
    if (location.pathname.startsWith(targetPathname)) return children
    return <></>;
}

export default function RouterUI() {
    const history = useHistoryContext()
    const location = useLocationContext()
    function linkClickHandler(e: React.MouseEvent) {
        if (e.target instanceof Element) {
            const nearestAnchor: HTMLAnchorElement | null = e.target.closest("a")
            // data-seektimeがある場合は、mousecaptureな都合上スキップする。
            // ここでのPath管理は完全にルーティングした先のコンポーネントに任せるため、単にページを切り替えるだけに留める。
            if (
                nearestAnchor && 
                !nearestAnchor.getAttribute("data-seektime") &&
                (
                    (
                        nearestAnchor.href.startsWith("https://www.nicovideo.jp/watch/") &&
                        !location.pathname.startsWith("/watch/")
                    ) ||
                    (
                        nearestAnchor.href.startsWith("https://www.nicovideo.jp/ranking") &&
                        !location.pathname.startsWith("/ranking")
                    ) 
                )
            ) {
                // 別の動画リンクであることが確定したら、これ以上イベントが伝播しないようにする
                e.stopPropagation()
                e.preventDefault()
                history.push(nearestAnchor.href)
            }
        }
    }
    const mintConfigElemRef = useRef<HTMLDivElement>(null);
    const headerActionStackerElemRef = useRef<HTMLDivElement>(null);
    const sideMenuElemRef = useRef<HTMLDivElement>(null);

    const setHeaderActionState = useSetHeaderActionStateContext();
    const setMintConfigShown = useSetMintConfigShownContext();
    const setSideMenuShown = useSetSideMenuShownContext()

    function handleKeydown(e: React.KeyboardEvent) {
        if (e.key === "Escape") {
            setHeaderActionState(false)
            setMintConfigShown(false)
            setSideMenuShown(false)
        }
    }

    function onModalOutsideClick(e: React.MouseEvent<HTMLDivElement>) {
        if (e.target instanceof HTMLElement && !headerActionStackerElemRef.current?.contains(e.target)) setHeaderActionState(false)
        if (e.target instanceof HTMLElement && !mintConfigElemRef.current?.contains(e.target)) setMintConfigShown(false)
        if (e.target instanceof HTMLElement && !sideMenuElemRef.current?.contains(e.target)) setSideMenuShown(false)
    }


    return <div className="router" onClickCapture={linkClickHandler} onKeyDown={handleKeydown} onClick={onModalOutsideClick}>
        <Header headerActionStackerElemRef={headerActionStackerElemRef} sideMenuElemRef={sideMenuElemRef}/>
        <HeaderActionStacker nodeRef={headerActionStackerElemRef} />
        <MintConfig nodeRef={mintConfigElemRef} />
        <Match targetPathname="/watch">
            <WatchBody/>
        </Match>
        <Match targetPathname="/ranking">
            <ShogiBody/>
        </Match>
    </div>
}