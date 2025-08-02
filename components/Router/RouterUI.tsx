import { ReactNode, useLayoutEffect } from "react"
import { WatchBody } from "../PMWatch/WatchBody"
import ShogiBody from "../ReShogi/ShogiBody"
import { useHistoryContext, useLocationContext } from "./RouterContext"
import Header from "../Global/Header/Header"
import { MintConfig } from "../Global/MintConfig"
import { useSetHeaderActionStateContext, useSetMintConfigShownContext, useSetSideMenuShownContext } from "../Global/Contexts/ModalStateProvider"
import { useVideoRefContext } from "../Global/Contexts/VideoDataProvider"
import { useBackgroundPlayingContext, useSetBackgroundPlayingContext } from "../Global/Contexts/BackgroundPlayProvider"
import Alert from "../Global/Alert"
import Toast from "../Global/Toast"

function MatchWatchPage({ targetPathname, children }: { targetPathname: string, children: ReactNode }) {
    const backgroundPlaying = useBackgroundPlayingContext()
    const location = useLocationContext()
    if (location.pathname.startsWith(targetPathname) || backgroundPlaying) return children
    return <></>
}

function Match({ targetPathname, children }: { targetPathname: string, children: ReactNode }) {
    const location = useLocationContext()
    if (location.pathname.startsWith(targetPathname)) return children
    return <></>
}

const nicovideoPrefix = "https://www.nicovideo.jp"

export default function RouterUI() {
    const { syncStorage } = useStorageContext()
    const videoRef = useVideoRefContext()
    const history = useHistoryContext()
    const location = useLocationContext()
    const setBackgroundPlaying = useSetBackgroundPlayingContext()
    const targetPathnames = syncStorage.enableReshogi ? ["/watch/", "/ranking"] : ["/watch/"]
    const linkClickHandler = useCallback((e: React.MouseEvent) => {
        if (e.target instanceof Element) {
            const nearestAnchor: HTMLAnchorElement | null = e.target.closest("a")
            // data-seektimeがある場合は、mousecaptureな都合上スキップする。
            // ここでのPath管理は完全にルーティングした先のコンポーネントに任せるため、単にページを切り替えるだけに留める。
            if (
                nearestAnchor
                && !nearestAnchor.getAttribute("data-seektime")
                && (
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
                window.scroll({ top: 0 })
            }
        }
    }, [setBackgroundPlaying, location, history])
    useLayoutEffect(() => {
        return history.listen(({ location: newLocation }) => {
            if (videoRef.current && !videoRef.current.paused && !newLocation.pathname.startsWith("/watch/")) {
                setBackgroundPlaying(true)
            } else {
                setBackgroundPlaying(false)
            }
        })
    }, [])
    const mintConfigElemRef = useRef<HTMLDivElement>(null)
    const headerActionStackerElemRef = useRef<HTMLDivElement>(null)
    const sideMenuElemRef = useRef<HTMLDivElement>(null)

    const setHeaderActionState = useSetHeaderActionStateContext()
    const setMintConfigShown = useSetMintConfigShownContext()
    const setSideMenuShown = useSetSideMenuShownContext()

    const handleKeydown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            setHeaderActionState(false)
            setMintConfigShown(false)
            setSideMenuShown(false)
        }
    }, [setHeaderActionState, setMintConfigShown, setSideMenuShown])

    const onModalOutsideClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target instanceof HTMLElement && !headerActionStackerElemRef.current?.contains(e.target)) setHeaderActionState(false)
        if (e.target instanceof HTMLElement && !mintConfigElemRef.current?.contains(e.target)) setMintConfigShown(false)
        if (e.target instanceof HTMLElement && !sideMenuElemRef.current?.contains(e.target)) setSideMenuShown(false)
    }, [setHeaderActionState, setMintConfigShown, setSideMenuShown])

    return (
        <div className="router" onClickCapture={linkClickHandler} onKeyDown={handleKeydown} onClick={onModalOutsideClick}>
            <Header headerActionStackerElemRef={headerActionStackerElemRef} sideMenuElemRef={sideMenuElemRef} />
            <MintConfig nodeRef={mintConfigElemRef} />
            <MatchWatchPage targetPathname="/watch">
                <WatchBody />
            </MatchWatchPage>
            <Match targetPathname="/ranking">
                <ShogiBody />
            </Match>
            <Alert />
            <Toast />
        </div>
    )
}
