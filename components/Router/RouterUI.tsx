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
import { RecommendationsBody } from "../Recommendations/RecommendationsBody"
import { UserBody } from "../User/UserBody"
import { useQueryClient } from "@tanstack/react-query"

function MatchWatchPage({ targetPathname, children }: { targetPathname: string | string[], children: ReactNode }) {
    const backgroundPlaying = useBackgroundPlayingContext()
    const location = useLocationContext()
    if (
        (typeof targetPathname === "string" && location.pathname.startsWith(targetPathname))
        || (typeof targetPathname === "object" && targetPathname.some(path => location.pathname.startsWith(path)))
    ) return children
    if (backgroundPlaying) return children
    return <></>
}

function pathMatcher(pathname: string, targetPathname: string) {
    if (targetPathname.endsWith("!")) return pathname === targetPathname.slice(0, -1)
    return pathname.startsWith(targetPathname)
}

export function Match({ targetPathname, children }: { targetPathname: string | string[], children?: ReactNode }) {
    const location = useLocationContext()
    if (
        (typeof targetPathname === "string" && pathMatcher(location.pathname, targetPathname))
        || (typeof targetPathname === "object" && targetPathname.some(path => pathMatcher(location.pathname, path)))
    ) return children
    return <></>
}

const nicovideoPrefix = "https://www.nicovideo.jp"

export default function RouterUI() {
    const syncStorage = useStorageVar(["enableReshogi", "enableSearchPage", "enableShortsPage", "enableRecommendationsPage", "enableUserPage"] as const)
    const isShortsPageEnabled = syncStorage.enableShortsPage ?? getDefault("enableShortsPage")
    const targetPathnames = [
        "/watch/",
        ...(isShortsPageEnabled ? ["/shorts/"] : []),
        ...(syncStorage.enableReshogi ? ["/ranking"] : []),
        ...(syncStorage.enableSearchPage
            ? searchPagePaths
            : []),
        ...(syncStorage.enableRecommendationsPage ? ["/recommendations"] : []),
        ...(syncStorage.enableUserPage
            ? ["/user/", "/my"]
            : []
        ),
    ]

    const videoRef = useVideoRefContext()
    const history = useHistoryContext()
    const location = useLocationContext()
    const setBackgroundPlaying = useSetBackgroundPlayingContext()

    const queryClient = useQueryClient()

    const mintConfigElemRef = useRef<HTMLDivElement>(null)
    const mintModalElemRef = useRef<HTMLDivElement>(null)
    const headerActionStackerElemRef = useRef<HTMLDivElement>(null)
    const sideMenuElemRef = useRef<HTMLDivElement>(null)

    const setHeaderActionState = useSetHeaderActionStateContext()
    const setMintConfigShown = useSetMintConfigShownContext()
    const setSideMenuShown = useSetSideMenuShownContext()

    const linkClickHandler = useCallback((e: React.MouseEvent) => {
        if (e.target instanceof Element) {
            const nearestAnchor: HTMLAnchorElement | null = e.target.closest("a")
            // data-seektimeがある場合は、mousecaptureな都合上スキップする。
            // ここでのPath管理は完全にルーティングした先のコンポーネントに任せるため、単にページを切り替えるだけに留める。
            if (
                nearestAnchor
                && !nearestAnchor.getAttribute("data-seektime")
                && (
                    targetPathnames.some(path => (nearestAnchor.href.startsWith(nicovideoPrefix + path) && location.pathname !== path))
                )
                && !isOutOfBoundsLinkAnchor(nearestAnchor)
            ) {
                // 別の動画リンクであることが確定したら、これ以上イベントが伝播しないようにする
                e.stopPropagation()
                e.preventDefault()
                const isVideoPage = isPathnameIsVideoPage(location.pathname, isShortsPageEnabled)
                if (videoRef.current && !videoRef.current.paused && !isVideoPage) {
                    setBackgroundPlaying(true)
                } else {
                    setBackgroundPlaying(false)
                    if (isVideoPage) {
                        const smId = pathnameToVideoId(location.pathname)
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
            if (!targetPathnames.some(path => newLocation.pathname.startsWith(path))) {
                console.log("Out of bounds. reloading...")
                window.location.reload()
            } else if (newLocation.pathname.split("/")[1] !== location.pathname.split("/")[1]) {
                setSideMenuShown(false)
            }
            if (videoRef.current && !videoRef.current.paused && !isPathnameIsVideoPage(newLocation.pathname, isShortsPageEnabled)) {
                setBackgroundPlaying(true)
            } else {
                setBackgroundPlaying(false)
            }
        })
    }, [queryClient, targetPathnames])

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
                <MatchWatchPage targetPathname={["/watch", ...(isShortsPageEnabled ? ["/shorts"] : [])]}>
                    <WatchBody />
                </MatchWatchPage>
                <Match targetPathname="/ranking">
                    <ShogiBody />
                </Match>
                <Match targetPathname={searchPagePaths}>
                    <SearchBody />
                </Match>
                <Match targetPathname="/recommendations">
                    <RecommendationsBody />
                </Match>
                <Match targetPathname={["/user/", "/my"]}>
                    <UserBody />
                </Match>
            </main>
            <Alert />
            <Toast />
        </div>
    )
}
