import { memo, useEffect, useRef, useState } from "react"
import { IconAdjustments, IconAdjustmentsCheck, IconAdjustmentsFilled, IconLayoutSidebarRightCollapseFilled, IconLayoutSidebarRightExpand, IconMaximize, IconMessage2, IconMessage2Off, IconMinimize, IconPlayerPauseFilled, IconPlayerPlayFilled, IconPlayerSkipBack, IconPlayerSkipBackFilled, IconPlayerSkipForward, IconPlayerSkipForwardFilled, IconRepeat, IconRepeatOff, IconRewindBackward10, IconRewindBackward15, IconRewindBackward30, IconRewindBackward5, IconRewindForward10, IconRewindForward15, IconRewindForward30, IconRewindForward5, IconSettings, IconSettingsFilled, IconVolume, IconVolume3 } from "@tabler/icons-react"
import type { Dispatch, JSX, ReactNode, RefObject, SetStateAction } from "react"
import Hls from "hls.js"
import type { effectsState } from "@/hooks/eqHooks"
import { Seekbar } from "./Seekbar"
import { timeCalc } from "../commonFunction"
import { secondsToTime } from "@/utils/readableValue"
import { CSSTransition } from "react-transition-group"
import { StoryBoardImageRootObject } from "@/types/StoryBoardData"
type Props = {
    videoRef: RefObject<HTMLVideoElement | null>
    effectsState: effectsState
    isVefxShown: boolean
    setIsVefxShown: Dispatch<SetStateAction<boolean>>
    isFullscreenUi: boolean
    toggleFullscreen: () => void
    isCommentShown: boolean
    setIsCommentShown: Dispatch<SetStateAction<boolean>>
    isSettingsShown: boolean
    setIsSettingsShown: Dispatch<SetStateAction<boolean>>
    hlsRef: RefObject<Hls>
    playlistIndexControl: (index: number, isShuffle?: boolean, isAutoPlayTrigger?: boolean) => void
    qualityLabels?: string[]
    storyBoardData?: StoryBoardImageRootObject | null
    currentPlayerType: keyof typeof playerTypes
}

export const playerTypes = {
    default: "default",
    classic: "classic",
    officialPlayer: "html5",
    shinjuku: "shinjuku",
    ginzaPlus: "ginzaplus",
}

const PlayerControllerButton = memo(function MemoizedPlayerControllerButton({ onClick, title, className, children }: { onClick: any, title: string, className: string, children: ReactNode }) {
    const [isHovered, setIsHovered] = useState(false)
    const spanRef = useRef(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null!)
    function toHoverState() {
        setIsHovered(false)
        timeoutRef.current = setTimeout(() => setIsHovered(true), 500)
    }
    function cancelHoverState() {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null!
        setIsHovered(false)
    }
    useEffect(() => {
        return () => {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null!
        }
    }, [])
    return (
        <button ref={buttonRef} className={className} onClick={onClick} aria-label={title} onMouseEnter={toHoverState} onMouseLeave={cancelHoverState}>
            {children}
            <CSSTransition nodeRef={spanRef} in={isHovered} timeout={300} unmountOnExit classNames="playercontroller-tooltip-transition">
                <span ref={spanRef} className="playercontroller-tooltip">{title}</span>
            </CSSTransition>
        </button>
    )
})

function PlayerController(props: Props) {
    const {
        videoRef,
        effectsState,
        isVefxShown,
        setIsVefxShown,
        isFullscreenUi,
        toggleFullscreen,
        isCommentShown,
        setIsCommentShown,
        hlsRef,
        isSettingsShown,
        setIsSettingsShown,
        playlistIndexControl,
        qualityLabels,
        storyBoardData,
        currentPlayerType,
    } = props
    const localStorage = useStorageVar(["isMuted", "volume", "isLoop", "enableShufflePlay", "rewindTime", "enableBigView"] as const, "local")

    const [isIconPlay, setIsIconPlay] = useState(false)

    const [isMuted, setIsMuted] = useState(localStorage.isMuted || false)
    const [videoVolume, setVideoVolume] = useState(localStorage.volume ?? 50)
    const [isLoop, setIsLoop] = useState<boolean>(localStorage.isLoop || false)

    const isMutedRef = useRef(isMuted)
    isMutedRef.current = isMuted
    const videoVolumeRef = useRef(videoVolume)
    videoVolumeRef.current = videoVolume

    const [hlsLevel, setHlsLevel] = useState(0)
    const [bufferedDuration, setBufferedDuration] = useState(0)
    // const [qualityStrings, setQualityStrings] = useState([])

    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)

    const seekbarRef = useRef<HTMLDivElement>(null!)
    const [isSeeking, setIsSeeking] = useState(false)
    const isSeekingRef = useRef(false)
    isSeekingRef.current = isSeeking

    // 渡されたコールバックでRef作成
    const doSeekRef = useRef(() => {
        if (!videoRef.current) return
        videoRef.current.currentTime = currentTime
        // 元々clientXから再計算してたけど素直に突っ込んだ方が早かった！！！！！！！
    })
    // callbackが更新されたりしたらRef更新
    doSeekRef.current = () => {
        if (!videoRef.current) return
        videoRef.current.currentTime = currentTime
    }

    useEffect(() => {
        if (localStorage.isMuted) setIsMuted(localStorage.isMuted)
        if (localStorage.isLoop) setIsLoop(localStorage.isLoop)
        if (localStorage.volume) setVideoVolume(localStorage.volume)
    }, [localStorage.isMuted, localStorage.isLoop, localStorage.volume])

    useEffect(() => {
        const video = videoRef.current
        if (video) {
            video.volume = videoVolume / 100
            video.muted = isMuted
            video.loop = isLoop
        }
    }, [isMuted, isLoop, videoVolume])

    useEffect(() => {
        if (!hlsRef.current) return
        hlsRef.current.on(Hls.Events.LEVEL_SWITCHED, () => {
            if (!hlsRef.current) return
            setHlsLevel(hlsRef.current.currentLevel)
        })
        hlsRef.current.on(Hls.Events.BUFFER_APPENDED, () => {
            if (videoRef.current?.buffered.length) {
                setBufferedDuration(videoRef.current?.buffered.end(videoRef.current?.buffered.length - 1))
            }
            // setBufferedDuration()
        })
        hlsRef.current.on(Hls.Events.BUFFER_FLUSHED, () => {
            setBufferedDuration(0)
        })
    }, [hlsRef.current])

    useEffect(() => {
        const setIconToPause = () => setIsIconPlay(false)
        const setIconToPlay = () => setIsIconPlay(true)
        const updateVolumeState = () => {
            if (!videoRef.current) return
            if (videoRef.current.volume !== videoVolume / 100) {
                setVideoVolume(videoRef.current.volume * 100)
                storage.setItem("local:volume", videoRef.current.volume * 100)
            }
            if (videoRef.current.muted !== isMuted) {
                setIsMuted(videoRef.current.muted)
                storage.setItem("local:isMuted", videoRef.current.muted)
            }
        }

        videoRef.current?.addEventListener("play", setIconToPause)
        videoRef.current?.addEventListener("pause", setIconToPlay)

        videoRef.current?.addEventListener("volumechange", updateVolumeState)
        return () => {
            videoRef.current?.removeEventListener("play", setIconToPause)
            videoRef.current?.removeEventListener("pause", setIconToPlay)
            videoRef.current?.removeEventListener("volumechange", updateVolumeState)
        }
    }, [videoRef.current, videoVolume, isMuted])

    useEffect(() => {
        const updateCurrentTime = () => {
            if (videoRef.current!.currentTime !== currentTime && !isSeekingRef.current) {
                setCurrentTime(videoRef.current!.currentTime)
            }
        }
        const updateDuration = () => {
            if (videoRef.current!.duration !== duration) setDuration(videoRef.current!.duration)
        }
        document.addEventListener("pointermove", onSeekPointerMove)
        document.addEventListener("pointerup", onSeekPointerUp)
        videoRef.current?.addEventListener("timeupdate", updateCurrentTime)
        videoRef.current?.addEventListener("durationchange", updateDuration)
        return () => {
            document.removeEventListener("pointermove", onSeekPointerMove)
            document.removeEventListener("pointerup", onSeekPointerUp)
            videoRef.current?.removeEventListener("timeupdate", updateCurrentTime)
            videoRef.current?.removeEventListener("durationchange", updateDuration)
        }
    }, [isSeeking])

    const isIndexControl = [currentTime < 3, currentTime >= duration]

    const video = videoRef.current

    const toggleStopState = useCallback(() => {
        if (!video) return
        if (video.paused) {
            video.play()
        } else {
            video.pause()
        }
        setIsIconPlay(video.paused)
    }, [video])

    const onTimeControl = useCallback((operation: string, time: number) => {
        if (!video) return
        video.currentTime = timeCalc(operation, time, video.currentTime, video.duration)
    }, [video])

    function setVolume(volume: number, isMuteToggle = false) {
        if (isMuteToggle) {
            setIsMuted(!isMuted)
            storage.setItem("local:isMuted", !isMuted)
            return
        }
        setVideoVolume(volume)
        storage.setItem("local:volume", volume)
    }

    function tempSeekHandle(clientX: number) {
        const boundingClientRect = seekbarRef.current?.getBoundingClientRect()
        if (!boundingClientRect || !videoRef.current) return
        // console.log((clientX - boundingClientRect.left) / boundingClientRect.width * 100)
        let scale = ((clientX - boundingClientRect.left) / boundingClientRect.width)
        if (scale > 1) scale = 1
        if (scale < 0) scale = 0
        setCurrentTime(duration * (scale <= 1 ? scale : 1))
    }

    const onSkipBack = useCallback(() => {
        onTimeControl("set", 0)
        if (isIndexControl[0] === true) playlistIndexControl(-1, localStorage.enableShufflePlay)
    }, [video, isIndexControl])

    const onSkipForward = useCallback(() => {
        if (!video) return
        onTimeControl("set", video.duration)
        if (isIndexControl[1] === true) playlistIndexControl(1, localStorage.enableShufflePlay)
    }, [video, isIndexControl])

    const onSkipSecondBack = useCallback(() => {
        const rewindTime = localStorage.rewindTime ?? 10
        onTimeControl("add", Number(rewindTime) * -1)
    }, [onTimeControl, localStorage.rewindTime])

    const onSkipSecondForward = useCallback(() => {
        const rewindTime = localStorage.rewindTime ?? 10
        onTimeControl("add", Number(rewindTime) * 1)
    }, [onTimeControl, localStorage.rewindTime])

    const onMuteToggle = useCallback(() => {
        setVolume(0, true)
    }, [setVolume])

    function onSeekPointerMove(e: PointerEvent) {
        if (!isSeeking) return
        tempSeekHandle(e.clientX)
        e.preventDefault()
        e.stopPropagation()
    }

    function onSeekPointerUp(e: PointerEvent) {
        if (!isSeeking) return
        doSeekRef.current()
        setIsSeeking(false)
        e.preventDefault()
        e.stopPropagation()
    }

    const toggleLoopState = useCallback(() => {
        setIsLoop(l => !l)
    }, [])

    const enabledEffects = Object.keys(effectsState).map((elem) => {
        if (elem && effectsState[elem as keyof effectsState].enabled) return elem
        return
    }).filter((elem) => { if (elem) return true })

    const seekbarElem = (
        <Seekbar
            key="control-seekbar"
            currentTime={currentTime}
            duration={duration}
            showTime={currentPlayerType === playerTypes.default || currentPlayerType === playerTypes.classic}
            bufferedDuration={bufferedDuration}
            isSeeking={isSeeking}
            setIsSeeking={setIsSeeking}
            tempSeekHandle={tempSeekHandle}
            seekbarRef={seekbarRef}
            storyBoardData={storyBoardData}
        />
    )

    const effectChangeElem = (
        <PlayerControllerButton
            key="control-effectchange"
            className="playercontroller-effectchange"
            onClick={() => { setIsVefxShown(!isVefxShown) }}
            title="エフェクト設定"
        >
            {isVefxShown
                ? <IconAdjustmentsFilled />
                : (enabledEffects.length > 0) ? <IconAdjustmentsCheck /> : <IconAdjustments />}
        </PlayerControllerButton>
    )
    const toggleMuteElem = <PlayerControllerButton key="control-togglemute" className="playercontroller-togglemute" onClick={onMuteToggle} title={isMuted ? "ミュート解除" : "ミュート"}>{(isMuted || videoVolume <= 0) ? <IconVolume3 /> : <IconVolume />}</PlayerControllerButton>
    const volumeElem = (
        <span key="control-volume" className="playercontroller-volume-container" style={{ ["--width" as string]: `${videoVolume}%` }}>
            <input type="range" className="playercontroller-volume" min="0" max="100" value={videoVolume} disabled={isMuted} aria-label={`音量 ${Math.floor(videoVolume)}%`} onChange={(e) => { setVolume(Math.floor(e.currentTarget.valueAsNumber)) }} />
            <span className="playercontroller-volume-tooltip">
                {Math.floor(videoVolume)}
                %
            </span>
        </span>
    )

    const skipBackElem = <PlayerControllerButton key="control-skipback" className="playercontroller-skipback" onClick={onSkipBack} title="開始地点にシーク">{isIndexControl[0] ? <IconPlayerSkipBackFilled /> : <IconPlayerSkipBack />}</PlayerControllerButton>
    const skipForwardElem = <PlayerControllerButton key="control-skipforward" className="playercontroller-skipforward" onClick={onSkipForward} title="終了地点にシーク">{isIndexControl[1] ? <IconPlayerSkipForwardFilled /> : <IconPlayerSkipForward />}</PlayerControllerButton>

    const backwardElem = (
        <PlayerControllerButton key="control-backward" className="playercontroller-backward" onClick={onSkipSecondBack} title={`${(localStorage.rewindTime ?? 10) * -1}秒シーク`}>
            {(localStorage.rewindTime === "10" || typeof localStorage.rewindTime !== "string") && <IconRewindBackward10 />}
            {localStorage.rewindTime === "15" && <IconRewindBackward15 />}
            {localStorage.rewindTime === "30" && <IconRewindBackward30 />}
            {localStorage.rewindTime === "5" && <IconRewindBackward5 />}
        </PlayerControllerButton>
    )
    const forwardElem = (
        <PlayerControllerButton key="control-forward" className="playercontroller-forward" onClick={onSkipSecondForward} title={`${(localStorage.rewindTime ?? 10) * 1}秒シーク`}>
            {(localStorage.rewindTime === "10" || typeof localStorage.rewindTime !== "string") && <IconRewindForward10 />}
            {localStorage.rewindTime === "15" && <IconRewindForward15 />}
            {localStorage.rewindTime === "30" && <IconRewindForward30 />}
            {localStorage.rewindTime === "5" && <IconRewindForward5 />}
        </PlayerControllerButton>
    )

    const togglePauseElem = <PlayerControllerButton key="control-togglepause" className="playercontroller-togglepause" onClick={toggleStopState} title={isIconPlay ? "再生" : "一時停止"}>{isIconPlay ? <IconPlayerPlayFilled /> : <IconPlayerPauseFilled />}</PlayerControllerButton>

    const toggleLoopElem = <PlayerControllerButton key="control-toggleloop" className="playercontroller-toggleloop" onClick={toggleLoopState} title={isLoop ? "ループ再生を解除" : "ループ再生を有効化"}>{isLoop ? <IconRepeat /> : <IconRepeatOff />}</PlayerControllerButton>

    const timeElem = (
        <div key="control-time" className="playercontroller-time">
            {secondsToTime(currentTime)}
            /
            {secondsToTime(duration)}
        </div>
    )

    const controlLayouts: { [key: string]: { top: JSX.Element[], left: JSX.Element[], center: JSX.Element[], right: JSX.Element[] } } = {
        default: {
            top: [seekbarElem],
            left: [effectChangeElem, toggleMuteElem, volumeElem, toggleLoopElem],
            center: [skipBackElem, backwardElem, togglePauseElem, forwardElem, skipForwardElem],
            right: [],
        },
        html5: {
            top: [seekbarElem],
            left: [togglePauseElem, effectChangeElem, toggleMuteElem, volumeElem],
            center: [skipBackElem, backwardElem, timeElem, forwardElem, skipForwardElem],
            right: [toggleLoopElem],
        },
        ginzaplus: {
            top: [seekbarElem],
            left: [togglePauseElem, skipBackElem, backwardElem, forwardElem, skipForwardElem, timeElem],
            center: [],
            right: [effectChangeElem, toggleMuteElem, volumeElem, toggleLoopElem],
        },
        shinjuku: {
            top: [],
            left: [togglePauseElem, skipBackElem, seekbarElem, timeElem],
            center: [],
            right: [effectChangeElem, toggleMuteElem, volumeElem, toggleLoopElem],
        },
    }

    const currentLayout = controlLayouts[currentPlayerType] ?? controlLayouts.default

    return (
        <div
            className="playercontroller-container"
            id="pmw-playercontroller"
            data-player-type={currentPlayerType}
        >
            {currentLayout.top}
            <div className="playercontroller-container-middle">
                <div className="playercontroller-container-left">
                    {currentLayout.left}
                </div>
                <div className="playercontroller-container-center">
                    {currentLayout.center}
                </div>
                <div className="playercontroller-container-right">
                    {currentLayout.right}
                    {
                        hlsRef.current
                            ? (
                                    <select
                                        onChange={(e) => {
                                            if (!hlsRef.current) return
                                            hlsRef.current.currentLevel = Number(e.currentTarget.value)
                                            storage.setItem("local:preferredLevel", Number(e.currentTarget.value))
                                            // setHlsLevel(Number(e.currentTarget.value))
                                        }}
                                        value={hlsLevel}
                                        className="playercontroller-qualityselect"
                                        title="画質選択"
                                    >
                                        {hlsRef.current.levels.map((elem, index) => {
                                            return <option value={index} key={index}>{(qualityLabels && qualityLabels[index]) || `${elem.height}p`}</option>
                                        })}
                                        <option value={-1}>Auto</option>
                                    </select>
                                )
                            : <select className="playercontroller-qualityselect" title="画質選択" id="pmw-qualityselector" />
                    }
                    {/* <div className="playercontroller-qualitydisplay">{hlsRef.current && hlsRef.current.levels.map(elem => `${elem.height}p`)[hlsRef.current.currentLevel]}</div> */}
                    <PlayerControllerButton className="playercontroller-commenttoggle" onClick={() => { setIsCommentShown(!isCommentShown) }} title={isCommentShown ? "コメントを非表示" : "コメントを表示"}>{isCommentShown ? <IconMessage2 /> : <IconMessage2Off />}</PlayerControllerButton>
                    <PlayerControllerButton className="playercontroller-fullscreen" onClick={toggleFullscreen} title={isFullscreenUi ? "フルスクリーンを終了" : "フルスクリーン"}>{isFullscreenUi ? <IconMinimize /> : <IconMaximize />}</PlayerControllerButton>
                    <PlayerControllerButton className="playercontroller-settings" onClick={() => { setIsSettingsShown(!isSettingsShown) }} title="プレイヤーの設定">{isSettingsShown ? <IconSettingsFilled /> : <IconSettings />}</PlayerControllerButton>
                    {isFullscreenUi && <PlayerControllerButton className="playercontroller-expandsidebar" onClick={() => { storage.setItem("local:enableBigView", !(localStorage.enableBigView ?? false)) }} title={localStorage.enableBigView ? "シアタービューを終了" : "シアタービューを開始"}>{(localStorage.enableBigView ?? false) ? <IconLayoutSidebarRightCollapseFilled /> : <IconLayoutSidebarRightExpand />}</PlayerControllerButton>}
                </div>
            </div>
        </div>
    )
}

export default PlayerController
