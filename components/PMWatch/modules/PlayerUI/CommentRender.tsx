import { Comment, Thread } from "@/types/CommentData"
import NiconiComments from "@xpadev-net/niconicomments"
import { RefObject } from "react"

const fastConfig = {
    canvasWidth: 1366,
    canvasHeight: 768,
    commentScale: 1366 / 683,
    commentDrawRange: 1088,
    commentDrawPadding: 139,
}
const disableOutlineConfig = {
    contextLineWidth: { html5: 0, flash: 0 },
    contextStrokeColor: "#000000",
    contextStrokeOpacity: 0,
}

// コメントレンダラー
export function CommentRender(props: {
    videoRef: RefObject<HTMLVideoElement | null>
    pipVideoRef: RefObject<HTMLVideoElement | null>
    isCommentShown: boolean
    commentOpacity: number
    threads: Thread[]
    videoOnClick: () => void
    enableCommentPiP: boolean
    commentRenderFps: number
    previewCommentItem: null | Comment
    defaultPostTargetIndex: number
    disableCommentOutline: boolean
    enableFancyRendering: boolean
    enableInterpolateCommentRendering: boolean
}) {
    const {
        videoRef,
        pipVideoRef,
        isCommentShown,
        commentOpacity,
        threads,
        videoOnClick,
        enableCommentPiP,
        commentRenderFps,
        disableCommentOutline,
        previewCommentItem,
        defaultPostTargetIndex,
        enableFancyRendering,
        enableInterpolateCommentRendering,
    } = props

    const canUseFastRenderConfig = !(enableFancyRendering || enableCommentPiP) // コメントPIPと描画優先のどちらも有効になっていない
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const niconicommentsRef = useRef<NiconiComments | null>(null!)
    const animationFrameIdRef = useRef<number>(null!)
    const fpsRef = useRef<number>(null!)
    fpsRef.current = commentRenderFps

    const lastCurrentTimeRef = useRef({ lastTime: 0, timeStamp: 0 })

    const drawWithAnimationFrame = useCallback(() => {
        if (!videoRef.current || !niconicommentsRef.current) return
        const thisPerformance = performance.now()
        // Firefox は currentTime が 48ms 刻みでしか更新されていない！！！
        // このため、前のanimationFrameと同じcurrentTimeが来たら、その時の Performance.now() との差分を比較して加えることで、期待通りのフレームを描画する
        // これをやらないとどう頑張っても 20.833333333333332 fps にしかならない！！！！！！

        // 以前と同じcurrentTimeを持っていない場合、またはそもそも補完処理が無効の場合、プレビュー中の場合、一時停止中の場合は補完しない
        if (videoRef.current.currentTime !== lastCurrentTimeRef.current.lastTime || !enableInterpolateCommentRendering || previewCommentItem !== null || videoRef.current.paused) {
            lastCurrentTimeRef.current = { lastTime: videoRef.current.currentTime, timeStamp: thisPerformance }
            niconicommentsRef.current.drawCanvas(videoRef.current.currentTime * 100)
        }
        else {
            niconicommentsRef.current.drawCanvas(videoRef.current.currentTime * 100 + ((thisPerformance - lastCurrentTimeRef.current.timeStamp) * 0.1))
        }
        if (fpsRef.current == -1) animationFrameIdRef.current = requestAnimationFrame(drawWithAnimationFrame)
    }, [fpsRef.current, videoRef.current, niconicommentsRef.current, enableInterpolateCommentRendering, previewCommentItem])

    useEffect(() => {
        if (
            canvasRef.current
            && threads
            && videoRef.current
        ) {
            // プレビューコメントを追加
            if (previewCommentItem && defaultPostTargetIndex !== -1) {
                threads[defaultPostTargetIndex].comments = threads[defaultPostTargetIndex].comments.filter(comment => comment.id !== "-1") // ID-1はプレビューコメント。前回のプレビューが残らないように一旦消してからpushする。
                threads[defaultPostTargetIndex].comments.push(previewCommentItem)
            }
            else if (defaultPostTargetIndex !== -1) {
                threads[defaultPostTargetIndex].comments = threads[defaultPostTargetIndex].comments.filter(comment => comment.id !== "-1") // プレビューが終わった後も残らないように常にフィルターする。
            }

            niconicommentsRef.current = new NiconiComments(canvasRef.current, threads, {
                format: "v1",
                enableLegacyPiP: true,
                video: (enableCommentPiP ? videoRef.current : undefined),
                mode: "html5",
                config: {
                    ...(disableCommentOutline ? disableOutlineConfig : {}),
                    ...(canUseFastRenderConfig ? fastConfig : {}),
                },
            }) //

            // PiP用のvideo要素にキャンバスの内容を流す
            if (enableCommentPiP && pipVideoRef.current && !pipVideoRef.current.srcObject) {
                pipVideoRef.current.srcObject = canvasRef.current.captureStream()
                if (!(videoRef.current.readyState === HTMLMediaElement.HAVE_ENOUGH_DATA && videoRef.current.paused)) {
                    pipVideoRef.current.play()
                }
            }
            if (commentRenderFps == -1) drawWithAnimationFrame()
            return () => {
                cancelAnimationFrame(animationFrameIdRef.current)
                niconicommentsRef.current = null
                if (pipVideoRef.current) pipVideoRef.current.srcObject = null
            }
        }
    }, [threads, enableCommentPiP, previewCommentItem, commentRenderFps, disableCommentOutline, canUseFastRenderConfig, enableInterpolateCommentRendering])

    useInterval(() => {
        if (!videoRef.current || !isCommentShown || !niconicommentsRef.current) return
        const thisPerformance = performance.now()
        if (videoRef.current.currentTime !== lastCurrentTimeRef.current.lastTime || !enableInterpolateCommentRendering || previewCommentItem !== null || videoRef.current.paused) {
            lastCurrentTimeRef.current = { lastTime: videoRef.current.currentTime, timeStamp: thisPerformance }
            niconicommentsRef.current.drawCanvas(videoRef.current.currentTime * 100)
        }
        else {
            niconicommentsRef.current.drawCanvas(videoRef.current.currentTime * 100 + ((thisPerformance - lastCurrentTimeRef.current.timeStamp) * 0.1))
        }
    }, Math.floor(1000 / commentRenderFps))

    const canvasWidth = (canUseFastRenderConfig ? 1366 : 1920)
    const canvasHeight = (canUseFastRenderConfig ? 768 : 1080)
    return (
        <>
            <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} style={isCommentShown ? { opacity: commentOpacity } : { opacity: 0 }} id="pmw-element-commentcanvas" />
            <video
                ref={pipVideoRef}
                className="player-commentvideo-pip"
                width="1920"
                height="1080"
                data-disabled={enableCommentPiP ? "false" : "true"}
                onPause={() => { if (videoRef.current) videoRef.current.pause() }}
                onPlay={() => { if (videoRef.current) videoRef.current.play() }}
                onClick={videoOnClick}
            >
            </video>
        </>
    )
}
