import { ReactNode, useLayoutEffect } from "react";
import { WatchBody } from "../PMWatch/WatchBody";
import ShogiBody from "../ReShogi/ShogiBody";
import { useHistoryContext, useLocationContext } from "./RouterContext";
import Header from "../Global/Header/Header";
import { HeaderActionStacker } from "../Global/Header/HeaderActionStacker";
import { MintConfig } from "../PMWatch/modules/MintConfig";
import { useSetHeaderActionStateContext, useSetMintConfigShownContext, useSetSideMenuShownContext } from "../Global/Contexts/ModalStateProvider";
import { useVideoRefContext } from "../Global/Contexts/VideoDataProvider";
import { useBackgroundPlayHrefRefContext, useBackgroundPlayingContext, useSetBackgroundPlayingContext } from "../Global/Contexts/BackgroundPlayProvider";

function MatchWatchPage({ targetPathname, children }: { targetPathname: string, children: ReactNode }) {
    const backgroundPlaying = useBackgroundPlayingContext()
    const location = useLocationContext()
    if (location.pathname.startsWith(targetPathname) || backgroundPlaying) return children
    return <></>;
}

function Match({ targetPathname, children }: { targetPathname: string, children: ReactNode }) {
    const location = useLocationContext()
    if (location.pathname.startsWith(targetPathname)) return children
    return <></>;
}

const nicovideoPrefix = "https://www.nicovideo.jp"
const targetPathnames = ["/watch/", "/ranking"]

export default function RouterUI() {
    const videoRef = useVideoRefContext()
    const history = useHistoryContext()
    const location = useLocationContext()
    const setBackgroundPlaying = useSetBackgroundPlayingContext()
    const backgroundPlayHrefRef = useBackgroundPlayHrefRefContext()
    function linkClickHandler(e: React.MouseEvent) {
        if (e.target instanceof Element) {
            const nearestAnchor: HTMLAnchorElement | null = e.target.closest("a")
            // data-seektimeがある場合は、mousecaptureな都合上スキップする。
            // ここでのPath管理は完全にルーティングした先のコンポーネントに任せるため、単にページを切り替えるだけに留める。
            if (
                nearestAnchor && 
                !nearestAnchor.getAttribute("data-seektime") &&
                (
                    targetPathnames.map(path => nearestAnchor.href.startsWith(nicovideoPrefix + path) && !location.pathname.startsWith(path)).some(path => path)
                )
            ) {
                // 別の動画リンクであることが確定したら、これ以上イベントが伝播しないようにする
                e.stopPropagation()
                e.preventDefault()
                if (videoRef.current && !videoRef.current.paused && !nearestAnchor.href.startsWith("/watch/")) {
                    setBackgroundPlaying(true)
                } else {
                    setBackgroundPlaying(false)
                }
                history.push(nearestAnchor.href)
            }
        }
    }
    useLayoutEffect(() => {
        return history.listen(({ location: newLocation }) => {
            if (videoRef.current && !videoRef.current.paused && !newLocation.pathname.startsWith("/watch/")) {
                setBackgroundPlaying(true)
            } else {
                setBackgroundPlaying(false)
            }
        })
    }, [])
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
        <MatchWatchPage targetPathname="/watch">
            <WatchBody/>
        </MatchWatchPage>
        <Match targetPathname="/ranking">
            <ShogiBody/>
        </Match>
    </div>
}