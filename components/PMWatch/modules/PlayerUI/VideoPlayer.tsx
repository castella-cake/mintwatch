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
    } = props
    const { syncStorage } = useStorageContext()

    const [canPlay, setCanPlay] = useState(false)
    const nodeRef = useRef(null)
    const videoContainerRef = useRef<HTMLDivElement>(null)

    const volumeGestureUsedRef = useRef<boolean>(false)
    useEffect(() => {
        // ホイールの音量ジェスチャー
        function onWheel(e: WheelEvent) {
            const wheelGestureAmount = (syncStorage.wheelGestureAmount ?? getDefault("wheelGestureAmount")) / 100
            const video = videoRef.current
            // 右クリックを押しながらホイールで音量を変更
            if (e.buttons < 2 || enableVolumeGesture === false || !video) return
            if (e.deltaY < 0) {
                if (video.volume + wheelGestureAmount > 1) {
                    video.volume = 1
                } else {
                    video.volume += wheelGestureAmount
                }
            } else {
                if (video.volume - wheelGestureAmount < 0) {
                    video.volume = 0
                } else {
                    video.volume -= wheelGestureAmount
                }
            }
            setShortcutFeedback(`音量: ${Math.round(video.volume * 100)}%`)
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
                <CSSTransition nodeRef={nodeRef} in={!canPlay} timeout={100} unmountOnExit classNames="player-loading-transition">
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
                    autoPlay
                    onPause={() => { onPause() }}
                    onEnded={onEnded}
                    onCanPlay={() => { setCanPlay(true) }}
                    width="1920"
                    height="1080"
                    id="pmw-element-video"
                    onClick={onClick}
                />
                { children }
            </div>
        </div>
    )
}
