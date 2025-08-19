import { useEffect, useState, useRef } from "react"
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

    const [isFullscreenUi, setIsFullscreenUi] = useState(false)

    const videoRef = useVideoRefContext()
    const { updatePlaylistState } = useControlPlaylistContext()
    const { videoInfo } = useVideoInfoContext()

    const queryClient = useQueryClient()

    // ナビゲーション処理はlistenPopStateで行います
    const changeVideo = useCallback((videoUrl: string, doScroll = true) => {
        const autoScrollSetting = autoScrollPositionOnVideoChange ?? getDefault("autoScrollPositionOnVideoChange")
        if (autoScrollSetting === "top" && doScroll) {
            window.scroll({ top: 0, behavior: "smooth" })
        } else if (autoScrollSetting === "player" && videoRef.current && doScroll) {
            videoRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
        }
        // historyにpushして移動
        history.push(videoUrl)
    }, [smId, autoScrollPositionOnVideoChange])

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
                if (smId !== smIdAfter) {
                    queryClient.invalidateQueries({ queryKey: ["commentData", smIdAfter, { logData: undefined }] })
                    queryClient.invalidateQueries({ queryKey: ["videoData", smIdAfter] })
                    setSmId(smIdAfter)
                }
                updatePlaylistState(location.search)
            };
        })
        return () => {
            listenPopState() // unlisten
        }
    }, [smId, videoInfo])

    // transition / outside click detection refs
    const videoActionModalElemRef = useRef<HTMLDivElement>(null)
    const onboardingPopupElemRef = useRef<HTMLDivElement>(null)

    const setVideoActionModalState = useSetVideoActionModalStateContext()
    const backgroundPlaying = useBackgroundPlayingContext()

    const playerSize = playerAreaSize ?? 1

    function handleKeydown(e: React.KeyboardEvent) {
        if (e.key === "Escape") {
            setVideoActionModalState(false)
        }
    }

    function onModalOutsideClick(e: React.MouseEvent<HTMLDivElement>) {
        if (e.target instanceof HTMLElement && !videoActionModalElemRef.current?.contains(e.target) && !onboardingPopupElemRef.current?.contains(e.target)) setVideoActionModalState(false)
    }

    return (
        <div
            className={isFullscreenUi ? "container fullscreen" : "container"}
            onKeyDown={handleKeydown}
            onClick={onModalOutsideClick}
            data-disallow-grid-fallback={disallowGridFallback ?? getDefault("disallowGridFallback")}
            data-background-playing={backgroundPlaying}
            data-layout-density={layoutDensity ?? getDefault("layoutDensity")}
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
