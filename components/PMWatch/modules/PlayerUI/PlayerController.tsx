import type { Dispatch, JSX, RefObject, SetStateAction } from "react"
import type Hls from "hls.js"
import type { effectsState } from "@/hooks/eqHooks"
import { Seekbar } from "./PlayerController/Seekbar"
import { StoryBoardImageRootObject } from "@/types/StoryBoardData"
import { VolumeController } from "./PlayerController/volumeController"
import { Time } from "./PlayerController/Time"
import { TogglePauseButton } from "./PlayerController/buttons/TogglePauseButton"
import { ToggleLoopButton } from "./PlayerController/buttons/ToggleLoopButton"
import { SkipButton } from "./PlayerController/buttons/SkipButton"
import { SkipSecondButton } from "./PlayerController/buttons/SkipSecondButton"
import { QualitySelect } from "./PlayerController/buttons/QualitySelect"
import { VefxToggleButton } from "./PlayerController/buttons/VefxToggleButton"
import { CommentToggleButton } from "./PlayerController/buttons/CommentToggleButton"
import { SettingsToggleButton } from "./PlayerController/buttons/SettingsToggleButton"
import { FullscreenButton } from "./PlayerController/buttons/FullscreenButton"
import { TheaterViewButton } from "./PlayerController/buttons/TheaterViewButton"

type Props = {
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
    officialPlayer: "html5",
    shinjuku: "shinjuku",
    ginzaPlus: "ginzaplus",
}

/**
 * プレイヤー下部のコントローラー
 * 各ボタンの状態・ストレージ購読は buttons/ 配下の各コンポーネントに局所化されており、
 * このコンポーネントが再レンダリングされても props が変化していないボタンは再レンダリングされない
 */
function PlayerController(props: Props) {
    const {
        effectsState,
        isVefxShown,
        setIsVefxShown,
        isFullscreenUi,
        toggleFullscreen,
        isCommentShown,
        setIsCommentShown,
        isSettingsShown,
        setIsSettingsShown,
        hlsRef,
        playlistIndexControl,
        qualityLabels,
        storyBoardData,
        currentPlayerType,
    } = props

    const seekbarElem = (
        <Seekbar
            key="control-seekbar"
            showTime={currentPlayerType === playerTypes.default}
            storyBoardData={storyBoardData}
            hlsRef={hlsRef}
        />
    )
    const volumeElem = <VolumeController key="control-volume" currentPlayerType={currentPlayerType} />
    const timeElem = <Time key="control-time" />

    const togglePauseElem = <TogglePauseButton key="control-togglepause" currentPlayerType={currentPlayerType} />
    const toggleLoopElem = <ToggleLoopButton key="control-toggleloop" currentPlayerType={currentPlayerType} />
    const effectChangeElem = (
        <VefxToggleButton
            key="control-effectchange"
            currentPlayerType={currentPlayerType}
            isVefxShown={isVefxShown}
            setIsVefxShown={setIsVefxShown}
            effectsState={effectsState}
        />
    )
    const skipBackElem = <SkipButton key="control-skipback" currentPlayerType={currentPlayerType} direction="back" playlistIndexControl={playlistIndexControl} />
    const skipForwardElem = <SkipButton key="control-skipforward" currentPlayerType={currentPlayerType} direction="forward" playlistIndexControl={playlistIndexControl} />
    const backwardElem = <SkipSecondButton key="control-backward" direction="backward" />
    const forwardElem = <SkipSecondButton key="control-forward" direction="forward" />

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
                    <QualitySelect hlsRef={hlsRef} qualityLabels={qualityLabels} />
                    <CommentToggleButton
                        currentPlayerType={currentPlayerType}
                        isCommentShown={isCommentShown}
                        setIsCommentShown={setIsCommentShown}
                    />
                    <FullscreenButton
                        currentPlayerType={currentPlayerType}
                        isFullscreenUi={isFullscreenUi}
                        toggleFullscreen={toggleFullscreen}
                    />
                    <SettingsToggleButton
                        currentPlayerType={currentPlayerType}
                        isSettingsShown={isSettingsShown}
                        setIsSettingsShown={setIsSettingsShown}
                    />
                    <TheaterViewButton
                        currentPlayerType={currentPlayerType}
                        isFullscreenUi={isFullscreenUi}
                    />
                </div>
            </div>
        </div>
    )
}

export default PlayerController
