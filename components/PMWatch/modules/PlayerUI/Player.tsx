import { useEffect, useState, useRef } from "react";
//import { useLang } from "../localizeHook";
import PlayerController from "./PlayerController";
import VefxController from "./VefxController";
import { useHlsVideo } from "@/hooks/hlsHooks";
import { Comment } from "@/types/CommentData";
import type { Dispatch, SetStateAction } from "react";
import CommentInput from "./CommentInput";
import Settings from "./Settings";
import { putPlaybackPosition } from "@/utils/watchApi";
import {
    doFilterThreads,
    handleCtrl,
    sharedNgLevelScore,
} from "../commonFunction";
import { StatsOverlay } from "./StatsOverlay";
import { CSSTransition } from "react-transition-group";
import { EndCard } from "./EndCard";
import { effectsState, useAudioEffects } from "@/hooks/eqHooks";
import { useStorageContext } from "@/hooks/extensionHook";
import { ErrorScreen } from "./ErrorScreen";
import { CommentRender } from "./CommentRender";
import { VideoPlayer } from "./VideoPlayer";
import {
    useActionTrackDataContext,
    useVideoInfoContext,
    useVideoRefContext,
} from "../Contexts/VideoDataProvider";
import {
    useCommentContentContext,
    useCommentControllerContext,
} from "../Contexts/CommentDataProvider";
import { usePlaylistContext } from "../Contexts/PlaylistProvider";
import { useRecommendContext } from "../Contexts/RecommendProvider";

type Props = {
    isFullscreenUi: boolean;
    setIsFullscreenUi: Dispatch<SetStateAction<boolean>>;
    changeVideo: (videoId: string) => void;
};

function Player(props: Props) {
    const { isFullscreenUi, setIsFullscreenUi, changeVideo } = props;

    const { videoInfo } = useVideoInfoContext();
    const commentContent = useCommentContentContext();
    const { setCommentContent, reloadCommentContent } =
        useCommentControllerContext();
    const videoRef = useVideoRefContext();
    const actionTrackId = useActionTrackDataContext();
    const { playlistData } = usePlaylistContext();
    const recommendData = useRecommendContext();

    const videoId = videoInfo?.data?.response.video.id ?? "";

    //const lang = useLang()
    const { localStorage, setLocalStorageValue, syncStorage } =
        useStorageContext();

    const [isVefxShown, setIsVefxShown] = useState(false);
    const [isSettingsShown, setIsSettingsShown] = useState(false);
    const [isCommentShown, setIsCommentShown] = useState(true);
    const [isStatsShown, setIsStatsShown] = useState(false);
    const cursorStopRef = useRef<boolean>(false); // これはコンテナのルートにも使われるけど、直接書き換えて再レンダリングを抑止する
    const pipVideoRef = useRef<HTMLVideoElement>(null);
    const commentInputRef = useRef<HTMLTextAreaElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [previewCommentItem, setPreviewCommentItem] =
        useState<Comment | null>(null); // プレビューコメント

    // for transition
    const vefxElemRef = useRef<HTMLDivElement>(null);
    const settingsElemRef = useRef<HTMLDivElement>(null);

    const isLoudnessEnabled =
        localStorage.playersettings.enableLoudnessData ?? true;
    const integratedLoudness =
        (videoInfo?.data?.response.media.domand &&
            videoInfo.data?.response.media.domand?.audios[0]
                .loudnessCollection[0].value) ??
        1;
    const loudnessData = isLoudnessEnabled ? integratedLoudness : 1;
    const { effectsState, setEffectsState, frequencies, handleEffectsChange } =
        useAudioEffects(
            videoRef,
            loudnessData,
            localStorage.playersettings.vefxSettings,
        );
    // エフェクト設定をリストア
    useEffect(() => {
        if (
            !localStorage ||
            !localStorage.playersettings ||
            !localStorage.playersettings.vefxSettings
        )
            return;
        setEffectsState(localStorage.playersettings.vefxSettings);
        handleEffectsChange(effectsState);
    }, []);

    // シャッフル再生のバッグ
    const shuffleBagRef = useRef<string[]>([]);

    // 外部HLSプラグインが使用される状況の場合は何もしない
    const shouldUseContentScriptHls = !(
        import.meta.env.FIREFOX || syncStorage.pmwforcepagehls
    );
    const hlsRef = useHlsVideo(
        videoRef,
        videoInfo,
        videoId,
        actionTrackId,
        shouldUseContentScriptHls,
        localStorage.playersettings.preferredLevel || -1,
    );

    // ストーリーボード
    const storyBoardData = useStoryBoardData(videoInfo, videoId, actionTrackId);

    useResumePlayback(
        videoRef,
        videoId,
        videoInfo,
        localStorage.playersettings.resumePlayback,
    );

    const toggleFullscreen = () => {
        const shouldRequestFullscreen =
            localStorage.playersettings.requestMonitorFullscreen ?? true;
        if (!isFullscreenUi && shouldRequestFullscreen) {
            document.body.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
        setIsFullscreenUi(!isFullscreenUi);
    };

    useEffect(() => {
        // カーソル表示状態の管理
        // Timeoutで呼ばれる関数 カーソル非表示状態へ移行
        const toCursorStop = () => {
            if (
                videoRef.current &&
                videoRef.current.currentTime &&
                videoRef.current.duration &&
                videoRef.current?.currentTime >= videoRef.current?.duration
            )
                return;
            cursorStopRef.current = true;
            containerRef.current?.setAttribute("is-cursor-stopped", "true");
        };
        // 動画が終了してエンドカードが表示されそうな場合は常にカーソル表示状態に
        const onTimeUpdate = () => {
            if (
                !videoRef.current ||
                !videoRef.current.currentTime ||
                !videoRef.current.duration
            )
                return;
            if (videoRef.current?.currentTime >= videoRef.current?.duration) {
                cursorStopRef.current = false;
                containerRef.current?.setAttribute(
                    "is-cursor-stopped",
                    "false",
                );
                clearTimeout(timeout);
            }
        };
        // カーソルが動いたらTimeoutをリセット
        const handleMouseMove = (e: MouseEvent) => {
            clearTimeout(timeout);
            cursorStopRef.current = false;
            containerRef.current?.setAttribute("is-cursor-stopped", "false");
            timeout = setTimeout(toCursorStop, 2500);
        };
        let timeout = setTimeout(toCursorStop, 2500);
        containerRef.current?.addEventListener(
            "mousemove",
            handleMouseMove,
            true,
        );
        videoRef.current?.addEventListener("timeupdate", onTimeUpdate);

        // フルスクリーンから脱出した場合にUIを切り替え
        const handleFullscreenChange = (e: Event) => {
            if (!document.fullscreenElement) {
                setIsFullscreenUi(false);
            } else {
                setIsFullscreenUi(true);
            }
        };
        document.body.addEventListener(
            "fullscreenchange",
            handleFullscreenChange,
        );

        // ホットキー
        const onKeydown = (e: KeyboardEvent) =>
            handleCtrl(
                e,
                videoRef.current,
                commentInputRef.current,
                toggleFullscreen,
            );
        document.body.addEventListener("keydown", onKeydown);

        // 破棄時に解除
        return () => {
            clearTimeout(timeout);
            document.body.removeEventListener("keydown", onKeydown);
            document.body.removeEventListener(
                "fullscreenchange",
                handleFullscreenChange,
            );
            containerRef.current?.removeEventListener(
                "mousemove",
                handleMouseMove,
            );
            videoRef.current?.removeEventListener("timeupdate", onTimeUpdate);
        };
    }, []);

    useEffect(() => {
        if (videoRef.current)
            videoRef.current.playbackRate =
                localStorage.playersettings.playbackRate || 1.0;
    }, [localStorage]);

    const filteredComments = useMemo(() => {
        if (!commentContent.data) return;
        return doFilterThreads(
            commentContent.data.threads,
            sharedNgLevelScore[
                (localStorage.playersettings.sharedNgLevel ??
                    "mid") as keyof typeof sharedNgLevelScore
            ],
            videoInfo.data?.response.comment.ng.viewer,
        );
    }, [commentContent, videoInfo, localStorage.playersettings.sharedNgLevel]);

    function playlistIndexControl(add: number, isShuffle?: boolean) {
        if (playlistData.items.length > 0) {
            let nextVideo = playlistData.items[0];
            if (isShuffle) {
                // 某ブロックゲームと同じく、バックの中から抽選する形式にする
                const shuffleBag = shuffleBagRef.current;
                if (shuffleBag.length - 1 >= playlistData.items.length)
                    shuffleBagRef.current = [];
                shuffleBagRef.current.push(videoId);
                const bagItems = playlistData.items.filter(
                    (item) => !shuffleBag.includes(item.id),
                );
                const pickedIndex = Math.floor(
                    Math.random() * (bagItems.length - 1),
                );
                nextVideo = bagItems[pickedIndex];
                console.log(shuffleBag);
                console.log(bagItems);
            } else {
                const currentVideoIndex = playlistData.items?.findIndex(
                    (video) => video.id === videoId,
                );
                if (
                    currentVideoIndex === undefined ||
                    currentVideoIndex === -1 ||
                    currentVideoIndex + add >= playlistData.items.length ||
                    currentVideoIndex + add < 0
                )
                    return;
                nextVideo = playlistData.items[currentVideoIndex + add];
            }
            let playlistQuery: { type: string; context: any } = {
                type: playlistData.type,
                context: {},
            };
            if (playlistData.type === "mylist") {
                playlistQuery.context = {
                    mylistId: Number(playlistData.id),
                    sortKey: "addedAt",
                    sortOrder: "asc",
                };
            } else if (playlistData.type === "series") {
                playlistQuery.context = { seriesId: Number(playlistData.id) };
            }
            changeVideo(
                `https://www.nicovideo.jp/watch/${encodeURIComponent(nextVideo.id)}?playlist=${btoa(JSON.stringify(playlistQuery))}`,
            );
        } else if (
            recommendData.data?.items &&
            recommendData.data.items[0].contentType === "video" &&
            add === 1
        ) {
            changeVideo(
                `https://www.nicovideo.jp/watch/${encodeURIComponent(recommendData.data.items[0].content.id)}`,
            );
        }
    }

    const onPause = useCallback(() => {
        if (!videoRef.current) return;
        const playbackPositionBody = {
            watchId: videoId,
            seconds: videoRef.current.currentTime,
        };
        putPlaybackPosition(JSON.stringify(playbackPositionBody));
    }, [videoRef, videoId]);

    const onEnded = () => {
        const autoPlayType =
            localStorage.playersettings.autoPlayType ?? "playlistonly";
        if (
            ((autoPlayType === "playlistonly" &&
                playlistData.items.length > 1) ||
                autoPlayType === "always") &&
            !localStorage.playersettings.isLoop
        ) {
            playlistIndexControl(
                1,
                localStorage.playersettings.enableShufflePlay,
            );
        }
    };

    const videoOnClick = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;
        if (video.paused) {
            video.play();
        } else {
            video.pause();
            onPause();
        }
    }, [videoRef]);

    useEffect(() => {
        if (
            videoInfo.meta?.status === 200 &&
            actionTrackId !== ""
        ) {
            document.dispatchEvent(
                new CustomEvent("pmw_playerReady", {
                    detail: JSON.stringify({ videoInfo, actionTrackId }),
                }),
            );
        }
    }, [videoInfo]);

    const preferredCommentFps =
        localStorage.playersettings.commentRenderFps ?? 60; // 未指定の場合は60にフォールバック
    const commentRenderFps = localStorage.playersettings.enableCommentPiP
        ? 60
        : preferredCommentFps; // PiPでコメント表示する場合はメモリリークを防ぐために60FPSで固定する
    // .map() から生成されている string[] の一次元配列なら大丈夫だと信じて.reverse()する
    const qualityLabels = videoInfo.data?.response.media.domand?.videos
        .map((video) => video.label)
        .reverse();

    const thumbnailSrc = videoInfo.data?.response.video.thumbnail.player;

    const thisVideoAuthor = (videoInfo.data?.response.owner && videoInfo.data?.response.owner.nickname) ?? (videoInfo.data?.response.channel && videoInfo.data?.response.channel.name) ?? "不明なユーザー"

    return (
        <div
            className="player-container"
            id="pmw-player"
            is-pipvideo={
                localStorage.playersettings.enableCommentPiP && isCommentShown
                    ? "true"
                    : "false"
            }
            is-dynamic-controller={
                localStorage.playersettings.integratedControl !== "never"
                    ? "true"
                    : "false"
            }
            is-integrated-controller={
                localStorage.playersettings.integratedControl === "always" &&
                !isFullscreenUi
                    ? "true"
                    : "false"
            }
            is-cursor-stopped={cursorStopRef.current ? "true" : "false"}
            ref={containerRef}
        >
            <VideoPlayer
                videoRef={videoRef}
                onPause={onPause}
                onEnded={onEnded}
                onClick={videoOnClick}
                thumbnailSrc={thumbnailSrc}
                videoTitle={videoInfo.data?.response.video.title}
                videoAuthor={thisVideoAuthor}
                videoGenre={videoInfo.data?.response.genre.label}
                enableVolumeGesture={
                    localStorage.playersettings.enableWheelGesture
                }
            >
                {filteredComments && (
                    <CommentRender
                        videoRef={videoRef}
                        pipVideoRef={pipVideoRef}
                        isCommentShown={isCommentShown}
                        commentOpacity={
                            localStorage.playersettings.commentOpacity || 1
                        }
                        threads={filteredComments}
                        videoOnClick={videoOnClick}
                        enableCommentPiP={
                            localStorage.playersettings.enableCommentPiP &&
                            !previewCommentItem
                        }
                        disableCommentOutline={
                            localStorage.playersettings.disableCommentOutline ??
                            false
                        }
                        commentRenderFps={commentRenderFps}
                        previewCommentItem={previewCommentItem}
                        defaultPostTargetIndex={
                            videoInfo.data
                                ? videoInfo.data.response.comment.threads.findIndex(
                                      (elem) => elem.isDefaultPostTarget,
                                  )
                                : -1
                        }
                    />
                )}
                <CSSTransition
                    nodeRef={vefxElemRef}
                    in={isVefxShown}
                    timeout={400}
                    unmountOnExit
                    classNames="player-transition-vefx"
                >
                    <VefxController
                        nodeRef={vefxElemRef}
                        frequencies={frequencies}
                        effectsState={effectsState}
                        onEffectsChange={(state: effectsState) => {
                            setLocalStorageValue(
                                "playersettings",
                                {
                                    ...localStorage.playersettings,
                                    vefxSettings: state,
                                },
                                true,
                            );
                            // 反映して再レンダリング
                            handleEffectsChange(state);
                            setEffectsState(state);
                        }}
                    />
                </CSSTransition>
                <CSSTransition
                    nodeRef={settingsElemRef}
                    in={isSettingsShown}
                    timeout={400}
                    unmountOnExit
                    classNames="player-transition-settings"
                >
                    <Settings
                        nodeRef={settingsElemRef}
                        isStatsShown={isStatsShown}
                        setIsStatsShown={setIsStatsShown}
                    />
                </CSSTransition>
                {isStatsShown && (
                    <StatsOverlay
                        videoInfo={videoInfo}
                        videoRef={videoRef}
                        hlsRef={hlsRef}
                    />
                )}
                <EndCard
                    videoInfo={videoInfo}
                    videoRef={videoRef}
                    recommendData={recommendData}
                />
                <ErrorScreen videoInfo={videoInfo} />
            </VideoPlayer>
            <div className="player-bottom-container">
                <PlayerController
                    videoRef={videoRef}
                    hlsRef={hlsRef}
                    effectsState={effectsState}
                    isVefxShown={isVefxShown}
                    setIsVefxShown={setIsVefxShown}
                    isFullscreenUi={isFullscreenUi}
                    toggleFullscreen={toggleFullscreen}
                    isCommentShown={isCommentShown}
                    setIsCommentShown={setIsCommentShown}
                    isSettingsShown={isSettingsShown}
                    setIsSettingsShown={setIsSettingsShown}
                    commentContent={commentContent}
                    playlistIndexControl={playlistIndexControl}
                    qualityLabels={qualityLabels}
                    storyBoardData={storyBoardData}
                />
                <CommentInput
                    videoId={videoId}
                    videoRef={videoRef}
                    videoInfo={videoInfo}
                    setCommentContent={setCommentContent}
                    reloadCommentContent={reloadCommentContent}
                    commentInputRef={commentInputRef}
                    setPreviewCommentItem={setPreviewCommentItem}
                />
            </div>
        </div>
    );
}

export default Player;
