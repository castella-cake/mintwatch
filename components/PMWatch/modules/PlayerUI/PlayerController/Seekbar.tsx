import { RefObject, useMemo } from "react"
import { secondsToTime } from "@/utils/readableValue"

import { StoryBoardImageRootObject } from "@/types/StoryBoardData"
import { CommentStats } from "./CommentStats"
import { useVideoRefContext } from "@/components/Global/Contexts/VideoDataProvider"
import Hls from "hls.js"

type Props = {
    showTime: boolean
    storyBoardData?: StoryBoardImageRootObject | null
    hlsRef: RefObject<Hls>
}

export function Seekbar({ showTime, storyBoardData, hlsRef }: Props) {
    const [storyBoardX, setStoryBoardX] = useState<number>(0)
    const storyboardCanvasRef = useRef<HTMLCanvasElement>(null)
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
    if (storyboardCanvasRef.current) {
        ctxRef.current = storyboardCanvasRef.current?.getContext("2d")
    }
    const storyboardImgsMemo = useMemo(() => {
        if (!storyBoardData) return []
        return storyBoardData.images.map((imgUrl) => {
            const image = new Image()
            image.src = imgUrl.url
            return image
        })
    }, [storyBoardData])

    const videoRef = useVideoRefContext()
    const [bufferedDuration, setBufferedDuration] = useState(0)

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
        const controller = new AbortController()
        const { signal } = controller
        const updateCurrentTime = () => {
            if (videoRef.current!.currentTime !== currentTime && !isSeekingRef.current) {
                setCurrentTime(videoRef.current!.currentTime)
            }
        }
        const updateDuration = () => {
            if (videoRef.current!.duration !== duration) setDuration(videoRef.current!.duration)
        }
        videoRef.current?.addEventListener("timeupdate", updateCurrentTime, { signal })
        videoRef.current?.addEventListener("durationchange", updateDuration, { signal })
        updateDuration()
        return () => controller.abort()
    }, [])
    useEffect(() => {
        const controller = new AbortController()
        const { signal } = controller
        function onSeekPointerMove(e: PointerEvent) {
            if (!isSeeking) return
            tempSeekHandle(e.clientX)
            e.preventDefault()
            e.stopPropagation()
        }

        function onSeekPointerUp(e: Event) {
            if (!isSeeking) return
            doSeekRef.current()
            setIsSeeking(false)
            e.preventDefault()
            e.stopPropagation()
        }
        document.addEventListener("pointermove", onSeekPointerMove, { signal })
        document.addEventListener("pointerup", onSeekPointerUp, { signal })
    }, [isSeeking])

    function tempSeekHandle(clientX: number) {
        const boundingClientRect = seekbarRef.current?.getBoundingClientRect()
        if (!boundingClientRect || !videoRef.current) return
        // console.log((clientX - boundingClientRect.left) / boundingClientRect.width * 100)
        let scale = ((clientX - boundingClientRect.left) / boundingClientRect.width)
        if (scale > 1) scale = 1
        if (scale < 0) scale = 0
        setCurrentTime(duration * (scale <= 1 ? scale : 1))
    }

    useEffect(() => {
        if (!hlsRef.current) return
        hlsRef.current.on(Hls.Events.BUFFER_APPENDED, () => {
            if (videoRef.current?.buffered.length) {
                setBufferedDuration(videoRef.current?.buffered.end(videoRef.current?.buffered.length - 1))
            }
        })
        hlsRef.current.on(Hls.Events.BUFFER_FLUSHED, () => {
            setBufferedDuration(0)
        })
    }, [hlsRef.current])

    const onPointerMove = (e: React.PointerEvent) => {
        const boundingClientRect = seekbarRef.current?.getBoundingClientRect()
        if (!boundingClientRect) return
        let scale = ((e.clientX - boundingClientRect.left) / boundingClientRect.width)
        if (scale > 1) scale = 1
        if (scale < 0) scale = 0
        setStoryBoardX(scale <= 1 ? scale : 1)

        if (storyBoardData && ctxRef.current && storyboardCanvasRef.current) {
            const flooredHoverTime = Math.floor((scale <= 1 ? scale : 1) * duration)
            // intervalで割って、何番目のサムネイルかを計算
            const thumbnailIndex = Math.floor(flooredHoverTime / (storyBoardData.interval / 1000))
            // サムネイルのインデックスから画像インデックスとグリッド位置を計算
            const selectImgIndex = Math.floor(thumbnailIndex / (storyBoardData.columns * storyBoardData.rows))
            const positionInGrid = thumbnailIndex % (storyBoardData.columns * storyBoardData.rows)
            const selectColumn = Math.floor(positionInGrid / storyBoardData.columns)
            const selectRow = positionInGrid % storyBoardData.columns

            // キャンバスをクリア
            ctxRef.current.clearRect(0, 0, storyboardCanvasRef.current.width, storyboardCanvasRef.current.height)

            // 対象の画像が読み込まれているか確認
            if (storyboardImgsMemo[selectImgIndex]) {
                const sourceX = selectRow * storyBoardData.thumbnailWidth
                const sourceY = selectColumn * storyBoardData.thumbnailHeight

                // キャンバスのサイズ
                const canvasWidth = storyboardCanvasRef.current.width
                const canvasHeight = storyboardCanvasRef.current.height

                // アスペクト比を計算
                const sourceAspect = storyBoardData.thumbnailWidth / storyBoardData.thumbnailHeight
                const canvasAspect = canvasWidth / canvasHeight

                // 描画サイズとオフセットを計算
                let drawWidth, drawHeight, offsetX, offsetY

                if (sourceAspect > canvasAspect) {
                    // 画像の方が横長の場合
                    drawWidth = canvasWidth
                    drawHeight = canvasWidth / sourceAspect
                    offsetX = 0
                    offsetY = (canvasHeight - drawHeight) / 2
                } else {
                    // 画像の方が縦長の場合
                    drawHeight = canvasHeight
                    drawWidth = canvasHeight * sourceAspect
                    offsetX = (canvasWidth - drawWidth) / 2
                    offsetY = 0
                }

                // 画像の切り出しと描画
                ctxRef.current.drawImage(
                    storyboardImgsMemo[selectImgIndex],
                    sourceX,
                    sourceY,
                    storyBoardData.thumbnailWidth,
                    storyBoardData.thumbnailHeight,
                    offsetX,
                    offsetY,
                    drawWidth,
                    drawHeight,
                )
            }
        }
    }

    function onPointerDown(e: React.PointerEvent) {
        setIsSeeking(true)
        tempSeekHandle(e.clientX)
        e.preventDefault()
        e.stopPropagation()
    }

    return (
        <div className="seekbar-container" id="pmw-seekbar">
            { showTime && <div className="seekbar-time currenttime">{secondsToTime(currentTime)}</div> }
            <div
                className="seekbar"
                ref={seekbarRef}
                onDragOver={(e) => { e.preventDefault() }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
            >
                <CommentStats duration={duration} />
                <div className="seekbar-bg"></div>
                <div className="seekbar-buffered" style={{ width: `${Math.min(bufferedDuration / duration * 100, 100)}%` }}></div>
                <div className="seekbar-played" style={{ width: `${Math.min(currentTime / duration * 100, 100)}%` }}></div>
                <div className="seekbar-thumb" style={{ ["--left" as any]: `${Math.min(currentTime / duration * 100, 100)}%` }}></div>
                <div className="seekbar-storyboard" style={{ left: `${Math.min(storyBoardX * 100, 100)}%` }}>
                    <canvas ref={storyboardCanvasRef} width={160} height={90} />
                    <div className="seekbar-storyboard-time">{secondsToTime(duration * storyBoardX)}</div>
                </div>
            </div>
            { showTime && <div className="seekbar-time duration">{secondsToTime(duration)}</div> }
        </div>
    )
}
