import { useEffect, useState, useRef, startTransition } from "react"
// import { useLang } from "./localizeHook";
import { CSSTransition } from "react-transition-group"
import { VideoActionModal } from "./modules/videoAction/VideoActionModal"
import { OnboardingPopup } from "./modules/Onboarding/Onboarding"
import { PlaylistDndWrapper } from "./modules/PlaylistDndWrapper"
import { TitleElement } from "./modules/TitleElement"
import { WatchContent } from "./WatchContent"
import { useSmIdContext } from "../Global/Contexts/WatchDataContext"
import {
    useVideoInfoContext,
    useVideoRefContext,
} from "@/components/Global/Contexts/VideoDataProvider"
import { useControlPlaylistContext } from "@/components/Global/Contexts/PlaylistProvider"
import { useSetVideoActionModalStateContext } from "@/components/Global/Contexts/ModalStateProvider"
import { useHistoryContext } from "../Router/RouterContext"
import { useBackgroundPlayingContext } from "../Global/Contexts/BackgroundPlayProvider"
import { useQueryClient } from "@tanstack/react-query"

function CreateWatchUI() {
    // const lang = useLang()
    const { smId, setSmId } = useSmIdContext()
    const history = useHistoryContext()

    const {
        autoScrollPositionOnVideoChange,
        layoutDensity,
        disallowGridFallback,
    } = useStorageVar(["autoScrollPositionOnVideoChange", "layoutDensity", "disallowGridFallback"] as const, "sync")
    const {
        playerAreaSize,
        onboardingIgnored,
    } = useStorageVar(["playerAreaSize", "onboardingIgnored"] as const, "local")

    const isBackgroundPlaying = useBackgroundPlayingContext()
    const [isFullscreenUi, setIsFullscreenUi] = useState(false)

    const videoRef = useVideoRefContext()
    const { updatePlaylistState } = useControlPlaylistContext()
    const { videoInfo } = useVideoInfoContext()

    const queryClient = useQueryClient()

    const setVideoActionModalState = useSetVideoActionModalStateContext()
    const backgroundPlaying = useBackgroundPlayingContext()

    const internalChangeVideo = useCallback((smIdAfter: string) => {
        if (smId === smIdAfter) return
        // 再度来ても良いようにキャッシュを破棄する
        queryClient.invalidateQueries({ queryKey: ["commentData", smIdAfter, { logData: undefined }] })
        queryClient.invalidateQueries({ queryKey: ["videoData", smIdAfter] })
        if (videoRef.current && import.meta.env.FIREFOX) videoRef.current.src = ""
        setSmId(smIdAfter)
    }, [smId])

    // ナビゲーション処理はlistenPopStateで行います
    const changeVideo = useCallback((videoUrl: string, doScroll = true, noLocationChange = false) => {
        const autoScrollSetting = autoScrollPositionOnVideoChange ?? getDefault("autoScrollPositionOnVideoChange")
        if (autoScrollSetting === "top" && doScroll) {
            window.scroll({ top: 0, behavior: "smooth" })
        } else if (autoScrollSetting === "player" && doScroll) {
            startTransition(() => {
                requestAnimationFrame(() => {
                    if (videoRef.current) {
                        videoRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
                    }
                })
            })
        }
        setVideoActionModalState(false)
        if (noLocationChange) {
            const parsedUrl = new URL(videoUrl)
            const smIdAfter = parsedUrl.pathname.replace("/watch/", "").replace(/\?.*/, "")
            internalChangeVideo(smIdAfter)
            return
        }
        // historyにpushして移動
        history.push(videoUrl)
    }, [smId, autoScrollPositionOnVideoChange, internalChangeVideo])

    const linkClickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target instanceof Element) {
            const nearestAnchor: HTMLAnchorElement | null = e.target.closest("a")
            // data-seektimeがある場合は、mousecaptureな都合上スキップする。
            if (nearestAnchor && nearestAnchor.href.startsWith("https://www.nicovideo.jp/watch/") && !nearestAnchor.getAttribute("data-seektime") && !isOutOfBoundsLinkAnchor(nearestAnchor)) {
                // 別の動画リンクであることが確定したら、これ以上イベントが伝播しないようにする
                e.stopPropagation()
                e.preventDefault()
                changeVideo(nearestAnchor.href)
            }
        }
    }

    useEffect(() => {
        // ページ移動が発生した場合にシーク位置を保存してキャッシュを破棄した後、Stateを変更する
        const listenPopState = history.listen(({ location }) => {
            if (
                smId
                && videoRef.current
                && videoRef.current instanceof HTMLVideoElement
            ) {
                const playbackPositionBody = {
                    watchId: smId,
                    seconds: videoRef.current.currentTime,
                }
                putPlaybackPosition(playbackPositionBody)
            }
            /* console.log(
                `The current URL is ${location.pathname}${location.search}${location.hash}`
            ); */
            if (location.pathname.startsWith("/watch/")) {
                const smIdAfter = location.pathname.replace("/watch/", "").replace(/\?.*/, "")
                internalChangeVideo(smIdAfter)
                updatePlaylistState(location.search)
            };
        })
        return () => {
            listenPopState() // unlisten
        }
    }, [smId, videoInfo, internalChangeVideo])

    // フォアグラウンドに戻された場合にレンダリングの後でスクロールする。初回レンダリングで行われないようにtrue→falseになった時だけ。
    const previousBackgroundStateRef = useRef(false)
    useEffect(() => {
        if (!isBackgroundPlaying && videoRef.current && previousBackgroundStateRef.current) {
            // 一瞬最上部に移動してから下へスムーズスクロール
            window.scroll({ top: 0 })
            videoRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
        }
        previousBackgroundStateRef.current = isBackgroundPlaying
    }, [isBackgroundPlaying])

    // transition / outside click detection refs
    const videoActionModalElemRef = useRef<HTMLDivElement>(null)
    const onboardingPopupElemRef = useRef<HTMLDivElement>(null)

    const playerSize = playerAreaSize ?? 1

    function handleKeydown(e: React.KeyboardEvent) {
        if (e.key === "Escape") {
            setVideoActionModalState(false)
        }
    }

    return (
        <div
            className={isFullscreenUi ? "container fullscreen" : "container"}
            onKeyDown={handleKeydown}
            data-disallow-grid-fallback={disallowGridFallback ?? getDefault("disallowGridFallback")}
            data-background-playing={backgroundPlaying}
            data-layout-density={layoutDensity ?? getDefault("layoutDensity")}
            onClickCapture={linkClickHandler}
        >
            <TitleElement />
            <CSSTransition
                nodeRef={onboardingPopupElemRef}
                in={
                    !onboardingIgnored && !isFullscreenUi
                }
                timeout={300}
                unmountOnExit
                classNames="pmw-onboarding-popup-transition"
            >
                <OnboardingPopup
                    nodeRef={onboardingPopupElemRef}
                />
            </CSSTransition>

            <VideoActionModal
                nodeRef={videoActionModalElemRef}
            />

            <PlaylistDndWrapper>
                <WatchContent
                    playerSize={playerSize}
                    onChangeVideo={changeVideo}
                    isFullscreenUi={isFullscreenUi}
                    setIsFullscreenUi={setIsFullscreenUi}
                />
            </PlaylistDndWrapper>
        </div>
    )
}

export default CreateWatchUI
