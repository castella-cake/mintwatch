import { amplitudeToPerceptual, perceptualToAmplitude } from "@discordapp/perceptual"
import { IconPlayerPlayFilled } from "@tabler/icons-react"
import { ReactNode, RefObject } from "react"
import { CSSTransition } from "react-transition-group"

type VideoPlayerProps = {
    children?: ReactNode
    videoRef: RefObject<HTMLVideoElement | null>
    onPause: () => void
    onEnded: () => void
    onClick: () => void
    thumbnailSrc?: string
    enableVolumeGesture: boolean
    videoTitle?: string
    videoAuthor?: string
    videoGenre?: string
    setShortcutFeedback: (text: string) => void
    isAutoplayEnabled?: boolean
}

export function VideoPlayer(props: VideoPlayerProps) {
    const {
        children,
        videoRef,
        onPause,
        onEnded,
        onClick,
        thumbnailSrc,
        enableVolumeGesture,
        videoTitle,
        videoAuthor,
        videoGenre,
        setShortcutFeedback,
        isAutoplayEnabled,
    } = props
    const syncStorage = useStorageVar(["wheelGestureAmount"] as const)

    const [canPlay, setCanPlay] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const nodeRef = useRef(null)
    const videoContainerRef = useRef<HTMLDivElement>(null)

    const volumeGestureUsedRef = useRef<boolean>(false)
    useEffect(() => {
        // ホイールの音量ジェスチャー
        function onWheel(e: WheelEvent) {
            const wheelGestureAmount = (syncStorage.wheelGestureAmount ?? getDefault("wheelGestureAmount")) / 100
            const video = videoRef.current
            if (!video) return
            let actualVideoVolume = amplitudeToPerceptual(video.volume, 1, 40)
            // 右クリックを押しながらホイールで音量を変更
            if (e.buttons < 2 || enableVolumeGesture === false || !video) return
            if (e.deltaY < 0) {
                if (actualVideoVolume + wheelGestureAmount > 1) {
                    actualVideoVolume = 1
                } else {
                    actualVideoVolume += wheelGestureAmount
                }
            } else {
                if (actualVideoVolume - wheelGestureAmount < 0) {
                    actualVideoVolume = 0
                } else {
                    actualVideoVolume -= wheelGestureAmount
                }
            }
            video.volume = perceptualToAmplitude(actualVideoVolume, 1, 40)
            setShortcutFeedback(`音量: ${Math.round(actualVideoVolume * 100)}%`)
            e.preventDefault()
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
    }, [syncStorage.wheelGestureAmount])

    return (
        <div className="player-video-container">
            <div className="player-video-container-inner" ref={videoContainerRef}>
                <CSSTransition nodeRef={nodeRef} in={!canPlay && !isPlaying} timeout={isAutoplayEnabled ? 300 : 100} unmountOnExit classNames="player-loading-transition">
                    <div ref={nodeRef} className="player-video-loading-container">
                        <img src={thumbnailSrc} className="player-video-loading-thumbnail"></img>
                        <div className="player-video-loading-text-container">
                            <div className="player-video-loading-text-genre">
                                {videoGenre}
                            </div>
                            <div className="player-video-loading-text-title">
                                {videoTitle}
                            </div>
                            <div className="player-video-loading-text-author">
                                {videoAuthor}
                            </div>
                        </div>
                        <div className="player-video-loading-text">Loading...</div>
                    </div>
                </CSSTransition>
                <video
                    ref={videoRef}
                    autoPlay={isAutoplayEnabled}
                    onPause={onPause}
                    onEnded={onEnded}
                    onCanPlay={() => { setCanPlay(true) }}
                    onLoadStart={() => { setCanPlay(false) }}
                    onPlay={() => { setIsPlaying(true) }}
                    onEmptied={() => {
                        setCanPlay(false)
                        setIsPlaying(false)
                    }}
                    width="1920"
                    height="1080"
                    id="pmw-element-video"
                    onClick={onClick}
                />
                {
                    !isAutoplayEnabled && canPlay && !isPlaying && (
                        <div className="player-video-playbutton-container">
                            <button className="player-video-playbutton" type="button" onClick={() => videoRef.current?.play()}>
                                <IconPlayerPlayFilled />
                            </button>
                        </div>
                    )
                }
                { children }
            </div>
        </div>
    )
}
