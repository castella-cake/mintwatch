import { useEffect, useState, useRef } from "react";
//import { useLang } from "./localizeHook";
import { CSSTransition } from "react-transition-group";
import { VideoActionModal } from "./modules/videoAction/VideoActionModal";
import { useStorageContext } from "@/hooks/extensionHook";
import { OnboardingPopup } from "./modules/Onboarding";
import { PlaylistDndWrapper } from "./modules/PlaylistDndWrapper";
import { TitleElement } from "./modules/TitleElement";
import { WatchContent, watchLayoutType } from "./WatchContent";
import { useSmIdContext } from "../Global/Contexts/WatchDataContext";
import {
    useVideoInfoContext,
    useVideoRefContext,
} from "@/components/Global/Contexts/VideoDataProvider";
import { useControlPlaylistContext } from "@/components/Global/Contexts/PlaylistProvider";
import { useSetVideoActionModalStateContext } from "@/components/Global/Contexts/ModalStateProvider";
import { useHistoryContext } from "../Router/RouterContext";
import { useBackgroundPlayingContext } from "../Global/Contexts/BackgroundPlayProvider";

function CreateWatchUI() {
    //const lang = useLang()
    const { smId, setSmId } = useSmIdContext();
    const history = useHistoryContext()

    const { syncStorage, localStorage, isLoaded } = useStorageContext();

    const [isFullscreenUi, setIsFullscreenUi] = useState(false);

    const videoRef = useVideoRefContext();
    const { updatePlaylistState } = useControlPlaylistContext();
    const { videoInfo } = useVideoInfoContext();

    const changeVideo = useCallback((videoUrl: string) => {
        // 移動前にシーク位置を保存
        if (smId && videoRef && videoRef.current instanceof HTMLVideoElement) {
            const playbackPositionBody = {
                watchId: smId,
                seconds: videoRef.current.currentTime,
            };
            putPlaybackPosition(playbackPositionBody);
        }

        // historyにpushして移動
        history.push(videoUrl);
        // 動画IDとプレイリスト状態を更新。プレイリスト状態はlocationが未更新のため、
        setSmId(
            videoUrl
                .replace("https://www.nicovideo.jp/watch/", "")
                .replace(/\?.*/, ""),
        );
        updatePlaylistState(new URL(videoUrl).search);
    }, [videoRef.current, smId])

    useEffect(() => {
        // 戻るボタンとかが発生した場合
        const listenPopState = history.listen(({ action, location }) => {
            if (
                smId &&
                videoRef.current &&
                videoRef.current instanceof HTMLVideoElement
            ) {
                const playbackPositionBody = {
                    watchId: smId,
                    seconds: videoRef.current.currentTime,
                };
                putPlaybackPosition(playbackPositionBody);
            }
            console.log(
                `The current URL is ${location.pathname}${location.search}${location.hash}`
            );
            if (location.pathname.startsWith("/watch/")) setSmId(location.pathname.replace("/watch/", "").replace(/\?.*/, ""));
        })
        return () => {
            listenPopState() // unlisten
        };
    }, [videoInfo]);

    // transition / outside click detection refs
    const videoActionModalElemRef = useRef<HTMLDivElement>(null);
    const onboardingPopupElemRef = useRef<HTMLDivElement>(null);

    const setVideoActionModalState = useSetVideoActionModalStateContext()
    const backgroundPlaying = useBackgroundPlayingContext()

    //console.log(videoInfo)
    if (!isLoaded)
        return (
            <div style={{ minHeight: "100vh" }}>
                <div className="header-container global-flex"></div>
            </div>
        );
    const layoutType =
        syncStorage.pmwlayouttype || watchLayoutType.reimaginedOldWatch;
    const playerSize =
        (localStorage &&
            localStorage.playersettings &&
            localStorage.playersettings.playerAreaSize) ||
        1;

    function handleKeydown(e: React.KeyboardEvent) {
        if (e.key === "Escape") {
            setVideoActionModalState(false)
        }
    }

    function onModalOutsideClick(e: React.MouseEvent<HTMLDivElement>) {
        if (e.target instanceof HTMLElement && !videoActionModalElemRef.current?.contains(e.target) && !onboardingPopupElemRef.current?.contains(e.target)) setVideoActionModalState(false)
    }

    const disallowGridFallback = syncStorage.disallowGridFallback ?? getDefault("disallowGridFallback");

    return (
        <div className={isFullscreenUi ? "container fullscreen" : "container"} onKeyDown={handleKeydown} onClick={onModalOutsideClick} data-disallow-grid-fallback={disallowGridFallback.toString()} data-background-playing={backgroundPlaying}>
            <TitleElement />
            <CSSTransition
                nodeRef={onboardingPopupElemRef}
                in={
                    !localStorage.playersettings.onboardingIgnored &&
                    !isFullscreenUi
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
                    layoutType={layoutType}
                    playerSize={playerSize}
                    onChangeVideo={changeVideo}
                    isFullscreenUi={isFullscreenUi}
                    setIsFullscreenUi={setIsFullscreenUi}
                />
            </PlaylistDndWrapper>
        </div>
    );
}

export default CreateWatchUI;
