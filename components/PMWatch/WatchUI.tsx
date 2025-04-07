import { useEffect, useState, useRef } from "react";
//import { useLang } from "./localizeHook";
import Header from "./modules/Header/Header";
import { MintConfig } from "./modules/MintConfig";
import { CSSTransition } from "react-transition-group";
import { VideoActionModal } from "./modules/videoAction/VideoActionModal";
import { useStorageContext } from "@/hooks/extensionHook";
import { OnboardingPopup } from "./modules/Onboarding";
import { PlaylistDndWrapper } from "./modules/PlaylistDndWrapper";
import { TitleElement } from "./modules/TitleElement";
import { WatchContent, watchLayoutType } from "./WatchContent";
import { useSmIdContext } from "./modules/WatchDataContext";
import {
    useVideoInfoContext,
    useVideoRefContext,
} from "./modules/Contexts/VideoDataProvider";
import { usePlaylistContext } from "./modules/Contexts/PlaylistProvider";
import { HeaderActionStacker } from "./modules/Header/HeaderActionStacker";
import { useSetHeaderActionStateContext, useSetMintConfigShownContext, useSetVideoActionModalStateContext } from "./modules/Contexts/ModalStateProvider";

function CreateWatchUI() {
    //const lang = useLang()
    const { smId, setSmId } = useSmIdContext();

    const { syncStorage, localStorage, isLoaded } = useStorageContext();

    const [isFullscreenUi, setIsFullscreenUi] = useState(false);

    const videoRef = useVideoRefContext();
    const { updatePlaylistState } = usePlaylistContext();
    const { videoInfo } = useVideoInfoContext();

    function changeVideo(videoUrl: string) {
        // 移動前にシーク位置を保存
        if (videoRef && videoRef.current instanceof HTMLVideoElement) {
            const playbackPositionBody = {
                watchId: smId,
                seconds: videoRef.current.currentTime,
            };
            putPlaybackPosition(JSON.stringify(playbackPositionBody));
        }

        // historyにpushして移動
        history.pushState(null, "", videoUrl);
        // 動画IDとプレイリスト状態を更新。プレイリスト状態はlocationが未更新のため、
        setSmId(
            videoUrl
                .replace("https://www.nicovideo.jp/watch/", "")
                .replace(/\?.*/, ""),
        );
        updatePlaylistState(new URL(videoUrl).search);
    }

    useEffect(() => {
        // 戻るボタンとかが発生した場合
        const onPopState = () => {
            // 移動前にシーク位置を保存
            if (
                videoRef.current &&
                videoRef.current instanceof HTMLVideoElement
            ) {
                const playbackPositionBody = {
                    watchId: smId,
                    seconds: videoRef.current.currentTime,
                };
                putPlaybackPosition(JSON.stringify(playbackPositionBody));
            }
            // watchだったら更新する、watchではない場合はページ移動が起こる
            setSmId(location.pathname.slice(7).replace(/\?.*/, ""));
        };
        window.addEventListener("popstate", onPopState);
        return () => {
            window.removeEventListener("popstate", onPopState);
        };
    }, [videoInfo]);

    // transition / outside click detection refs
    const mintConfigElemRef = useRef<HTMLDivElement>(null);
    const headerActionStackerElemRef = useRef<HTMLDivElement>(null);
    const videoActionModalElemRef = useRef<HTMLDivElement>(null);
    const onboardingPopupElemRef = useRef<HTMLDivElement>(null);

    const setVideoActionModalState = useSetVideoActionModalStateContext()
    const setHeaderActionState = useSetHeaderActionStateContext();
    const setMintConfigShown = useSetMintConfigShownContext();

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
            setHeaderActionState(false)
            setVideoActionModalState(false)
            setMintConfigShown(false)
        }
    }

    function onModalOutsideClick(e: React.MouseEvent<HTMLDivElement>) {
        if (e.target instanceof HTMLElement && !headerActionStackerElemRef.current?.contains(e.target)) setHeaderActionState(false)
        if (e.target instanceof HTMLElement && !videoActionModalElemRef.current?.contains(e.target) && !onboardingPopupElemRef.current?.contains(e.target)) setVideoActionModalState(false)
        if (e.target instanceof HTMLElement && !mintConfigElemRef.current?.contains(e.target)) setMintConfigShown(false)
    }

    const disallowGridFallback = syncStorage.disallowGridFallback ?? getDefault("disallowGridFallback");

    return (
        <div className={isFullscreenUi ? "container fullscreen" : "container"} onKeyDown={handleKeydown} onClick={onModalOutsideClick} data-disallow-grid-fallback={disallowGridFallback.toString()}>
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

            {!isFullscreenUi && <>
                <Header />
                <HeaderActionStacker nodeRef={headerActionStackerElemRef} />
                <MintConfig nodeRef={mintConfigElemRef} />
                <VideoActionModal
                    nodeRef={videoActionModalElemRef}
                />
            </>}

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
