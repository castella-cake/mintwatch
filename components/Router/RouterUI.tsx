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
import { MintWatchModal } from "../Global/Settings/Modal"
import { SearchBody } from "../Search/SearchBody"
import { useQueryClient } from "@tanstack/react-query"

function MatchWatchPage({ targetPathname, children }: { targetPathname: string, children: ReactNode }) {
    const backgroundPlaying = useBackgroundPlayingContext()
    const location = useLocationContext()
    if (location.pathname.startsWith(targetPathname) || backgroundPlaying) return children
    return <></>
}

function Match({ targetPathname, children }: { targetPathname: string | string[], children: ReactNode }) {
    const location = useLocationContext()
    if (
        (typeof targetPathname === "string" && location.pathname.startsWith(targetPathname))
        || (typeof targetPathname === "object" && targetPathname.some(path => location.pathname.startsWith(path)))
    ) return children
    return <></>
}

const nicovideoPrefix = "https://www.nicovideo.jp"

export default function RouterUI() {
    const syncStorage = useStorageVar(["enableReshogi", "enableSearchPage"] as const)
    const targetPathnames = [
        "/watch/",
        ...(syncStorage.enableReshogi ? ["/ranking"] : []),
        ...(syncStorage.enableSearchPage
            ? searchPagePaths
            : []),
    ]

    const videoRef = useVideoRefContext()
    const history = useHistoryContext()
    const location = useLocationContext()
    const setBackgroundPlaying = useSetBackgroundPlayingContext()

    const queryClient = useQueryClient()

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
                && !isOutOfBoundsLinkAnchor(nearestAnchor)
            ) {
                // 別の動画リンクであることが確定したら、これ以上イベントが伝播しないようにする
                e.stopPropagation()
                e.preventDefault()
                if (videoRef.current && !videoRef.current.paused && !nearestAnchor.href.startsWith("/watch/")) {
                    setBackgroundPlaying(true)
                } else {
                    setBackgroundPlaying(false)
                    if (location.pathname.startsWith("/watch/")) {
                        const smId = location.pathname.replace("/watch/", "").replace(/\?.*/, "")
                        if (smId) {
                            // この動画IDのキャッシュをあらかじめ破棄する
                            queryClient.invalidateQueries({ queryKey: ["commentData", smId, { logData: undefined }] })
                            queryClient.invalidateQueries({ queryKey: ["videoData", smId] })
                        }
                    }
                }
                history.push(nearestAnchor.href)
                window.scroll({ top: 0 })
            }
        }
    }, [setBackgroundPlaying, location, history])
    useLayoutEffect(() => {
        return history.listen(({ location: newLocation }) => {
            if (!targetPathnames.some(path => location.pathname.startsWith(path))) {
                console.log("out of bounds")
                window.location.reload()
            }
            if (videoRef.current && !videoRef.current.paused && !newLocation.pathname.startsWith("/watch/")) {
                setBackgroundPlaying(true)
            } else {
                setBackgroundPlaying(false)
            }
        })
    }, [queryClient])
    const mintConfigElemRef = useRef<HTMLDivElement>(null)
    const mintModalElemRef = useRef<HTMLDivElement>(null)
    const headerActionStackerElemRef = useRef<HTMLDivElement>(null)
    const sideMenuElemRef = useRef<HTMLDivElement>(null)

    const setHeaderActionState = useSetHeaderActionStateContext()
    const setMintConfigShown = useSetMintConfigShownContext()
    const setSideMenuShown = useSetSideMenuShownContext()

    const handleKeydown = useCallback((e: KeyboardEvent) => {
        if (e.key === "Escape") {
            setHeaderActionState(false)
            setMintConfigShown(false)
            setSideMenuShown(false)
            return false
        }
        if (e.ctrlKey) return true
        if (e.target instanceof Element) {
            if (e.target.closest("input, textarea")) return true
        }
        if (e.key === "/") {
            setHeaderActionState(false)
            setMintConfigShown(false)
            setSideMenuShown(false)
            return false
        }
        if (e.key.toLowerCase() === "?") {
            e.preventDefault()
            setMintConfigShown("shortcuts")
            return false
        }
    }, [setHeaderActionState, setMintConfigShown, setSideMenuShown])

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal
        document.body.addEventListener("keydown", handleKeydown, { signal })
        return () => controller.abort()
    }, [setHeaderActionState, setMintConfigShown, setSideMenuShown])

    return (
        <div className="router" onClickCapture={linkClickHandler}>
            <Header headerActionStackerElemRef={headerActionStackerElemRef} sideMenuElemRef={sideMenuElemRef} />
            <MintConfig nodeRef={mintConfigElemRef} />
            <MintWatchModal containerRef={mintModalElemRef} />
            <main>
                <MatchWatchPage targetPathname="/watch">
                    <WatchBody />
                </MatchWatchPage>
                <Match targetPathname="/ranking">
                    <ShogiBody />
                </Match>
                <Match targetPathname={searchPagePaths}>
                    <SearchBody />
                </Match>
            </main>
            <Alert />
            <Toast />
        </div>
    )
}
