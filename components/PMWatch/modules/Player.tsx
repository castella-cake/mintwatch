import { useEffect, useState, useRef, RefObject } from "react";
//import { useLang } from "../localizeHook";
import PlayerController from "./PlayerUI/PlayerController";
import VefxController from "./PlayerUI/VefxController";
import { useHlsVideo } from "@/hooks/hlsHooks";
import type { VideoDataRootObject } from "@/types/VideoData";
import { Comment, type CommentDataRootObject } from "@/types/CommentData";
import type { Dispatch, ReactNode, SetStateAction } from "react"
import CommentInput from "./PlayerUI/CommentInput";
import Settings from "./PlayerUI/Settings";
import { putPlaybackPosition } from "../../../utils/watchApi";
import { doFilterThreads, handleCtrl, sharedNgLevelScore } from "./commonFunction";
import { StatsOverlay } from "./PlayerUI/StatsOverlay";
import { RecommendDataRootObject } from "@/types/RecommendData";
import { playlistData } from "./Playlist";
import { CSSTransition } from "react-transition-group";
import { EndCard } from "./PlayerUI/EndCard";
import { useAudioEffects } from "@/hooks/eqHooks";
import { useStorageContext } from "@/hooks/extensionHook";
import { ErrorScreen } from "./PlayerUI/ErrorScreen";
import { CommentRender } from "./PlayerUI/CommentRender";

export type effectsState = {
    equalizer: { enabled: boolean, gains: number[] },
    echo: { enabled: boolean, delayTime: number, feedback: number, gain: number },
    preamp: { enabled: boolean, gain: number },
    mono: { enabled: boolean },
}

type Props = {
    videoId: string,
    actionTrackId: string,
    videoInfo: VideoDataRootObject,
    commentContent: CommentDataRootObject,
    reloadCommentContent: () => Promise<CommentDataRootObject | undefined>,
    videoRef: RefObject<HTMLVideoElement>,
    isFullscreenUi: boolean,
    setIsFullscreenUi: Dispatch<SetStateAction<boolean>>,
    setCommentContent: Dispatch<SetStateAction<CommentDataRootObject>>,
    playlistData: playlistData,
    recommendData: RecommendDataRootObject,
    changeVideo: (videoId: string) => void,
}


type VideoPlayerProps = {
    children?: ReactNode,
    videoRef: RefObject<HTMLVideoElement>,
    onPause: () => void,
    onEnded: () => void,
    onClick: () => void,
    thumbnailSrc?: string,
    enableVolumeGesture: boolean
}

function VideoPlayer({children, videoRef, onPause, onEnded, onClick, thumbnailSrc, enableVolumeGesture}: VideoPlayerProps) {
    const [canPlay, setCanPlay] = useState(false)
    const nodeRef = useRef(null)
    const videoContainerRef = useRef<HTMLDivElement>(null)

    const volumeGestureUsedRef = useRef<boolean>(false)
    useEffect(() => {
        // ホイールの音量ジェスチャー
        function onWheel(e: WheelEvent) {
            const video = videoRef.current
            // 右クリックを押しながらホイールで音量を変更
            if ( e.buttons < 2 || enableVolumeGesture === false || !video ) return;
            if ( e.deltaY < 0 ) {
                video.volume += 0.05;
            } else {
                video.volume -= 0.05;
            }
            e.preventDefault();
            volumeGestureUsedRef.current = true
        }
        function preventContextMenu(e: Event) {
            if (!volumeGestureUsedRef.current) return
            e.preventDefault()
            volumeGestureUsedRef.current = false
        }
        videoContainerRef.current?.addEventListener("wheel", onWheel)
        videoContainerRef.current?.addEventListener("contextmenu", preventContextMenu)
        return () => {
            videoContainerRef.current?.removeEventListener("wheel", onWheel)
            videoContainerRef.current?.removeEventListener("contextmenu", preventContextMenu)
        }
    }, [])

    return (<div className="player-video-container">
        <div className="player-video-container-inner" ref={videoContainerRef}>
            <CSSTransition nodeRef={nodeRef} in={!canPlay} timeout={400} unmountOnExit classNames="player-loading-transition">
                <div ref={nodeRef} className="player-video-loading-container">
                    <img src={thumbnailSrc} className="player-video-loading-thumbnail"></img>
                    <div className="player-video-loading-text">Loading...</div>
                </div>
            </CSSTransition>
            <video ref={videoRef} autoPlay onPause={(e) => {onPause()}} onEnded={onEnded} onCanPlay={() => {setCanPlay(true)}} width="1920" height="1080" id="pmw-element-video" onClick={onClick}></video>
            { children }
        </div>
    </div>);
}

function Player({ videoId, actionTrackId, videoInfo, commentContent, videoRef, isFullscreenUi, setIsFullscreenUi, setCommentContent, reloadCommentContent, playlistData, changeVideo, recommendData }: Props) {
    //const lang = useLang()
    const { localStorage, setLocalStorageValue, syncStorage } = useStorageContext()

    const [isVefxShown, setIsVefxShown] = useState(false)
    const [isSettingsShown, setIsSettingsShown] = useState(false)
    const [isCommentShown, setIsCommentShown] = useState(true)
    const [isStatsShown, setIsStatsShown] = useState(false)
    const cursorStopRef = useRef<boolean>(false) // これはコンテナのルートにも使われるけど、直接書き換えて再レンダリングを抑止する
    const pipVideoRef = useRef<HTMLVideoElement>(null)
    const commentInputRef = useRef<HTMLTextAreaElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [previewCommentItem, setPreviewCommentItem] = useState<Comment | null>(null) // プレビューコメント

    // for transition
    const vefxElemRef = useRef<HTMLDivElement>(null)
    const settingsElemRef = useRef<HTMLDivElement>(null)

    const isLoudnessEnabled = localStorage.playersettings.enableLoudnessData ?? true
    const integratedLoudness = (videoInfo.data?.response.media.domand && videoInfo.data?.response.media.domand?.audios[0].loudnessCollection[0].value) ?? 1
    const loudnessData = isLoudnessEnabled ? integratedLoudness : 1
    const { effectsState, setEffectsState, frequencies, handleEffectsChange } = useAudioEffects(videoRef, loudnessData, localStorage.playersettings.vefxSettings);
    // エフェクト設定をリストア
    useEffect(() => {
        if (!localStorage || !localStorage.playersettings || !localStorage.playersettings.vefxSettings) return
        setEffectsState(localStorage.playersettings.vefxSettings)
        handleEffectsChange(effectsState)
    }, [])

    // シャッフル再生のバッグ
    const shuffleBagRef = useRef<string[]>([])

    // 外部HLSプラグインが使用される状況の場合は何もしない
    const shouldUseContentScriptHls = !(import.meta.env.FIREFOX || syncStorage.pmwforcepagehls)
    const hlsRef = useHlsVideo(videoRef, videoInfo, videoId, actionTrackId, shouldUseContentScriptHls, localStorage.playersettings.preferredLevel || -1)

    // ストーリーボード
    const storyBoardData = useStoryBoardData(videoInfo, videoId, actionTrackId)

    useResumePlayback(videoRef, videoId, videoInfo, localStorage.playersettings.resumePlayback)

    const toggleFullscreen = () => {
        const shouldRequestFullscreen = localStorage.playersettings.requestMonitorFullscreen ?? true
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
            if (videoRef.current && videoRef.current.currentTime && videoRef.current.duration && videoRef.current?.currentTime >= videoRef.current?.duration) return
            cursorStopRef.current = true
            containerRef.current?.setAttribute("is-cursor-stopped", "true")
        }
        // 動画が終了してエンドカードが表示されそうな場合は常にカーソル表示状態に
        const onTimeUpdate = () => {
            if ( !videoRef.current || !videoRef.current.currentTime || !videoRef.current.duration ) return
            if (videoRef.current?.currentTime >= videoRef.current?.duration) {
                cursorStopRef.current = false
                containerRef.current?.setAttribute("is-cursor-stopped", "false")
                clearTimeout(timeout)
            }
        }
        // カーソルが動いたらTimeoutをリセット
        const handleMouseMove = (e: MouseEvent) => {
            clearTimeout(timeout)
            cursorStopRef.current = false
            containerRef.current?.setAttribute("is-cursor-stopped", "false")
            timeout = setTimeout(toCursorStop, 2500)
        }
        let timeout = setTimeout(toCursorStop, 2500)
        containerRef.current?.addEventListener("mousemove", handleMouseMove, true)
        videoRef.current?.addEventListener("timeupdate", onTimeUpdate)

        // フルスクリーンから脱出した場合にUIを切り替え
        const handleFullscreenChange = (e: Event) => {
            if ( !document.fullscreenElement ) {
                setIsFullscreenUi(false)
            } else {
                setIsFullscreenUi(true)
            }
        }
        document.body.addEventListener("fullscreenchange", handleFullscreenChange)

        // ホットキー
        const onKeydown = (e: KeyboardEvent) => handleCtrl(e, videoRef.current, commentInputRef.current, toggleFullscreen)
        document.body.addEventListener("keydown", onKeydown)
        
        // 破棄時に解除
        return () => {
            clearTimeout(timeout)
            document.body.removeEventListener("keydown", onKeydown)
            document.body.removeEventListener("fullscreenchange", handleFullscreenChange)
            containerRef.current?.removeEventListener("mousemove", handleMouseMove)
            videoRef.current?.removeEventListener("timeupdate", onTimeUpdate)
        }
    }, [])

    useEffect(() => {
        if (videoRef.current) videoRef.current.playbackRate = localStorage.playersettings.playbackRate || 1.0
    }, [localStorage])

    const filteredComments = useMemo(() => {
        if (!commentContent.data) return
        return doFilterThreads(commentContent.data.threads, sharedNgLevelScore[(localStorage.playersettings.sharedNgLevel ?? "mid") as keyof typeof sharedNgLevelScore], videoInfo.data?.response.comment.ng.viewer)
    }, [commentContent, videoInfo, localStorage.playersettings.sharedNgLevel])

    function playlistIndexControl(add: number, isShuffle?: boolean) {
        if (playlistData.items.length > 0) {
            let nextVideo = playlistData.items[0]
            if (isShuffle) {
                // 某ブロックゲームと同じく、バックの中から抽選する形式にする
                const shuffleBag = shuffleBagRef.current
                if (shuffleBag.length - 1 >= playlistData.items.length) shuffleBagRef.current = []
                shuffleBagRef.current.push(videoId)
                const bagItems = playlistData.items.filter(item => !shuffleBag.includes(item.id))
                const pickedIndex = Math.floor(Math.random() * (bagItems.length - 1))
                nextVideo = bagItems[pickedIndex]
                console.log(shuffleBag)
                console.log(bagItems)
            } else {
                const currentVideoIndex = playlistData.items?.findIndex(video => video.id === videoId)
                if (currentVideoIndex === undefined || currentVideoIndex === -1 || currentVideoIndex + add >= playlistData.items.length || currentVideoIndex + add < 0) return
                nextVideo = playlistData.items[currentVideoIndex + add]
            }
            let playlistQuery: { type: string, context: any } = {
                type: playlistData.type,
                context: {}
            }
            if ( playlistData.type === "mylist" ) {
                playlistQuery.context = { mylistId: Number(playlistData.id), sortKey: "addedAt", sortOrder: "asc" }
            } else if ( playlistData.type === "series" ) {
                playlistQuery.context = { seriesId: Number(playlistData.id) }
            }
            changeVideo(`https://www.nicovideo.jp/watch/${encodeURIComponent(nextVideo.id)}?playlist=${btoa(JSON.stringify(playlistQuery))}`)
        } else if (recommendData.data?.items && recommendData.data.items[0].contentType === "video" && add === 1) {
            changeVideo(`https://www.nicovideo.jp/watch/${encodeURIComponent(recommendData.data.items[0].content.id)}`)
        }
    }
    
    const onPause = useCallback(() => {
        if ( !videoRef.current ) return
        const playbackPositionBody = { watchId: videoId, seconds: videoRef.current.currentTime }
        putPlaybackPosition(JSON.stringify(playbackPositionBody))
    }, [videoRef, videoId])

    const onEnded = () => {
        const autoPlayType = localStorage.playersettings.autoPlayType ?? "playlistonly"
        if ( ((autoPlayType === "playlistonly" && playlistData.items.length > 1) || autoPlayType === "always") && !localStorage.playersettings.isLoop ) {
            playlistIndexControl(1, localStorage.playersettings.enableShufflePlay)
        }
    }

    
    const videoOnClick = useCallback(() => {
        const video = videoRef.current
        if ( !video ) return
        if ( video.paused ) {
            video.play()
        } else {
            video.pause()
            onPause()
        }
    }, [videoRef])

    const preferredCommentFps = (localStorage.playersettings.commentRenderFps ?? 60) // 未指定の場合は60にフォールバック
    const commentRenderFps = localStorage.playersettings.enableCommentPiP ? 60 : preferredCommentFps // PiPでコメント表示する場合はメモリリークを防ぐために60FPSで固定する
    // .map() から生成されている string[] の一次元配列なら大丈夫だと信じて.reverse()する
    const qualityLabels = videoInfo.data?.response.media.domand?.videos.map(video => video.label).reverse()

    const thumbnailSrc = videoInfo.data?.response.video.thumbnail.player 

    return <div className="player-container"
        id="pmw-player"
        is-pipvideo={localStorage.playersettings.enableCommentPiP && isCommentShown ? "true" : "false"}
        is-dynamic-controller={localStorage.playersettings.integratedControl !== "never" ? "true" : "false"}
        is-integrated-controller={localStorage.playersettings.integratedControl === "always" && !isFullscreenUi ? "true" : "false"}
        is-cursor-stopped={cursorStopRef.current ? "true" : "false"}
        ref={containerRef}
    >
        <VideoPlayer videoRef={videoRef} onPause={onPause} onEnded={onEnded} onClick={videoOnClick} thumbnailSrc={thumbnailSrc} enableVolumeGesture={localStorage.playersettings.enableWheelGesture}>
            { filteredComments && <CommentRender
                videoRef={videoRef}
                pipVideoRef={pipVideoRef}
                isCommentShown={isCommentShown}
                commentOpacity={localStorage.playersettings.commentOpacity || 1}
                threads={filteredComments}
                videoOnClick={videoOnClick}
                enableCommentPiP={localStorage.playersettings.enableCommentPiP && !previewCommentItem}
                disableCommentOutline={localStorage.playersettings.disableCommentOutline ?? false}
                commentRenderFps={commentRenderFps}
                previewCommentItem={previewCommentItem}
                defaultPostTargetIndex={videoInfo.data ? videoInfo.data.response.comment.threads.findIndex(elem => elem.isDefaultPostTarget) : -1}
            /> }
            <CSSTransition nodeRef={vefxElemRef} in={isVefxShown} timeout={400} unmountOnExit classNames="player-transition-vefx">
                <VefxController
                    nodeRef={vefxElemRef}
                    frequencies={frequencies}
                    effectsState={effectsState}
                    onEffectsChange={(state: effectsState) => {
                        setLocalStorageValue("playersettings", { ...localStorage.playersettings, vefxSettings: state })
                        // 反映して再レンダリング
                        handleEffectsChange(state)
                        setEffectsState(state)
                    }}
                />
            </CSSTransition>
            <CSSTransition nodeRef={settingsElemRef} in={isSettingsShown} timeout={400} unmountOnExit classNames="player-transition-settings">
                <Settings nodeRef={settingsElemRef} isStatsShown={isStatsShown} setIsStatsShown={setIsStatsShown}/>
            </CSSTransition>
            { isStatsShown && <StatsOverlay videoInfo={videoInfo} videoRef={videoRef} hlsRef={hlsRef}/> }
            <EndCard videoInfo={videoInfo} videoRef={videoRef} recommendData={recommendData}/>
            <ErrorScreen videoInfo={videoInfo}/>
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
            <CommentInput videoId={videoId} videoRef={videoRef} videoInfo={videoInfo} setCommentContent={setCommentContent} reloadCommentContent={reloadCommentContent} commentInputRef={commentInputRef} setPreviewCommentItem={setPreviewCommentItem}/>
        </div>
    </div>
}


export default Player;