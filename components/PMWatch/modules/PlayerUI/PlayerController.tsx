import { useCallback, useEffect, useState } from "react"
import { IconAdjustments, IconAdjustmentsCheck, IconAdjustmentsFilled, IconLayoutSidebarRightCollapseFilled, IconLayoutSidebarRightExpand, IconMaximize, IconMessage2, IconMessage2Off, IconMinimize, IconPlayerPauseFilled, IconPlayerPlayFilled, IconPlayerSkipBack, IconPlayerSkipBackFilled, IconPlayerSkipForward, IconPlayerSkipForwardFilled, IconRepeat, IconRepeatOff, IconRewindBackward10, IconRewindBackward15, IconRewindBackward30, IconRewindBackward5, IconRewindForward10, IconRewindForward15, IconRewindForward30, IconRewindForward5, IconSettings, IconSettingsFilled } from "@tabler/icons-react"
import type { Dispatch, JSX, RefObject, SetStateAction } from "react"
import Hls from "hls.js"
import { useStorageVar } from "@/hooks/extensionHook"
import ShinjukuPlay from "@/assets/shinjuku/Play.svg?react"
import ShinjukuPaused from "@/assets/shinjuku/Paused.svg?react"
import ShinjukuSkipBack from "@/assets/shinjuku/SkipBack.svg?react"
import ShinjukuLoopOn from "@/assets/shinjuku/LoopOn.svg?react"
import ShinjukuLoopOff from "@/assets/shinjuku/LoopOff.svg?react"
import ShinjukuStartFullScreen from "@/assets/shinjuku/StartFullScreen.svg?react"
import ShinjukuEndFullScreen from "@/assets/shinjuku/EndFullScreen.svg?react"
import ShinjukuCommentShown from "@/assets/shinjuku/CommentShown.svg?react"
import ShinjukuCommentHidden from "@/assets/shinjuku/CommentHidden.svg?react"
import ShinjukuOpenVefx from "@/assets/shinjuku/OpenVEFX.svg?react"
import ShinjukuOpenSettings from "@/assets/shinjuku/OpenSettings.svg?react"
import ShinjukuStartTheater from "@/assets/shinjuku/StartTheater.svg?react"
import ShinjukuEndTheater from "@/assets/shinjuku/EndTheater.svg?react"
import type { effectsState } from "@/hooks/eqHooks"
import { Seekbar } from "./PlayerController/Seekbar"
import { timeCalc } from "../commonFunction"
import { StoryBoardImageRootObject } from "@/types/StoryBoardData"
import { VolumeController } from "./PlayerController/volumeController"
import { PlayerControllerButton } from "./PlayerController/Button"
import { Time } from "./PlayerController/Time"
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
    const isLoop = localStorage.isLoop

    const [isIconPlay, setIsIconPlay] = useState(false)

    const [hlsLevel, setHlsLevel] = useState(0)

    useEffect(() => {
        if (!hlsRef.current) return
        hlsRef.current.on(Hls.Events.LEVEL_SWITCHED, () => {
            if (!hlsRef.current) return
            setHlsLevel(hlsRef.current.currentLevel)
        })
    }, [hlsRef.current])

    useEffect(() => {
        const setIconToPause = () => setIsIconPlay(false)
        const setIconToPlay = () => setIsIconPlay(true)

        videoRef.current?.addEventListener("play", setIconToPause)
        videoRef.current?.addEventListener("pause", setIconToPlay)
        return () => {
            videoRef.current?.removeEventListener("play", setIconToPause)
            videoRef.current?.removeEventListener("pause", setIconToPlay)
        }
    }, [videoRef.current])

    const isIndexControl = [false, false]

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

    const toggleLoopState = useCallback(() => {
        if (video) {
            storage.setItem("local:isLoop", !video.loop)
            video.loop = !video.loop
        }
    }, [video])
    if (video) video.loop = isLoop

    const enabledEffects = Object.keys(effectsState).map((elem) => {
        if (elem && effectsState[elem as keyof effectsState].enabled) return elem
        return
    }).filter((elem) => { if (elem) return true })

    const seekbarElem = (
        <Seekbar
            key="control-seekbar"
            showTime={currentPlayerType === playerTypes.default || currentPlayerType === playerTypes.classic}
            storyBoardData={storyBoardData}
            hlsRef={hlsRef}
        />
    )

    const effectChangeElem = (
        <PlayerControllerButton
            key="control-effectchange"
            className="playercontroller-effectchange"
            onClick={() => { setIsVefxShown(!isVefxShown) }}
            title="エフェクト設定"
        >
            {currentPlayerType === playerTypes.shinjuku
                ? <ShinjukuOpenVefx />
                : (isVefxShown
                        ? <IconAdjustmentsFilled />
                        : (enabledEffects.length > 0) ? <IconAdjustmentsCheck /> : <IconAdjustments />
                    )}
        </PlayerControllerButton>
    )
    const volumeElem = <VolumeController key="control-volume" currentPlayerType={currentPlayerType} />

    const skipBackElem = (
        <PlayerControllerButton
            key="control-skipback"
            className="playercontroller-skipback"
            onClick={onSkipBack}
            title="開始地点にシーク"
        >
            {currentPlayerType === playerTypes.shinjuku
                ? <ShinjukuSkipBack />
                : (isIndexControl[0] ? <IconPlayerSkipBackFilled /> : <IconPlayerSkipBack />)}
        </PlayerControllerButton>
    )
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

    const togglePauseElem = (
        <PlayerControllerButton
            key="control-togglepause"
            className="playercontroller-togglepause"
            onClick={toggleStopState}
            title={isIconPlay ? "再生" : "一時停止"}
        >
            {currentPlayerType === playerTypes.shinjuku
                ? (isIconPlay ? <ShinjukuPlay /> : <ShinjukuPaused />)
                : (isIconPlay ? <IconPlayerPlayFilled /> : <IconPlayerPauseFilled />)}
        </PlayerControllerButton>
    )

    const toggleLoopElem = (
        <PlayerControllerButton key="control-toggleloop" className="playercontroller-toggleloop" onClick={toggleLoopState} title={isLoop ? "ループ再生を解除" : "ループ再生を有効化"}>
            {currentPlayerType === playerTypes.shinjuku
                ? (isLoop ? <ShinjukuLoopOn /> : <ShinjukuLoopOff />)
                : (isLoop ? <IconRepeat /> : <IconRepeatOff />)}
        </PlayerControllerButton>
    )

    const timeElem = <Time key="control-time" />

    const controlLayouts: { [key: string]: { top: JSX.Element[], left: JSX.Element[], center: JSX.Element[], right: JSX.Element[] } } = {
        default: {
            top: [seekbarElem],
            left: [effectChangeElem, volumeElem, toggleLoopElem],
            center: [skipBackElem, backwardElem, togglePauseElem, forwardElem, skipForwardElem],
            right: [],
        },
        html5: {
            top: [seekbarElem],
            left: [togglePauseElem, effectChangeElem, volumeElem],
            center: [skipBackElem, backwardElem, timeElem, forwardElem, skipForwardElem],
            right: [toggleLoopElem],
        },
        ginzaplus: {
            top: [seekbarElem],
            left: [togglePauseElem, skipBackElem, backwardElem, forwardElem, skipForwardElem, timeElem],
            center: [],
            right: [effectChangeElem, volumeElem, toggleLoopElem],
        },
        shinjuku: {
            top: [],
            left: [togglePauseElem, skipBackElem, seekbarElem, timeElem],
            center: [],
            right: [effectChangeElem, volumeElem, toggleLoopElem],
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
                    <PlayerControllerButton
                        className="playercontroller-commenttoggle"
                        onClick={() => { setIsCommentShown(!isCommentShown) }}
                        title={isCommentShown ? "コメントを非表示" : "コメントを表示"}
                    >
                        {currentPlayerType === playerTypes.shinjuku
                            ? (isCommentShown ? <ShinjukuCommentShown /> : <ShinjukuCommentHidden />)
                            : (isCommentShown ? <IconMessage2 /> : <IconMessage2Off />)}
                    </PlayerControllerButton>
                    <PlayerControllerButton
                        className="playercontroller-fullscreen"
                        onClick={toggleFullscreen}
                        title={isFullscreenUi ? "フルスクリーンを終了" : "フルスクリーン"}
                    >
                        {currentPlayerType === playerTypes.shinjuku
                            ? (isFullscreenUi ? <ShinjukuEndFullScreen /> : <ShinjukuStartFullScreen />)
                            : (isFullscreenUi ? <IconMinimize /> : <IconMaximize />)}
                    </PlayerControllerButton>
                    <PlayerControllerButton className="playercontroller-settings" onClick={() => { setIsSettingsShown(!isSettingsShown) }} title="プレイヤーの設定">
                        { currentPlayerType === playerTypes.shinjuku
                            ? <ShinjukuOpenSettings />
                            : (isSettingsShown ? <IconSettingsFilled /> : <IconSettings />)}
                    </PlayerControllerButton>
                    { isFullscreenUi && (
                        <PlayerControllerButton className="playercontroller-expandsidebar" onClick={() => { storage.setItem("local:enableBigView", !(localStorage.enableBigView ?? false)) }} title={localStorage.enableBigView ? "シアタービューを終了" : "シアタービューを開始"}>
                            {currentPlayerType === playerTypes.shinjuku
                                ? (localStorage.enableBigView ? <ShinjukuEndTheater /> : <ShinjukuStartTheater />)
                                : (localStorage.enableBigView ? <IconLayoutSidebarRightCollapseFilled /> : <IconLayoutSidebarRightExpand />)}
                        </PlayerControllerButton>
                    ) }
                </div>
            </div>
        </div>
    )
}

export default PlayerController
