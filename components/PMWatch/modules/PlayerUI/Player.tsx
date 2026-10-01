import { useEffect, useState, useRef } from "react"
// import { useLang } from "../localizeHook";
import PlayerController, { playerTypes } from "./PlayerController"
import VefxController from "./VefxController"
import { Comment } from "@/types/CommentData"
import type { Dispatch, SetStateAction } from "react"
import CommentInput from "./CommentInput"
import Settings from "./Settings/Settings"
import { StatsOverlay } from "./StatsOverlay"
import { CSSTransition } from "react-transition-group"
import { EndCard } from "./EndCard"
import { useAudioEffects } from "@/hooks/eqHooks"
import { ErrorScreen } from "./ErrorScreen"
import { CommentRender } from "./CommentRender"
import { VideoPlayer } from "./VideoPlayer"
import {
    useActionTrackDataContext,
    useVideoInfoContext,
    useVideoRefContext,
} from "@/components/Global/Contexts/VideoDataProvider"
import {
    useCommentContentContext,
} from "@/components/Global/Contexts/CommentDataProvider"
import { usePlaylistContext } from "@/components/Global/Contexts/PlaylistProvider"
import { decodePlaylistString, encodePlaylistQuery } from "@/utils/playlistUtils"
import { useRecommendContext } from "@/components/Global/Contexts/RecommendProvider"
import BackgroundController from "./BackgroundController"
import { useViewerNgContext } from "@/components/Global/Contexts/ViewerNgProvider"
import VideoTitle from "../Info/VideoTitle"
import { useStoryBoardData } from "@/hooks/apiHooks/watch/storyBoardData"
import { useSmIdContext } from "@/components/Global/Contexts/WatchDataContext"
import { borderMyComments, parseNicoScriptEvent } from "@/utils/commentUtils"
import { useBackgroundPlayingContext } from "@/components/Global/Contexts/BackgroundPlayProvider"
import { useHeartbeat } from "@/hooks/useHeartbeat"
import { useLocationContext } from "@/components/Router/RouterContext"
import { useLyricData } from "@/hooks/apiHooks/watch/lyricData"
import { JumpVideoCard } from "./JumpVideoCard"
import { useSetMessageContext } from "@/components/Global/Contexts/MessageProvider"
import { validateThreadId } from "@/utils/detectVideoId"
import { IconMessage2Question } from "@tabler/icons-react"

type Props = {
    isFullscreenUi: boolean
    setIsFullscreenUi: Dispatch<SetStateAction<boolean>>
    changeVideo: (videoUrl: string, doScroll?: boolean, noLocationChange?: boolean) => void
    onModalStateChanged: (isModalOpen: boolean, modalType: "mylist" | "share") => void
    isShortsPlayer: boolean
}

function Player(props: Props) {
    const { isFullscreenUi, setIsFullscreenUi, changeVideo, onModalStateChanged, isShortsPlayer } = props

    const { showToast } = useSetMessageContext()

    const { smId } = useSmIdContext()
    const { videoInfo, rawVideoInfo, videoId } = useVideoInfoContext()
    const { commentContent, lastSentCommentId, currentLogData } = useCommentContentContext()
    const videoRef = useVideoRefContext()
    const actionTrackId = useActionTrackDataContext()
    const playlistData = usePlaylistContext()
    const recommendData = useRecommendContext()
    const { lyricData } = useLyricData(videoId, videoInfo?.video?.hasLyrics ?? false)
    const { ngData } = useViewerNgContext()
    const isBackgroundPlaying = useBackgroundPlayingContext()
    const location = useLocationContext()

    // heartbeat: Player ライフサイクルで start / impression / play を発火する
    const searchParams = new URLSearchParams(location.search)
    const queryParameters: Record<string, string> = {}
    searchParams.forEach((value, key) => {
        queryParameters[key] = value
    })
    const nicosid = videoInfo?.client?.nicosid ?? ""
    const { sendStart, sendImpression, sendPlay } = useHeartbeat({
        videoId,
        actionTrackId,
        method: videoInfo?.viewer ? (videoInfo?.viewer.isPremium ? "premium" : "regular") : "guest",
        nicosid,
        queryParameters,
    })

    const localStorage = useStorageVar([
        "enableLoudnessData",
        "vefxSettings",
        "preferredQuality",
        "resumePlayback",
        "requestMonitorFullscreen",
        "playbackRate",
        "sharedNgLevel",
        "customCommentOpacity",
        "enableContinuousPlay",
        "continuousPlayWithRecommend",
        "isLoop",
        "isLoopInShorts",
        "enableShufflePlay",
        "commentRenderFps",
        "enableCommentPiP",
        "integratedControl",
        "enableWheelGesture",
        "commentOpacity",
        "disableCommentOutline",
        "enableFancyRendering",
        "enableInterpolateCommentRendering",
        "commentRenderMode",
        "enableBigView",
        "rewindTime",
        "borderPastMyComments",
        "enableAutoPlay",
        "lyricCommentFilter",
        "jumpVideoBehaviour",
    ] as const, "local")
    const syncStorage = useStorageVar([
        "pmwplayertype",
        "pmwforcepagehls",
        "disableBorderlessPlayer",
        "flagTimetravelCommentRenderMode",
        "flagEnableShortsLayout",
    ] as const)

    const [isVefxShown, setIsVefxShown] = useState(false)
    const [isSettingsShown, setIsSettingsShown] = useState(false)
    const [isCommentShown, setIsCommentShown] = useState(true)
    const [isStatsShown, setIsStatsShown] = useState(false)
    const cursorStopRef = useRef<boolean>(false) // これはコンテナのルートにも使われるけど、直接書き換えて再レンダリングを抑止する
    const pipVideoRef = useRef<HTMLVideoElement>(null)
    const commentInputRef = useRef<HTMLTextAreaElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [previewCommentItem, setPreviewCommentItem] = useState<Comment | null>(null) // プレビューコメント
    const [jumpVideo, setJumpVideo] = useState<{ smId: string, message: string } | null>(null)
    const jumpEventIdRef = useRef<string | null>(null)
    const jumpFeedbackTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null!)

    useEffect(() => {
        jumpEventIdRef.current = null
        setJumpVideo(null)
        clearTimeout(jumpFeedbackTimeoutRef.current)
    }, [videoId])

    // heartbeat: start は Base API 受信 + actionTrackId 確定直後に1回だけ発火
    useEffect(() => {
        if (!videoId || !actionTrackId) return
        sendStart()
    }, [videoId, actionTrackId, sendStart])

    // heartbeat: impression は初回マウント後1回だけ発火(レンダリング完了後を意図して rAF で送る)
    useEffect(() => {
        if (!videoId || !actionTrackId) return
        const raf = requestAnimationFrame(() => sendImpression())
        return () => cancelAnimationFrame(raf)
    }, [videoId, actionTrackId, sendImpression])

    // heartbeat: play は video 要素の最初の 'play' イベントで1回だけ発火
    useEffect(() => {
        const videoEl = videoRef.current
        if (!videoEl || !videoId || !actionTrackId) return
        const onFirstPlay = () => {
            sendPlay()
            videoEl.removeEventListener("play", onFirstPlay)
        }
        videoEl.addEventListener("play", onFirstPlay)
        return () => videoEl.removeEventListener("play", onFirstPlay)
    }, [videoId, actionTrackId, sendPlay, videoRef])

    useEffect(() => {
        const nicoScriptEvents = parseNicoScriptEvent(commentContent?.data?.threads ?? [], videoInfo?.video?.duration ?? 0)
        const videoEl = videoRef.current
        if (!videoEl) return
        const jumpEvents = nicoScriptEvents.filter(event => event.type === "jump")
        const onTimeUpdate = () => {
            const currentVpos = videoEl.currentTime * 1000
            const activeEvent = jumpEvents.find(event => currentVpos >= event.startVpos && currentVpos <= event.endVpos)
            if (!activeEvent) {
                jumpEventIdRef.current = null
                return
            }
            if (jumpEventIdRef.current === activeEvent.id) return
            jumpEventIdRef.current = activeEvent.id
            if (activeEvent.targetType === "time") {
                videoEl.currentTime = activeEvent.target as number
                return
            }
            videoEl.pause()
            setJumpVideo({ smId: activeEvent.target as string, message: activeEvent.message ?? "" })
            if (localStorage.jumpVideoBehaviour !== "manual") {
                clearTimeout(jumpFeedbackTimeoutRef.current)
                jumpFeedbackTimeoutRef.current = setTimeout(() => {
                    setJumpVideo(null)
                    changeVideo(`https://www.nicovideo.jp/watch/${encodeURIComponent(activeEvent.target as string)}`, true)
                }, 5000)
            }
        }
        videoEl.addEventListener("timeupdate", onTimeUpdate)
        return () => {
            videoEl.removeEventListener("timeupdate", onTimeUpdate)
            clearTimeout(jumpFeedbackTimeoutRef.current)
        }
    }, [commentContent, videoInfo?.video, videoId, changeVideo, videoRef, localStorage.jumpVideoBehaviour])

    // ショートカットのフィードバックツールチップ
    const [shortcutFeedbackShown, _setShortcutFeedbackShown] = useState(false)
    const [shortcutFeedbackText, _setShortcutFeedbackText] = useState<string | null>(null)
    const shortcutFeedbackElemRef = useRef<HTMLDivElement>(null)
    const shortcutFeedbackTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null!)
    const setShortcutFeedback = useCallback((text: string) => {
        _setShortcutFeedbackText(text)
        _setShortcutFeedbackShown(true)
        clearTimeout(shortcutFeedbackTimeoutRef.current)
        shortcutFeedbackTimeoutRef.current = setTimeout(() => {
            _setShortcutFeedbackShown(false)
        }, 1500)
    }, [])

    // for transition
    const vefxElemRef = useRef<HTMLDivElement>(null)
    const settingsElemRef = useRef<HTMLDivElement>(null)

    const isLoudnessEnabled = localStorage.enableLoudnessData ?? true
    const integratedLoudness = (
        videoInfo?.media?.contents && videoInfo.media.contents.audios.length > 0
        && videoInfo.media.contents.audios[0].loudnessCollection.length > 0
        && videoInfo.media.contents.audios[0].loudnessCollection[0].value
    ) || 1
    const loudnessData = isLoudnessEnabled ? integratedLoudness : 1
    const { effectsState, setEffectsState, frequencies, handleEffectsChange } = useAudioEffects(
        videoRef,
        loudnessData,
        localStorage.vefxSettings,
    )
    // エフェクト設定をリストア
    useEffect(() => {
        if (
            !localStorage
            || !localStorage.vefxSettings
        )
            return
        setEffectsState(localStorage.vefxSettings)
        handleEffectsChange(effectsState)
    }, [])

    // シャッフル再生のバッグ
    const shuffleBagRef = useRef<string[]>([])

    // 外部HLSプラグインが使用される状況の場合は何もしない
    const shouldUseContentScriptHls = !(
        import.meta.env.FIREFOX || syncStorage.pmwforcepagehls
    )
    /* const { hlsRef, errorInfo } = useHlsVideo(
        videoRef,
        videoInfo,
        videoId,
        actionTrackId,
        shouldUseContentScriptHls,
        localStorage.preferredLevel ?? -1,
    ) */
    /* const { accessRightsData: hlsAccessRightsData, error: errorInfo } = useAccessRightsData(
        smId,
        videoInfo?.media ?? null,
        actionTrackId,
        shouldUseContentScriptHls,
    ) */
    const { hlsRef, error: hlsError, isBuffering, levelMapRef } = useHls(
        videoRef,
        videoInfo?.media.hls.url,
        videoInfo?.media?.contents,
        videoInfo?.media?.hls?.outputs,
        localStorage.preferredQuality,
        shouldUseContentScriptHls,
    )

    // ストーリーボード
    const { storyboardData } = useStoryBoardData(videoInfo?.media ?? null, smId, actionTrackId)

    useResumePlayback(
        videoRef,
        videoInfo?.video,
        videoInfo?.player,
        localStorage.resumePlayback,
    )

    // FullscreenButton の memo 化に対応するため、参照を安定させる
    const toggleFullscreen = useCallback(() => {
        const shouldRequestFullscreen
            = localStorage.requestMonitorFullscreen ?? true
        if (!isFullscreenUi && shouldRequestFullscreen) {
            document.body.requestFullscreen()
        } else if (document.fullscreenElement !== null) {
            document.exitFullscreen()
        }
        setIsFullscreenUi(!isFullscreenUi)
    }, [isFullscreenUi, localStorage.requestMonitorFullscreen, setIsFullscreenUi])

    useEffect(() => {
        // カーソル表示状態の管理
        // Timeoutで呼ばれる関数 カーソル非表示状態へ移行
        const toCursorStop = () => {
            if (
                videoRef.current
                && videoRef.current.currentTime
                && videoRef.current.duration
                && videoRef.current?.currentTime >= videoRef.current?.duration
            )
                return
            cursorStopRef.current = true
            containerRef.current?.setAttribute("data-is-cursor-stopped", "true")
        }
        // 動画が終了してエンドカードが表示されそうな場合は常にカーソル表示状態に
        const onTimeUpdate = () => {
            if (
                !videoRef.current
                || !videoRef.current.currentTime
                || !videoRef.current.duration
            )
                return
            if (videoRef.current?.currentTime >= videoRef.current?.duration) {
                cursorStopRef.current = false
                containerRef.current?.setAttribute(
                    "data-is-cursor-stopped",
                    "false",
                )
                clearTimeout(timeout)
            }
        }
        // カーソルが動いたらTimeoutをリセット
        const handleMouseMove = () => {
            clearTimeout(timeout)
            cursorStopRef.current = false
            containerRef.current?.setAttribute("data-is-cursor-stopped", "false")
            timeout = setTimeout(toCursorStop, 2500)
        }
        let timeout = setTimeout(toCursorStop, 2500)
        containerRef.current?.addEventListener(
            "mousemove",
            handleMouseMove,
            true,
        )
        videoRef.current?.addEventListener("timeupdate", onTimeUpdate)

        // フルスクリーンから脱出した場合にUIを切り替え
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                setIsFullscreenUi(false)
            } else {
                setIsFullscreenUi(true)
            }
        }
        document.body.addEventListener(
            "fullscreenchange",
            handleFullscreenChange,
        )

        // ホットキー
        const onKeydown = (e: KeyboardEvent) =>
            handleCtrl(
                e,
                videoRef.current,
                commentInputRef.current,
                toggleFullscreen,
                setShortcutFeedback,
                onModalStateChanged,
                setIsCommentShown,
                localStorage.rewindTime,
            )
        document.body.addEventListener("keydown", onKeydown)

        // 破棄時に解除
        return () => {
            clearTimeout(timeout)
            document.body.removeEventListener("keydown", onKeydown)
            document.body.removeEventListener(
                "fullscreenchange",
                handleFullscreenChange,
            )
            containerRef.current?.removeEventListener(
                "mousemove",
                handleMouseMove,
            )
            videoRef.current?.removeEventListener("timeupdate", onTimeUpdate)
        }
    }, [localStorage.rewindTime])

    useEffect(() => {
        if (videoRef.current)
            videoRef.current.playbackRate
                = localStorage.playbackRate || 1.0
    }, [localStorage])

    useEffect(() => {
        if (!videoInfo?.video) return
        if ("mediaSession" in navigator) {
            const { title, artist } = resolveTitleAndArtist(
                videoInfo.video.title,
                returnVideoOwnerName(videoInfo.owner),
            )
            const albumTitle = playlistData?.name ?? videoInfo.series?.title ?? "リスト情報なし"

            navigator.mediaSession.metadata = new MediaMetadata({
                title: title,
                artist: artist ?? "非公開または退会済みユーザー",
                album: albumTitle,
                artwork: (videoInfo.video.thumbnail.player
                    ? [
                            {
                                src: videoInfo.video.thumbnail.player,
                            },
                        ]
                    : []),
            })
        }
    }, [videoInfo?.video, videoInfo?.owner, videoInfo?.series, playlistData])

    const filteredComments = useMemo(() => {
        if (!commentContent || !commentContent.data) return
        const levensteinBasedLyricNg = lyricData && localStorage.lyricCommentFilter > 0 ? doLyricCommentNg(commentContent.data.threads, lyricData, localStorage.lyricCommentFilter) : []
        const filteredThreads = doFilterThreads(
            commentContent.data.threads,
            sharedNgLevelScore[
                (localStorage.sharedNgLevel
                    ?? "mid") as keyof typeof sharedNgLevelScore
            ],
            ngData,
            levensteinBasedLyricNg,
        )
        if (!videoInfo?.comment?.threads) return []
        const threadLabels = returnThreadLabels(videoInfo.comment.threads)
        const threadsOpacityApplied = applyOpacityToThreads(filteredThreads, threadLabels, localStorage.customCommentOpacity ?? {})
        const threadsBordered = borderMyComments(threadsOpacityApplied, lastSentCommentId ?? "", localStorage.borderPastMyComments ?? false)
        return threadsBordered
    }, [commentContent, videoInfo?.comment, lyricData, localStorage.sharedNgLevel, localStorage.customCommentOpacity, localStorage.borderPastMyComments, localStorage.lyricCommentFilter, lastSentCommentId, ngData])

    const playlistIndexControl = useCallback((add: number, isShuffle?: boolean, isAutoPlayTrigger?: boolean) => {
        if (!videoId) return
        if (playlistData.items.length > 0) {
            let nextVideo = playlistData.items[0]
            if (isShuffle) {
                // 某ブロックゲームと同じく、バックの中から抽選する形式にする
                const shuffleBag = shuffleBagRef.current
                if (shuffleBag.length - 1 >= playlistData.items.length)
                    shuffleBagRef.current = []
                shuffleBagRef.current.push(videoId)
                const bagItems = playlistData.items.filter(
                    item => shuffleBag.indexOf(item.id) === -1,
                )
                const pickedIndex = Math.floor(
                    Math.random() * (bagItems.length - 1),
                )
                nextVideo = bagItems[pickedIndex]
                // console.log(shuffleBag);
                // console.log(bagItems);
            } else {
                const currentVideoIndex = playlistData.items?.findIndex(
                    video => video.id === videoId,
                )
                if (
                    currentVideoIndex === undefined
                    || currentVideoIndex === -1
                    || currentVideoIndex + add >= playlistData.items.length
                    || currentVideoIndex + add < 0
                )
                    return
                nextVideo = playlistData.items[currentVideoIndex + add]
            }
            const playlistQuery: { type: string, context: any } = {
                type: playlistData.type,
                context: {},
            }
            if (playlistData.type === "mylist") {
                playlistQuery.context = {
                    mylistId: Number(playlistData.id),
                    sortKey: "addedAt",
                    sortOrder: "asc",
                }
            } else if (playlistData.type === "series") {
                playlistQuery.context = { seriesId: Number(playlistData.id) }
            } else if (playlistData.type === "search" && playlistData.id) {
                playlistQuery.context = decodePlaylistString(playlistData.id).context
            }
            if (!nextVideo) return
            changeVideo(
                `https://www.nicovideo.jp/watch/${encodeURIComponent(nextVideo.id)}?playlist=${encodeURIComponent(encodePlaylistQuery(playlistQuery))}`,
                !isAutoPlayTrigger,
                isBackgroundPlaying,
            )
        } else if (
            recommendData
            && recommendData.data?.items
            && recommendData.data.items[0]
            && recommendData.data.items[0].contentType === "video"
            && add === 1
        ) {
            changeVideo(
                `https://www.nicovideo.jp/watch/${encodeURIComponent(recommendData.data.items[0].content.id)}`,
                !isAutoPlayTrigger,
                isBackgroundPlaying,
            )
        }
    }, [playlistData, videoId, changeVideo, recommendData, isBackgroundPlaying])

    const onPause = useCallback(() => {
        if (!videoRef.current || !videoId) return
        const playbackPositionBody = {
            videoId,
            seconds: videoRef.current.currentTime,
        }
        putPlaybackPosition(playbackPositionBody, new Date())
    }, [videoRef, videoInfo?.video, videoId])

    const onEnded = useCallback(() => {
        const enableContinuousPlay = localStorage.enableContinuousPlay ?? true
        const withRecommend = localStorage.continuousPlayWithRecommend ?? false
        const isLoopInShorts = localStorage.isLoopInShorts ?? true

        if (
            (enableContinuousPlay && (playlistData.items.length > 1 || withRecommend))
            && !(localStorage.isLoop || (isShortsPlayer && isLoopInShorts))
        ) {
            playlistIndexControl(
                1,
                localStorage.enableShufflePlay,
                true,
            )
        }
    }, [isShortsPlayer, localStorage.enableContinuousPlay, localStorage.continuousPlayWithRecommend, localStorage.isLoop, localStorage.isLoopInShorts, localStorage.enableShufflePlay, playlistData.items.length, playlistIndexControl])

    const videoOnClick = useCallback(() => {
        const video = videoRef.current
        if (!video) return
        if (video.paused) {
            video.play()
        } else {
            video.pause()
            onPause()
        }
    }, [videoRef])

    useEffect(() => {
        if (
            rawVideoInfo?.meta.status === 200
            && actionTrackId !== ""
        ) {
            document.dispatchEvent(
                new CustomEvent("pmw_playerReady", {
                    detail: JSON.stringify({
                        videoInfo: rawVideoInfo,
                        actionTrackId,
                    }),
                }),
            )
        }
    }, [rawVideoInfo, actionTrackId])

    const handleJumpCancel = useCallback(() => {
        clearTimeout(jumpFeedbackTimeoutRef.current)
        setJumpVideo(null)
        if (videoRef.current && videoRef.current.currentTime < videoRef.current.duration && videoRef.current.currentTime !== videoRef.current.duration) {
            videoRef.current?.play().catch(() => {})
        }
    }, [jumpFeedbackTimeoutRef, setJumpVideo, videoRef])

    const lastWarnedSmIdRef = useRef<string | null>(null)
    useEffect(() => {
        if (
            smId
            && validateThreadId(smId)
            && smId !== videoId
            && lastWarnedSmIdRef.current !== smId
            && videoInfo?.video?.isChannelVideo
            && commentContent?.data?.threads.reduce((prev, current) => prev + current.comments.length, 0) === 0
            && !videoInfo?.comment?.threads.some(t => t.label === "community")
        ) {
            lastWarnedSmIdRef.current = smId
            showToast({
                icon: <IconMessage2Question />,
                title: "指定されたスレッドIDにはコメントがありません",
                body: (
                    <>
                        チャンネル動画をスレッドID指定で取得していますが、このスレッドにはコメントがありません。
                        <br />
                        すべてのコメントを表示するには、動画IDでアクセスし直してください。
                    </>
                ),
            })
        }
    }, [smId, videoId, videoInfo?.video, videoInfo?.comment, commentContent, showToast])

    const preferredCommentFps
        = localStorage.commentRenderFps ?? 60 // 未指定の場合は60にフォールバック
    const commentRenderFps = localStorage.enableCommentPiP
        ? 60
        : preferredCommentFps // PiPでコメント表示する場合はメモリリークを防ぐために60FPSに固定する

    // 旧 `preferredLevel: number` (HLS インデックス) は新 API で動画ごとに安定しないため削除。
    // 新形式は `preferredQuality: { videoId, audioId }` で保存される。
    // 旧値が残っている場合は useStorageVar の参照外なので直接削除する。
    if (localStorage.preferredQuality === undefined) {
        storage.removeItem("local:preferredLevel")
    }

    const thumbnailSrc = videoInfo?.video?.thumbnail.player

    const thisVideoAuthor = returnVideoOwnerName(videoInfo?.owner)

    const currentPlayerType = isShortsPlayer && syncStorage.flagEnableShortsLayout ? playerTypes.shorts : (syncStorage.pmwplayertype || playerTypes.default)

    // 過去ログロード中はコメント互換モードをdefaultに変更
    const commentRenderMode = currentLogData?.when ? (syncStorage.flagTimetravelCommentRenderMode || "default") : localStorage.commentRenderMode ?? "html5"

    return (
        <div
            className="player-container"
            id="pmw-player"
            data-is-pipvideo={
                localStorage.enableCommentPiP && isCommentShown
                    ? "true"
                    : "false"
            }
            data-is-dynamic-controller={
                localStorage.integratedControl !== "never"
                    ? "true"
                    : "false"
            }
            data-is-integrated-controller={
                localStorage.integratedControl === "always"
                && !isFullscreenUi
                    ? "true"
                    : "false"
            }
            data-is-cursor-stopped={cursorStopRef.current ? "true" : "false"}
            data-is-jump-video={jumpVideo ? "true" : "false"}
            data-is-borderless-player={syncStorage.disableBorderlessPlayer ? "false" : "true"}
            data-player-type={currentPlayerType}
            ref={containerRef}
        >
            <VideoPlayer
                videoRef={videoRef}
                onPause={onPause}
                onEnded={onEnded}
                onClick={videoOnClick}
                thumbnailSrc={thumbnailSrc}
                videoTitle={videoInfo?.video?.title}
                videoAuthor={thisVideoAuthor}
                videoGenre={videoInfo?.genre?.label}
                enableVolumeGesture={
                    localStorage.enableWheelGesture
                }
                setShortcutFeedback={setShortcutFeedback}
                isAutoplayEnabled={localStorage.enableAutoPlay ?? true}
            >
                {isBuffering && (
                    <div className="player-video-buffering" data-is-buffering="true">
                        <div className="loading-spinner" />
                    </div>
                )}
                {filteredComments && (
                    <CommentRender
                        videoRef={videoRef}
                        pipVideoRef={pipVideoRef}
                        isCommentShown={isCommentShown}
                        commentOpacity={
                            localStorage.commentOpacity || 1
                        }
                        threads={filteredComments}
                        videoOnClick={videoOnClick}
                        enableCommentPiP={
                            localStorage.enableCommentPiP
                            && !previewCommentItem
                        }
                        disableCommentOutline={
                            localStorage.disableCommentOutline
                            ?? false
                        }
                        enableFancyRendering={
                            localStorage.enableFancyRendering
                            ?? false
                        }
                        enableInterpolateCommentRendering={
                            localStorage.enableInterpolateCommentRendering
                            ?? true
                        }
                        renderMode={commentRenderMode}
                        commentRenderFps={commentRenderFps}
                        previewCommentItem={previewCommentItem}
                        defaultPostTargetIndex={
                            videoInfo?.comment
                                ? videoInfo.comment.threads.findIndex(elem => elem.isPostTarget)
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
                        onEffectsChange={handleEffectsChange}
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
                <CSSTransition
                    nodeRef={shortcutFeedbackElemRef}
                    in={shortcutFeedbackShown}
                    timeout={300}
                    unmountOnExit
                    classNames="player-shortcut-feedback-transition"
                >
                    <div className="player-shortcut-feedback-wrapper" ref={shortcutFeedbackElemRef}>
                        <div className="player-shortcut-feedback">
                            {shortcutFeedbackText}
                        </div>
                    </div>
                </CSSTransition>
                {isStatsShown && (
                    <StatsOverlay
                        videoRef={videoRef}
                        hlsRef={hlsRef}
                    />
                )}
                {jumpVideo && (
                    <JumpVideoCard
                        smId={jumpVideo.smId}
                        message={jumpVideo.message}
                        onCancel={handleJumpCancel}
                    />
                )}
                {videoId !== "" && <EndCard smId={videoId} />}
                <ErrorScreen hlsErrorInfo={hlsError ?? null} />
                {isFullscreenUi && localStorage.enableBigView && <VideoTitle showStats={true} />}
            </VideoPlayer>
            <div className="player-bottom-container">
                <PlayerController
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
                    playlistIndexControl={playlistIndexControl}
                    contents={videoInfo?.media?.contents}
                    levelMapRef={levelMapRef}
                    storyBoardData={storyboardData}
                    currentPlayerType={currentPlayerType}
                    tempIsShortsPlayer={isShortsPlayer}
                />
                <CommentInput
                    videoId={videoId}
                    videoRef={videoRef}
                    commentInputRef={commentInputRef}
                    setPreviewCommentItem={setPreviewCommentItem}
                />
                <BackgroundController />
            </div>
        </div>
    )
}

export default Player
